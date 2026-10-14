# PLAN — professordudley.github.io

Personal portfolio + game-dev hub for Sam Dicken (ProfessorDudley).
Static Jekyll 4 site, GitHub Pages via Actions (`master` only).

## Current state (dev @ `4caa99d`, tags v0.2–v0.5)

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

- **Now:** phone sprint at 390px (see Phone sprint task board). Desktop must
  not move (fresh 1440 baselines in `/tmp/opencode/baseline3/`; 390
  before-shots in `/tmp/opencode/before390/`).
- **Next:** publish pass to `master` (strip lab via `exclude:` on the merge
  commit; favicon done; mobile floor; `_apps` gone) + custom-domain decision
  (CNAME vs github.io URL). Note `_config.yml` already points at
  `https://samdicken.me`.
- **Later:** blog (first standalone post triggers it), sprites as gacha
  content, flyout store, SEO pass.

## Phone sprint — task board (active, orchestrator + 3 streams)

Source of truth for Streams H, I, J — read this section before starting.
Target width 390px (iPhone logical); 360px is verification-only for overflow.
1440 baselines: `/tmp/opencode/baseline3/` (desktop must stay identical).
390 before-shots: `/tmp/opencode/before390/` (shows current breakage: nav
wraps to two rows, 2×2 cards crush content at 390).
Screenshot helper: `/tmp/opencode/shot.py`
(`shot.py URL OUTFILE [--width W --height H --port DBGPORT]`).
Compare: `compare -metric RMSE` / `sha256sum`.

- **Orchestrator (lead agent):** validates each stream (build + 1440/390
  shots vs references, plus 360px overflow check on merged `dev`);
  merges H→I→J with rebuild + screenshots per merge; writes the final state
  update for user sign-off. Loop budget: max 3 fix loops per stream, then
  escalate to the user.
- **Stream H — global structure** (`sprint/phone-h-nav`, worktree
  `/tmp/opencode/sprint-h`, serve :4011, owns `_includes/header.html` +
  `assets/css/theme.css` global regions ONLY — nav block, `main` padding;
  stay out of the article 768px block):
  - H1: `main` side padding 6rem → 2rem at ≤390px (all pages).
  - H2: nav collapses to a single menu button at ≤390px (inline SVG
    hamburger icon, currentColor, no new requests). Pure-CSS checkbox toggle
    (zero-JS rule, same pattern as the filter bar): unchecked shows button
    only; checked reveals the menu panel with internal nav links first in a
    vertical stack, then a horizontal row of the external icon links
    right-aligned. Button icon swaps hamburger→X when expanded (pure-CSS,
    same swap pattern as the filter chevrons). Desktop: button + checkbox
    `display:none`, link lists render exactly as today (inert markup).
  - Acceptance: 390px shots (all pages) show one-row nav with menu button;
    expanded menu matches the specified layout; 1440px identical to
    `baseline3/` (projects/article sha256; landing RMSE-noise-only);
    no overflow collapsed or expanded.
- Status H (Stream H: update ONLY this line): done — H1+H2 shipped, verified (390 collapsed/expanded + 1440 identical), ready to merge.
- **Stream I — landing phone** (`sprint/phone-i-landing`, worktree
  `/tmp/opencode/sprint-i`, serve :4012, owns `assets/css/index.css` ONLY):
  - I1: hero padding → `2rem 0 3rem` at ≤390px.
  - I2: landing card grid single column at ≤390px (fluid
    `minmax(0,1fr)`, not fixed 326px — content is ~326px wide at 390 and
    card borders would overflow).
  - I3: cards keep 480px min-height at ≤390px (override the 768
    `min-height:0` back to desktop `min-height:480px`).
  - I4: invert (archive-closer) card half height at ≤390px
    (`min-height:~240px`; min-height so copy never clips).
  - Acceptance: 390px landing shows I1–I4, no clipped card content, no
    overflow; 1440px identical to `baseline3/landing-1440.png` (noise-only).
- Status I (Stream I: update ONLY this line): done — 390 block in index.css (hero 2rem 0 3rem, fluid 1fr grid, 480px cards, 240px invert); 1440 zero-px-diff vs baseline3, 390 single-column no-clip; shot /tmp/i-landing-390.png + /tmp/i-landing-1440.png.
- **Stream J — projects phone** (`sprint/phone-j-projects`, worktree
  `/tmp/opencode/sprint-j`, serve :4013, owns `assets/css/projects.css`
  ONLY — `projects.html` and `filter.js` untouched):
  - J1: card grid single fluid column at ≤390px (explicit viewport query;
    do not rely on container queries — 326px fixed tracks overflow the
    ~326px content width once borders count).
  - J2: cards keep 480px min-height at ≤390px (verify the desktop rule
    survives; re-assert in the query if anything overrides it).
  - Acceptance: 390px projects shows single column, full card content, no
    overflow; filter bar + expanded menu still work (CDP toggle test);
    1440px sha256-identical to `baseline3/projects-1440.png`.
- Status J (Stream J: update ONLY this line): launched.
- **Shared stream rules:** `@media (max-width: 390px)` queries go AFTER the
  768px blocks (cascade); existing queries untouched; zero new JS (no `.js`
  files); no new runtime requests (inline SVG only); unsigned commits; never
  touch `master`; draft files in `/tmp` never the repo; each stream edits
  ONLY its own Status line in this file; max 3 build-verify-fix loops then
  STOP and report BLOCKED with evidence. Do NOT merge or push stream
  branches — orchestrator merges.

- Git: never sign (repo-local `commit.gpgsign=false` / `tag.gpgsign=false`;
  user signs). Unsigned commits only. Never push `master` without explicit
  approval. `dev` pushes are safe (no deploy). Keep branches listed above.
- Verify by building (`bundle exec jekyll build`) and headless screenshots
  (Brave), not by reasoning. Preview :4000, Studio :8571.
- User-authored content files (their writing/edits) stay uncommitted unless
  asked; never bundle them silently under agent messages.
- Performance budget: deferred scripts only, no render-blocking additions,
  no new network requests without discussion.
