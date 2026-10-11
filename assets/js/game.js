// Site meta-game (MVP): theme cycling. Deferred: zero render-blocking cost.
// Nothing on the page depends on this file; deleting it leaves defaults.
(() => {
  const THEMES = [
    { name: "Yellow", h: 35, s: 78, l: 67 },
    { name: "Red", h: 4, s: 80, l: 64 },
    { name: "Green", h: 145, s: 65, l: 58 },
    { name: "Blue", h: 212, s: 85, l: 65 },
    { name: "Purple", h: 278, s: 75, l: 70 },
  ];
  const KEY = "site-theme";
  const root = document.documentElement;
  const btn = document.getElementById("theme-cycle");

  function apply(t) {
    root.style.setProperty("--accent", `hsl(${t.h} ${t.s}% ${t.l}%)`);
    if (btn) btn.textContent = t.name;
  }

  function load() {
    let name = null;
    try {
      name = localStorage.getItem(KEY);
    } catch {
      /* private mode: fall through to default */
    }
    return THEMES.find((t) => t.name === name) || THEMES[0];
  }

  let current = load();
  apply(current);
  if (btn) {
    btn.addEventListener("click", () => {
      current = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
      try {
        localStorage.setItem(KEY, current.name);
      } catch {
        /* private mode: theme just won't persist */
      }
      apply(current);
    });
  }

  // Wallet: coin count persisted in localStorage, shown in the ticker.
  const WALLET_KEY = "site-wallet";
  const GRANT = 10;
  const walletEl = document.getElementById("coin-count");

  function readWallet() {
    try {
      const n = parseInt(localStorage.getItem(WALLET_KEY), 10);
      return Number.isFinite(n) && n >= 0 ? n : 0;
    } catch {
      return 0;
    }
  }

  function renderWallet(n) {
    if (walletEl) walletEl.textContent = n;
  }

  function grant(n) {
    const total = readWallet() + n;
    try {
      localStorage.setItem(WALLET_KEY, String(total));
    } catch {
      /* private mode: wallet just won't persist */
    }
    renderWallet(total);
  }

  renderWallet(readWallet());

  // Debug faucet (debug page only): unstyled on purpose.
  const faucet = document.getElementById("coin-debug");
  if (faucet) {
    faucet.addEventListener("click", () => grant(GRANT));
  }
})();
