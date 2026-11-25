import os
from collections import deque
from PIL import Image

OUTLATE_DIR = r"c:\Users\hp\Desktop\fashon website\assets\outlate"
OUT_DIR = r"c:\Users\hp\Desktop\fashon website\assets\products"
BRAND_DIR = r"c:\Users\hp\Desktop\fashon website\assets\brand"

os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(BRAND_DIR, exist_ok=True)


def find_white_valley(im, approx_x, search_radius=60):
    """Find the vertical column closest to approx_x that has the highest average whiteness."""
    rgb = im.convert("RGB")
    w, h = rgb.size
    pix = rgb.load()
    x0 = max(1, approx_x - search_radius)
    x1 = min(w - 2, approx_x + search_radius)
    best_x = approx_x
    best_score = -1
    step_y = max(1, h // 120)
    for x in range(x0, x1 + 1):
        white_cnt = 0
        lum_sum = 0
        for y in range(0, h, step_y):
            r, g, b = pix[x, y]
            lum = r + g + b
            lum_sum += lum
            if min(r, g, b) >= 235:
                white_cnt += 1
        score = white_cnt * 1000 + lum_sum - abs(x - approx_x) * 2
        if score > best_score:
            best_score = score
            best_x = x
    return best_x


def keep_main_components(rgba, min_area_ratio=0.05):
    """Remove tiny disconnected stray sleeve slivers from neighboring panels."""
    w, h = rgba.size
    pix = rgba.load()
    visited = bytearray(w * h)
    components = []

    for y in range(h):
        row_off = y * w
        for x in range(w):
            idx = row_off + x
            if not visited[idx] and pix[x, y][3] > 20:
                comp = []
                q = deque([(x, y)])
                visited[idx] = 1
                while q:
                    cx, cy = q.popleft()
                    comp.append((cx, cy))
                    for nx, ny in ((cx - 1, cy), (cx + 1, cy), (cx, cy - 1), (cx, cy + 1)):
                        if 0 <= nx < w and 0 <= ny < h:
                            nidx = ny * w + nx
                            if not visited[nidx] and pix[nx, ny][3] > 20:
                                visited[nidx] = 1
                                q.append((nx, ny))
                components.append(comp)

    if not components:
        return rgba

    max_size = max(len(c) for c in components)
    threshold = max_size * min_area_ratio
    for comp in components:
        if len(comp) < threshold:
            for cx, cy in comp:
                pix[cx, cy] = (0, 0, 0, 0)
    return rgba


def remove_white_bg_floodfill(im, threshold=236, sat_tol=18, feather_threshold=220, clean_slivers=True):
    rgba = im.convert("RGBA")
    w, h = rgba.size
    pix = rgba.load()

    visited = bytearray(w * h)
    is_bg = bytearray(w * h)
    q = deque()

    def is_white_like(r, g, b):
        mx = max(r, g, b)
        mn = min(r, g, b)
        return mn >= threshold and (mx - mn) <= sat_tol

    for x in range(w):
        for y in (0, h - 1):
            idx = y * w + x
            if not visited[idx]:
                r, g, b, a = pix[x, y]
                if a < 10 or is_white_like(r, g, b):
                    visited[idx] = 1
                    is_bg[idx] = 1
                    q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            idx = y * w + x
            if not visited[idx]:
                r, g, b, a = pix[x, y]
                if a < 10 or is_white_like(r, g, b):
                    visited[idx] = 1
                    is_bg[idx] = 1
                    q.append((x, y))

    while q:
        cx, cy = q.popleft()
        for nx, ny in ((cx - 1, cy), (cx + 1, cy), (cx, cy - 1), (cx, cy + 1)):
            if 0 <= nx < w and 0 <= ny < h:
                idx = ny * w + nx
                if not visited[idx]:
                    r, g, b, a = pix[nx, ny]
                    if a < 10 or is_white_like(r, g, b):
                        visited[idx] = 1
                        is_bg[idx] = 1
                        q.append((nx, ny))

    for y in range(h):
        row_off = y * w
        for x in range(w):
            if is_bg[row_off + x]:
                pix[x, y] = (0, 0, 0, 0)

    # Anti-alias 1px halo
    for y in range(1, h - 1):
        row_off = y * w
        for x in range(1, w - 1):
            idx = row_off + x
            if not is_bg[idx]:
                if is_bg[idx - 1] or is_bg[idx + 1] or is_bg[idx - w] or is_bg[idx + w]:
                    r, g, b, a = pix[x, y]
                    lum = (r + g + b) // 3
                    sat = max(r, g, b) - min(r, g, b)
                    if lum >= feather_threshold and sat <= 26:
                        alpha = max(0, min(255, int((250 - lum) * 7.5)))
                        pix[x, y] = (r, g, b, min(a, alpha))

    if clean_slivers:
        rgba = keep_main_components(rgba, min_area_ratio=0.06)

    bbox = rgba.getbbox()
    if bbox:
        pad = 6
        rgba = rgba.crop((max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(w, bbox[2] + pad), min(h, bbox[3] + pad)))
    return rgba


def save_cutout(im, out_name, max_dim=700, pad_canvas=None, clean_slivers=True):
    im = remove_white_bg_floodfill(im, clean_slivers=clean_slivers)
    w, h = im.size
    scale = min(max_dim / max(w, h), 1.0)
    if scale < 1.0:
        im = im.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)

    if pad_canvas:
        cw, ch = pad_canvas
        canvas = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
        im.thumbnail((int(cw * 0.92), int(ch * 0.92)), Image.Resampling.LANCZOS)
        ox = (cw - im.size[0]) // 2
        oy = (ch - im.size[1]) // 2
        canvas.paste(im, (ox, oy), im)
        im = canvas

    im.save(os.path.join(OUT_DIR, out_name), "WEBP", quality=88, method=5)


