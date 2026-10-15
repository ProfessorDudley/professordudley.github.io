# PLAN — professordudley.github.io

Personal portfolio + game-dev hub for Sam Dicken (ProfessorDudley).
Static Jekyll 4 site, GitHub Pages via Actions (`master` only).

## Current state (dev @ `2f1d626`, tags v0.2–v0.5)

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
  bbox; investigate only if diffs are structural. Reference captures lived
  in `/tmp/opencode/baseline3/` — lost when /tmp was cleaned (Oct 2026);
  re-shoot the 1440 set before the next visual comparison.
- **Nav icons carry a strut fix** (`.soc` margin-block compensation) so the
  1.3em glyphs don't grow the desktop nav bar. Touching nav icon sizing
  requires re-verifying desktop below-nav pixels.
- **Phone 390px overrides must match landing selector specificity.**
  Bare `main` loses to the 768px `body.landing main` rule — landing-scoped
  overrides need the qualified selector (caused an 8px overflow at 360).
- **Landing tiers are band-scoped with min-width bounds** (1950/1560/1380
  with tier D down to 1100): bands ordered D→C→B→A so shared boundaries
  resolve upward, and every later block must re-assert every property the
  earlier block sets (leaks bitten at 1950 and the old 1440 C→D boundary,
  now 1380 after the border rework). The 768/390 rules
  and the projects grid must never match — scope under
  `body.landing`/`.main-col`, verify 768/390 shots on every change.
- **`rem` is 16px-based, not 18px.** `6rem` = 96px, `1.5rem` = 24px
  (`--fs: 18px` applies to `body` font-size only). Floor sums that assumed
  27px card gaps were 3px/gap pessimistic — all tier thresholds still hold
  with room to spare.
- **Screenshot tooling** (`shot.py` full-page via Brave CDP, `sweep4000.py`
  per-width computed-style sweep, `storemin.py` min/max content probe) lived
  in `/tmp/opencode/` — wiped with /tmp (Oct 2026), rewrite from scratch
  when visual verification is next needed; regenerable, not precious.

## Goals

1. **Project hub** — point people here for jobs/presence; content-first,
   game-dev personality, fast first paint.
2. **Writing outlet** — project articles carry Context/Did/Learned; standalone
   blog only when a lesson outgrows its project.
3. **Hobby infra** — hand-rolled, fun to hack on; finishing + publishing is
   the point. Game loop (coins → skins → sprites later) stays a bonus that
   never blocks content or slows loads.

## Direction

- **Now:** landing tier rework — DONE, merged, verified, awaiting user
  sign-off incl. the C→D border rework (1380 border, 6rem padding
  restored, side floor 300) — see Tier rework section + open decision.
  Landing 1440 baseline refreshed.
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

## Tier rework — done (merged to `dev`, awaiting user sign-off)

- **Stream N** (`d261e84`, 2 loops): tiers A (≥1950: main 1319 fixed, 3×326
  + 260 closer, side grows), B (1560–1950: 2×326, invert 200–260, side
  grows), C (1440–1560: 2×280–326, invert 200–260), D (1100–1440: 1 card +
  closer, 4rem page gap overriding the 1100 stack); landing-scoped
  `:nth-child` hiding (2nd+3rd in D, 3rd in B/C); `index.css` only.

- **Orchestrator verification:** measured independently at
  1950/1560/1440/1100 (cards 326/326/281/280, closers 260/231/201/200,
  sides ≥326, counts 3/2/2/1+invert, no overflow) + 768/390/360 unchanged.
  Merged; landing 1440 is the approved new look (baseline refreshed);
  projects/article 1440 identical. Zero new JS, no new requests.
  Boundary-leak pattern re-appeared twice (D→C at 1440): later blocks must
  re-assert every property the earlier block sets. No escalation needed.
- Below 1100: stack rule untouched (unique case, later).
- **Follow-up (tier B):** `auto` main track hogged leftover (108px dead
  space after the closer at 1700) while side sat at 326. Reworked to
  `fit-content(966px) minmax(326px, 1fr)` + uncapped closer fr — side now
  grows (331–631 across the band), cards stay 326. Measured, no overflow.
- **Follow-up (band-D hero):** name wrapped at 1100–1440 (main-col 504–613
  too narrow for 112px). Measured 5.73px/px → clamp + nowrap, one line at
  1100/1200/1300/1440, verified no overflow. Also found+fixed the real 1100
  1px overflow: band D never set main padding (my 390-block fix didn't
  cover it) — added qualified `body.landing main { padding: 2rem 2rem 6rem }`.
- **Follow-up (band-D hero II):** bumped bigger —
  `clamp(5.25rem, 0.6rem + 6.9vw, 7rem)` (85.5/92.4/99.3/109px): one line,
  text inside box, no page overflow at 1100/1200/1300/1440. (Note: h1 rect
  always equals main-col width — measure text via scrollWidth, not rect.)
- **Follow-up (C→D border rework)** (`3743723`): user rejected band D's 2rem padding
  and the 1440 transition. Store min-content measured 291px (1fr probe),
  so the old 326 side floor was a planning choice, not a minimum. New
  bands: D (1100–1380) and C (1380–1560) both use base 6rem padding,
  4rem page gap, side floor 300 (291 + 9 buffer); D main =
  `fit-content(610px)` (326+260+24 — bare auto hogs the leftover again,
  same lesson as B) so the side grows 300→498 while cards hold 326/260.
  C floor 1379 = 15+192+64+300+808, so 1380 fits 2×280+200 with margin.
  Hero override now spans D+C (`clamp(5rem, 1.5rem + 5.6vw, 7rem)`,
  continuous into the 112px base at 1560). B re-asserts `column-gap:
  6rem` — C sets 4rem and both bands match at exactly 1560 (would have
  overflowed by 3px). 1300 was impossible (needs 1376+ even with 4rem
  main padding + no gap); 1380 is the true floor with 300 side.
  Verified: 1100/1180/1300/1379/1380/1440/1500/1560/1700/1950 table +
  hero one-line + no overflow all pass; projects/article 1440
  identical; 768/390/360 unchanged. Landing 1440 baseline refreshed.
  **Open decision (user):** keep side floor 300 or restore 326 — the
  latter means raising the C→D border 1380→1410 (one number in the side
  floor sum + C floor sum, then re-sweep).
- **Floor sums must subtract the scrollbar:** body = viewport − ~15px.
  Media queries match the full width (min-1100 true at exactly 1100) but
  content must fit the smaller body — that's what bit band D.

- Git: never sign (repo-local `commit.gpgsign=false` / `tag.gpgsign=false`;
  user signs). Unsigned commits only. Never push `master` without explicit
  approval. `dev` pushes are safe (no deploy). Keep branches listed above.
- Verify by building (`bundle exec jekyll build`) and headless screenshots
  (Brave), not by reasoning. Preview :4000, Studio :8571.
- User-authored content files (their writing/edits) stay uncommitted unless
  asked; never bundle them silently under agent messages.
- Performance budget: deferred scripts only, no render-blocking additions,
  no new network requests without discussion.
