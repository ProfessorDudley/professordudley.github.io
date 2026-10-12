// Project filtering (projects page only). Deferred, runs after paint.
(() => {
  const grid = document.querySelector(".projects-main .card-grid");
  const buttons = [...document.querySelectorAll("#filter-tech .filter-btn")];
  const count = document.getElementById("filter-count");
  const clear = document.getElementById("filter-clear");
  if (!grid || !buttons.length) return;

  const cards = [...grid.querySelectorAll(".card")];
  const modes = new Map(); // filter -> 0 off | 1 include | 2 exclude

  function apply() {
    const inc = [...modes].filter(([, m]) => m === 1).map(([t]) => t);
    const exc = [...modes].filter(([, m]) => m === 2).map(([t]) => t);
    let shown = 0;
    for (const card of cards) {
      const tags = (card.dataset.tech || "").split(",");
      const visible =
        (!inc.length || inc.some((t) => tags.includes(t))) &&
        !exc.some((t) => tags.includes(t));
      card.hidden = !visible;
      if (visible) shown += 1;
    }
    if (count) count.textContent = `Showing ${shown} of ${cards.length}`;
  }

  buttons.forEach((b) => {
    b.addEventListener("click", () => {
      const t = b.dataset.filter;
      const next = ((modes.get(t) || 0) + 1) % 3;
      modes.set(t, next);
      b.setAttribute("aria-pressed", next === 1 ? "true" : "false");
      b.dataset.mode = ["", "only", "not"][next];
      if (next === 0) modes.delete(t);
      apply();
    });
  });

  if (clear) {
    clear.addEventListener("click", () => {
      modes.clear();
      buttons.forEach((b) => {
        b.setAttribute("aria-pressed", "false");
        b.dataset.mode = "";
      });
      apply();
    });
  }

  apply();
})();
