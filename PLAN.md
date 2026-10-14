# PLAN — professordudley.github.io

Personal portfolio + game-dev hub for Sam Dicken (ProfessorDudley).
Static Jekyll 4 site, GitHub Pages via Actions (`master` only).

## Current state (dev @ `3714f53`, tags v0.2–v0.5)

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
- **Landing tiers are band-scoped with min-width bounds** (1950/1560/1380):
  bands ordered C→B→A so shared boundaries resolve upward; the 768/390
  rules and the projects grid must never match — scope under
  `body.landing`/`.main-col`, verify 768/390 shots on every change.
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

- **Now:** landing in-between tiers — DONE, merged, verified, awaiting user
  sign-off (see In-between section). Landing 1440 baseline refreshed.
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

## Polish — done (merged to `dev`, awaiting user sign-off)

- **Stream K — nav menu** (`9274f95`, 1 loop): zero strip side padding,
  button bottom border both states, no link separators, inline tally,
  externals keep UL top border, menu bottom border intact; 390 block only.
- **Stream L — article image** (`c57d949`, 1 loop): `.detail-thumb`
  `margin-bottom: 1em` desktop / `0.5rem` ≤768px — below-spacing now equals
  text at every width (measured 60/60 desktop, 20/20 phone).
- **Orchestrator verification:** merged K→L with rebuild + screenshots per
  merge. Final 1440px: projects sha256-identical, landing noise-only,
  article +18px by approval (baseline refreshed, hash matches stream
  output). 390px collapsed + expanded hold, no overflow. Zero new JS, no
  new requests. No escalation needed.
- **Follow-up (nav menu):** removed the doubled button bottom border;
  externals row centered with no container top border; tally margin
  `0.45em` → `0.9em`.

## In-between — done (merged to `dev`, awaiting user sign-off)

- **Stream M** (`b100089`, 2 loops): landing tiers A (≥1950: 3+invert,
  grow), B (1560–1950: 2@326 fixed, 906 main), C (1380–1560: 2@280, 754
  main cap); 3rd card hidden via landing-scoped `:nth-child(3)`; banded
  queries with min-width bounds (768/390 untouched); `index.css` only.
- **Orchestrator verification:** measured independently at
  2000/1950/1600/1440/1380 (cards 342/329/326/280/280, sides ≥326, counts
  3/2/2+invert, no overflow). Merged; landing 1440 is the approved new look
  (baseline refreshed); projects/article 1440 identical; 768/390/360
  unchanged. Zero new JS, no new requests. No escalation needed.
- Below 1380 deliberately unchanged (user inspects the 1100–1380 band later).

- Git: never sign (repo-local `commit.gpgsign=false` / `tag.gpgsign=false`;
  user signs). Unsigned commits only. Never push `master` without explicit
  approval. `dev` pushes are safe (no deploy). Keep branches listed above.
- Verify by building (`bundle exec jekyll build`) and headless screenshots
  (Brave), not by reasoning. Preview :4000, Studio :8571.
- User-authored content files (their writing/edits) stay uncommitted unless
  asked; never bundle them silently under agent messages.
- Performance budget: deferred scripts only, no render-blocking additions,
  no new network requests without discussion.
