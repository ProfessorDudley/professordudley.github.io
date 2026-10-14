# PLAN — professordudley.github.io

Personal portfolio + game-dev hub for Sam Dicken (ProfessorDudley).
Static Jekyll 4 site, GitHub Pages via Actions (`master` only).

## Current state (dev @ `199a394`, tags v0.2–v0.5)

- **Branches:** `master` = legacy launchpad (do not touch without a publish plan);
  `dev` = all current work; `game-prototype` = open, sprite/game exploration.
  Only `master` deploys (workflow triggers on `master` push).
- **Pages:** landing `index.html` (hero, featured cards, Store), `/projects/`
  (collection grid + filter sidebar), project articles (`_layouts/article.html`
  with meta rail), `debug.html` (design lab, never ships).
- **Collections/content:** `_projects/` (4 real: Tiny Moves, Waiter!,
  Chaos Daycare, Count Crumble); blog removed from nav (no `_posts` yet —
  project writeups double as the writing outlet).
- **Theme system:** `assets/css/theme.css` (globals) + per-page
  `index.css` / `projects.css` + debug-only `lab.css`. Five accents
  (Yellow/Red/Green/Blue/Purple) cycled from the ticker, persisted +
  pre-painted; borders derive from accent. `game.js` owns wallet, ownership,
  store, visit awards. `filter.js` owns 3-state tech/status/source filters
  + sort. See `docs/` for design notes and the project template.
- **Portrait tablet (768px) — complete:** store hidden on landing; nav
  externals icon+text on desktop, icon-only at ≤768px (inline SimpleIcons);
  landing 2×2 cards with full-bleed images (same bleed as projects), roomy
  hero, 6rem sides, left footer; projects filter collapses to a one-line
  `Filter` bar (pure-CSS checkbox toggle, zero JS) above a two-across grid,
  footer bottom-left; article rail below title with tight rhythm; 6rem main
  bottom padding + unified `24/0/0/0` left footers everywhere at 768px.
  Landing fills the viewport (flex column + `1fr` hero row, no `46vh`).
- **Tools (dev-only, build-excluded):** `tools/aseprite/` (LLM→Aseprite
  pipeline, proven pixel-perfect), `tools/sprite-studio/` (local Ollama app
  on :8571, engine = external `~/tools/aseprite-mcp` clone).

## Remember why

- **No 768px `.card img` override on landing.** The desktop full-bleed
  (`width:calc(100% + 3rem)` + negative margins, `theme.css`) must apply at
  all sizes or landing cards inset while projects cards bleed. Do not re-add
  a landing-only image sizing rule without checking both pages.
- **Filter collapse is a checkbox hack on purpose.** Zero-JS rule stands;
  `filter.js` queries `.filter-btn`/`#filter-clear`, so the toggle must only
  hide/show via CSS and never move those nodes.
- **Landing 1440px screenshots never hash-match; projects/article do.**
  Brave full-page captures have renderer noise (AA/dither, worst single
  pixel ~22/255 in empty areas). Compare landing with RMSE + locate the
  bbox; investigate only if diffs are structural. Current 1440 reference:
  `/tmp/opencode/baseline2/`.
- **Nav icons carry a strut fix** (`.soc` margin-block compensation) so the
  1.3em glyphs don't grow the desktop nav bar. Touching nav icon sizing
  requires re-verifying desktop below-nav pixels.
- **Screenshot tooling** (`/tmp/opencode/shot.py` full-page via Brave CDP,
  `measure.py` computed styles) lives outside the repo and may vanish with
  `/tmp` — regenerable, not precious.

## Goals

1. **Project hub** — point people here for jobs/presence; content-first,
   game-dev personality, fast first paint.
2. **Writing outlet** — project articles carry Context/Did/Learned; standalone
   blog only when a lesson outgrows its project.
3. **Hobby infra** — hand-rolled, fun to hack on; finishing + publishing is
   the point. Game loop (coins → skins → sprites later) stays a bonus that
   never blocks content or slows loads.

## Direction

- **Now:** portrait tablet signed off. Next structural step is phone sizes
  (fluid first, breakpoints only for structural moves — same playbook).
- **Next:** publish pass to `master` (strip lab via `exclude:` on the merge
  commit; favicon done; mobile floor; `_apps` gone) + custom-domain decision
  (CNAME vs github.io URL). Note `_config.yml` already points at
  `https://samdicken.me`.
- **Later:** blog (first standalone post triggers it), sprites as gacha
  content, flyout store, SEO pass.

- Git: never sign (repo-local `commit.gpgsign=false` / `tag.gpgsign=false`;
  user signs). Unsigned commits only. Never push `master` without explicit
  approval. `dev` pushes are safe (no deploy). Keep branches listed above.
- Verify by building (`bundle exec jekyll build`) and headless screenshots
  (Brave), not by reasoning. Preview :4000, Studio :8571.
- User-authored content files (their writing/edits) stay uncommitted unless
  asked; never bundle them silently under agent messages.
- Performance budget: deferred scripts only, no render-blocking additions,
  no new network requests without discussion.
