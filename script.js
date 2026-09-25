/* ==========================================================================
   Baby Shower – Gael Santander Vallejo
   Main Script: Sparkles · Envelope · Countdown · Lightbox · Audio
   ========================================================================== */

"use strict";

/* --------------------------------------------------------------------------
   1. SPARKLE PARTICLE CANVAS
   -------------------------------------------------------------------------- */
(function initSparkles() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W, H, particles;

  const SYMBOLS = ["✦", "♡", "·", "⋆", "✧", "❋"];
  const COLORS  = [
    "rgba(197,159,91,",
    "rgba(110,132,96,",
    "rgba(218,195,148,",
    "rgba(255,255,255,",
    "rgba(174,151,112,",
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    const col = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x:     Math.random() * W,
      y:     Math.random() * H + H,
      vx:    (Math.random() - 0.5) * 0.4,
      vy:    -(0.35 + Math.random() * 0.55),
      alpha: 0,
      maxA:  0.25 + Math.random() * 0.35,
      size:  9 + Math.random() * 12,
      sym,
      col,
      phase: Math.random() * Math.PI * 2,
    };
  }

  function initParticles() {
    particles = [];
    const COUNT = Math.floor((W * H) / 22000);
    for (let i = 0; i < COUNT; i++) {
      const p = createParticle();
      p.y = Math.random() * H; // stagger start
      p.alpha = Math.random() * p.maxA;
      particles.push(p);
    }
  }

  let tick = 0;
  function animate() {
    ctx.clearRect(0, 0, W, H);
    tick++;

    particles.forEach((p, i) => {
      p.x  += p.vx + Math.sin(tick * 0.012 + p.phase) * 0.3;
      p.y  += p.vy;
      p.alpha = Math.max(0, Math.min(p.maxA, p.alpha + (p.y < H * 0.7 ? 0.002 : -0.003)));

      if (p.y < -30) {
        particles[i] = createParticle();
        return;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.font        = `${p.size}px serif`;
      ctx.fillStyle   = p.col + "1)";
      ctx.fillText(p.sym, p.x, p.y);
      ctx.restore();
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", () => { resize(); initParticles(); });
  resize();
  initParticles();
  animate();
})();


/* --------------------------------------------------------------------------
   2. ENVELOPE OPENING & CLOSING INTERACTION
   -------------------------------------------------------------------------- */
(function initEnvelope() {
  const stage          = document.getElementById("envelopeStage");
  const openBtn        = document.getElementById("openBtn");
  const openBtnText    = document.getElementById("openBtnText");
  const bottomCloseBtn = document.getElementById("bottomCloseBtn");
  const coverInner     = document.querySelector(".cover-inner");
  const invSec         = document.getElementById("invitation");
  let isOpened         = false;

  function openEnvelope() {
    if (isOpened) return;
    isOpened = true;

    stage.classList.add("opened");
    if (coverInner) coverInner.classList.add("is-opened");

    if (openBtnText) openBtnText.textContent = "Cerrar invitación";
    if (openBtn) {
      openBtn.classList.add("btn-opened");
      openBtn.setAttribute("aria-expanded", "true");
    }

    // Start background music automatically on user interaction
    if (typeof window.playMusic === "function") {
      window.playMusic();
    }

    // Confetti burst
    burstConfetti();

    // Reveal invitation section below
    setTimeout(() => {
      if (!isOpened) return;
      invSec.classList.add("show");
      invSec.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 820);
  }

  function closeEnvelope() {
    if (!isOpened) return;
    isOpened = false;

    stage.classList.remove("opened");
    if (coverInner) coverInner.classList.remove("is-opened");

    if (openBtnText) openBtnText.textContent = "Abrir invitación";
    if (openBtn) {
      openBtn.classList.remove("btn-opened");
      openBtn.setAttribute("aria-expanded", "false");
    }

    // Smooth scroll back to cover
    const cover = document.getElementById("cover");
    if (cover) {
      cover.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Hide invitation section after scroll
    setTimeout(() => {
      if (!isOpened) {
        invSec.classList.remove("show");
      }
    }, 600);
  }

  function toggleEnvelope() {
    if (isOpened) {
      closeEnvelope();
    } else {
      openEnvelope();
    }
  }

  if (openBtn)        openBtn.addEventListener("click", toggleEnvelope);
  if (bottomCloseBtn) bottomCloseBtn.addEventListener("click", closeEnvelope);

  if (stage) {
    stage.addEventListener("click", toggleEnvelope);
    stage.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleEnvelope();
      }
    });
  }
})();


/* --------------------------------------------------------------------------
   3. MINI CONFETTI BURST
   -------------------------------------------------------------------------- */
function burstConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:999;";
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const COLORS = ["#c59f5b","#7f936b","#f2d492","#e8c5a0","#f4f0e7","#a7c4a0","#ddc27a"];
  const pieces = [];

  for (let i = 0; i < 100; i++) {
    const cx = canvas.width / 2;
    const cy = canvas.height * 0.38;
    const angle = (Math.random() * Math.PI * 2);
    const speed = 2 + Math.random() * 6;
    pieces.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      w: 7 + Math.random() * 8,
      h: 4 + Math.random() * 5,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.25,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 1,
      gravity: 0.18,
    });
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    pieces.forEach(p => {
      p.vy += p.gravity;
      p.x  += p.vx;
      p.y  += p.vy;
      p.r  += p.vr;
      if (frame > 50) p.alpha = Math.max(0, p.alpha - 0.015);
      if (p.alpha > 0) alive = true;

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    frame++;
    if (alive) requestAnimationFrame(draw);
    else document.body.removeChild(canvas);
  }

  requestAnimationFrame(draw);
}


