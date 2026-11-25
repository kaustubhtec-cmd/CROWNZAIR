/* ==========================================================================
   REBELLION LUXURY THEME-ADAPTIVE AUDIO ENGINE
   - Main Page: Warm Luxury Brand Lounge (main-luxury.aac)
   - Indian Traditional: Bansuri / Sitar / Tabla Folk Instrumental (indian-folk.aac)
   - Anime & Japanese: Koto / Bamboo Flute Instrumental (japanese-theme.aac)
   - Animal & Nature: Tranquil Forest Instrumental + Soft Woodland Breeze (nature-forest.aac)
   Includes smooth crossfading, Stop, and Silent (Mute) controls.
   ========================================================================== */

(function () {
  const TARGET_VOLUME = 0.38;

  const TRACKS = {
    main: {
      id: "main",
      label: "MAIN LUXURY",
      shortLabel: "Luxury",
      src: "assets/audio/main-luxury.aac"
    },
    "indian-traditional": {
      id: "indian-traditional",
      label: "INDIAN FOLK",
      shortLabel: "Indian",
      src: "assets/audio/indian-folk.aac"
    },
    "anime-japanese": {
      id: "anime-japanese",
      label: "JAPANESE ZEN",
      shortLabel: "Japanese",
      src: "assets/audio/japanese-theme.aac"
    },
    "animal-nature": {
      id: "animal-nature",
      label: "NATURE FOREST",
      shortLabel: "Nature",
      src: "assets/audio/nature-forest.aac"
    }
  };

  class RebellionAudioEngine {
    constructor() {
      this.players = {};
      this.fadeTimers = {};
      this.currentTheme = "main";
      this.muted = false;
      this.stopped = false;
      this.playing = false;
      this.awaitingGesture = false;
      this.listeners = [];

      // Subtle procedural woodland breeze for Animal & Nature section
      this.audioCtx = null;
      this.forestGain = null;
      this.forestRunning = false;

      // Pre-create looped HTML5 Audio elements (works on http:// and file://)
      Object.values(TRACKS).forEach((t) => {
        const audio = new Audio(t.src);
        audio.loop = true;
        audio.preload = "auto";
        audio.volume = 0;
        this.players[t.id] = audio;
      });

      this._bindFirstGestureUnlock();
    }

    onChange(fn) {
      this.listeners.push(fn);
      fn(this.getState());
    }

    getState() {
      const t = TRACKS[this.currentTheme] || TRACKS.main;
      return {
        theme: this.currentTheme,
        label: t.label,
        shortLabel: t.shortLabel,
        playing: this.playing && !this.muted && !this.stopped,
        stopped: this.stopped,
        muted: this.muted,
        awaitingGesture: this.awaitingGesture
      };
    }

    _emit() {
      const st = this.getState();
      this.listeners.forEach((fn) => fn(st));
    }

    _bindFirstGestureUnlock() {
      const unlock = (e) => {
        // Don't auto-start if the user's very first click is Silent or Stop
        if (e && e.target && e.target.closest && e.target.closest("[data-audio-no-auto]")) {
          return;
        }
        if (!this.stopped && !this.muted && !this.playing) {
          this.play();
        }
        window.removeEventListener("pointerdown", unlock);
        window.removeEventListener("keydown", unlock);
      };
      window.addEventListener("pointerdown", unlock, { passive: true });
      window.addEventListener("keydown", unlock, { passive: true });
    }

    _fadeAudio(id, targetVol, durationMs, pauseOnZero = false) {
      const audio = this.players[id];
      if (!audio) return;
      if (this.fadeTimers[id]) {
        cancelAnimationFrame(this.fadeTimers[id]);
        delete this.fadeTimers[id];
      }

      const startVol = audio.volume;
      const delta = targetVol - startVol;
      if (Math.abs(delta) < 0.004 || durationMs <= 0) {
        audio.volume = Math.max(0, Math.min(1, targetVol));
        if (pauseOnZero && targetVol <= 0) audio.pause();
        return;
      }

      const startTime = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - startTime) / durationMs);
        const eased = p * (2 - p);
        audio.volume = Math.max(0, Math.min(1, startVol + delta * eased));
        if (p < 1) {
          this.fadeTimers[id] = requestAnimationFrame(step);
        } else {
          delete this.fadeTimers[id];
          if (pauseOnZero && targetVol <= 0) audio.pause();
        }
      };
      this.fadeTimers[id] = requestAnimationFrame(step);
    }

    _updateForestAmbience(shouldPlay) {
      if (!shouldPlay) {
        if (this.forestGain && this.audioCtx) {
          this.forestGain.gain.setTargetAtTime(0.0001, this.audioCtx.currentTime, 0.25);
        }
        return;
      }
      try {
        if (!this.audioCtx) {
          const Ctx = window.AudioContext || window.webkitAudioContext;
          if (!Ctx) return;
          this.audioCtx = new Ctx();

          // Soft organic pink-noise forest wind filtered warmly
          const bufferSize = this.audioCtx.sampleRate * 4;
          const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
          const data = buffer.getChannelData(0);
          let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.03;
            b6 = white * 0.115926;
          }

          const noise = this.audioCtx.createBufferSource();
          noise.buffer = buffer;
          noise.loop = true;

          const bandpass = this.audioCtx.createBiquadFilter();
          bandpass.type = "bandpass";
          bandpass.frequency.value = 520;
          bandpass.Q.value = 0.7;

          // Gentle breathing LFO on wind frequency
          const lfo = this.audioCtx.createOscillator();
          const lfoGain = this.audioCtx.createGain();
          lfo.frequency.value = 0.12;
          lfoGain.gain.value = 180;
          lfo.connect(lfoGain);
          lfoGain.connect(bandpass.frequency);

          this.forestGain = this.audioCtx.createGain();
          this.forestGain.gain.value = 0.0001;

          noise.connect(bandpass);
          bandpass.connect(this.forestGain);
          this.forestGain.connect(this.audioCtx.destination);

          noise.start();
          lfo.start();
          this.forestRunning = true;
        }
        if (this.audioCtx.state === "suspended") {
          this.audioCtx.resume().catch(() => {});
        }
        if (this.forestGain) {
          this.forestGain.gain.setTargetAtTime(0.085, this.audioCtx.currentTime, 0.6);
        }
      } catch (_) {
        // Fallback silently if Web Audio is unavailable
      }
    }

    initAutoPlay() {
      if (this.stopped || this.muted) return;
      const audio = this.players[this.currentTheme];
      if (!audio) return;
      audio.volume = 0;
      const promise = audio.play();
      if (promise && typeof promise.then === "function") {
        promise
          .then(() => {
            this.playing = true;
            this.awaitingGesture = false;
            this._fadeAudio(this.currentTheme, TARGET_VOLUME, 900);
            this._updateForestAmbience(this.currentTheme === "animal-nature");
            this._emit();
          })
          .catch(() => {
            this.playing = false;
            this.awaitingGesture = true;
            this._emit();
          });
      }
    }

    setTheme(themeKey) {
      const normalized = TRACKS[themeKey] ? themeKey : "main";
      const prevTheme = this.currentTheme;
      this.currentTheme = normalized;

      if (this.stopped) {
        this._emit();
        return;
      }

      // Fade out all other tracks
      Object.keys(this.players).forEach((id) => {
        if (id !== normalized) {
          this._fadeAudio(id, 0, 550, true);
        }
      });

      const nextAudio = this.players[normalized];
      if (!nextAudio) return;

      if (this.muted) {
        this._updateForestAmbience(false);
        this._emit();
        return;
      }

      if (prevTheme !== normalized || nextAudio.paused) {
        const p = nextAudio.play();
        if (p && typeof p.then === "function") {
          p.then(() => {
            this.playing = true;
            this.awaitingGesture = false;
            this._fadeAudio(normalized, TARGET_VOLUME, 700);
            this._updateForestAmbience(normalized === "animal-nature");
            this._emit();
          }).catch(() => {
            this.awaitingGesture = true;
            this._emit();
          });
        }
      } else {
        this._fadeAudio(normalized, TARGET_VOLUME, 450);
        this._updateForestAmbience(normalized === "animal-nature");
        this._emit();
      }
    }

    play() {
      this.stopped = false;
      this.muted = false;
      const audio = this.players[this.currentTheme];
      if (!audio) return;

      // Pause others
      Object.keys(this.players).forEach((id) => {
        if (id !== this.currentTheme) this._fadeAudio(id, 0, 300, true);
      });

      const p = audio.play();
      if (p && typeof p.then === "function") {
        p.then(() => {
          this.playing = true;
          this.awaitingGesture = false;
          this._fadeAudio(this.currentTheme, TARGET_VOLUME, 550);
          this._updateForestAmbience(this.currentTheme === "animal-nature");
          this._emit();
        }).catch(() => {
          this.awaitingGesture = true;
          this._emit();
        });
      }
    }

    stop() {
      this.stopped = true;
      this.playing = false;
      this.awaitingGesture = false;
      this._updateForestAmbience(false);
      Object.keys(this.players).forEach((id) => {
        const a = this.players[id];
        if (this.fadeTimers[id]) {
          cancelAnimationFrame(this.fadeTimers[id]);
          delete this.fadeTimers[id];
        }
        a.volume = 0;
        a.pause();
        try { a.currentTime = 0; } catch (_) {}
      });
      this._emit();
    }

    toggleMute() {
      this.muted = !this.muted;
      if (this.muted) {
        this._updateForestAmbience(false);
        Object.keys(this.players).forEach((id) => {
          this._fadeAudio(id, 0, 220, false);
        });
      } else {
        if (this.stopped) {
          this.play();
          return;
        }
        const a = this.players[this.currentTheme];
        if (a && a.paused) {
          this.play();
          return;
        }
        this._fadeAudio(this.currentTheme, TARGET_VOLUME, 380);
        this._updateForestAmbience(this.currentTheme === "animal-nature");
      }
      this._emit();
    }

    togglePlayStop() {
      if (this.playing && !this.stopped && !this.muted) {
        this.stop();
      } else {
        this.play();
      }
    }
  }

  window.RebellionAudioEngine = new RebellionAudioEngine();
  window.REBELLION_AUDIO_TRACKS = TRACKS;
})();
