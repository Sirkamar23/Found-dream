(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Butterflies ---------- */

  const BLUES = [
    ["#9fd0ff", "#2f7bff"],
    ["#cfe6ff", "#5aa9ff"],
    ["#7fb8ff", "#1745b8"],
    ["#b7f0ff", "#2aa6e0"],
    ["#ffffff", "#6c9cff"],
  ];

  function butterflySVG([light, dark], id) {
    return `
      <svg viewBox="0 0 100 80">
        <defs>
          <radialGradient id="g${id}" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stop-color="${light}"/>
            <stop offset="100%" stop-color="${dark}"/>
          </radialGradient>
        </defs>
        <g class="wing-l">
          <path d="M50 40 C30 0, 0 5, 8 30 C12 42, 35 42, 50 40 Z" fill="url(#g${id})"/>
          <path d="M50 42 C35 48, 12 58, 22 72 C32 80, 46 60, 50 42 Z" fill="url(#g${id})" opacity=".9"/>
        </g>
        <g class="wing-r">
          <path d="M50 40 C70 0, 100 5, 92 30 C88 42, 65 42, 50 40 Z" fill="url(#g${id})"/>
          <path d="M50 42 C65 48, 88 58, 78 72 C68 80, 54 60, 50 42 Z" fill="url(#g${id})" opacity=".9"/>
        </g>
        <ellipse cx="50" cy="44" rx="2.5" ry="16" fill="#0a2a6b"/>
        <path d="M49 30 C46 20, 42 16, 38 14 M51 30 C54 20, 58 16, 62 14"
              stroke="#0a2a6b" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      </svg>`;
  }

  const rand = (min, max) => Math.random() * (max - min) + min;

  const flock = document.getElementById("butterflies");
  const count = Math.min(40, Math.round((innerWidth * innerHeight) / 14000) + 14);

  for (let i = 0; i < count; i++) {
    const b = document.createElement("div");
    b.className = "butterfly";
    const size = rand(28, 72);
    b.style.left = rand(-5, 95) + "vw";
    b.style.top = rand(-5, 95) + "vh";
    b.style.setProperty("--size", size + "px");
    b.style.setProperty("--flap", rand(0.18, 0.4) + "s");
    b.style.setProperty("--drift", rand(3, 7) + "s");
    b.style.setProperty("--dx", rand(-60, 60) + "px");
    b.style.setProperty("--dy", rand(-80, -20) + "px");
    // Each one flies off in its own direction (mostly upward)
    const angle = rand(-Math.PI, 0);
    b.style.setProperty("--away-x", Math.cos(angle) * 120 + "vw");
    b.style.setProperty("--away-y", Math.sin(angle) * 120 + "vh");
    b.style.transitionDelay = rand(0, 0.8) + "s";
    b.innerHTML = butterflySVG(BLUES[i % BLUES.length], i);
    flock.appendChild(b);
  }

  /* ---------- Sparkles (stay in the background) ---------- */

  const sparkles = document.getElementById("sparkles");
  for (let i = 0; i < 40; i++) {
    const s = document.createElement("span");
    s.className = "sparkle";
    s.style.left = rand(0, 100) + "vw";
    s.style.top = rand(0, 100) + "vh";
    s.style.setProperty("--t", rand(2, 5) + "s");
    s.style.animationDelay = rand(0, 5) + "s";
    sparkles.appendChild(s);
  }

  /* ---------- Butterflies fly away, message appears ---------- */

  const gift = document.getElementById("gift");
  let revealed = false;

  function reveal() {
    if (revealed) return;
    revealed = true;
    flock.querySelectorAll(".butterfly").forEach((b) => b.classList.add("leave"));
    setTimeout(() => {
      gift.hidden = false;
      requestAnimationFrame(() => gift.classList.add("show"));
    }, reduceMotion ? 0 : 1300);
    setTimeout(() => flock.remove(), 3500);
  }

  setTimeout(reveal, reduceMotion ? 300 : 3500);
  // A tap anywhere lets people skip ahead
  document.addEventListener("pointerdown", reveal, { once: true });

  /* ---------- Music player ---------- */

  const songs = Array.isArray(window.SONGS) ? window.SONGS : [];
  const audio = document.getElementById("audio");
  const list = document.getElementById("playlist");
  const titleEl = document.getElementById("trackTitle");
  const artistEl = document.getElementById("trackArtist");
  const toggleBtn = document.getElementById("toggleBtn");
  const playBtn = document.getElementById("playBtn");
  const seek = document.getElementById("seek");
  const cur = document.getElementById("cur");
  const dur = document.getElementById("dur");
  const disc = document.getElementById("disc");
  let index = 0;

  const fmt = (s) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  };

  if (!songs.length) {
    list.innerHTML = '<li class="empty">Music is coming soon 🎶</li>';
    titleEl.textContent = "Music coming soon";
    [toggleBtn, playBtn, seek, document.getElementById("prevBtn"), document.getElementById("nextBtn")]
      .forEach((el) => (el.disabled = true));
    playBtn.style.display = "none";
    return;
  }

  songs.forEach((song, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="n">${i + 1}</span><span></span>`;
    li.lastChild.textContent = song.title || song.file;
    li.addEventListener("click", () => { load(i); play(); });
    list.appendChild(li);
  });

  function load(i) {
    index = (i + songs.length) % songs.length;
    const song = songs[index];
    audio.src = song.file;
    titleEl.textContent = song.title || song.file;
    artistEl.textContent = song.artist || "";
    [...list.children].forEach((li, n) => li.classList.toggle("active", n === index));
  }

  function play() { audio.play().catch(() => {}); }

  function sync() {
    const playing = !audio.paused;
    toggleBtn.textContent = playing ? "⏸" : "▶";
    toggleBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
    playBtn.innerHTML = playing
      ? '<span class="icon">⏸</span> Pause music'
      : '<span class="icon">▶</span> Play my music';
    disc.classList.toggle("spin", playing);
  }

  toggleBtn.addEventListener("click", () => (audio.paused ? play() : audio.pause()));
  playBtn.addEventListener("click", () => (audio.paused ? play() : audio.pause()));
  document.getElementById("prevBtn").addEventListener("click", () => {
    if (audio.currentTime > 3) audio.currentTime = 0;
    else { load(index - 1); play(); }
  });
  document.getElementById("nextBtn").addEventListener("click", () => { load(index + 1); play(); });

  audio.addEventListener("play", sync);
  audio.addEventListener("pause", sync);
  audio.addEventListener("ended", () => { load(index + 1); play(); });
  audio.addEventListener("loadedmetadata", () => (dur.textContent = fmt(audio.duration)));
  audio.addEventListener("timeupdate", () => {
    cur.textContent = fmt(audio.currentTime);
    if (audio.duration) seek.value = (audio.currentTime / audio.duration) * 100;
  });
  seek.addEventListener("input", () => {
    if (audio.duration) audio.currentTime = (seek.value / 100) * audio.duration;
  });

  load(0);
})();