/* --------------------------------------------------------------------------
   4. COUNTDOWN TIMER
   -------------------------------------------------------------------------- */
(function initCountdown() {
  const targetMs = new Date("2026-10-11T14:00:00-05:00").getTime();
  const els = {
    days:    document.getElementById("days"),
    hours:   document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
  };

  function pad(n) { return String(Math.max(0, n)).padStart(2, "0"); }

  function tick() {
    const diff = targetMs - Date.now();
    if (diff <= 0) {
      Object.values(els).forEach(el => { if (el) el.textContent = "00"; });
      return;
    }
    if (els.days)    els.days.textContent    = pad(Math.floor(diff / 86400000));
    if (els.hours)   els.hours.textContent   = pad(Math.floor(diff / 3600000)  % 24);
    if (els.minutes) els.minutes.textContent = pad(Math.floor(diff / 60000)    % 60);
    if (els.seconds) els.seconds.textContent = pad(Math.floor(diff / 1000)     % 60);
  }

  tick();
  setInterval(tick, 1000);
})();


/* --------------------------------------------------------------------------
   5. ULTRASOUND LIGHTBOX MODAL
   -------------------------------------------------------------------------- */
(function initLightbox() {
  const modal     = document.getElementById("lightboxModal");
  const closeBtn  = document.getElementById("lightboxClose");
  const modalImg  = document.getElementById("lightboxImg");
  const modalTitle= document.getElementById("lightboxTitle");
  const modalDesc = document.getElementById("lightboxDesc");

  if (!modal) return;

  document.querySelectorAll(".keepsake-card").forEach(card => {
    card.addEventListener("click", () => {
      const src   = card.dataset.full  || card.querySelector("img")?.src || "";
      const title = card.dataset.title || "Ecografía de Gael";
      const desc  = card.dataset.desc  || "";

      modalImg.src         = src;
      modalImg.alt         = title;
      modalTitle.textContent = title;
      modalDesc.textContent  = desc;

      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    });
  });

  function closeLightbox() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    // Delay clearing src so exit animation is smooth
    setTimeout(() => { modalImg.src = ""; }, 350);
  }

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeLightbox(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
})();


/* --------------------------------------------------------------------------
   6. HERE COMES THE SUN — The Beatles (Audio + Web Audio Fallback)
   -------------------------------------------------------------------------- */
