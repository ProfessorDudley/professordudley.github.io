# PLAN — professordudley.github.io

Personal portfolio + game-dev hub for Sam Dicken (ProfessorDudley).
Static Jekyll 4 site, GitHub Pages via Actions (`master` only).

## Current state (dev @ `4379228`, tags v0.2–v0.5)

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
- **Phone 390px overrides must match landing selector specificity.**
  Bare `main` loses to the 768px `body.landing main` rule — landing-scoped
  overrides need the qualified selector (caused an 8px overflow at 360).
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

- **Now:** nav menu polish (390px) + article image spacing (all sizes) —
  ACTIVE (see Polish task board). Desktop moves ONLY for the article image
  (explicitly approved); nav work is ≤390px-scoped.
- **Next:** publish pass to `master` (strip lab via `exclude:` on the merge
  commit; favicon done; mobile floor; `_apps` gone) + custom-domain decision
  (CNAME vs github.io URL). Note `_config.yml` already points at
  `https://samdicken.me`.
- **Later:** blog (first standalone post triggers it), sprites as gacha
  content, flyout store, SEO pass.

## Phone sprint — done (390px, merged to `dev`, awaiting user sign-off)

- **Stream H — global** (`7c6c26b`, 1 loop): `main` sides 6rem→2rem at ≤390px;
  hamburger/X menu button (checkbox toggle, zero JS), vertical internals +
  right-aligned externals when expanded; `header.html` + `theme.css`.
- **Stream I — landing** (`5c4246e`, 1 loop): hero `2rem 0 3rem`, single fluid
  column, 480px cards, 240px invert; `index.css` 390 block.
- **Stream J — projects** (`7c431fa`, 1 loop): single fluid column, 480px
  floor; filter toggle + buttons re-proven via CDP; `projects.css` only.
- **Orchestrator verification:** merged H→I→J with rebuild + screenshots per
  merge. Final 1440px vs `baseline3/`: projects + article sha256-identical,
  landing noise-only. 390px: all items hold on merged shots. 360px:
  sw==cw on all pages, zero overflow.
- **Cross-stream fix (orchestrator):** H's bare-`main` 390 rule lost to the
  768px `body.landing main` rule by specificity, leaving landing at 6rem
  sides (8px overflow at 360). Fixed with a qualified
  `body.landing main { padding: 2rem 2rem 4rem; }` in the 390 block.

## Polish — task board (active, orchestrator + 2 streams)

Source of truth for Streams K and L. 1440 baselines: `/tmp/opencode/baseline3/`
(note: Stream L changes article desktop pixels by approval — refresh the
article 1440 baseline after merging L). Helper: `/tmp/opencode/shot.py`.

- **Orchestrator:** validates each stream (build + 1440/390 shots);
  merges K→L with rebuild + screenshots per merge; refreshes the article
  1440 baseline post-merge; final state update for sign-off. Max 3 loops
  per stream, then escalate.
- **Stream K — nav menu polish** (`sprint/polish-k-nav`, worktree
  `/tmp/opencode/sprint-k`, serve :4011, owns the nav 390px block in
  `assets/css/theme.css` ONLY — no markup, no other regions):
  - K1: `header .demo-nav.strip` left/right padding → 0 at ≤390px.
  - K2: `.nav-menu-btn` keeps a bottom border in both states at ≤390px
    (separates button row from the opened panel).
  - K3: remove the top borders between the stacked internal nav links
    (the `li + li` separators H added) at ≤390px.
  - K4: tally marker (`a::after`) back to inline-with-text at ≤390px
    (override the absolute corner-dock from the desktop strip rules).
  - K5: remove the left borders between external icon links at ≤390px.
  - K6: KEEP the top border on the externals `ul` container.
  - K7: KEEP the expanded menu's bottom border (verify visible in shots).
  - Acceptance: 390px collapsed (button row, no wrap) + expanded shots
    show K1–K7; 1440px identical to `baseline3/` (projects/article sha256,
    landing noise-only); no overflow either state.
- Status K (Stream K: update ONLY this line): done — K1–K7 in 390 block, 1440 projects/article sha256-identical, landing noise-only (RMSE 0.10), 390 shots verified, no overflow; commit on `sprint/polish-k-nav`, unmerged.
- **Stream L — article image spacing** (`sprint/polish-l-article`, worktree
  `/tmp/opencode/sprint-l`, serve :4012, owns the `.detail-thumb` rules in
  `assets/css/theme.css` ONLY — base rule + Stream C's 768px block; no other
  regions, no markup):
  - Background: `.detail` is a grid (gap 1.25rem desktop / 0.75rem ≤768px)
    and text children carry bottom margins (UA 1em desktop / 0.5rem ≤768px),
    but `.detail-thumb` has none — so image below-spacing trails text
    spacing at every width.
  - L1: base `.detail-thumb` gets `margin-bottom: 1em` (matches desktop text
    bottom margins; grid gap adds equally to both, so totals equalize).
    APPROVED desktop-visible change.
  - L2: in the 768px block, `.detail-thumb` gets `margin-bottom: 0.5rem`
    (matches the 768px text bottom margins from Stream C).
  - Acceptance: article 390px + 1440px shots show image below-spacing equal
    to text below-spacing; other pages' 1440px unchanged (selector matches
    article images only — prove via projects/landing hashes); no overflow.
- Status L (Stream L: update ONLY this line): launched.
- **Shared rules:** zero JS (no `.js` files); no new requests; unsigned
  commits; never `master`; drafts in `/tmp`; each stream edits ONLY its own
  Status line; max 3 loops then STOP and report BLOCKED. Do NOT merge/push.

- Git: never sign (repo-local `commit.gpgsign=false` / `tag.gpgsign=false`;
  user signs). Unsigned commits only. Never push `master` without explicit
  approval. `dev` pushes are safe (no deploy). Keep branches listed above.
- Verify by building (`bundle exec jekyll build`) and headless screenshots
  (Brave), not by reasoning. Preview :4000, Studio :8571.
- User-authored content files (their writing/edits) stay uncommitted unless
  asked; never bundle them silently under agent messages.
- Performance budget: deferred scripts only, no render-blocking additions,
  no new network requests without discussion.
