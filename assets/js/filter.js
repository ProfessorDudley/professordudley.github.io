// Project filtering (projects page only). Deferred, runs after paint.
(() => {
  const grid = document.querySelector(".page-main .card-grid");
  const buttons = [...document.querySelectorAll("#filter-tech .filter-btn")];
  const count = document.getElementById("filter-count");
  const clear = document.getElementById("filter-clear");
  if (!grid || !buttons.length) return;

  const cards = [...grid.querySelectorAll(".card")];
  const active = new Set();

  function apply() {
    let shown = 0;
    for (const card of cards) {
      const tags = (card.dataset.tech || "").split(",");
      const visible = !active.size || [...active].some((t) => tags.includes(t));
      card.hidden = !visible;
      if (visible) shown += 1;
    }
    if (count) count.textContent = `Showing ${shown} of ${cards.length}`;
  }

  buttons.forEach((b) => {
    b.addEventListener("click", () => {
      const t = b.dataset.filter;
      if (active.has(t)) {
        active.delete(t);
        b.setAttribute("aria-pressed", "false");
      } else {
        active.add(t);
        b.setAttribute("aria-pressed", "true");
      }
      apply();
    });
  });

  if (clear) {
    clear.addEventListener("click", () => {
      active.clear();
      buttons.forEach((b) => b.setAttribute("aria-pressed", "false"));
      apply();
    });
  }

  apply();
})();