(function initAudio() {
  const toggleBtn = document.getElementById("audioToggle");
  const audioIcon = document.getElementById("audioIcon");
  const audioText = document.getElementById("audioText");
  if (!toggleBtn) return;

  let audioCtx        = null;
  let masterGain      = null;
  let playing         = false;
  let loopTimer       = null;

  // ── YouTube player (official Beatles video, streamed — never downloaded) ──
  const YT_VIDEO_ID   = "KQetemT1sWc"; // The Beatles - Here Comes The Sun (Official 2019 Mix)
  let ytPlayer         = null;
  let ytReady          = false;
  let ytFailed         = false;
  let usingYouTube     = false;

  function loadYouTubeAPI() {
    if (!document.getElementById("youtubePlayer")) return;
    if (window.YT && window.YT.Player) { createYtPlayer(); return; }
    if (!document.getElementById("youtube-iframe-api")) {
      const tag = document.createElement("script");
      tag.id  = "youtube-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
    const prevReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      if (typeof prevReady === "function") prevReady();
      createYtPlayer();
    };
  }

  function createYtPlayer() {
    if (ytPlayer) return;
    ytPlayer = new YT.Player("youtubePlayer", {
      videoId: YT_VIDEO_ID,
      playerVars: { autoplay: 0, controls: 0, disablekb: 1, modestbranding: 1, rel: 0 },
      events: {
        onReady: () => {
          ytReady = true;
          if (playing && !usingYouTube) {
            stopWebAudio();
            tryPlayYouTube();
          }
        },
        onError: () => {
          ytFailed = true;
          if (usingYouTube) {
            usingYouTube = false;
            if (playing) startWebAudioLoop();
          }
        },
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.ENDED) {
            ytPlayer.seekTo(0);
            ytPlayer.playVideo();
          }
        }
      }
    });
  }

  function tryPlayYouTube() {
    if (!ytReady || ytFailed || !ytPlayer || typeof ytPlayer.playVideo !== "function") return false;
    usingYouTube = true;
    ytPlayer.playVideo();
    return true;
  }

  // ── Note frequencies (George Harrison's acoustic guitar, Capo 7 in A Major) ──
  // Beat duration base = 0.38s (≈ 158 bpm feel, slow sunny warmth)
  const B = 0.38;
  const SONG = [
    // Phrase 1: "Here comes the sun..."
    { f: 587.33, b: 220.00, d: B * 0.5 },  // D5  + A3 bass - Here
    { f: 554.37, b: 0,      d: B * 0.5 },  // C#5           - comes
    { f: 587.33, b: 0,      d: B * 0.75 }, // D5            - the
    { f: 440.00, b: 220.00, d: B * 1.5 },  // A4  + A3 bass - sun
    { f: 0,      b: 0,      d: B * 0.25 }, // rest

    // "doo doo doo doo"
    { f: 493.88, b: 146.83, d: B * 0.33 }, // B4  + D3 bass
    { f: 587.33, b: 0,      d: B * 0.33 }, // D5
    { f: 493.88, b: 0,      d: B * 0.33 }, // B4
    { f: 440.00, b: 220.00, d: B * 0.75 }, // A4  + A3 bass
    { f: 0,      b: 0,      d: B * 0.25 }, // rest

    // Phrase 2: "and I say..."
    { f: 392.00, b: 196.00, d: B * 0.5 },  // G4  + G3 bass - and
    { f: 440.00, b: 0,      d: B * 0.5 },  // A4            - I
    { f: 493.88, b: 0,      d: B * 0.5 },  // B4            - say
    { f: 440.00, b: 164.81, d: B * 0.5 },  // A4  + E3 bass
    { f: 392.00, b: 0,      d: B * 0.75 }, // G4
    { f: 329.63, b: 164.81, d: B * 1.5 },  // E4  + E3 bass - held
    { f: 0,      b: 0,      d: B * 0.25 }, // rest

    // Phrase 3: "it's alright..."
    { f: 392.00, b: 146.83, d: B * 0.5 },  // G4  + D3 bass
    { f: 440.00, b: 0,      d: B * 0.5 },  // A4
    { f: 493.88, b: 0,      d: B * 0.75 }, // B4  - it's
    { f: 587.33, b: 220.00, d: B * 0.75 }, // D5  + A3 bass - al
    { f: 493.88, b: 0,      d: B * 1.0 },  // B4  - right
    { f: 0,      b: 0,      d: B * 0.5 },  // breath

    // Phrase 4: "it's alright..." (higher repeat)
    { f: 493.88, b: 146.83, d: B * 0.5 },  // B4  + D3 bass
    { f: 554.37, b: 0,      d: B * 0.5 },  // C#5
    { f: 587.33, b: 220.00, d: B * 0.75 }, // D5  + A3 bass
    { f: 659.25, b: 164.81, d: B * 0.75 }, // E5  + E3 bass
    { f: 587.33, b: 220.00, d: B * 1.25 }, // D5  + A3 bass
    { f: 0,      b: 0,      d: B * 0.5 },  // rest

    // Iconic George Harrison acoustic guitar riff
    { f: 587.33, b: 220.00, d: B * 0.33 }, // D5  + A3 bass
    { f: 493.88, b: 0,      d: B * 0.33 }, // B4
    { f: 440.00, b: 0,      d: B * 0.33 }, // A4
    { f: 392.00, b: 196.00, d: B * 0.33 }, // G4  + G3 bass
    { f: 329.63, b: 0,      d: B * 0.33 }, // E4
    { f: 293.66, b: 146.83, d: B * 0.33 }, // D4  + D3 bass
    { f: 246.94, b: 0,      d: B * 0.5 },  // B3
    { f: 293.66, b: 0,      d: B * 0.75 }, // D4
    { f: 329.63, b: 164.81, d: B * 1.0 },  // E4  + E3 bass — resolve
    { f: 0,      b: 0,      d: B * 0.75 }, // rest before loop
  ];

  // ── Web Audio Graph ────────────────────────────────────────────────────
  function buildContext() {
    if (audioCtx) return;
    audioCtx   = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);

    // Warm reverb via two feedback delay lines
    const delay1  = audioCtx.createDelay(0.8);
    const delay2  = audioCtx.createDelay(0.5);
    const dGain1  = audioCtx.createGain();
    const dGain2  = audioCtx.createGain();
    const wetGain = audioCtx.createGain();
    delay1.delayTime.value = 0.52;
    delay2.delayTime.value = 0.31;
    dGain1.gain.value      = 0.24;
    dGain2.gain.value      = 0.16;
    wetGain.gain.value     = 0.34;

    masterGain.connect(delay1);
    masterGain.connect(delay2);
    delay1.connect(dGain1);
    delay2.connect(dGain2);
    dGain1.connect(wetGain);
    dGain2.connect(wetGain);
    wetGain.connect(audioCtx.destination);
    masterGain.connect(audioCtx.destination);
  }

  // ── Pluck note (guitar-like acoustic filter + warm resonance) ──────────
  function playNote(freq, when, dur) {
    if (!audioCtx || freq === 0) return;

    // Filter simulating string pluck brightness decaying into warm wooden body
    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2400, when);
    filter.frequency.exponentialRampToValueAtTime(750, when + dur * 0.7);

    // Primary warm triangle wave
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, when);
    osc.detune.setValueAtTime(-4, when);

    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(0.28, when + 0.02);
    gain.gain.setValueAtTime(0.24, when + dur * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, when + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    osc.start(when);
    osc.stop(when + dur + 0.08);

    // Soft overtone
    const osc2  = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(freq * 2, when);
    gain2.gain.setValueAtTime(0, when);
    gain2.gain.linearRampToValueAtTime(0.05, when + 0.025);
    gain2.gain.exponentialRampToValueAtTime(0.001, when + dur * 0.75);
    osc2.connect(gain2);
    gain2.connect(masterGain);
    osc2.start(when);
    osc2.stop(when + dur + 0.05);

    // Chorus voice: slightly detuned for width and warmth
    const osc3  = audioCtx.createOscillator();
    const gain3 = audioCtx.createGain();
    osc3.type = "triangle";
    osc3.frequency.setValueAtTime(freq, when);
    osc3.detune.setValueAtTime(7, when);
    gain3.gain.setValueAtTime(0, when);
    gain3.gain.linearRampToValueAtTime(0.12, when + 0.03);
    gain3.gain.exponentialRampToValueAtTime(0.001, when + dur * 0.9);
    osc3.connect(filter);
    gain3.connect(masterGain);
    filter.connect(gain3);
    osc3.start(when);
    osc3.stop(when + dur + 0.08);
  }

  function playBassNote(freq, when, dur) {
    if (!audioCtx || !freq || freq === 0) return;
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, when);

    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(0.18, when + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, when + dur * 1.2);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(when);
    osc.stop(when + dur * 1.25);
  }

  function scheduleSong(startAt) {
    let t = startAt;
    SONG.forEach(note => {
      playNote(note.f, t, note.d * 0.92);
      if (note.b) playBassNote(note.b, t, note.d * 1.5);
      t += note.d;
    });
    return t;
  }

  function startWebAudioLoop() {
    buildContext();
    if (audioCtx.state === "suspended") audioCtx.resume();

    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.6);

    const now = audioCtx.currentTime;
    let loopEnd = scheduleSong(now + 0.1);

    function reschedule() {
      if (!playing) return;
      loopEnd = scheduleSong(loopEnd);
      loopTimer = setTimeout(reschedule, (loopEnd - audioCtx.currentTime - 1) * 1000);
    }
    loopTimer = setTimeout(reschedule, (loopEnd - now - 1) * 1000);
  }

  function stopWebAudio() {
    clearTimeout(loopTimer);
    if (masterGain && audioCtx) {
      masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.6);
    }
  }

  function updateUI(isPlaying) {
    if (isPlaying) {
      toggleBtn.classList.add("playing");
      audioIcon.textContent = "☀️";
      audioText.textContent = "Here Comes The Sun";
      toggleBtn.setAttribute("title", "The Beatles - Here Comes The Sun (Pausar)");
    } else {
      toggleBtn.classList.remove("playing");
      audioIcon.textContent = "🎵";
      audioText.textContent = "Música";
      toggleBtn.setAttribute("title", "The Beatles - Here Comes The Sun (Reproducir)");
    }
  }

  function startPlaying() {
    playing = true;
    if (!ytFailed && tryPlayYouTube()) {
      updateUI(true);
      return;
    }
    // YouTube not ready yet (or failed) — play synth now; if YouTube becomes
    // ready shortly after, onReady() swaps over to the real recording.
    startWebAudioLoop();
    updateUI(true);
  }

  function stopPlaying() {
    playing = false;
    if (usingYouTube && ytPlayer && typeof ytPlayer.pauseVideo === "function") {
      ytPlayer.pauseVideo();
    }
    usingYouTube = false;
    stopWebAudio();
    updateUI(false);
  }

  toggleBtn.addEventListener("click", () => {
    if (playing) stopPlaying();
    else         startPlaying();
  });

  // Load the YouTube player early so it's ready by the time the user clicks.
  loadYouTubeAPI();

  // Prepare AudioContext on first user interaction (browser policy)
  document.addEventListener("click", function onFirst() {
    document.removeEventListener("click", onFirst);
    buildContext();
  }, { once: true });

  // Expose global methods
  window.playMusic = startPlaying;
  window.stopMusic = stopPlaying;
})();


