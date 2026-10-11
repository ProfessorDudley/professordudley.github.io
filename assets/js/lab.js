(() => {
  const KEY = "design-lab:bg";
  const defaults = { h: 220, s: 20, l: 12 };

  const root = document.documentElement;
  const h = document.getElementById("bg-h");
  const s = document.getElementById("bg-s");
  const l = document.getElementById("bg-l");
  const readout = document.getElementById("bg-value");
  const cssOut = document.getElementById("bg-css");

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { ...defaults };
      const v = JSON.parse(raw);
      return {
        h: Number(v.h) || 0,
        s: Math.min(100, Math.max(0, Number(v.s) || 0)),
        l: Math.min(100, Math.max(0, Number(v.l) || 0)),
      };
    } catch {
      return { ...defaults };
    }
  }

  function apply(v, persist = true) {
    root.style.setProperty("--bg-h", v.h);
    root.style.setProperty("--bg-s", `${v.s}%`);
    root.style.setProperty("--bg-l", `${v.l}%`);
    h.value = v.h;
    s.value = v.s;
    l.value = v.l;
    document.getElementById("bg-h-val").textContent = v.h;
    document.getElementById("bg-s-val").textContent = `${v.s}%`;
    document.getElementById("bg-l-val").textContent = `${v.l}%`;
    const css = `background: hsl(${v.h} ${v.s}% ${v.l}%);`;
    readout.textContent = `hsl(${v.h} ${v.s}% ${v.l}%)`;
    cssOut.textContent = `:root {\n  --bg-h: ${v.h};\n  --bg-s: ${v.s}%;\n  --bg-l: ${v.l}%;\n}`;
    if (persist) {
      try {
        localStorage.setItem(KEY, JSON.stringify(v));
      } catch { /* private mode */ }
    }
    return css;
  }

  function current() {
    return { h: Number(h.value), s: Number(s.value), l: Number(l.value) };
  }

  h.addEventListener("input", () => apply(current()));
  s.addEventListener("input", () => apply(current()));
  l.addEventListener("input", () => apply(current()));

  document.getElementById("bg-copy").addEventListener("click", async () => {
    const v = current();
    const css = `:root {\n  --bg-h: ${v.h};\n  --bg-s: ${v.s}%;\n  --bg-l: ${v.l}%;\n}`;
    try {
      await navigator.clipboard.writeText(css);
      readout.textContent = "Copied! Paste it here to hardcode.";
    } catch {
      readout.textContent = "Copy blocked — select the snippet below.";
    }
  });

  document.getElementById("bg-download").addEventListener("click", () => {
    const v = current();
    const blob = new Blob([JSON.stringify({ background: v }, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "design-state.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  document.getElementById("bg-reset").addEventListener("click", () => {
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
    apply({ ...defaults });
  });

  apply(load(), false);
})();
