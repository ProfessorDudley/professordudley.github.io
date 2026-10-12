// Project filtering and sorting (projects page only). Deferred, post-paint.
// Groups: tech, status, source. 3-state buttons: off -> include -> exclude.
// Within a group includes OR together; across groups everything ANDs;
// excludes always win. Sort is single-select.
(() => {
  const grid = document.querySelector(".projects-main .card-grid");
  const count = document.getElementById("filter-count");
  const clear = document.getElementById("filter-clear");
  if (!grid) return;

  const cards = [...grid.querySelectorAll(".card")];
  const buttons = [...document.querySelectorAll(".filter-btn[data-group]")];
  const sortBtns = [...document.querySelectorAll(".filter-btn[data-sort]")];
  const modes = new Map(); // "group:value" -> 1 include | 2 exclude
  let sort = "new";

  const key = (b) => `${b.dataset.group}:${b.dataset.filter}`;

  function groupModes(group, want) {
    const out = [];
    for (const [k, m] of modes) {
      if (m !== want) continue;
      const [g, v] = k.split(":");
      if (g === group) out.push(v);
    }
    return out;
  }

  function visible(card) {
    for (const group of ["tech", "status", "source"]) {
      const tags = (card.dataset[group] || "").split(",");
      const inc = groupModes(group, 1);
      const exc = groupModes(group, 2);
      if (inc.length && !inc.some((t) => tags.includes(t))) return false;
      if (exc.some((t) => tags.includes(t))) return false;
    }
    return true;
  }

  function sortKey(card) {
    if (sort === "az") return card.dataset.title || "";
    return card.dataset.date || "";
  }

  function apply() {
    let shown = 0;
    for (const card of cards) {
      const v = visible(card);
      card.hidden = !v;
      if (v) shown += 1;
    }
    const ordered = [...cards].sort((a, b) => {
      const ka = sortKey(a), kb = sortKey(b);
      if (ka === kb) return 0;
      const cmp = ka < kb ? -1 : 1;
      return sort === "new" ? -cmp : cmp;
    });
    for (const card of ordered) grid.appendChild(card);
    if (count) count.textContent = `Showing ${shown} of ${cards.length}`;
  }

  function paint(b, mode) {
    b.setAttribute("aria-pressed", mode === 1 ? "true" : "false");
    b.dataset.mode = ["", "only", "not"][mode];
  }

  buttons.forEach((b) => {
    b.addEventListener("click", () => {
      const k = key(b);
      const next = ((modes.get(k) || 0) + 1) % 3;
      if (next === 0) modes.delete(k);
      else modes.set(k, next);
      paint(b, next);
      apply();
    });
  });

  sortBtns.forEach((b) => {
    b.addEventListener("click", () => {
      sort = b.dataset.sort;
      sortBtns.forEach((o) => o.setAttribute("aria-pressed", o === b ? "true" : "false"));
      apply();
    });
  });

  if (clear) {
    clear.addEventListener("click", () => {
      modes.clear();
      buttons.forEach((b) => paint(b, 0));
      sort = "new";
      sortBtns.forEach((o) => o.setAttribute("aria-pressed", o.dataset.sort === "new" ? "true" : "false"));
      apply();
    });
  }

  // Shelved work (placeholder slots) starts excluded.
  buttons.forEach((b) => {
    if (b.dataset.group === "status" && b.dataset.filter === "shelved") {
      modes.set(key(b), 2);
      paint(b, 2);
    }
  });

  apply();
})();
