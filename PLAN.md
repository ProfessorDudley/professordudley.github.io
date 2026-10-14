# PLAN — professordudley.github.io

Personal portfolio + game-dev hub for Sam Dicken (ProfessorDudley).
Static Jekyll 4 site, GitHub Pages via Actions (`master` only).

## Current state (dev @ `cefe4f2`, tags v0.2–v0.5)

- **Branches:** `master` = legacy launchpad (do not touch without a publish plan);
  `dev` = all current work, currently at `cefe4f2` on top of `v0.5`;
  `game-prototype` = open, sprite/game exploration. Only `master` deploys
  (workflow triggers on `master` push).
- **Padding spike (done, squash-merged):** `main` bottom padding `0 → 6rem`
  on desktop; landing fills viewport (`body.landing` flex column, `main`
  `display:grid` + `flex:1`, `.page-grid` stretched, `.main-col`
  `1fr/auto` hero row; `46vh` hero rule removed). Verified pixel-identical
  content, page == viewport at tall heights, no new overflow. Baselines +
  CDP helper live in `/tmp/opencode/` (`baseline/`, `shot.py`).
- **Branches synced:** after user approval, `dev` was force-pushed over
  `origin/dev`; the two old tablet commits (`1f120d1`, `7a20745`) are gone
  from the remote (recoverable via reflog until GC if ever needed).
- **Pages:** landing `index.html` (hero, featured cards, Store), `/projects/`
  (collection grid + filter sidebar), project articles (`_layouts/article.html`
  with meta rail), `debug.html` (design lab, never ships).
- **Collections/content:** `_projects/` (4 real: Tiny Moves, Waiter!,
  Chaos Daycare, Count Crumble); `_apps/` removed; blog removed from nav
  (no `_posts` yet — project writeups double as the writing outlet).
- **Theme system:** `assets/css/theme.css` (globals) + per-page
  `index.css` / `projects.css` + debug-only `lab.css`. Five accents
  (Yellow/Red/Green/Blue/Purple) cycled from the ticker, persisted +
  pre-painted; borders derive from accent. `game.js` owns wallet, ownership,
  store, visit awards. `filter.js` owns 3-state tech/status/source filters
  + sort. See `docs/` for design notes and the project template.
- **Tools (dev-only, build-excluded):** `tools/aseprite/` (LLM→Aseprite
  pipeline, proven pixel-perfect), `tools/sprite-studio/` (local Ollama app
  on :8571, engine = external `~/tools/aseprite-mcp` clone).

## Goals

1. **Project hub** — point people here for jobs/presence; content-first,
   game-dev personality, fast first paint.
2. **Writing outlet** — project articles carry Context/Did/Learned; standalone
   blog only when a lesson outgrows its project.
3. **Hobby infra** — hand-rolled, fun to hack on; finishing + publishing is
   the point. Game loop (coins → skins → sprites later) stays a bonus that
   never blocks content or slows loads.

## Direction

- **Now (tablet sprint, 768px):** graceful degradation. In-between sizes keep
  visual identity via fluid layout; structural moves happen only at
  breakpoints. Locked: nav externals icon+text on desktop, icon-only at
  ≤768px on all pages (inline SimpleIcons, zero new requests); projects
  filter above grid, pure-CSS collapsed single line (`Filter … expand \/`)
  expanding to desktop-identical menu (zero-JS rule stands); article rail
  below title + tighter rhythm; 6rem bottom padding desktop + tablet.
- **Acceptance (per page):** 768px full-page shot shows the listed change,
  no horizontal scroll, no overlap/clipping; 1440px re-shot hash-matches
  baseline except the approved nav region; zero new JS, no new requests,
  deferred scripts untouched.
- **Next:** publish pass to `master` (delete slots already done; strip lab
  via `exclude:` on the merge commit; favicon done; mobile floor; `_apps`
  gone) + custom-domain decision (CNAME vs github.io URL).
- **Later:** blog (first standalone post triggers it), sprites as gacha
  content, flyout store, SEO pass.

## Conventions (binding)

- Git: never sign (repo-local `commit.gpgsign=false` / `tag.gpgsign=false`;
  user signs). Unsigned commits only. Never push `master` without explicit
  approval. `dev` pushes are safe (no deploy). Keep branches listed above.
- Verify by building (`bundle exec jekyll build`) and headless screenshots
  (Brave), not by reasoning. Preview :4000, Studio :8571.
- User-authored content files (their writing/edits) stay uncommitted unless
  asked; never bundle them silently under agent messages.
- Performance budget: deferred scripts only, no render-blocking additions,
  no new network requests without discussion.
