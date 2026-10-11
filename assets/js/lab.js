// LAB ONLY — debug tool. Nothing on the page depends on this file.
// Strip-out: delete this file, #design-menu, #scheme-panel, lab.css link.
(() => {
  const KEY = "design-lab:v2";
  const ROLES = ["bg", "surface", "text", "muted", "accent", "on-accent", "border"];
  const LABELS = {
    bg: "Background", surface: "Card surface", text: "Body text",
    muted: "Subtitle", accent: "Accent", "on-accent": "Text on accent", border: "Card border",
  };
  // [role, compare-against, minimum ratio]
  const CHECKS = [
    ["text", "bg", 4.5], ["muted", "bg", 3], ["accent", "bg", 3],
    ["on-accent", "accent", 4.5], ["border", "surface", 2],
  ];
  const defaults = {
    bg: { h: 220, s: 20, l: 12 }, surface: { h: 220, s: 20, l: 18 },
    text: { h: 220, s: 12, l: 92 }, muted: { h: 220, s: 12, l: 65 },
    accent: { h: 205, s: 85, l: 62 }, "on-accent": { h: 205, s: 20, l: 8 },
    border: { h: 205, s: 40, l: 35 },
  };

  const root = document.documentElement;
  const $ = (id) => document.getElementById(id);
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const clampL = (l) => Math.min(97, Math.max(3, l));

  function hslToRgb(h, s, l) {
    s /= 100; l /= 100; h = ((h % 360) + 360) % 360;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [f(0), f(8), f(4)];
  }
  function luminance(c) {
    const [r, g, b] = hslToRgb(c.h, c.s, c.l).map((v) =>
      v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  const ratio = (a, b) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };
  const css = (c) => `hsl(${Math.round(c.h)} ${Math.round(c.s)}% ${Math.round(c.l)}%)`;

  let state = load();
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const v = JSON.parse(raw);
        if (v.roles && v.locks) return v;
      }
    } catch { /* ignore */ }
    return { roles: structuredClone(defaults), locks: Object.fromEntries(ROLES.map((r) => [r, false])) };
  }
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* private mode */ }
  }

  function apply(persistIt = true) {
    for (const r of ROLES) {
      const c = state.roles[r];
      root.style.setProperty(`--${r}`, css(c));
    }
    const bg = state.roles.bg;
    $("bg-h").value = bg.h; $("bg-s").value = bg.s; $("bg-l").value = bg.l;
    $("bg-h-val").textContent = Math.round(bg.h);
    $("bg-s-val").textContent = `${Math.round(bg.s)}%`;
    $("bg-l-val").textContent = `${Math.round(bg.l)}%`;
    $("bg-value").textContent = css(bg);
    $("bg-css").textContent = ":root {\n" +
      ROLES.map((r) => `  --${r}: ${css(state.roles[r])};`).join("\n") + "\n}";
    renderSwatches();
    if (persistIt) persist();
  }

  function renderSwatches() {
    const box = $("swatches");
    box.innerHTML = "";
    const results = Object.fromEntries(CHECKS.map(([a, b, min]) => [`${a}/${b}`, { v: ratio(state.roles[a], state.roles[b]), min }]));
    for (const r of ROLES) {
      const rel = CHECKS.filter(([, b]) => b === r).map(([a]) => `${a}: ${results[`${a}/${r}`].v.toFixed(1)}`);
      const bad = CHECKS.some(([a, b, min]) => (a === r || b === r) && results[`${a}/${b}`].v < min);
      const d = document.createElement("div");
      d.className = "sw";
      d.dataset.role = r;
      d.innerHTML =
        `<div class="sw-chip"></div><div class="sw-body"><strong>${LABELS[r]}</strong>` +
        `<code>${css(state.roles[r])}</code>` +
        (rel.length ? `<span class="sw-ratio${bad ? " bad" : ""}">${rel.join(" · ")}${bad ? " !" : ""}</span>` : "") +
        `<label class="sw-lock"><input type="checkbox" data-lock="${r}"${state.locks[r] ? " checked" : ""}> lock</label></div>`;
      box.appendChild(d);
    }
    box.querySelectorAll("[data-lock]").forEach((cb) =>
      cb.addEventListener("change", () => {
        state.locks[cb.dataset.lock] = cb.checked;
        persist();
      }));
  }

  // ---- harmonious + legible regeneration ----
  function genBg(cur) {
    const dark = cur.l < 50;
    return { h: Math.round(rand(0, 360)), s: Math.round(rand(10, 35)), l: Math.round(dark ? rand(8, 20) : rand(86, 95)) };
  }
  function genSurface(bg) {
    const dark = bg.l < 50;
    return { h: bg.h, s: bg.s, l: Math.round(clampL(bg.l + (dark ? rand(4, 9) : -rand(4, 9)))) };
  }
  function genText(bg) {
    const dark = bg.l < 50;
    for (let i = 0; i < 300; i++) {
      const c = { h: bg.h, s: Math.round(rand(5, 18)), l: Math.round(dark ? rand(86, 97) : rand(4, 14)) };
      if (ratio(c, bg) >= 4.5) return c;
    }
    return { h: bg.h, s: 8, l: dark ? 95 : 6 };
  }
  function genMuted(bg) {
    const dark = bg.l < 50;
    for (let i = 0; i < 300; i++) {
      const c = { h: bg.h, s: Math.round(rand(8, 22)), l: Math.round(dark ? rand(55, 72) : rand(30, 45)) };
      if (ratio(c, bg) >= 3) return c;
    }
    return { h: bg.h, s: 12, l: dark ? 65 : 40 };
  }
  function genAccent(bg) {
    const dark = bg.l < 50;
    const base = state.locks.accent ? state.roles.accent.h : bg.h;
    const offsets = [-35, -25, -15, 15, 25, 35, 150, 180, 210];
    for (let i = 0; i < 300; i++) {
      const c = {
        h: Math.round((base + pick(offsets) + 360) % 360),
        s: Math.round(rand(55, 95)), l: Math.round(dark ? rand(55, 72) : rand(38, 55)),
      };
      if (ratio(c, bg) >= 3) return c;
    }
    return { h: (base + 180) % 360, s: 70, l: dark ? 62 : 45 };
  }
  function genOnAccent(accent) {
    const dark = { h: accent.h, s: 15, l: 10 };
    const light = { h: accent.h, s: 10, l: 97 };
    if (ratio(dark, accent) >= 4.5) return dark;
    if (ratio(light, accent) >= 4.5) return light;
    return ratio(dark, accent) > ratio(light, accent) ? dark : light;
  }
  function genBorder(surface, accent) {
    const dark = surface.l < 50;
    for (let i = 0; i < 300; i++) {
      const c = { h: accent.h, s: Math.round(rand(25, 60)), l: Math.round(dark ? rand(28, 48) : rand(58, 80)) };
      if (ratio(c, surface) >= 2) return c;
    }
    return { h: accent.h, s: 35, l: dark ? 35 : 70 };
  }

  function regenerate() {
    const r = state.roles, L = state.locks;
    if (!L.bg) r.bg = genBg(r.bg);
    if (!L.surface) r.surface = genSurface(r.bg);
    if (!L.text) r.text = genText(r.bg);
    if (!L.muted) r.muted = genMuted(r.bg);
    if (!L.accent) r.accent = genAccent(r.bg);
    if (!L["on-accent"]) r["on-accent"] = genOnAccent(r.accent);
    if (!L.border) r.border = genBorder(r.surface, r.accent);
    apply();
  }

  // ---- wiring ----
  const readBg = () => ({ h: Number($("bg-h").value), s: Number($("bg-s").value), l: Number($("bg-l").value) });
  for (const id of ["bg-h", "bg-s", "bg-l"]) {
    $(id).addEventListener("input", () => {
      state.roles.bg = readBg();
      state.locks.bg = true; // hand-tuned means approved
      apply();
    });
  }
  $("regen").addEventListener("click", regenerate);
  $("bg-copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText($("bg-css").textContent);
      $("bg-value").textContent = "Copied! Paste it here to hardcode.";
    } catch { $("bg-value").textContent = "Copy blocked — select the snippet below."; }
  });
  $("bg-download").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify({ scheme: state.roles, locks: state.locks }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "design-state.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });
  $("bg-reset").addEventListener("click", () => {
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
    state = { roles: structuredClone(defaults), locks: Object.fromEntries(ROLES.map((r) => [r, false])) };
    apply();
  });

  apply(false);
})();