/* --------------------------------------------------------------------------
   7. SMOOTH ENTRANCE ANIMATIONS ON SCROLL (Intersection Observer)
   -------------------------------------------------------------------------- */
(function initScrollReveal() {
  const targets = document.querySelectorAll(
    ".event-details-box, .countdown-container, .ultrasounds-section, .rsvp-box, .keepsake-card"
  );

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = "fadeInRise 0.7s cubic-bezier(0.2,0.8,0.25,1) forwards";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  // Set initial state
  targets.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    observer.observe(el);
  });
})();


/* --------------------------------------------------------------------------
   8. FLOATING SHARE BUTTON
   -------------------------------------------------------------------------- */
(function initShare() {
  const btn     = document.getElementById("shareBtn");
  const tooltip = document.getElementById("shareTooltip");
  if (!btn) return;

  const shareData = {
    title: "Baby Shower · Gael Santander Vallejo",
    text:  "¡Estás invitado al Baby Shower de Gael! 🧸💛 11 de Octubre · 2:00 PM · Salón Chambú, Pasto",
    url:   window.location.href,
  };

  let tooltipTimer = null;

  function showTooltip(msg) {
    tooltip.textContent = msg;
    tooltip.classList.add("visible");
    clearTimeout(tooltipTimer);
    tooltipTimer = setTimeout(() => tooltip.classList.remove("visible"), 2800);
  }

  btn.addEventListener("click", async () => {
    // Native share sheet (mobile browsers)
    if (navigator.share) {
      try { await navigator.share(shareData); return; } catch { /* cancelled */ }
    }
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href);
      showTooltip("¡Enlace copiado! Comparte la invitación 💛");
    } catch {
      prompt("Copia este enlace:", window.location.href);
    }
  });
})();
