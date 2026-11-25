/* ==========================================================================
   REBELLION STREETWEAR — INTERACTIVE STOREFRONT ENGINE
   ========================================================================== */

(function () {
  const DATA = window.REBELLION_DATA;
  const APPAREL_SIZES = ["S", "M", "L", "XL", "XXL"];
  const SNEAKER_SIZES = ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"];
  const FREE_SHIPPING_THRESHOLD = 2999;
  const SHIPPING_FEE = 149;

  // Helpers
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const formatINR = (num) => "₹" + Number(num).toLocaleString("en-IN");
  const getProduct = (id) => DATA.products.find((p) => p.id === id);
  const getSizesFor = (cat) => (cat === "sneakers" ? SNEAKER_SIZES : APPAREL_SIZES);
  const themeLabel = (id) => (DATA.themes.find((t) => t.id === id)?.shortName || id);
  const catLabel = (id) => (DATA.categories.find((c) => c.id === id)?.name || id);

  // =========================================================================
  // APPLICATION STATE
  // =========================================================================
  const state = {
    heroSlideIdx: 0,
    heroColorIdx: 0,
    heroView: "front", // 'front' | 'back'
    heroSize: "L",

    cinemaThemeIdx: 0,
    browseMode: "category", // 'category' | 'theme'

    filters: {
      category: "all",
      theme: "all",
      color: "all",
      maxPrice: 6499,
      search: "",
      sort: "featured"
    },

    // Per-card live selected colorway index { [productId]: number }
    cardColorIdx: {},

    sneakerIdx: 0,
    craftLayerIdx: 0,

    // PDP Modal state
    pdpProductId: null,
    pdpColorIdx: 0,
    pdpSize: "L",
    pdpActiveImg: "",
    pdpMediaMode: "video", // 'video' | 'gallery'

    // Cart & Wishlist (persisted)
    cart: JSON.parse(localStorage.getItem("rebellion_cart_v1") || "[]"),
    wishlist: JSON.parse(localStorage.getItem("rebellion_wishlist_v1") || "[]"),
    promoApplied: false,

    // Checkout
    payMethod: "upi",
    upiApp: "GPay"
  };

  function saveCart() {
    localStorage.setItem("rebellion_cart_v1", JSON.stringify(state.cart));
  }
  function saveWishlist() {
    localStorage.setItem("rebellion_wishlist_v1", JSON.stringify(state.wishlist));
  }

  // Video Engine, Audio Engine, Carousel & Preloader handles
  let pdpVideoPlayer = null;
  let preloaderTimer = null;
  let preloaderDoneTimer = null;
  let preloaderFlashInterval = null;
  let promoSlideIdx = 0;
  let promoAutoTimer = null;

  const PRELOADER_FLASH_FRAMES = [
    { src: "assets/products/hoodie-jatayu-black-back.webp", bg: "#9f1239" },
    { src: "assets/products/hoodie-falcon-saffron-back.webp", bg: "#ea580c" },
    { src: "assets/products/editorial-team7-showcase.webp", bg: "#1e293b" },
    { src: "assets/products/jacket-rudra-black-back.webp", bg: "#b91c1c" },
    { src: "assets/products/jacket-goku-navy-back.webp", bg: "#1d4ed8" },
    { src: "assets/products/jacket-lion-black-back.webp", bg: "#d97706" },
    { src: "assets/products/sneakers-trishul-black-pair.webp", bg: "#7f1d1d" },
    { src: "assets/brand/company-logo.jpg", bg: "#0f172a" },
    { src: "assets/products/jacket-hanuman-leap-black-back.webp", bg: "#c2410c" },
    { src: "assets/products/joggers-botanical-navy-back.webp", bg: "#047857" }
  ];
  PRELOADER_FLASH_FRAMES.forEach((f) => {
    const im = new Image();
    im.src = f.src;
  });

  function formatVideoTime(sec) {
    const s = Math.max(0, Math.floor(sec));
    return `00:${String(s).padStart(2, "0")}`;
  }

  function syncThemeSound(themeId) {
    if (!window.RebellionAudioEngine) return;
    if (themeId === "indian-traditional" || themeId === "anime-japanese" || themeId === "animal-nature") {
      window.RebellionAudioEngine.setTheme(themeId);
    } else {
      window.RebellionAudioEngine.setTheme("main");
    }
  }

  // =========================================================================
  // 0. CINEMATIC "REBELLION" CUTOUT-FLASH & ZOOM-THROUGH PORTAL INTRO
  // =========================================================================
  function dismissPreloader() {
    if (preloaderTimer) { clearTimeout(preloaderTimer); preloaderTimer = null; }
    if (preloaderDoneTimer) { clearTimeout(preloaderDoneTimer); preloaderDoneTimer = null; }
    if (preloaderFlashInterval) { clearInterval(preloaderFlashInterval); preloaderFlashInterval = null; }
    const el = $("#preloader");
    if (!el) return;
    el.classList.add("zooming");
    preloaderDoneTimer = setTimeout(() => {
      el.classList.add("done");
      document.body.style.overflow = "";
    }, 880);
  }

  function runPreloader() {
    const el = $("#preloader");
    if (!el) return;
    if (preloaderTimer) clearTimeout(preloaderTimer);
    if (preloaderDoneTimer) clearTimeout(preloaderDoneTimer);
    if (preloaderFlashInterval) clearInterval(preloaderFlashInterval);

    el.classList.remove("done", "zooming");
    document.body.style.overflow = "hidden";

    // Restart horizontal center-outward flash reveal
    const reel = $("#preloaderFlashReel");
    if (reel) {
      reel.style.animation = "none";
      void reel.offsetWidth;
      reel.style.animation = "";
    }

    const flashImg = $("#preloaderFlashImg");
    let frameIdx = 0;
    if (flashImg) {
      const applyFrame = (idx) => {
        const f = PRELOADER_FLASH_FRAMES[idx];
        flashImg.src = f.src;
        if (reel) reel.style.background = f.bg;
        flashImg.style.transform = idx % 2 === 0 ? "scale(1.12)" : "scale(1.04)";
      };
      applyFrame(0);
      preloaderFlashInterval = setInterval(() => {
        frameIdx = (frameIdx + 1) % PRELOADER_FLASH_FRAMES.length;
        applyFrame(frameIdx);
      }, 140);
    }

    // After rapid artwork flashes inside REBELLION letters, zoom THROUGH into live site!
    preloaderTimer = setTimeout(() => {
      if (preloaderFlashInterval) {
        clearInterval(preloaderFlashInterval);
        preloaderFlashInterval = null;
      }
      el.classList.add("zooming");
      preloaderDoneTimer = setTimeout(() => {
        el.classList.add("done");
        document.body.style.overflow = "";
      }, 880);
    }, 1500);
  }

  // =========================================================================
  // 0.5 FRONT PAGE AUTO-SLIDING DEALS & DROPS CAROUSEL (PRODUCT ONLY)
  // =========================================================================
  function initPromoCarousel() {
    const track = $("#promoCarouselTrack");
    const viewport = $("#promoCarouselViewport");
    if (!track || !viewport) return;

    const slides = $$(".promo-slide", track);
    const total = slides.length;
    if (!total) return;

    const goTo = (idx) => {
      promoSlideIdx = (idx + total) % total;
      track.style.transform = `translateX(-${promoSlideIdx * 100}%)`;
      $$("#promoDots .promo-dot").forEach((dot, i) => dot.classList.toggle("active", i === promoSlideIdx));
    };

    const startAuto = () => {
      stopAuto();
      promoAutoTimer = setInterval(() => goTo(promoSlideIdx + 1), 3600);
    };
    const stopAuto = () => {
      if (promoAutoTimer) {
        clearInterval(promoAutoTimer);
        promoAutoTimer = null;
      }
    };

    $("#promoPrevBtn")?.addEventListener("click", () => { goTo(promoSlideIdx - 1); startAuto(); });
    $("#promoNextBtn")?.addEventListener("click", () => { goTo(promoSlideIdx + 1); startAuto(); });
    $$("#promoDots .promo-dot").forEach((dot) => {
      dot.addEventListener("click", () => {
        goTo(Number(dot.dataset.promoDot));
        startAuto();
      });
    });

    viewport.addEventListener("mouseenter", stopAuto);
    viewport.addEventListener("mouseleave", startAuto);

    // Touch swipe on mobile phones
    let sx = 0;
    viewport.addEventListener("touchstart", (e) => {
      sx = e.changedTouches[0].screenX;
      stopAuto();
    }, { passive: true });
    viewport.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].screenX - sx;
      if (Math.abs(dx) > 42) goTo(promoSlideIdx + (dx < 0 ? 1 : -1));
      startAuto();
    }, { passive: true });

    // Copy REBEL10 button
    $("#copyRebelCodeBtn")?.addEventListener("click", () => {
      try { navigator.clipboard?.writeText("REBEL10"); } catch (_) {}
      showToast("Promo code <strong>REBEL10</strong> copied! Extra 10% OFF in Bag.");
    });

    goTo(0);
    startAuto();
  }

  // =========================================================================
  // 0.75 MINIMAL SILENT / SOUND CONTROLS (BACKGROUND THEME AUDIO AUTO-SWITCH)
  // =========================================================================
  function initAudioControls() {
    const engine = window.RebellionAudioEngine;
    if (!engine) return;

    const eqEl = $("#audioEq");
    const silentBtn = $("#audioSilentBtn");
    const silentLabel = $("#audioSilentLabel");
    const navSoundBtn = $("#navSoundBtn");

    engine.onChange((st) => {
      const isOff = st.muted || st.stopped;
      if (eqEl) eqEl.classList.toggle("playing", st.playing);

      if (silentBtn) {
        silentBtn.classList.toggle("is-muted", isOff);
      }
      if (silentLabel) {
        silentLabel.textContent = isOff ? "Sound Off" : "Silent";
      }

      if (navSoundBtn) {
        navSoundBtn.classList.toggle("is-playing", st.playing);
        navSoundBtn.classList.toggle("is-muted", isOff);
        $(".snd-on-ico", navSoundBtn)?.classList.toggle("hidden", isOff);
        $(".snd-off-ico", navSoundBtn)?.classList.toggle("hidden", !isOff);
      }
    });

    const toggleSilent = (e) => {
      e.stopPropagation();
      engine.toggleMute();
    };

    silentBtn?.addEventListener("click", toggleSilent);
    navSoundBtn?.addEventListener("click", toggleSilent);

    // Attempt luxury warm ambient autoplay immediately
    engine.initAutoPlay();
  }

  // Toast helper
  function showToast(msg) {
    const container = $("#toastContainer");
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = msg;
    container.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateY(10px)";
      el.style.transition = "all 0.25s ease";
      setTimeout(() => el.remove(), 260);
    }, 2900);
  }

  // =========================================================================
  // 1. HERO DYNAMIC COLOR-MORPHING STAGE (Video 1 Inspiration)
  // =========================================================================
  function getHeroSlideProduct() {
    const slide = DATA.heroSlides[state.heroSlideIdx];
    const product = getProduct(slide.productId);
    const color = product.colors[state.heroColorIdx] || product.colors[0];
    return { slide, product, color };
  }

  function buildBgForColor(color, fallbackRadial) {
    if (color.bgGlow) return color.bgGlow;
    const hex = color.accent || "#FF5E1A";
    return `radial-gradient(circle at 52% 46%, ${hex}55 0%, ${hex}24 38%, #0d0d13 78%, #070709 100%)`;
  }

  function renderHero(animateSwap = false) {
    const { slide, product, color } = getHeroSlideProduct();
    const imgEl = $("#heroGarmentImg");
    const bgLayer = $("#heroBgLayer");
    const aura = $("#heroAura");

    const nextSrc = state.heroView === "back" ? color.back : color.front;

    // Update radial background morph
    bgLayer.style.background = buildBgForColor(color, slide.bgRadial);
    aura.style.background = `radial-gradient(circle, ${color.accent || slide.accent}55 0%, transparent 70%)`;

    // Text & counters
    $("#heroSlideCounter").textContent = `${String(state.heroSlideIdx + 1).padStart(2, "0")} / ${String(DATA.heroSlides.length).padStart(2, "0")}`;
    $("#heroEyebrow").textContent = slide.eyebrow;
    $("#heroHeadline").textContent = slide.headline;
    $("#heroCopy").textContent = slide.copy;
    $("#heroTagline").textContent = slide.tagline;

    $("#heroCatPill").textContent = `${catLabel(product.category).toUpperCase()} • ${themeLabel(product.theme).toUpperCase()}`;
    $("#heroProductName").textContent = product.name;
    $("#heroPrice").textContent = formatINR(product.price);
    $("#heroMrp").textContent = formatINR(product.mrp);
    const pct = Math.round(((product.mrp - product.price) / product.mrp) * 100);
    $("#heroDiscount").textContent = `${pct}% OFF`;
    $("#heroColorName").textContent = color.name;
    $("#heroFlipLabel").textContent = state.heroView === "back" ? "Show Front View" : "Show Back Artwork";

    // Arc swap animation (Video 1!)
    if (animateSwap) {
      imgEl.classList.remove("arc-enter");
      imgEl.classList.add("arc-exit");
      setTimeout(() => {
        imgEl.src = nextSrc;
        imgEl.alt = `${product.name} — ${color.name}`;
        imgEl.classList.remove("arc-exit");
        void imgEl.offsetWidth;
        imgEl.classList.add("arc-enter");
      }, 210);
    } else {
      imgEl.src = nextSrc;
      imgEl.alt = `${product.name} — ${color.name}`;
    }

    // Hero Color Swatches
    const swWrap = $("#heroColorSwatches");
    swWrap.innerHTML = product.colors
      .map(
        (c, i) => `
        <button class="swatch-dot ${i === state.heroColorIdx ? "active" : ""}"
          style="background:${c.hex}"
          title="${c.name}"
          aria-label="Select colorway ${c.name}"
          data-hero-color="${i}"></button>`
      )
      .join("");

    // Hero Circular Sizes (Video 1!)
    const sizes = getSizesFor(product.category);
    if (!sizes.includes(state.heroSize)) state.heroSize = sizes[2];
    const szWrap = $("#heroSizeCircles");
    szWrap.innerHTML = sizes
      .map(
        (s) => `
        <button class="size-circle ${s === state.heroSize ? "active" : ""}" data-hero-size="${s}">${s.replace("UK ", "")}</button>`
      )
      .join("");

    // Floating Bottom-Right Next Colorway Preview (Video 1 signature!)
    const nextColorIdx = (state.heroColorIdx + 1) % product.colors.length;
    const nextColor = product.colors[nextColorIdx];
    $("#heroNextPreviewImg").src = nextColor.front;
    $("#heroNextPreviewName").textContent = nextColor.name;
  }

  function changeHeroSlide(delta) {
    state.heroSlideIdx = (state.heroSlideIdx + delta + DATA.heroSlides.length) % DATA.heroSlides.length;
    state.heroColorIdx = DATA.heroSlides[state.heroSlideIdx].colorIndex || 0;
    state.heroView = "front";
    renderHero(true);
  }

  // =========================================================================
  // 2. CINEMATIC ART THEME EXPLORER (Video 4 Inspiration)
  // =========================================================================
  function renderCinemaTheme() {
    const theme = DATA.themes[state.cinemaThemeIdx];
    const count = DATA.products.filter((p) => p.theme === theme.id).length;

    $("#themesCinemaBg").style.background = theme.bgGradient;
    $("#cinemaIndex").textContent = `THEME ${theme.index} / 03`;
    $("#cinemaCount").textContent = `${count} MULTI-COLOR DROPS`;

    const titleEl = $("#cinemaTitle");
    titleEl.style.animation = "none";
    void titleEl.offsetWidth;
    titleEl.textContent = theme.name.toUpperCase();
    titleEl.style.animation = "kineticSlideUp 0.55s cubic-bezier(0.16, 1, 0.3, 1)";

    $("#cinemaSubtitle").textContent = theme.subtitle;
    $("#cinemaDesc").textContent = theme.description;
    $("#cinemaTags").innerHTML = theme.tags.map((t) => `<span class="cinema-tag">${t}</span>`).join("");

    const pImg = $("#cinemaImgPrimary");
    const sImg = $("#cinemaImgSecondary");
    pImg.style.opacity = "0";
    sImg.style.opacity = "0";
    setTimeout(() => {
      pImg.src = theme.featuredImg;
      sImg.src = theme.secondaryImg;
      pImg.style.opacity = "1";
      sImg.style.opacity = "0.84";
    }, 150);

    // Bottom numbered strip (01, 02, 03)
    $("#cinemaStrip").innerHTML = DATA.themes
      .map(
        (t, idx) => `
        <button class="cinema-thumb-card ${idx === state.cinemaThemeIdx ? "active" : ""}"
          style="--thumb-accent:${t.accent}"
          data-cinema-idx="${idx}"
          role="tab"
          aria-selected="${idx === state.cinemaThemeIdx}">
          <span class="cinema-thumb-num">${t.index}</span>
          <img src="${t.featuredImg}" alt="${t.name}" class="cinema-thumb-img" loading="lazy" />
          <div class="cinema-thumb-info">
            <strong>${t.name}</strong>
            <span>${t.subtitle}</span>
          </div>
        </button>`
      )
      .join("");
  }

  // =========================================================================
  // 3. INTERACTIVE CATEGORY & THEME EXPLORER + FULL CATALOG
  // =========================================================================
  function renderCategoryExplorer() {
    const grid = $("#categoryExplorerGrid");
    if (state.browseMode === "category") {
      grid.classList.remove("theme-mode");
      grid.innerHTML = DATA.categories
        .map(
          (c, i) => `
          <button class="explorer-card ${state.filters.category === c.id ? "active" : ""}"
            style="--card-accent:${c.accent}33; --card-accent-solid:${c.accent}"
            data-explore-cat="${c.id}">
            <div class="explorer-card-top">
              <span>0${i + 1} // CATEGORY</span>
              <span>${c.count} DROPS</span>
            </div>
            <img src="${c.heroImg}" alt="${c.name}" class="explorer-card-img" loading="lazy" />
            <div class="explorer-card-foot">
              <h3>${c.name}</h3>
              <p>${c.tagline}</p>
            </div>
          </button>`
        )
        .join("");
    } else {
      grid.classList.add("theme-mode");
      grid.innerHTML = DATA.themes
        .map((t) => {
          const cnt = DATA.products.filter((p) => p.theme === t.id).length;
          return `
          <button class="explorer-card ${state.filters.theme === t.id ? "active" : ""}"
            style="--card-accent:${t.accent}33; --card-accent-solid:${t.accent}"
            data-explore-theme="${t.id}">
            <div class="explorer-card-top">
              <span>${t.index} // ART THEME</span>
              <span>${cnt} DROPS</span>
            </div>
            <img src="${t.featuredImg}" alt="${t.name}" class="explorer-card-img" loading="lazy" />
            <div class="explorer-card-foot">
              <h3>${t.shortName}</h3>
              <p>${t.subtitle}</p>
            </div>
          </button>`;
        })
        .join("");
    }
  }

  function renderSidebarLists() {
    const catList = $("#sidebarCatList");
    catList.innerHTML = [
      { id: "all", name: "All Categories", count: DATA.products.length },
      ...DATA.categories
    ]
      .map(
        (c) => `
        <button class="sidebar-filter-btn ${state.filters.category === c.id ? "active" : ""}" data-side-cat="${c.id}">
          <span>${c.name}</span>
          <span>${c.count}</span>
        </button>`
      )
      .join("");

    const themeList = $("#sidebarThemeList");
    themeList.innerHTML = [
      { id: "all", name: "All 3 Art Themes" },
      ...DATA.themes
    ]
      .map(
        (t) => `
        <button class="sidebar-filter-btn ${state.filters.theme === t.id ? "active" : ""}" data-side-theme="${t.id}">
          <span>${t.name}</span>
        </button>`
      )
      .join("");
  }

  function matchesColorFamily(product, colorFamily) {
    if (colorFamily === "all") return true;
    const map = {
      black: ["black", "obsidian", "midnight", "flame", "crimson oni"],
      navy: ["navy", "cobalt", "indigo", "blue", "wave", "tsunami", "chakra"],
      white: ["white", "ivory", "sandstone", "arctic", "manga", "sakura", "bone", "fern"],
      green: ["green", "emerald", "forest", "olive", "jungle", "rainforest", "zoro", "kakashi"],
      crimson: ["crimson", "red"],
      saffron: ["saffron", "orange", "flame"]
    };
    const keys = map[colorFamily] || [colorFamily];
    return product.colors.some((c) => keys.some((k) => c.name.toLowerCase().includes(k)));
  }

  function getFilteredProducts() {
    const f = state.filters;
    let list = DATA.products.filter((p) => {
      if (f.category !== "all" && p.category !== f.category) return false;
      if (f.theme !== "all" && p.theme !== f.theme) return false;
      if (p.price > f.maxPrice) return false;
      if (!matchesColorFamily(p, f.color)) return false;
      if (f.search.trim()) {
        const q = f.search.toLowerCase();
        const hay = `${p.name} ${p.category} ${p.theme} ${p.description} ${p.colors.map((c) => c.name).join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (f.sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (f.sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (f.sort === "rating") list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    else list.sort((a, b) => Number(b.featured) - Number(a.featured) || Number(a.dropNo) - Number(b.dropNo));

    return list;
  }

  function buildProductCardHTML(p) {
    const cIdx = state.cardColorIdx[p.id] ?? 0;
    const color = p.colors[cIdx] || p.colors[0];
    const wished = state.wishlist.includes(p.id);
    const disc = Math.round(((p.mrp - p.price) / p.mrp) * 100);

    return `
      <article class="product-card" data-product-card="${p.id}">
        <div class="card-media" style="--card-glow:${color.accent || "#FF5E1A"}28" data-open-pdp="${p.id}">
          <div class="card-top-badges">
            <span class="card-drop-index">${p.dropNo} // ${catLabel(p.category).toUpperCase()}</span>
            <div class="card-right-tools">
              <button class="card-icon-mini ${wished ? "active" : ""}" data-toggle-wish="${p.id}" aria-label="Save to wishlist" title="Wishlist">
                <svg viewBox="0 0 24 24" fill="${wished ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
            </div>
          </div>

          <img src="${color.front}" alt="${p.name} — ${color.name} Front" class="card-img-front" loading="lazy" />
          <img src="${color.back}" alt="${p.name} — ${color.name} Back Artwork" class="card-img-back" loading="lazy" />

          <span class="card-theme-pill">${themeLabel(p.theme)}</span>
          <div class="card-bottom-actions">
            <button class="card-video-btn" data-open-video="${p.id}" type="button" title="Watch Studio Detail & Zoom Video">&#9654; VIDEO</button>
            <button class="card-flip-btn" data-flip-card="${p.id}" type="button">FLIP</button>
          </div>
        </div>

        <div class="card-body">
          <div class="card-meta-top">
            <span>${p.badge}</span>
            <span class="card-rating">★ ${p.rating.toFixed(1)} (${p.reviews})</span>
          </div>
          <h3 class="card-title" data-open-pdp="${p.id}">${p.name}</h3>

          <!-- Live Colorway Switcher for Same Design -->
          <div class="card-swatches-row">
            <div class="card-swatches">
              ${p.colors
                .map(
                  (c, idx) => `
                  <button class="card-swatch ${idx === cIdx ? "active" : ""}"
                    style="background:${c.hex}"
                    title="${c.name}"
                    aria-label="Switch to ${c.name}"
                    data-card-color="${p.id}:${idx}"></button>`
                )
                .join("")}
            </div>
            <span class="card-color-label">${color.name}</span>
          </div>

          <div class="card-price-action">
            <div class="card-price-wrap">
              <span class="card-price">${formatINR(p.price)}</span>
              <span class="card-mrp">${formatINR(p.mrp)}</span>
            </div>
            <button class="quick-add-btn" data-quick-add="${p.id}">+ Bag</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderCatalog() {
    const products = getFilteredProducts();
    const grid = $("#productGrid");

    // Sync active tabs & pills
    $$("#catTabs .cat-tab").forEach((b) => b.classList.toggle("active", b.dataset.cat === state.filters.category));
    $$("#themePills .theme-pill").forEach((b) => b.classList.toggle("active", b.dataset.theme === state.filters.theme));
    $$("#colorFilterPills .cf-pill").forEach((b) => b.classList.toggle("active", b.dataset.color === state.filters.color));
    renderSidebarLists();
    renderCategoryExplorer();

    const catText = state.filters.category === "all" ? "All Categories" : catLabel(state.filters.category);
    const thText = state.filters.theme === "all" ? "All 3 Art Themes" : themeLabel(state.filters.theme);
    $("#resultsCountText").innerHTML = `Showing <strong>${products.length}</strong> drop${products.length === 1 ? "" : "s"} in <strong>${catText}</strong> • ${thText}`;

    if (!products.length) {
      grid.innerHTML = `
        <div class="empty-catalog">
          <h3>No drops matched your filter</h3>
          <p style="color:var(--text-muted);margin:8px 0 18px;">Try resetting filters or exploring another colorway/theme.</p>
          <button class="btn btn-primary" id="inlineResetBtn">Reset All Filters</button>
        </div>`;
      return;
    }

    grid.innerHTML = products.map(buildProductCardHTML).join("");
  }

  function renderFeaturedDrops() {
    const featured = DATA.products.filter((p) => p.featured).slice(0, 8);
    $("#featuredDropsGrid").innerHTML = featured.map(buildProductCardHTML).join("");
  }

  function switchCardColor(productId, colorIdx) {
    state.cardColorIdx[productId] = colorIdx;
    const p = getProduct(productId);
    if (!p) return;
    const color = p.colors[colorIdx];
    // Update EVERY instance of this product card on the page (catalog + featured) without full re-render flicker!
    $$(`[data-product-card="${productId}"]`).forEach((card) => {
      const media = $(".card-media", card);
      const front = $(".card-img-front", card);
      const back = $(".card-img-back", card);
      const label = $(".card-color-label", card);
      media.style.setProperty("--card-glow", `${color.accent || "#FF5E1A"}28`);
      front.src = color.front;
      back.src = color.back;
      if (label) label.textContent = color.name;
      $$(".card-swatch", card).forEach((sw, i) => sw.classList.toggle("active", i === colorIdx));
    });
  }

  // =========================================================================
  // 4. TRIPLE-STRIPE SNEAKER SPOTLIGHT (Video 3 Inspiration)
  // =========================================================================
  function renderSneakerSpotlight(animate = false) {
    const item = DATA.sneakerSpotlight[state.sneakerIdx];
    const stripes = $("#tripleStripes");
    const img = $("#snkHeroImg");

    stripes.style.setProperty("--stripe-color", item.stripeColor);
    stripes.style.setProperty("--stripe-glow", item.stripeGlow);

    $("#snkSubtitle").textContent = item.subtitle;
    $("#snkTitle").textContent = item.title;
    $("#snkDesc").textContent = item.description;
    $("#snkPrice").textContent = formatINR(item.price);

    if (animate) {
      stripes.classList.add("pulse");
      setTimeout(() => stripes.classList.remove("pulse"), 420);
      img.classList.remove("snk-enter");
      img.src = item.image;
      void img.offsetWidth;
      img.classList.add("snk-enter");
    } else {
      img.src = item.image;
    }

    $("#sneakerThumbsGrid").innerHTML = DATA.sneakerSpotlight
      .map(
        (s, idx) => `
        <button class="snk-thumb-btn ${idx === state.sneakerIdx ? "active" : ""}"
          style="--thumb-ring:${s.stripeColor}; --thumb-glow:${s.stripeGlow}"
          data-snk-idx="${idx}"
          title="${s.title}"
          aria-label="Preview ${s.title}">
          <img src="${s.thumb}" alt="${s.title}" loading="lazy" />
        </button>`
      )
      .join("");
  }

  // =========================================================================
  // 5. ENGINEERED TO ENDURE — 3D ISOMETRIC LAYERS (Video 2 Inspiration)
  // =========================================================================
  function renderCraftLayers() {
    $("#craftLayersList").innerHTML = DATA.craftLayers
      .map(
        (l, idx) => `
        <button class="craft-layer-item ${idx === state.craftLayerIdx ? "active" : ""}"
          style="--layer-accent:${l.accent}"
          data-craft-idx="${idx}">
          <span class="craft-layer-num">${l.num} //</span>
          <div>
            <strong>${l.title}</strong>
            <small>${l.subtitle}</small>
          </div>
        </button>`
      )
      .join("");

    $$("#isometricStage .iso-plate").forEach((plate, i) => {
      plate.classList.toggle("active", i === state.craftLayerIdx);
    });

    const active = DATA.craftLayers[state.craftLayerIdx];
    $("#craftSpecNum").textContent = `${active.num} // ${active.subtitle}`;
    $("#craftSpecNum").style.color = active.accent;
    $("#craftSpecTitle").textContent = active.title;
    $("#craftSpecDetail").textContent = active.detail;
  }

  // =========================================================================
  // 6. PRODUCT DETAIL PAGE (PDP) MODAL + LIVE MALE MODEL RUNWAY VIDEO
  // =========================================================================
  function destroyPdpVideo() {
    if (pdpVideoPlayer) {
      pdpVideoPlayer.destroy();
      pdpVideoPlayer = null;
    }
  }

  function openPDP(productId, initialColorIdx = null, initialMode = "video") {
    const p = getProduct(productId);
    if (!p) return;
    state.pdpProductId = productId;
    state.pdpColorIdx = initialColorIdx !== null ? initialColorIdx : (state.cardColorIdx[productId] ?? 0);
    const sizes = getSizesFor(p.category);
    state.pdpSize = sizes[2];
    const color = p.colors[state.pdpColorIdx] || p.colors[0];
    state.pdpActiveImg = color.front;
    state.pdpMediaMode = initialMode || "video";

    renderPDP();
    syncThemeSound(p.theme);
    $("#pdpBackdrop").classList.add("open");
    $("#pdpModal").classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closePDP() {
    destroyPdpVideo();
    state.pdpProductId = null;
    $("#pdpBackdrop").classList.remove("open");
    $("#pdpModal").classList.remove("open");
    document.body.style.overflow = "";
    syncThemeSound(state.filters.theme);
  }

  function mountPdpVideo(product, colorIdx) {
    destroyPdpVideo();
    const canvas = $("#pdpVideoCanvas");
    if (!canvas || !window.RebellionVideoEngine) return;

    const fillEl = $("#pdpVideoScrubFill");
    const timeEl = $("#pdpVideoTime");
    const playIcon = $("#pdpVideoPlayIcon");

    pdpVideoPlayer = new window.RebellionVideoEngine.OutfitModelVideoPlayer(canvas, {
      onSceneChange(sceneIdx) {
        $$("#pdpScenePills .pdp-scene-pill").forEach((pill, i) => {
          pill.classList.toggle("active", i === sceneIdx);
        });
      },
      onTimeUpdate(time, duration) {
        if (fillEl) fillEl.style.width = `${(time / duration) * 100}%`;
        if (timeEl) timeEl.textContent = `${formatVideoTime(time)} / ${formatVideoTime(duration)}`;
      }
    });

    pdpVideoPlayer.setOutfit(product, colorIdx);

    const togglePlay = () => {
      if (!pdpVideoPlayer) return;
      const playing = pdpVideoPlayer.togglePlay();
      if (playIcon) playIcon.innerHTML = playing ? "&#10074;&#10074;" : "&#9654;";
    };

    $("#pdpVideoPlayBtn")?.addEventListener("click", togglePlay);
    canvas.addEventListener("click", togglePlay);

    $("#pdpVideoScrubber")?.addEventListener("click", (e) => {
      if (!pdpVideoPlayer) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const frac = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      pdpVideoPlayer.seekFraction(frac);
    });
  }

  function renderPDP() {
    destroyPdpVideo();
    const p = getProduct(state.pdpProductId);
    if (!p) return;
    const color = p.colors[state.pdpColorIdx] || p.colors[0];
    const sizes = getSizesFor(p.category);
    const disc = Math.round(((p.mrp - p.price) / p.mrp) * 100);
    const wished = state.wishlist.includes(p.id);

    const galleryImgs = [
      { label: "Front", src: color.front },
      { label: p.category === "sneakers" ? "Side Profile" : "Back Artwork", src: color.back }
    ];
    if (color.angle) galleryImgs.push({ label: "Rear Angle", src: color.angle });
    if (p.extraGallery) {
      p.extraGallery.forEach((src, i) => galleryImgs.push({ label: `Lookbook ${i + 1}`, src }));
    }

    if (!galleryImgs.some((g) => g.src === state.pdpActiveImg)) {
      state.pdpActiveImg = galleryImgs[0].src;
    }

    const related = DATA.products
      .filter((x) => x.id !== p.id && (x.theme === p.theme || x.category === p.category))
      .slice(0, 4);

    const mediaStageHTML =
      state.pdpMediaMode === "video"
        ? `
          <div class="pdp-video-stage">
            <div class="pdp-video-canvas-wrap">
              <canvas id="pdpVideoCanvas" aria-label="Studio detail zoom video for ${p.name}"></canvas>
            </div>
            <div class="pdp-video-controls">
              <div class="pdp-video-bar-row">
                <button class="pdp-vplay-btn" id="pdpVideoPlayBtn" type="button" aria-label="Play or Pause Outfit Video">
                  <span id="pdpVideoPlayIcon">&#10074;&#10074;</span>
                </button>
                <div class="pdp-vscrubber" id="pdpVideoScrubber" role="slider" aria-label="Outfit video timeline">
                  <div class="pdp-vscrub-fill" id="pdpVideoScrubFill"></div>
                </div>
                <span class="pdp-vtime" id="pdpVideoTime">00:00 / 00:12</span>
              </div>
              <div class="pdp-scene-pills" id="pdpScenePills">
                <button class="pdp-scene-pill active" data-pdp-scene="0" type="button">01 Front</button>
                <button class="pdp-scene-pill" data-pdp-scene="1" type="button">${p.category === "sneakers" ? "02 Profile" : "02 Back Art"}</button>
                <button class="pdp-scene-pill" data-pdp-scene="2" type="button">03 Macro Zoom</button>
                <button class="pdp-scene-pill" data-pdp-scene="3" type="button">04 Twin View</button>
              </div>
            </div>
          </div>`
        : `
          <div class="pdp-gallery-main" id="pdpMainStage" style="--pdp-glow:${color.accent || "#FF5E1A"}33" title="Click to toggle zoom">
            <img src="${state.pdpActiveImg}" alt="${p.name} — ${color.name}" id="pdpMainImg" />
          </div>
          <div class="pdp-thumbs">
            ${galleryImgs
              .map(
                (g) => `
                <button class="pdp-thumb ${g.src === state.pdpActiveImg ? "active" : ""}" data-pdp-thumb="${g.src}" title="${g.label}">
                  <img src="${g.src}" alt="${g.label}" />
                </button>`
              )
              .join("")}
          </div>`;

    $("#pdpBody").innerHTML = `
      <div class="pdp-grid">
        <div>
          <div class="pdp-media-tabs" role="tablist" aria-label="Product Media Mode">
            <button class="pdp-media-tab ${state.pdpMediaMode === "video" ? "active" : ""}" data-pdp-mode="video" type="button">
              &#9654; Detail Zoom Video
            </button>
            <button class="pdp-media-tab ${state.pdpMediaMode === "gallery" ? "active" : ""}" data-pdp-mode="gallery" type="button">
              &#128247; Studio Photos
            </button>
          </div>
          ${mediaStageHTML}
        </div>

        <div class="pdp-details">
          <div class="pdp-badges">
            <span class="pdp-badge">${catLabel(p.category).toUpperCase()}</span>
            <span class="pdp-badge">${themeLabel(p.theme).toUpperCase()}</span>
            <span class="pdp-badge">★ ${p.rating.toFixed(1)} (${p.reviews} Reviews)</span>
          </div>

          <h2 class="pdp-title" id="pdpTitle">${p.name}</h2>
          <p style="color:#d4d4d8;font-size:0.92rem;">${p.description}</p>

          <div class="pdp-price-bar">
            <span class="pdp-price">${formatINR(p.price)}</span>
            <span class="pdp-mrp">${formatINR(p.mrp)}</span>
            <span class="hero-discount">${disc}% OFF</span>
            <span class="pdp-tax">Inclusive of all taxes</span>
          </div>

          <div>
            <div class="option-head">
              <span>SELECT COLORWAY (${p.colors.length} OPTIONS)</span>
              <strong id="pdpActiveColorName">${color.name}</strong>
            </div>
            <div class="hero-color-swatches">
              ${p.colors
                .map(
                  (c, idx) => `
                  <button class="swatch-dot ${idx === state.pdpColorIdx ? "active" : ""}"
                    style="background:${c.hex};width:34px;height:34px;"
                    title="${c.name}"
                    data-pdp-color="${idx}"></button>`
                )
                .join("")}
            </div>
          </div>

          <div>
            <div class="option-head">
              <span>SELECT SIZE</span>
              <button class="text-link-xs" data-open-size-guide>Size Guide &amp; Fit Chart</button>
            </div>
            <div class="pdp-size-grid">
              ${sizes
                .map(
                  (s) => `
                  <button class="pdp-size-btn ${s === state.pdpSize ? "active" : ""}" data-pdp-size="${s}">${s}</button>`
                )
                .join("")}
            </div>
          </div>

          <div class="pdp-action-row">
            <button class="btn btn-white btn-lg" id="pdpAddCartBtn">Add to Bag</button>
            <button class="btn btn-primary btn-lg" id="pdpBuyNowBtn">Buy Now &rarr;</button>
          </div>

          <button class="btn btn-outline btn-sm" data-toggle-wish="${p.id}">
            ${wished ? "♥ Saved in Wishlist" : "♡ Add to Wishlist"}
          </button>

          <div class="pdp-specs">
            <div class="pdp-spec-block">
              <h5>FABRIC &amp; MATERIAL ENGINEERING</h5>
              <p>${p.fabric}</p>
            </div>
            <div class="pdp-spec-block">
              <h5>PRINT CARE INSTRUCTIONS</h5>
              <p>${p.care}</p>
            </div>
            <div class="pdp-spec-block">
              <h5>DELIVERY &amp; RETURNS (INDIA)</h5>
              <p>Dispatched within 24–48 hrs. Free express shipping above ₹2,999. 7-day hassle-free size exchange &amp; COD available.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="pdp-related">
        <h4>COMPLETE THE FIT — YOU MAY ALSO LIKE</h4>
        <div class="pdp-related-grid">
          ${related
            .map(
              (r) => `
              <button class="related-mini-card" data-open-pdp="${r.id}">
                <img src="${r.colors[0].back}" alt="${r.name}" loading="lazy" />
                <strong>${r.name}</strong>
                <span>${formatINR(r.price)}</span>
              </button>`
            )
            .join("")}
        </div>
      </div>
    `;

    if (state.pdpMediaMode === "video") {
      mountPdpVideo(p, state.pdpColorIdx);
    }
  }

  // =========================================================================
  // 7. SHOPPING CART, WISHLIST & INDIAN CHECKOUT (UPI / CARD / COD)
  // =========================================================================
  function addToCart(productId, colorIdx, size, openDrawer = true) {
    const p = getProduct(productId);
    if (!p) return;
    const c = p.colors[colorIdx] || p.colors[0];
    const key = `${p.id}__${c.name}__${size}`;
    const existing = state.cart.find((item) => item.key === key);
    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({
        key,
        productId: p.id,
        name: p.name,
        colorName: c.name,
        colorIdx,
        size,
        price: p.price,
        image: c.front,
        qty: 1
      });
    }
    saveCart();
    renderCart();
    showToast(`Added <strong>${p.name}</strong> (${c.name}, ${size}) to bag!`);
    if (openDrawer) openCartDrawer();
  }

  function updateCartQty(key, delta) {
    const idx = state.cart.findIndex((i) => i.key === key);
    if (idx === -1) return;
    state.cart[idx].qty += delta;
    if (state.cart[idx].qty <= 0) state.cart.splice(idx, 1);
    saveCart();
    renderCart();
  }

  function calcCartTotals() {
    const subtotal = state.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const discount = state.promoApplied ? Math.round(subtotal * 0.1) : 0;
    const afterDisc = Math.max(0, subtotal - discount);
    const shipping = subtotal === 0 || afterDisc >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = afterDisc + shipping;
    return { subtotal, discount, shipping, total };
  }

  function renderCart() {
    const totalQty = state.cart.reduce((s, i) => s + i.qty, 0);
    $("#cartCount").textContent = totalQty;
    $("#cartDrawerCount").textContent = `(${totalQty})`;
    $("#mobileCartBadge").textContent = totalQty;

    const { subtotal, discount, shipping, total } = calcCartTotals();

    // Free Shipping Bar
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
    const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
    $("#shippingFill").style.width = `${pct}%`;
    $("#shippingMsg").innerHTML =
      remaining === 0 && subtotal > 0
        ? `🎉 You've unlocked <strong>FREE Express Shipping</strong> across India!`
        : `Add <strong>${formatINR(remaining || FREE_SHIPPING_THRESHOLD)}</strong> more for <strong>FREE Express Shipping</strong>`;

    const listEl = $("#cartItemsList");
    const footEl = $("#cartFooter");

    if (!state.cart.length) {
      listEl.innerHTML = `
        <div class="cart-empty">
          <p style="font-size:2.4rem;margin-bottom:10px;">🛍️</p>
          <h4>Your REBELLION bag is empty</h4>
          <p style="font-size:0.84rem;margin:8px 0 18px;">Explore our 460 GSM hoodies, tactical jackets, cargo joggers &amp; high-top kicks.</p>
          <button class="btn btn-primary" id="emptyCartShopBtn">Explore Collections</button>
        </div>`;
      footEl.classList.add("hidden");
      return;
    }

    footEl.classList.remove("hidden");
    listEl.innerHTML = state.cart
      .map(
        (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <div class="cart-item-meta">${item.colorName} • Size ${item.size}</div>
            <div class="cart-item-bottom">
              <div class="qty-box">
                <button data-cart-qty="${item.key}:-1" aria-label="Decrease quantity">&minus;</button>
                <span>${item.qty}</span>
                <button data-cart-qty="${item.key}:1" aria-label="Increase quantity">+</button>
              </div>
              <div style="text-align:right">
                <div style="font-weight:700;font-size:0.94rem;">${formatINR(item.price * item.qty)}</div>
                <button class="remove-item-btn" data-cart-remove="${item.key}">Remove</button>
              </div>
            </div>
          </div>
        </div>`
      )
      .join("");

    $("#cartSubtotal").textContent = formatINR(subtotal);
    $("#cartDiscountRow").classList.toggle("hidden", !state.promoApplied);
    $("#cartDiscountVal").textContent = `-${formatINR(discount)}`;
    $("#cartShipping").textContent = shipping === 0 ? "FREE" : formatINR(shipping);
    $("#cartTotal").textContent = formatINR(total);
  }

  function openCartDrawer() {
    $("#cartBackdrop").classList.add("open");
    $("#cartDrawer").classList.add("open");
  }
  function closeCartDrawer() {
    $("#cartBackdrop").classList.remove("open");
    $("#cartDrawer").classList.remove("open");
  }

  function toggleWishlist(productId) {
    const idx = state.wishlist.indexOf(productId);
    if (idx === -1) {
      state.wishlist.push(productId);
      showToast("Saved drop to your <strong>Wishlist</strong> ♥");
    } else {
      state.wishlist.splice(idx, 1);
      showToast("Removed from Wishlist");
    }
    saveWishlist();
    renderWishlist();
    renderCatalog();
    renderFeaturedDrops();
    if (state.pdpProductId === productId && $("#pdpModal").classList.contains("open")) {
      const btn = $(`#pdpModal [data-toggle-wish="${productId}"]`);
      if (btn) btn.textContent = state.wishlist.includes(productId) ? "♥ Saved in Wishlist" : "♡ Add to Wishlist";
    }
  }

  function renderWishlist() {
    const badge = $("#wishlistCount");
    badge.textContent = state.wishlist.length;
    badge.classList.toggle("hidden", state.wishlist.length === 0);

    const list = $("#wishlistItemsList");
    if (!state.wishlist.length) {
      list.innerHTML = `<div class="cart-empty"><h4>No saved drops yet</h4><p style="font-size:0.84rem;margin-top:8px;">Tap the heart icon on any drop to save it here.</p></div>`;
      return;
    }
    list.innerHTML = state.wishlist
      .map((id) => {
        const p = getProduct(id);
        if (!p) return "";
        return `
        <div class="cart-item">
          <img src="${p.colors[0].front}" alt="${p.name}" class="cart-item-img" />
          <div class="cart-item-info">
            <h4>${p.name}</h4>
            <div class="cart-item-meta">${formatINR(p.price)} • ${p.colors.length} Colors</div>
            <div class="cart-item-bottom">
              <button class="btn btn-primary btn-sm" data-open-pdp="${p.id}">Select Size</button>
              <button class="remove-item-btn" data-toggle-wish="${p.id}">Remove</button>
            </div>
          </div>
        </div>`;
      })
      .join("");
  }

  // Checkout Modal
  function openCheckout() {
    if (!state.cart.length) {
      showToast("Add at least one drop to checkout!");
      return;
    }
    closeCartDrawer();
    closePDP();
    renderCheckoutForm();
    $("#checkoutBackdrop").classList.add("open");
    $("#checkoutModal").classList.add("open");
  }

  function closeCheckout() {
    $("#checkoutBackdrop").classList.remove("open");
    $("#checkoutModal").classList.remove("open");
  }

  function renderCheckoutForm() {
    const { subtotal, discount, shipping, total } = calcCartTotals();
    const codFee = state.payMethod === "cod" && total < 3999 ? 99 : 0;
    const grandTotal = total + codFee;

    let payBody = "";
    if (state.payMethod === "upi") {
      payBody = `
        <div class="upi-chips">
          ${["GPay", "PhonePe", "Paytm", "BHIM UPI"]
            .map((a) => `<button type="button" class="upi-chip ${state.upiApp === a ? "active" : ""}" data-upi-app="${a}">${a}</button>`)
            .join("")}
        </div>
        <div class="form-field">
          <label>YOUR UPI ID (INSTANT VERIFICATION)</label>
          <input type="text" id="upiIdInput" placeholder="yourname@okaxis / @ybl" value="rebel@okicici" required />
        </div>`;
    } else if (state.payMethod === "card") {
      payBody = `
        <div class="checkout-form-grid" style="margin-bottom:0">
          <div class="form-field full">
            <label>CARD NUMBER (VISA / MASTERCARD / RUPAY)</label>
            <input type="text" placeholder="4532 •••• •••• 8842" maxlength="19" required />
          </div>
          <div class="form-field">
            <label>EXPIRY (MM/YY)</label>
            <input type="text" placeholder="08/29" maxlength="5" required />
          </div>
          <div class="form-field">
            <label>CVV</label>
            <input type="password" placeholder="•••" maxlength="4" required />
          </div>
        </div>`;
    } else {
      payBody = `
        <p style="font-size:0.86rem;color:#d4d4d8;">
          Pay via Cash or UPI QR right at your doorstep upon delivery across 19,000+ Indian pincodes.
          ${codFee ? `<br><strong style="color:var(--gold)">₹99 COD handling fee applies (Free on orders above ₹3,999).</strong>` : `<br><strong style="color:var(--emerald)">Zero COD Fee unlocked!</strong>`}
        </p>`;
    }

    $("#checkoutContent").innerHTML = `
      <form id="checkoutForm">
        <div class="checkout-form-grid">
          <div class="form-field">
            <label>FULL NAME</label>
            <input type="text" id="chkName" placeholder="Aarav Sharma" required />
          </div>
          <div class="form-field">
            <label>MOBILE NUMBER (+91)</label>
            <input type="tel" id="chkPhone" placeholder="9876543210" pattern="[0-9]{10}" required />
          </div>
          <div class="form-field">
            <label>PINCODE</label>
            <input type="text" id="chkPin" placeholder="400001" pattern="[0-9]{6}" required />
          </div>
          <div class="form-field">
            <label>CITY &amp; STATE</label>
            <input type="text" id="chkCity" placeholder="Mumbai, Maharashtra" required />
          </div>
          <div class="form-field full">
            <label>DELIVERY ADDRESS</label>
            <input type="text" id="chkAddr" placeholder="Flat / Street / Landmark" required />
          </div>
        </div>

        <label class="filter-label">PAYMENT METHOD</label>
        <div class="pay-tabs">
          <button type="button" class="pay-tab ${state.payMethod === "upi" ? "active" : ""}" data-pay-method="upi">⚡ UPI Instant</button>
          <button type="button" class="pay-tab ${state.payMethod === "card" ? "active" : ""}" data-pay-method="card">💳 Debit / Credit Card</button>
          <button type="button" class="pay-tab ${state.payMethod === "cod" ? "active" : ""}" data-pay-method="cod">📦 Cash on Delivery</button>
        </div>

        <div class="pay-panel">${payBody}</div>

        <div class="cart-summary-lines">
          <div class="sum-line"><span>Items (${state.cart.reduce((s, i) => s + i.qty, 0)})</span><strong>${formatINR(subtotal)}</strong></div>
          ${discount ? `<div class="sum-line"><span>Promo REBEL10</span><strong class="text-green">-${formatINR(discount)}</strong></div>` : ""}
          <div class="sum-line"><span>Express Shipping</span><strong>${shipping === 0 ? "FREE" : formatINR(shipping)}</strong></div>
          ${codFee ? `<div class="sum-line"><span>COD Fee</span><strong>${formatINR(codFee)}</strong></div>` : ""}
          <div class="sum-line total"><span>Payable Amount</span><strong>${formatINR(grandTotal)}</strong></div>
        </div>

        <button type="submit" class="btn btn-primary btn-full btn-lg">
          ${state.payMethod === "cod" ? `Place COD Order — ${formatINR(grandTotal)}` : `Pay ${formatINR(grandTotal)} Securely`}
        </button>
      </form>
    `;
  }

  function handleCheckoutSubmit(e) {
    e.preventDefault();
    const name = $("#chkName").value.trim() || "Rebel";
    const city = $("#chkCity").value.trim() || "India";
    const orderId = "RBL-" + Math.floor(100000 + Math.random() * 900000);
    const { total } = calcCartTotals();
    const methodLabel = state.payMethod === "upi" ? `UPI (${state.upiApp})` : state.payMethod === "card" ? "Credit/Debit Card" : "Cash on Delivery";

    state.cart = [];
    state.promoApplied = false;
    saveCart();
    renderCart();

    $("#checkoutContent").innerHTML = `
      <div class="order-confirmed-box">
        <div class="confirm-check">✓</div>
        <span class="section-kicker">ORDER CONFIRMED</span>
        <h2 style="font-family:var(--font-display);font-size:2.4rem;margin-bottom:8px;">WELCOME TO THE REBELLION, ${name.toUpperCase()}!</h2>
        <p style="color:var(--text-muted);margin-bottom:20px;">
          Order <strong>#${orderId}</strong> (${formatINR(total)} via ${methodLabel}) is locked in and queued for dispatch to <strong>${city}</strong>.
        </p>
        <div style="background:#14141d;border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:22px;font-family:var(--font-mono);font-size:0.78rem;color:#d4d4d8;">
          ESTIMATED EXPRESS DELIVERY: 3–5 BUSINESS DAYS • SMS &amp; WHATSAPP TRACKING ENABLED
        </div>
        <button class="btn btn-primary btn-lg" id="doneOrderBtn">Continue Exploring Drops</button>
      </div>
    `;
  }

  // =========================================================================
  // 8. SIZE GUIDE, POLICIES & MOBILE ACCORDION
  // =========================================================================
  function openInfoModal(type) {
    const title = $("#infoModalTitle");
    const body = $("#infoModalBody");
    if (type === "size") {
      title.textContent = "SIZE GUIDE — APPAREL & UK SNEAKERS";
      body.innerHTML = `
        <p style="color:var(--text-muted);font-size:0.86rem;margin-bottom:14px;">Our Hoodies &amp; Tactical Jackets feature an authentic <strong>oversized drop-shoulder streetwear block</strong>. Take your regular size for a boxy fit, or size down for a closer fit.</p>
        <h4 style="font-family:var(--font-mono);color:var(--saffron);font-size:0.78rem;">HOODIES &amp; TACTICAL JACKETS (INCHES)</h4>
        <table class="size-table">
          <thead><tr><th>Size</th><th>Chest</th><th>Length</th><th>Shoulder</th></tr></thead>
          <tbody>
            <tr><td>S</td><td>42"</td><td>27"</td><td>20.5"</td></tr>
            <tr><td>M</td><td>44"</td><td>28"</td><td>21.5"</td></tr>
            <tr><td>L</td><td>46"</td><td>29"</td><td>22.5"</td></tr>
            <tr><td>XL</td><td>48"</td><td>30"</td><td>23.5"</td></tr>
            <tr><td>XXL</td><td>50"</td><td>31"</td><td>24.5"</td></tr>
          </tbody>
        </table>
        <h4 style="font-family:var(--font-mono);color:var(--saffron);font-size:0.78rem;">SNEAKERS (UK / EU / FOOT CM)</h4>
        <table class="size-table">
          <thead><tr><th>UK Size</th><th>EU Size</th><th>Foot Length (cm)</th></tr></thead>
          <tbody>
            <tr><td>UK 6</td><td>40</td><td>25.0 cm</td></tr>
            <tr><td>UK 7</td><td>41</td><td>25.8 cm</td></tr>
            <tr><td>UK 8</td><td>42</td><td>26.6 cm</td></tr>
            <tr><td>UK 9</td><td>43</td><td>27.5 cm</td></tr>
            <tr><td>UK 10</td><td>44</td><td>28.3 cm</td></tr>
            <tr><td>UK 11</td><td>45</td><td>29.1 cm</td></tr>
          </tbody>
        </table>`;
    } else if (type === "shipping") {
      title.textContent = "SHIPPING & 7-DAY RETURNS";
      body.innerHTML = `
        <div class="pdp-specs" style="border:none;padding:0">
          <div class="pdp-spec-block"><h5>PAN-INDIA EXPRESS DELIVERY</h5><p>All orders dispatch within 24–48 hours from our Mumbai &amp; Bengaluru hubs. Free Express Air Shipping on orders above ₹2,999 (₹149 flat below ₹2,999).</p></div>
          <div class="pdp-spec-block"><h5>7-DAY HASSLE-FREE EXCHANGE &amp; RETURNS</h5><p>Need a different size or colorway? Request an instant reverse pickup within 7 days of delivery with original tags intact. Instant UPI refund or size swap.</p></div>
          <div class="pdp-spec-block"><h5>CASH ON DELIVERY &amp; UPI</h5><p>We accept GPay, PhonePe, Paytm, RuPay, Visa, Mastercard, and Cash on Delivery across 19,000+ pincodes.</p></div>
        </div>`;
    } else {
      title.textContent = "GARMENT & ARTWORK CARE";
      body.innerHTML = `
        <div class="pdp-specs" style="border:none;padding:0">
          <div class="pdp-spec-block"><h5>HEAVYWEIGHT HOODIES &amp; JOGGERS</h5><p>Always turn inside-out and wash in cold water (30°C max) on gentle cycle. Avoid harsh bleach. Dry flat in shade to keep 460 GSM cotton and puff inks vibrant for years.</p></div>
          <div class="pdp-spec-block"><h5>TACTICAL JACKETS</h5><p>Zip up and fasten all buckles before washing. Wipe surface dirt with a damp microfiber cloth. Never tumble dry or iron directly on graphic panels.</p></div>
          <div class="pdp-spec-block"><h5>ART-PRINTED SNEAKERS</h5><p>Use a soft dry brush or mild foaming sneaker cleaner. Air dry at room temperature away from direct sunlight.</p></div>
        </div>`;
    }
    $("#infoBackdrop").classList.add("open");
    $("#infoModal").classList.add("open");
  }

  function closeInfoModal() {
    $("#infoBackdrop").classList.remove("open");
    $("#infoModal").classList.remove("open");
  }

  function renderMobileAccordion() {
    $("#mobileNavAccordion").innerHTML = DATA.categories
      .map(
        (cat) => `
        <div class="mob-acc-group">
          <button class="mob-acc-trigger" data-mob-jump="${cat.id}">
            <span>${cat.name}</span>
            <span style="color:var(--saffron);font-family:var(--font-mono);font-size:0.74rem;">${cat.count} DROPS</span>
          </button>
          <div class="mob-acc-panel">
            <button data-filter-cat="${cat.id}" data-filter-theme="all">All ${cat.name}</button>
            <button data-filter-cat="${cat.id}" data-filter-theme="indian-traditional">01 // Indian Traditional Prints</button>
            <button data-filter-cat="${cat.id}" data-filter-theme="anime-japanese">02 // Anime &amp; Japanese Theme</button>
            <button data-filter-cat="${cat.id}" data-filter-theme="animal-nature">03 // Animal &amp; Nature Prints</button>
          </div>
        </div>`
      )
      .join("");
  }

  function jumpToFilteredShop(cat = "all", theme = "all") {
    state.filters.category = cat;
    state.filters.theme = theme;
    renderCatalog();
    syncThemeSound(theme);
    closeMobileDrawer();
    $("#shop").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openMobileDrawer() {
    $("#mobileDrawerBackdrop").classList.add("open");
    $("#mobileDrawer").classList.add("open");
  }
  function closeMobileDrawer() {
    $("#mobileDrawerBackdrop").classList.remove("open");
    $("#mobileDrawer").classList.remove("open");
  }

  // =========================================================================
  // GLOBAL EVENT LISTENERS & TOUCH SWIPE SUPPORT
  // =========================================================================
  function bindEvents() {
    // Scroll shadow on navbar
    window.addEventListener("scroll", () => {
      $("#navbar").classList.toggle("scrolled", window.scrollY > 24);
    });

    // Hero Controls
    $("#heroPrevBtn").addEventListener("click", () => changeHeroSlide(-1));
    $("#heroNextBtn").addEventListener("click", () => changeHeroSlide(1));
    $("#heroFlipBtn").addEventListener("click", () => {
      state.heroView = state.heroView === "front" ? "back" : "front";
      renderHero(true);
    });
    $("#heroInspectBtn").addEventListener("click", () => {
      const { product } = getHeroSlideProduct();
      openPDP(product.id, state.heroColorIdx);
    });
    $("#heroAddCartBtn").addEventListener("click", () => {
      const { product } = getHeroSlideProduct();
      addToCart(product.id, state.heroColorIdx, state.heroSize, true);
    });
    $("#heroNextPreviewBtn").addEventListener("click", () => {
      const { product } = getHeroSlideProduct();
      state.heroColorIdx = (state.heroColorIdx + 1) % product.colors.length;
      renderHero(true);
    });

    // Phone touch-swipe on Hero Stage!
    let touchStartX = 0;
    const heroStage = $("#heroProductStage");
    heroStage.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    heroStage.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(dx) > 45) changeHeroSlide(dx < 0 ? 1 : -1);
    }, { passive: true });

    // Search bar toggle
    $("#openSearchBtn").addEventListener("click", () => {
      $("#searchOverlay").classList.toggle("open");
      if ($("#searchOverlay").classList.contains("open")) $("#globalSearchInput").focus();
    });
    $("#closeSearchBtn").addEventListener("click", () => $("#searchOverlay").classList.remove("open"));
    $("#globalSearchInput").addEventListener("input", (e) => {
      state.filters.search = e.target.value;
      $("#sidebarSearchInput").value = e.target.value;
      renderCatalog();
      if (e.target.value.trim().length >= 2) {
        $("#shop").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    // Sidebar search, price, sort, toggle, reset
    $("#sidebarSearchInput").addEventListener("input", (e) => {
      state.filters.search = e.target.value;
      renderCatalog();
    });
    $("#maxPriceRange").addEventListener("input", (e) => {
      state.filters.maxPrice = Number(e.target.value);
      $("#maxPriceValue").textContent = formatINR(state.filters.maxPrice);
      renderCatalog();
    });
    $("#sortSelect").addEventListener("change", (e) => {
      state.filters.sort = e.target.value;
      renderCatalog();
    });
    $("#toggleSidebarBtn").addEventListener("click", () => {
      if (window.innerWidth <= 960) {
        $("#filterSidebar").classList.toggle("mobile-open");
      } else {
        $(".catalog-layout").classList.toggle("sidebar-collapsed");
      }
    });
    $("#closeSidebarBtn").addEventListener("click", () => $("#filterSidebar").classList.remove("mobile-open"));

    const resetAllFilters = () => {
      state.filters = { category: "all", theme: "all", color: "all", maxPrice: 6499, search: "", sort: "featured" };
      $("#sidebarSearchInput").value = "";
      $("#globalSearchInput").value = "";
      $("#maxPriceRange").value = 6499;
      $("#maxPriceValue").textContent = "₹6,499";
      $("#sortSelect").value = "featured";
      renderCatalog();
      syncThemeSound("main");
      showToast("All filters reset");
    };
    $("#resetFiltersBtn").addEventListener("click", resetAllFilters);

    // Cinema quick buttons
    $("#cinemaExploreBtn").addEventListener("click", () => jumpToFilteredShop("all", DATA.themes[state.cinemaThemeIdx].id));
    $("#cinemaQuickHoodies").addEventListener("click", () => jumpToFilteredShop("hoodies", DATA.themes[state.cinemaThemeIdx].id));
    $("#cinemaQuickJackets").addEventListener("click", () => jumpToFilteredShop("jackets", DATA.themes[state.cinemaThemeIdx].id));
    $("#cinemaQuickJoggers").addEventListener("click", () => jumpToFilteredShop("joggers", DATA.themes[state.cinemaThemeIdx].id));
    $("#cinemaQuickSneakers").addEventListener("click", () => jumpToFilteredShop("sneakers", DATA.themes[state.cinemaThemeIdx].id));

    // Sneaker Spotlight buttons
    $("#snkBuyBtn").addEventListener("click", () => {
      const item = DATA.sneakerSpotlight[state.sneakerIdx];
      addToCart(item.productId, item.colorIndex, "UK 9", true);
    });
    $("#snkMoreBtn").addEventListener("click", () => {
      const item = DATA.sneakerSpotlight[state.sneakerIdx];
      openPDP(item.productId, item.colorIndex);
    });

    // Cart, Wishlist, Mobile Menu, Modals open/close
    $("#openCartBtn").addEventListener("click", openCartDrawer);
    $("#mobileBottomCartBtn").addEventListener("click", openCartDrawer);
    $("#closeCartBtn").addEventListener("click", closeCartDrawer);
    $("#cartBackdrop").addEventListener("click", closeCartDrawer);

    $("#openWishlistBtn").addEventListener("click", () => {
      $("#wishlistBackdrop").classList.add("open");
      $("#wishlistDrawer").classList.add("open");
    });
    $("#closeWishlistBtn").addEventListener("click", () => {
      $("#wishlistBackdrop").classList.remove("open");
      $("#wishlistDrawer").classList.remove("open");
    });
    $("#wishlistBackdrop").addEventListener("click", () => {
      $("#wishlistBackdrop").classList.remove("open");
      $("#wishlistDrawer").classList.remove("open");
    });

    $("#mobileMenuBtn").addEventListener("click", openMobileDrawer);
    $("#closeMobileMenuBtn").addEventListener("click", closeMobileDrawer);
    $("#mobileDrawerBackdrop").addEventListener("click", closeMobileDrawer);
    $("#mobileShopAllBtn").addEventListener("click", () => jumpToFilteredShop("all", "all"));
    $("#mobileSizeGuideBtn").addEventListener("click", () => {
      closeMobileDrawer();
      openInfoModal("size");
    });

    $("#closePdpBtn").addEventListener("click", closePDP);
    $("#pdpBackdrop").addEventListener("click", closePDP);

    $("#proceedCheckoutBtn").addEventListener("click", openCheckout);
    $("#closeCheckoutBtn").addEventListener("click", closeCheckout);
    $("#checkoutBackdrop").addEventListener("click", closeCheckout);

    $("#closeInfoModalBtn").addEventListener("click", closeInfoModal);
    $("#infoBackdrop").addEventListener("click", closeInfoModal);

    // Promo Code
    $("#applyPromoBtn").addEventListener("click", () => {
      const code = $("#promoInput").value.trim().toUpperCase();
      if (code === "REBEL10") {
        state.promoApplied = true;
        renderCart();
        showToast("Code <strong>REBEL10</strong> applied — 10% OFF unlocked!");
      } else {
        showToast("Invalid code. Try <strong>REBEL10</strong> for 10% OFF!");
      }
    });

    // Newsletter & Footer support
    $("#newsletterForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const email = $("#newsletterEmail").value.trim();
      if (!email) return;
      $("#newsletterEmail").value = "";
      showToast(`Subscribed <strong>${email}</strong>! Use code <strong>REBEL10</strong> for 10% OFF.`);
    });

    $("#footerTrackBtn").addEventListener("click", () => {
      showToast("Need order help? WhatsApp REBELLION Concierge: +91 98200-REBEL (10AM–8PM IST)");
    });

    // Brand logo / Home clicks return to Main Luxury sound
    $$('a[href="#hero"]').forEach((a) => {
      a.addEventListener("click", () => syncThemeSound("main"));
    });

    $("#replayIntroBtn")?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      runPreloader();
    });

    // Delegated click handler for all dynamic controls
    document.addEventListener("click", (e) => {
      const t = e.target;

      // Hero color & size
      const heroColorBtn = t.closest("[data-hero-color]");
      if (heroColorBtn) {
        state.heroColorIdx = Number(heroColorBtn.dataset.heroColor);
        renderHero(true);
        return;
      }
      const heroSizeBtn = t.closest("[data-hero-size]");
      if (heroSizeBtn) {
        state.heroSize = heroSizeBtn.dataset.heroSize;
        renderHero(false);
        return;
      }

      // Mega-dropdown / footer / mobile filter jumps
      const filterJump = t.closest("[data-filter-cat]");
      if (filterJump) {
        jumpToFilteredShop(filterJump.dataset.filterCat, filterJump.dataset.filterTheme || "all");
        return;
      }
      const catTrigger = t.closest("[data-jump-cat]");
      if (catTrigger) {
        jumpToFilteredShop(catTrigger.dataset.jumpCat, "all");
        return;
      }

      // Video 4 Cinema Theme Strip -> switches sound to Indian Folk / Japanese / Nature!
      const cinBtn = t.closest("[data-cinema-idx]");
      if (cinBtn) {
        state.cinemaThemeIdx = Number(cinBtn.dataset.cinemaIdx);
        renderCinemaTheme();
        syncThemeSound(DATA.themes[state.cinemaThemeIdx].id);
        return;
      }

      // Browse mode pills
      const modePill = t.closest("[data-browse-mode]");
      if (modePill) {
        state.browseMode = modePill.dataset.browseMode;
        $$(".mode-pill").forEach((b) => b.classList.toggle("active", b.dataset.browseMode === state.browseMode));
        renderCategoryExplorer();
        return;
      }

      // Visual Explorer cards
      const expCat = t.closest("[data-explore-cat]");
      if (expCat) {
        state.filters.category = state.filters.category === expCat.dataset.exploreCat ? "all" : expCat.dataset.exploreCat;
        renderCatalog();
        $("#catalogToolbar").scrollIntoView({ behavior: "smooth", block: "nearest" });
        return;
      }
      const expTheme = t.closest("[data-explore-theme]");
      if (expTheme) {
        state.filters.theme = state.filters.theme === expTheme.dataset.exploreTheme ? "all" : expTheme.dataset.exploreTheme;
        renderCatalog();
        syncThemeSound(state.filters.theme);
        $("#catalogToolbar").scrollIntoView({ behavior: "smooth", block: "nearest" });
        return;
      }

      // Catalog Tabs & Pills & Sidebar Filters
      const catTab = t.closest("#catTabs [data-cat]");
      if (catTab) {
        state.filters.category = catTab.dataset.cat;
        renderCatalog();
        return;
      }
      const themePill = t.closest("#themePills [data-theme]");
      if (themePill) {
        state.filters.theme = themePill.dataset.theme;
        renderCatalog();
        syncThemeSound(state.filters.theme);
        return;
      }
      const sideCat = t.closest("[data-side-cat]");
      if (sideCat) {
        state.filters.category = sideCat.dataset.sideCat;
        renderCatalog();
        return;
      }
      const sideTheme = t.closest("[data-side-theme]");
      if (sideTheme) {
        state.filters.theme = sideTheme.dataset.sideTheme;
        renderCatalog();
        syncThemeSound(state.filters.theme);
        return;
      }
      const cfPill = t.closest("[data-color]");
      if (cfPill) {
        state.filters.color = cfPill.dataset.color;
        renderCatalog();
        return;
      }
      if (t.closest("#inlineResetBtn")) {
        resetAllFilters();
        return;
      }

      // Product Card Actions (MUST check swatch / flip / wish / quick-add BEFORE open-pdp!)
      const cardSwatch = t.closest("[data-card-color]");
      if (cardSwatch) {
        e.stopPropagation();
        const [pid, idx] = cardSwatch.dataset.cardColor.split(":");
        switchCardColor(pid, Number(idx));
        return;
      }

      const openVideoBtn = t.closest("[data-open-video]");
      if (openVideoBtn) {
        e.stopPropagation();
        const pid = openVideoBtn.dataset.openVideo;
        openPDP(pid, null, "video");
        return;
      }

      const flipBtn = t.closest("[data-flip-card]");
      if (flipBtn) {
        e.stopPropagation();
        flipBtn.closest(".product-card").classList.toggle("flipped");
        return;
      }

      const wishBtn = t.closest("[data-toggle-wish]");
      if (wishBtn) {
        e.stopPropagation();
        toggleWishlist(wishBtn.dataset.toggleWish);
        return;
      }

      const quickAdd = t.closest("[data-quick-add]");
      if (quickAdd) {
        e.stopPropagation();
        const pid = quickAdd.dataset.quickAdd;
        const p = getProduct(pid);
        const cIdx = state.cardColorIdx[pid] ?? 0;
        const defaultSize = p.category === "sneakers" ? "UK 9" : "L";
        addToCart(pid, cIdx, defaultSize, true);
        return;
      }

      const openPdpTrigger = t.closest("[data-open-pdp]");
      if (openPdpTrigger) {
        const pid = openPdpTrigger.dataset.openPdp;
        $("#wishlistBackdrop").classList.remove("open");
        $("#wishlistDrawer").classList.remove("open");
        openPDP(pid);
        return;
      }

      // Video 3 Sneaker Spotlight Thumbnails
      const snkThumb = t.closest("[data-snk-idx]");
      if (snkThumb) {
        state.sneakerIdx = Number(snkThumb.dataset.snkIdx);
        renderSneakerSpotlight(true);
        return;
      }

      // Video 2 Isometric 3D Craft Layers
      const craftBtn = t.closest("[data-craft-idx]");
      if (craftBtn) {
        state.craftLayerIdx = Number(craftBtn.dataset.craftIdx);
        renderCraftLayers();
        return;
      }
      const isoPlate = t.closest(".iso-plate");
      if (isoPlate) {
        state.craftLayerIdx = Number(isoPlate.dataset.layer);
        renderCraftLayers();
        return;
      }

      // PDP Interactive Controls
      const pdpModeBtn = t.closest("[data-pdp-mode]");
      if (pdpModeBtn) {
        state.pdpMediaMode = pdpModeBtn.dataset.pdpMode;
        renderPDP();
        return;
      }
      const pdpSceneBtn = t.closest("[data-pdp-scene]");
      if (pdpSceneBtn && pdpVideoPlayer) {
        pdpVideoPlayer.jumpToScene(Number(pdpSceneBtn.dataset.pdpScene));
        const icon = $("#pdpVideoPlayIcon");
        if (icon) icon.innerHTML = "&#10074;&#10074;";
        return;
      }
      const pdpThumb = t.closest("[data-pdp-thumb]");
      if (pdpThumb) {
        state.pdpActiveImg = pdpThumb.dataset.pdpThumb;
        renderPDP();
        return;
      }
      const pdpColor = t.closest("[data-pdp-color]");
      if (pdpColor) {
        state.pdpColorIdx = Number(pdpColor.dataset.pdpColor);
        const p = getProduct(state.pdpProductId);
        const col = p.colors[state.pdpColorIdx];
        state.pdpActiveImg = col.front;
        switchCardColor(p.id, state.pdpColorIdx);
        if (state.pdpMediaMode === "video" && pdpVideoPlayer) {
          pdpVideoPlayer.setOutfit(p, state.pdpColorIdx);
          const nameEl = $("#pdpActiveColorName");
          if (nameEl) nameEl.textContent = col.name;
          $$("#pdpModal [data-pdp-color]").forEach((btn, i) => btn.classList.toggle("active", i === state.pdpColorIdx));
        } else {
          renderPDP();
        }
        return;
      }
      const pdpSize = t.closest("[data-pdp-size]");
      if (pdpSize) {
        state.pdpSize = pdpSize.dataset.pdpSize;
        $$("#pdpModal [data-pdp-size]").forEach((btn) => btn.classList.toggle("active", btn.dataset.pdpSize === state.pdpSize));
        return;
      }
      if (t.closest("#pdpMainStage")) {
        $("#pdpMainStage").classList.toggle("zoomed");
        return;
      }
      if (t.closest("#pdpAddCartBtn")) {
        addToCart(state.pdpProductId, state.pdpColorIdx, state.pdpSize, true);
        return;
      }
      if (t.closest("#pdpBuyNowBtn")) {
        addToCart(state.pdpProductId, state.pdpColorIdx, state.pdpSize, false);
        openCheckout();
        return;
      }

      // Cart controls
      const qtyBtn = t.closest("[data-cart-qty]");
      if (qtyBtn) {
        const [key, delta] = qtyBtn.dataset.cartQty.split(":");
        updateCartQty(key, Number(delta));
        return;
      }
      const remBtn = t.closest("[data-cart-remove]");
      if (remBtn) {
        state.cart = state.cart.filter((i) => i.key !== remBtn.dataset.cartRemove);
        saveCart();
        renderCart();
        return;
      }
      if (t.closest("#emptyCartShopBtn")) {
        closeCartDrawer();
        $("#shop").scrollIntoView({ behavior: "smooth" });
        return;
      }

      // Checkout payment method & UPI chip switching
      const payTab = t.closest("[data-pay-method]");
      if (payTab) {
        state.payMethod = payTab.dataset.payMethod;
        renderCheckoutForm();
        return;
      }
      const upiChip = t.closest("[data-upi-app]");
      if (upiChip) {
        state.upiApp = upiChip.dataset.upiApp;
        renderCheckoutForm();
        return;
      }
      if (t.closest("#doneOrderBtn")) {
        closeCheckout();
        return;
      }

      // Size Guide & Policy Modals
      if (t.closest("[data-open-size-guide]")) {
        openInfoModal("size");
        return;
      }
      const policyBtn = t.closest("[data-open-policy]");
      if (policyBtn) {
        openInfoModal(policyBtn.dataset.openPolicy);
        return;
      }
    });

    // Checkout form submit
    document.addEventListener("submit", (e) => {
      if (e.target && e.target.id === "checkoutForm") {
        handleCheckoutSubmit(e);
      }
    });

    // Escape key closes modals
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closePDP();
        closeCartDrawer();
        closeCheckout();
        closeInfoModal();
        closeMobileDrawer();
      }
    });
  }

  // =========================================================================
  // INITIALIZE
  // =========================================================================
  function init() {
    runPreloader();
    renderHero(false);
    initPromoCarousel();
    initAudioControls();
    renderCinemaTheme();
    renderCatalog();
    renderFeaturedDrops();
    renderSneakerSpotlight(false);
    renderCraftLayers();
    renderMobileAccordion();
    renderCart();
    renderWishlist();
    bindEvents();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
