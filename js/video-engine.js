/* ==========================================================================
   REBELLION 60FPS STUDIO OUTFIT DETAIL & ZOOMING VIDEO ENGINE
   Pure luxury garment showcase (ZERO cartoon models) for all 19 drops x 70 colors:
   - Scene 01: Studio Front Silhouette & Ambient Rim Light
   - Scene 02: 360° Back Artwork Mural / Profile Reveal
   - Scene 03: Macro Detail & Print Texture Zoom Pan
   - Scene 04: Dual-Angle Editorial Composition & Craft Telemetry
   ========================================================================== */

(function () {
  const imgCache = new Map();

  function loadImg(src) {
    if (!src) return null;
    if (imgCache.has(src)) return imgCache.get(src);
    const img = new Image();
    img.src = src;
    imgCache.set(src, img);
    return img;
  }

  function isReady(img) {
    return img && img.complete && img.naturalWidth > 0;
  }

  function drawContain(ctx, img, cx, cy, maxW, maxH, scale = 1, rotDeg = 0, alpha = 1) {
    if (!isReady(img)) return;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const s = Math.min(maxW / iw, maxH / ih) * scale;
    const dw = iw * s;
    const dh = ih * s;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(cx, cy);
    if (rotDeg) ctx.rotate((rotDeg * Math.PI) / 180);
    ctx.shadowColor = "rgba(0,0,0,0.75)";
    ctx.shadowBlur = 34;
    ctx.shadowOffsetY = 18;
    ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
  }

  function formatTime(sec) {
    const s = Math.max(0, Math.floor(sec));
    return `00:${String(s).padStart(2, "0")}`;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
  }

  function createParticles(count) {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: Math.random(),
        y: Math.random(),
        r: 1 + Math.random() * 2.1,
        vx: (Math.random() - 0.5) * 0.012,
        vy: -0.015 - Math.random() * 0.03,
        alpha: 0.18 + Math.random() * 0.5
      });
    }
    return arr;
  }

  function drawParticles(ctx, particles, w, h, dt, colorHex) {
    ctx.save();
    for (const p of particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
      if (p.x < -0.05) p.x = 1.05;
      if (p.x > 1.05) p.x = -0.05;
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = colorHex;
      ctx.shadowColor = colorHex;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawStudioGrid(ctx, w, h) {
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.035)";
    ctx.lineWidth = 1;
    const step = 48;
    for (let x = step; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = step; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawStudioHUD(ctx, w, h, time, duration, accent, logoImg) {
    // Soft luxury dark vignette
    const vig = ctx.createRadialGradient(w * 0.5, h * 0.5, h * 0.28, w * 0.5, h * 0.5, w * 0.74);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(1, "rgba(4,4,8,0.68)");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);

    // Top-left studio detail pill
    ctx.save();
    const blink = Math.floor(time * 2) % 2 === 0;
    ctx.fillStyle = "rgba(8,8,14,0.72)";
    ctx.beginPath();
    ctx.roundRect(16, 14, 174, 28, 99);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = blink ? accent : "rgba(212,175,55,0.35)";
    ctx.beginPath();
    ctx.arc(31, 28, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f4f4f5";
    ctx.font = "600 10.5px 'JetBrains Mono', monospace";
    ctx.fillText(`STUDIO ZOOM • ${formatTime(time)} / ${formatTime(duration)}`, 42, 32);
    ctx.restore();

    // Top-right subtle REBELLION shield crest
    if (isReady(logoImg)) {
      ctx.save();
      ctx.globalAlpha = 0.85;
      const s = 36;
      ctx.drawImage(logoImg, w - s - 16, 12, s, s);
      ctx.restore();
    }

    // Bottom razor progress line
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.fillRect(0, h - 3, w, 3);
    ctx.fillStyle = accent;
    ctx.fillRect(0, h - 3, w * (time / duration), 3);
  }

  class OutfitDetailVideoPlayer {
    constructor(canvas, opts = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.onSceneChange = opts.onSceneChange || (() => {});
      this.onTimeUpdate = opts.onTimeUpdate || (() => {});

      this.duration = 12; // 4 scenes x 3s
      this.time = 0;
      this.playing = true;
      this.destroyed = false;
      this.lastTs = 0;
      this.activeScene = -1;
      this.particles = createParticles(18);
      this.logoImg = loadImg("assets/brand/logo-shield.webp");

      this.product = null;
      this.color = null;

      this.resize();
      this._onResize = () => this.resize();
      window.addEventListener("resize", this._onResize);
      this._raf = requestAnimationFrame((ts) => this.loop(ts));
    }

    setOutfit(product, colorIdx) {
      this.product = product;
      this.color = product.colors[colorIdx] || product.colors[0];
      loadImg(this.color.front);
      loadImg(this.color.back);
      if (this.color.angle) loadImg(this.color.angle);
    }

    jumpToScene(sceneIdx) {
      this.time = sceneIdx * 3 + 0.02;
      this.playing = true;
    }

    seekFraction(frac) {
      this.time = Math.max(0, Math.min(this.duration - 0.05, frac * this.duration));
    }

    togglePlay() {
      this.playing = !this.playing;
      return this.playing;
    }

    resize() {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(280, Math.floor(rect.width || 520));
      const h = Math.max(280, Math.floor(rect.height || 520));
      this.canvas.width = Math.floor(w * dpr);
      this.canvas.height = Math.floor(h * dpr);
      this.w = w;
      this.h = h;
      this.dpr = dpr;
    }

    destroy() {
      this.destroyed = true;
      cancelAnimationFrame(this._raf);
      window.removeEventListener("resize", this._onResize);
    }

    loop(ts) {
      if (this.destroyed) return;
      if (!this.lastTs) this.lastTs = ts;
      const dt = Math.min(0.05, (ts - this.lastTs) / 1000);
      this.lastTs = ts;

      if (this.playing) {
        this.time = (this.time + dt) % this.duration;
      }

      const sceneIdx = Math.min(3, Math.floor(this.time / 3));
      if (sceneIdx !== this.activeScene) {
        this.activeScene = sceneIdx;
        this.onSceneChange(sceneIdx);
      }
      this.onTimeUpdate(this.time, this.duration);

      if (this.product && this.color) {
        this.drawFrame(dt, sceneIdx);
      }
      this._raf = requestAnimationFrame((t) => this.loop(t));
    }

    drawFrame(dt, sceneIdx) {
      const ctx = this.ctx;
      const w = this.w;
      const h = this.h;
      const localT = this.time - sceneIdx * 3; // 0..3
      const p = localT / 3; // 0..1
      const accent = this.color.accent || "#D4AF37";

      const frontImg = loadImg(this.color.front);
      const backImg = loadImg(this.color.back);
      const angleImg = this.color.angle ? loadImg(this.color.angle) : backImg;

      ctx.save();
      ctx.scale(this.dpr, this.dpr);

      // Luxury obsidian studio background
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, "#090910");
      bg.addColorStop(0.5, "#0d0d16");
      bg.addColorStop(1, "#06060a");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      drawStudioGrid(ctx, w, h);

      // Subtle watermark wordmark in background
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.03)";
      ctx.font = `700 ${Math.round(w * 0.21)}px 'Bebas Neue', sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("REBELLION", w * 0.5, h * 0.56);
      ctx.restore();

      // Studio radial glow
      const aura = ctx.createRadialGradient(w * 0.5, h * 0.48, 16, w * 0.5, h * 0.48, w * 0.56);
      aura.addColorStop(0, accent + "52");
      aura.addColorStop(0.55, accent + "14");
      aura.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, w, h);

      // Pedestal floor ellipse shadow
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.84, w * 0.24, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (sceneIdx === 0) {
        // === SCENE 01: STUDIO FRONT SILHOUETTE (SLOW LUXURY ZOOM-IN) ===
        const enter = easeOutCubic(Math.min(1, localT / 0.55));
        const zoom = 0.94 + p * 0.14;
        const floatY = Math.sin(this.time * 2.2) * 5;
        drawContain(ctx, frontImg, w * 0.5, h * 0.46 + floatY, w * 0.80, h * 0.72, enter * zoom, (1 - enter) * -5, enter);

        ctx.save();
        ctx.fillStyle = accent;
        ctx.font = "700 10px 'JetBrains Mono', monospace";
        ctx.fillText(`01 // FRONT SILHOUETTE • ${this.color.name.toUpperCase()}`, 18, h - 40);
        ctx.fillStyle = "#ffffff";
        ctx.font = "600 12.5px 'Inter', sans-serif";
        ctx.fillText(this.product.name, 18, h - 20);
        ctx.restore();
      } else if (sceneIdx === 1) {
        // === SCENE 02: 360° BACK ARTWORK MURAL / SIDE PROFILE + LIGHT SWEEP ===
        ctx.save();
        const beamX = -w * 0.35 + p * w * 1.7;
        const beam = ctx.createLinearGradient(beamX - 75, 0, beamX + 75, h);
        beam.addColorStop(0, "rgba(255,255,255,0)");
        beam.addColorStop(0.5, "rgba(255,255,255,0.16)");
        beam.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = beam;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();

        const enter = easeOutCubic(Math.min(1, localT / 0.5));
        const rot = this.product.category === "sneakers" ? -9 + Math.sin(p * Math.PI) * 5 : (1 - enter) * 6;
        const zoom = 0.96 + p * 0.12;
        drawContain(ctx, backImg, w * 0.5, h * 0.46 + Math.sin(this.time * 2.4) * 4, w * 0.84, h * 0.75, enter * zoom, rot, enter);

        ctx.save();
        ctx.fillStyle = accent;
        ctx.font = "700 10px 'JetBrains Mono', monospace";
        ctx.fillText(
          this.product.category === "sneakers" ? "02 // SCULPTED PROFILE VIEW" : "02 // FULL BACK ARTWORK MURAL",
          18,
          h - 40
        );
        ctx.fillStyle = "#ffffff";
        ctx.font = "600 12px 'Inter', sans-serif";
        ctx.fillText("HIGH-DENSITY ZERO-CRACK HERITAGE INK", 18, h - 20);
        ctx.restore();
      } else if (sceneIdx === 2) {
        // === SCENE 03: MACRO DETAIL & PRINT ZOOM PAN ===
        const macroImg = isReady(backImg) ? backImg : frontImg;
        const panY = (p - 0.5) * -105;
        const panX = Math.sin(p * Math.PI * 1.5) * 32;
        const zoom = 1.24 + p * 0.24;
        drawContain(ctx, macroImg, w * 0.5 + panX, h * 0.5 + panY, w * 1.46, h * 1.46, zoom, 0, 1);

        // Soft bottom readability fade
        const bGrad = ctx.createLinearGradient(0, h - 96, 0, h);
        bGrad.addColorStop(0, "rgba(7,7,11,0)");
        bGrad.addColorStop(1, "rgba(7,7,11,0.92)");
        ctx.fillStyle = bGrad;
        ctx.fillRect(0, h - 96, w, 96);

        // Subtle macro reticle corner brackets
        ctx.save();
        ctx.strokeStyle = accent + "99";
        ctx.lineWidth = 1.5;
        const pad = 26;
        const len = 18;
        ctx.beginPath();
        ctx.moveTo(pad, pad + len); ctx.lineTo(pad, pad); ctx.lineTo(pad + len, pad);
        ctx.moveTo(w - pad - len, pad); ctx.lineTo(w - pad, pad); ctx.lineTo(w - pad, pad + len);
        ctx.moveTo(pad, h - 70 - len); ctx.lineTo(pad, h - 70); ctx.lineTo(pad + len, h - 70);
        ctx.moveTo(w - pad - len, h - 70); ctx.lineTo(w - pad, h - 70); ctx.lineTo(w - pad, h - 70 - len);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.fillStyle = accent;
        ctx.font = "700 10px 'JetBrains Mono', monospace";
        ctx.fillText("03 // 2.4X MACRO FABRIC & ARTWORK ZOOM", 18, h - 40);
        ctx.fillStyle = "#ffffff";
        ctx.font = "600 12px 'Inter', sans-serif";
        ctx.fillText(`${this.color.name} • HEAVYWEIGHT PRECISION CRAFT`, 18, h - 20);
        ctx.restore();
      } else {
        // === SCENE 04: DUAL-ANGLE FRONT + BACK LUXURY COMPOSITION ===
        const enter = easeOutCubic(Math.min(1, localT / 0.55));
        const floatA = Math.sin(this.time * 2.2) * 4;
        const floatB = Math.cos(this.time * 2.2) * 4;
        const slideOffset = (1 - enter) * 34;

        drawContain(ctx, frontImg, w * 0.33 - slideOffset, h * 0.47 + floatA, w * 0.56, h * 0.64, 0.96, -3, enter);
        drawContain(ctx, angleImg, w * 0.68 + slideOffset, h * 0.47 + floatB, w * 0.58, h * 0.66, 1.02, 3, enter);

        ctx.save();
        ctx.fillStyle = accent;
        ctx.font = "700 10px 'JetBrains Mono', monospace";
        ctx.fillText("04 // COMPLETE SILHOUETTE • FRONT & BACK", 18, h - 40);
        ctx.fillStyle = "#ffffff";
        ctx.font = "600 12px 'Inter', sans-serif";
        ctx.fillText(`${this.product.badge} • DISPATCHES IN 24–48 HRS`, 18, h - 20);
        ctx.restore();
      }

      drawParticles(ctx, this.particles, w, h, dt, accent);

      if (localT < 0.18) {
        ctx.fillStyle = `rgba(7,7,11,${(1 - localT / 0.18) * 0.55})`;
        ctx.fillRect(0, 0, w, h);
      }

      drawStudioHUD(ctx, w, h, this.time, this.duration, accent, this.logoImg);
      ctx.restore();
    }
  }

  window.RebellionVideoEngine = {
    OutfitDetailVideoPlayer,
    OutfitModelVideoPlayer: OutfitDetailVideoPlayer
  };
})();