def split_1x2(filename, prefix):
    im = Image.open(os.path.join(OUTLATE_DIR, filename))
    w, h = im.size
    mid = find_white_valley(im, w // 2, search_radius=int(w * 0.06))
    save_cutout(im.crop((0, 0, mid, h)), f"{prefix}-front.webp", max_dim=720, pad_canvas=(680, 760))
    save_cutout(im.crop((mid, 0, w, h)), f"{prefix}-back.webp", max_dim=720, pad_canvas=(680, 760))


def split_2x4_garments(filename, prefix, colors):
    im = Image.open(os.path.join(OUTLATE_DIR, filename))
    w, h = im.size
    rh = h // 2
    # Find clean vertical valleys near 1/4, 2/4, 3/4 for each row independently
    row_configs = [
        (0, 0, rh, colors[0], colors[1]),
        (1, rh, h, colors[2], colors[3]),
    ]
    for _, y0, y1, c_left, c_right in row_configs:
        strip = im.crop((0, y0, w, y1))
        s1 = find_white_valley(strip, w // 4, search_radius=45)
        s2 = find_white_valley(strip, w // 2, search_radius=45)
        s3 = find_white_valley(strip, (3 * w) // 4, search_radius=45)

        save_cutout(strip.crop((0, 0, s1, y1 - y0)), f"{prefix}-{c_left}-front.webp", max_dim=720, pad_canvas=(680, 760))
        save_cutout(strip.crop((s1, 0, s2, y1 - y0)), f"{prefix}-{c_left}-back.webp", max_dim=720, pad_canvas=(680, 760))
        save_cutout(strip.crop((s2, 0, s3, y1 - y0)), f"{prefix}-{c_right}-front.webp", max_dim=720, pad_canvas=(680, 760))
        save_cutout(strip.crop((s3, 0, w, y1 - y0)), f"{prefix}-{c_right}-back.webp", max_dim=720, pad_canvas=(680, 760))


def split_2x2_sneakers(filename, prefix, colors):
    """
    For sneakers, save full pair (-pair.webp) cleanly without clipping any toe!
    For Video 3 (-side.webp), use the full pair OR cleanly isolate left shoe only when separated by a white valley.
    """
    im = Image.open(os.path.join(OUTLATE_DIR, filename))
    w, h = im.size
    qw = w // 2
    qh = h // 2
    quads = [(0, 0, colors[0]), (1, 0, colors[1]), (0, 1, colors[2]), (1, 1, colors[3])]

    for qx, qy, cname in quads:
        x0 = qx * qw
        y0 = qy * qh
        x1 = (qx + 1) * qw if qx == 0 else w
        y1 = (qy + 1) * qh if qy == 0 else h
        quad = im.crop((x0, y0, x1, y1))

        # Full pair (keep both shoes! clean_slivers=False so neither shoe gets dropped)
        save_cutout(quad, f"{prefix}-{cname}-pair.webp", max_dim=760, pad_canvas=(780, 560), clean_slivers=False)

        # Check if there is a clean white gap between left & right shoe for isolated side shoe
        tw, th = quad.size
        # Find whitest column between 54% and 78% of quadrant width
        valley_x = find_white_valley(quad, int(tw * 0.66), search_radius=int(tw * 0.12))
        # Check how white that valley column actually is
        rgb = quad.convert("RGB")
        pix = rgb.load()
        non_white = sum(1 for y in range(0, th, 2) if min(pix[valley_x, y]) < 228)
        if non_white < th * 0.04:
            # Clean separation! Save pure isolated left side-profile shoe & right angled shoe!
            save_cutout(quad.crop((0, 0, valley_x, th)), f"{prefix}-{cname}-side.webp", max_dim=720, pad_canvas=(740, 560), clean_slivers=True)
            save_cutout(quad.crop((valley_x, 0, tw, th)), f"{prefix}-{cname}-angle.webp", max_dim=720, pad_canvas=(740, 560), clean_slivers=True)
        else:
            # Shoes overlap slightly in this studio shot — use full pristine pair for side & zoomed crop for angle so toe is NEVER clipped!
            save_cutout(quad, f"{prefix}-{cname}-side.webp", max_dim=760, pad_canvas=(780, 560), clean_slivers=False)
            save_cutout(quad.crop((int(tw * 0.30), 0, tw, th)), f"{prefix}-{cname}-angle.webp", max_dim=720, pad_canvas=(740, 560), clean_slivers=False)


def hue_shift_garment(in_prefix, out_prefix, hue_delta=0, sat_mult=1.0, val_mult=1.0):
    for view in ("front", "back"):
        src = Image.open(os.path.join(OUT_DIR, f"{in_prefix}-{view}.webp")).convert("RGBA")
        _, _, _, a = src.split()
        hsv = src.convert("RGB").convert("HSV")
        h_ch, s_ch, v_ch = hsv.split()
        h_data = list(h_ch.get_flattened_data())
        s_data = list(s_ch.get_flattened_data())
        v_data = list(v_ch.get_flattened_data())
        new_h, new_s, new_v = [], [], []
        for hv, sv, vv in zip(h_data, s_data, v_data):
            if sv > 45 and vv > 35:
                new_h.append((hv + hue_delta) % 256)
                new_s.append(max(0, min(255, int(sv * sat_mult))))
                new_v.append(max(0, min(255, int(vv * val_mult))))
            else:
                new_h.append(hv); new_s.append(sv); new_v.append(vv)
        h_ch.putdata(new_h); s_ch.putdata(new_s); v_ch.putdata(new_v)
        recolored = Image.merge("HSV", (h_ch, s_ch, v_ch)).convert("RGB")
        recolored.putalpha(a)
        recolored.save(os.path.join(OUT_DIR, f"{out_prefix}-{view}.webp"), "WEBP", quality=88, method=5)


def main():
    # Re-process hoodies, jackets, joggers, sneakers with valley detection & sliver cleanup!
    split_1x2("Black-and-Gold Jatayu Mythology Hoodie.png", "hoodie-jatayu-black")
    split_1x2("Jatayu Ink Battle Hoodie Mockup.png", "hoodie-jatayu-ivory")
    split_1x2("Jatayu Versus Ravana Hoodie Mockup.png", "hoodie-jatayu-crimson")
    split_1x2("Epic Hanuman Hoodie Showcase.png", "hoodie-hanuman-black")
    split_1x2("Hanuman’s Epic Leap Hoodie Design.png", "hoodie-hanuman-sandstone")
    split_1x2("Ninja Dragon Ink Hoodie Mockup.png", "hoodie-dragon-navy")
    split_1x2("Forest Green Ninja Dragon Hoodie Mockup.png", "hoodie-dragon-green")
    split_1x2("Falcon Ink Japanese Hoodie Mockup.png", "hoodie-falcon-saffron")
    hue_shift_garment("hoodie-falcon-saffron", "hoodie-falcon-crimson", hue_delta=-14, sat_mult=1.05, val_mult=0.86)
    hue_shift_garment("hoodie-falcon-saffron", "hoodie-falcon-forest", hue_delta=84, sat_mult=0.72, val_mult=0.58)
    hue_shift_garment("hoodie-falcon-saffron", "hoodie-falcon-navy", hue_delta=138, sat_mult=0.80, val_mult=0.62)

    split_2x4_garments("Rudra Tandava Jacket Collection.png", "jacket-rudra", ["black", "navy", "white", "green"])
    split_2x4_garments("Hanuman Ji Tactical Jacket Collection.png", "jacket-hanuman-ji", ["black", "navy", "white", "green"])
    split_2x4_garments("Hanuman Leap Jacket Collection.png", "jacket-hanuman-leap", ["black", "navy", "white", "green"])
    split_2x4_garments("Dragon Ball Goku Hoodie Collection.png", "jacket-goku", ["black", "navy", "white", "green"])
    split_2x4_garments("Naruto Anime Hoodie Collection Mockup.png", "jacket-naruto-uchiha", ["black", "navy", "white", "green"])
    split_2x4_garments("One Piece Jolly Roger Hoodie Jacket Collection.png", "jacket-onepiece", ["black", "navy", "white", "green"])
    split_1x2("Gemini_Generated_Image_owbt1vowbt1vowbt.jpg", "jacket-team7-white")
    split_1x2("Gemini_Generated_Image_uyxhunuyxhunuyxh.png", "jacket-team7-green")
    split_2x4_garments("Four-Color Falcon Tactical Jacket Grid.png", "jacket-falcon", ["black", "crimson", "saffron", "green"])
    split_1x2("Falcon Streetwear Jacket Mockup.png", "jacket-falcon-white")
    split_2x4_garments("Lion-Themed Tactical Jacket Collection.png", "jacket-lion", ["black", "crimson", "saffron", "green"])

    split_2x4_garments("Gemini_Generated_Image_n516cvn516cvn516.png", "joggers-botanical", ["black", "navy", "white", "green"])
    split_2x4_garments("indian_traditional_joggers_grid.jpg", "joggers-heritage", ["black", "navy", "white", "green"])
    split_2x4_garments("anime_japanese_joggers_grid.jpg", "joggers-oni", ["black", "navy", "white", "green"])

    split_2x2_sneakers("Gemini_Generated_Image_1v30pu1v30pu1v30.png", "sneakers-trishul", ["white", "black", "navy", "green"])
    split_2x2_sneakers("Gemini_Generated_Image_1nuhbm1nuhbm1nuh.png", "sneakers-wilderness", ["white", "black", "navy", "green"])
    split_2x2_sneakers("anime_japanese_sneakers_grid.jpg", "sneakers-shogun", ["black", "navy", "white", "green"])

    print("PERFECTION PASS COMPLETE!")


if __name__ == "__main__":
    main()
