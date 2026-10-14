# PLAN — professordudley.github.io

Personal portfolio + game-dev hub for Sam Dicken (ProfessorDudley).
Static Jekyll 4 site, GitHub Pages via Actions (`master` only).

## Current state (dev @ `f05ef4c`, tags v0.2–v0.5)

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

- **Now (tablet refinements, 768px):** ACTIVE — polish the 768px layouts
  (see Tablet refinements task board). Desktop must not move this round
  (fresh 1440 baselines in `/tmp/opencode/baseline2/`).
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

## Tablet refinements — task board (active, orchestrator + 2 streams)

Source of truth for Streams D and E — read this section before starting.
1440 baselines: `/tmp/opencode/baseline2/` (desktop must stay identical).
Screenshot helper: `/tmp/opencode/shot.py` (CDP full-page:
`shot.py URL OUTFILE [--width W --height H --port DBGPORT]`).
Compare: `compare -metric RMSE` / `sha256sum` (ImageMagick available).

- **Orchestrator (lead agent):** validates each stream (build + 1440/768
  shots vs `baseline2/`); merges D→E with rebuild + screenshots per merge;
  writes the final state update for user sign-off. Loop budget: max 3 fix
  loops per stream, then escalate to the user.
- **Stream D — landing refinements** (`sprint/tablet-d-landing`, worktree
  `/tmp/opencode/sprint-d`, serve :4011, owns `assets/css/index.css` ONLY):
  - D1: restore 6rem side padding on landing `main` at ≤768px (Stream A set
    `1.5rem 1.25rem 3rem`; bring sides back to 6rem, keep sane top/bottom).
  - D2: landing card grid 2×2 at ≤768px (3 featured cards + closer; replace
    the single-column rule; cards may shrink below 326px — fluid columns).
  - D3: breathing room around the hero (gap/padding above/below within the
    768px block).
  - D4: landing footer (`.col-footer`) left-aligned at ≤768px (landing scope
    only — do not touch the global rule in `theme.css`).
  - Acceptance: 768px shot shows D1–D4; 1440px sha256-identical to
    `baseline2/landing-1440.png`; no horizontal overflow, no overlap.
- Status D (Stream D: update ONLY this line): launched.
- **Stream E — projects refinements** (`sprint/tablet-e-projects`, worktree
  `/tmp/opencode/sprint-e`, serve :4012, owns `projects.html` +
  `assets/css/projects.css` ONLY):
  - E1: project card grid two-across at ≤768px (override the fixed 326px
    tracks within the tablet query; fluid `minmax(0,1fr)` columns).
  - E2: expanded `#filter-menu` spans the container width (aligns with the
    filter bar and the grid; currently narrower).
  - E3: replace the `expand \/` / `collapse /\` text toggles with inline SVG
    chevrons in the same style as the existing `.chev` (down when collapsed,
    up when expanded; pure-CSS swap, no JS). Inline SVG only.
  - E4: filter bar title `Filter …` → `Filter` (drop the ellipsis).
  - Acceptance: 768px collapsed + expanded shots show E1–E4; filtering still
    works after the markup change (CDP click-test a filter button, cite
    count/card change); 1440px sha256-identical to
    `baseline2/projects-1440.png` (bar/SVG hidden on desktop → inert);
    no overflow.
- Status E (Stream E: update ONLY this line): done 1 loop — E1 two-across fluid grid, E2 menu align-self:stretch (561px = bar width), E3 inline SVG .chev down/up pure-CSS swap, E4 title `Filter`; 1440 sha256-identical to baseline2, 768 no overflow (753/753), filter click Godot 4→2 cards; commit pending.
- **Shared stream rules:** scoped `@media (max-width: 768px)` queries only,
  existing queries untouched; zero new JS (no `.js` files); no new runtime
  requests; unsigned commits; never touch `master`; draft files in `/tmp`
  never the repo; each stream edits ONLY its own Status line in this file;
  max 3 build-verify-fix loops then STOP and report BLOCKED with evidence.
  Do NOT merge or push stream branches — orchestrator merges.

- Git: never sign (repo-local `commit.gpgsign=false` / `tag.gpgsign=false`;
  user signs). Unsigned commits only. Never push `master` without explicit
  approval. `dev` pushes are safe (no deploy). Keep branches listed above.
- Verify by building (`bundle exec jekyll build`) and headless screenshots
  (Brave), not by reasoning. Preview :4000, Studio :8571.
- User-authored content files (their writing/edits) stay uncommitted unless
  asked; never bundle them silently under agent messages.
- Performance budget: deferred scripts only, no render-blocking additions,
  no new network requests without discussion.
