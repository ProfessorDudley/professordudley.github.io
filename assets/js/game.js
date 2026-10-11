// Site meta-game (MVP): accent cycling, wallet, store. Deferred: zero render-blocking cost.
// Nothing on the page depends on this file; deleting it leaves defaults.
// ACCENTS is the single source of truth: :root defaults mirror its Yellow
// entry (border included), and apply() derives --border from the accent.
(() => {
  const ACCENTS = [
    { name: "Yellow", h: 35, s: 78, l: 67 },
    { name: "Red", h: 4, s: 80, l: 64 },
    { name: "Green", h: 145, s: 65, l: 58 },
    { name: "Blue", h: 212, s: 85, l: 65 },
    { name: "Purple", h: 278, s: 75, l: 70 },
  ];
  const KEY = "site-theme";
  const OWNED_KEY = "site-owned";
  const root = document.documentElement;
  const cycleBtns = document.querySelectorAll(".theme-cycle");

  function apply(t) {
    const accent = `hsl(${t.h} ${t.s}% ${t.l}%)`;
    const border = `hsl(${t.h} 50% ${Math.max(15, t.l - 26)}%)`;
    root.style.setProperty("--accent", accent);
    root.style.setProperty("--border", border);
    try {
      localStorage.setItem("site-theme-css", JSON.stringify({ accent, border }));
    } catch {
      /* private mode: pre-paint just won't have anything to read */
    }
    cycleBtns.forEach((b) => {
      const label = b.querySelector(".theme-name");
      if (label) label.textContent = t.name;
      else b.textContent = t.name;
    });
  }

  function loadOwned() {
    try {
      const arr = JSON.parse(localStorage.getItem(OWNED_KEY));
      if (Array.isArray(arr) && arr.length) return arr;
    } catch {
      /* fall through to default */
    }
    // First run under ownership: keep any previously selected theme.
    let prev = null;
    try {
      prev = localStorage.getItem(KEY);
    } catch {
      /* ignore */
    }
    const seed = ["Yellow"];
    if (prev && ACCENTS.some((t) => t.name === prev) && !seed.includes(prev)) {
      seed.push(prev);
    }
    return seed;
  }

  function saveOwned() {
    try {
      localStorage.setItem(OWNED_KEY, JSON.stringify(owned));
    } catch {
      /* private mode: ownership just won't persist */
    }
  }

  let owned = loadOwned();
  if (!owned.includes("Yellow")) owned.push("Yellow");

  function load() {
    let name = null;
    try {
      name = localStorage.getItem(KEY);
    } catch {
      /* private mode: fall through to default */
    }
    return ACCENTS.find((t) => t.name === name) || ACCENTS[0];
  }

  let current = load();
  if (!owned.includes(current.name)) current = ACCENTS[0];
  apply(current);
  cycleBtns.forEach((b) => {
    b.addEventListener("click", () => {
      const list = ACCENTS.filter((t) => owned.includes(t.name));
      current = list[(list.indexOf(current) + 1) % list.length];
      try {
        localStorage.setItem(KEY, current.name);
      } catch {
        /* private mode: theme just won't persist */
      }
      apply(current);
    });
  });

  // Wallet: coin count persisted in localStorage, shown wherever .coin-count appears.
  const WALLET_KEY = "site-wallet";
  const GRANT = 10;
  const walletEls = document.querySelectorAll(".coin-count");

  function readWallet() {
    try {
      const n = parseInt(localStorage.getItem(WALLET_KEY), 10);
      return Number.isFinite(n) && n >= 0 ? n : 0;
    } catch {
      return 0;
    }
  }

  function renderWallet(n) {
    walletEls.forEach((el) => { el.textContent = n; });
  }

  function grant(n) {
    setWallet(readWallet() + n);
  }

  renderWallet(readWallet());

  // Store: buy buttons per theme, fixed cost for now.
  const COST = 5;
  const storeEl = document.getElementById("store-list");

  function setWallet(n) {
    try {
      localStorage.setItem(WALLET_KEY, String(n));
    } catch {
      /* private mode: wallet just won't persist */
    }
    renderWallet(n);
  }

  function buy(i) {
    const t = ACCENTS[i];
    if (owned.includes(t.name)) return;
    const wallet = readWallet();
    if (wallet < COST) return;
    setWallet(wallet - COST);
    owned.push(t.name);
    saveOwned();
    current = t;
    try {
      localStorage.setItem(KEY, current.name);
    } catch {
      /* private mode: theme just won't persist */
    }
    apply(current);
    renderStore();
  }

  function renderStore() {
    if (!storeEl) return;
    storeEl.innerHTML = "";
    ACCENTS.forEach((t, i) => {
      const isOwned = owned.includes(t.name);
      const row = document.createElement("div");
      row.className = "store-row" + (isOwned ? " owned" : "");
      row.innerHTML =
        `<button type="button" class="buy-btn" style="--buy-bg:hsl(${t.h} ${t.s}% ${t.l}%)"${isOwned ? " disabled" : ""}>${t.name}</button>` +
        `<span class="cost">x ${COST} <img src="/media/images/coin.png" alt="" width="16" height="16"></span>`;
      if (!isOwned) {
        row.querySelector("button").addEventListener("click", () => buy(i));
      }
      storeEl.appendChild(row);
    });
  }

  renderStore();

  // Debug faucet (debug page only): unstyled on purpose.
  const faucet = document.getElementById("coin-debug");
  if (faucet) {
    faucet.addEventListener("click", () => grant(GRANT));
  }

  // Debug reset: clears game keys only (design-lab tool state untouched).
  const wipe = document.getElementById("storage-clear");
  if (wipe) {
    wipe.addEventListener("click", () => {
      try {
        localStorage.removeItem(WALLET_KEY);
        localStorage.removeItem(OWNED_KEY);
        localStorage.removeItem(KEY);
      } catch {
        /* ignore */
      }
      owned = ["Yellow"];
      current = ACCENTS[0];
      apply(current);
      renderStore();
      renderWallet(0);
    });
  }
})();
