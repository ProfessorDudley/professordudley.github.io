# PLAN — professordudley.github.io

Personal portfolio + game-dev hub for Sam Dicken (ProfessorDudley).
Static Jekyll 4 site, GitHub Pages via Actions (`master` only).

## Current state (dev @ `6eb22fb`, tags v0.2–v0.5)

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

- **Now (landing card-bleed + hero room, 768px):** ACTIVE — two landing-only
  fixes (see Landing fixes task board). Desktop must not move (`baseline2/`).
- **Acceptance (per page):** 768px full-page shot shows the listed change,
  no horizontal scroll, no overlap/clipping; 1440px re-shot hash-matches
  baseline except the approved nav region; zero new JS, no new requests,
  deferred scripts untouched.
- **Next:** publish pass to `master` (delete slots already done; strip lab
  via `exclude:` on the merge commit; favicon done; mobile floor; `_apps`
  gone) + custom-domain decision (CNAME vs github.io URL).
- **Later:** blog (first standalone post triggers it), sprites as gacha
  content, flyout store, SEO pass.

## Tablet sprint — done (768px, merged to `dev`, awaiting user sign-off)

- **Stream A — landing + nav icons** (`b7b416a`, 2 loops): inline SimpleIcons
  in `header.html` (labels kept); `theme.css` nav block (desktop icon+text,
  ≤768px icon-only all pages; strut fix holds desktop below-nav identical);
  `index.css` tablet block (store hidden, single column, clamped hero).
- **Stream B — projects** (`47e72e0`, 1 loop): pure-CSS checkbox collapse
  (`Filter … expand \/` → desktop-identical menu, live filtering works);
  footer bottom-left; `projects.html` +2, `projects.css` +59, `filter.js`
  untouched.
- **Stream C — article + global** (`2ec5811`, 1 loop): rail below title via
  `order:-1`, tightened rhythm, 6rem bottom padding in tablet query;
  `theme.css` +16, `article.html` untouched.
- **Orchestrator verification:** merged A→B→C with rebuild + screenshots per
  merge. Final 1440px below-nav vs baselines: projects 0, article 0, landing
  renderer-noise only (≤0.0002, single-channel ≤4/255); page heights match
  baselines exactly. 768px: all acceptance items hold, no overflow/overlap.
  Zero new JS, no new requests. No stream needed escalation (all ≤2 loops).

## Tablet refinements — done (merged to `dev`, awaiting user sign-off)

- **Stream D — landing** (`505c0cb`, 1 loop): 6rem sides restored
  (`2rem 6rem 4rem`), 2×2 cards, hero padding/gap, footer left; `index.css`
  768 block only.
- **Stream E — projects** (`1789057`, 1 loop): two-across grid, full-width
  expanded menu (`align-self:stretch`), SVG chevron toggles (rotated `.chev`,
  down/up pure-CSS swap), bar title `Filter`; filtering re-proven via CDP.
- **Orchestrator verification:** merged D→E with rebuild + screenshots per
  merge. Final 1440px vs `baseline2/`: projects sha256-identical, landing
  renderer-noise only (≤0.00095, worst pixel 20/255 in empty gutter —
  invisible; D's CSS is a single ≤768px block, provably inert at 1440).
  768px: all eight items (D1–D4, E1–E4) hold on merged shots, no
  overflow/overlap. Zero new JS, no new requests. No escalation needed.

## Landing fixes — task board (active, orchestrator + 1 stream)

Source of truth for Stream F. 1440 baselines: `/tmp/opencode/baseline2/`.
Helper: `/tmp/opencode/shot.py`. Diagnosis (orchestrator): Stream A added
`.card img { width:100%; margin-left:0; margin-right:0; }` to the landing
768px block (`assets/css/index.css:129`), killing the desktop full-bleed
(`width:calc(100% + 3rem); margin:-1.5rem -1.5rem 1rem` in `theme.css`).
Projects page never got that override, hence the discrepancy.

- **Stream F — landing fixes** (`sprint/tablet-f-landing`, worktree
  `/tmp/opencode/sprint-f`, serve :4011, owns `assets/css/index.css` ONLY):
  - F1: remove the `.card img` 768px override so landing cards inherit the
    desktop full-bleed (images span full card width, matching projects).
    Percent-based math works in the fluid 2×2 grid — prove no overflow.
  - F2: double hero top/bottom padding at ≤768px (`1.5rem 0 2rem` →
    `3rem 0 4rem`). Scope is tablet-only: desktop hero spacing comes from
    grid centering and must not change.
  - Acceptance: 768px shot shows full-bleed card images + roomier hero;
    1440px sha256-identical to `baseline2/landing-1440.png`; no overflow.
- Status F (Stream F: update ONLY this line): launched.
- **Shared rules:** `@media (max-width: 768px)` only; zero JS; no new
  requests; unsigned commits; never `master`; max 3 loops then STOP and
  report BLOCKED. Do NOT merge/push — orchestrator merges.

- Git: never sign (repo-local `commit.gpgsign=false` / `tag.gpgsign=false`;
  user signs). Unsigned commits only. Never push `master` without explicit
  approval. `dev` pushes are safe (no deploy). Keep branches listed above.
- Verify by building (`bundle exec jekyll build`) and headless screenshots
  (Brave), not by reasoning. Preview :4000, Studio :8571.
- User-authored content files (their writing/edits) stay uncommitted unless
  asked; never bundle them silently under agent messages.
- Performance budget: deferred scripts only, no render-blocking additions,
  no new network requests without discussion.
