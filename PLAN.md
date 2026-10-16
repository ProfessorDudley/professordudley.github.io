# PLAN — professordudley.github.io

Personal portfolio + game-dev hub for Sam Dicken (ProfessorDudley).
Static Jekyll 4 site, GitHub Pages via Actions (`master` only).

## Current state (dev @ `e0a80c9`, tags v0.2–v0.7)

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
- **Ticker blanking:** at ≤1100px, `.ticker .wallet` and `.ticker .theme-cycle` are hidden via `visibility: hidden` in `assets/css/theme.css` to preserve the ticker bar's height. This applies on all pages (global scope).
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

- **Now:** round-7 nav open/close consistency — DONE, merged, validated,
  awaiting user sign-off (see Round 7 section).
- **Next:** publish pass to `master` (strip lab via `exclude:` on the merge
  commit; favicon done; mobile floor; `_apps` gone) + custom-domain decision
  (CNAME vs github.io URL). Note `_config.yml` already points at
  `https://samdicken.me`.
- **Later:** blog (first standalone post triggers it), sprites as gacha
  content, flyout store, SEO pass.

## Round 8
- [x] ticker blanking (hide .wallet, .theme-cycle; keep .ticker bar)
- [ ] mobile floor / size overrides (align 390px/768px/1440px)



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

## Tablet rework (≤1100) — in progress (orchestrated)

Goal: ≤1100 matches the mobile (768/390) patterns by *moving* breakpoints,
not duplicating rules — one rule, one breakpoint, no tablet-vs-mobile
conflicts. Desktop >1100 stays byte-identical unless a scope answer says
otherwise.

- **Tooling rebuilt (Oct 2026):** `/tmp/opencode/shot.py` (full-page PNG +
  JSON metrics via Brave CDP :9333), `/tmp/opencode/sweep.py` (widths ×
  pages table). Brave flags for containers: `--no-sandbox
  --disable-dev-shm-usage --no-zygote --remote-allow-origins=*`. (Prior
  scripts were wiped with /tmp; these are rewrites, not recoveries.)
  Lesson: a fresh tab defaults to 780px wide — set
  `Emulation.setDeviceMetricsOverride` BEFORE navigate; `/json/close`
  returns non-JSON, tolerate it.
- **Reference set (pre-change):** `/tmp/opencode/tablet-rework/ref/`,
  15 shots: landing/projects/article × 1440/1100/900/768/390. Baseline
  sweep (bodyW/docSW/ovf/cards): landing 1440 [300,300,hidden,220] no-ovf;
  landing 1100 [293,hidden,hidden,213] no-ovf; landing 900
  [163,163,163,131] — the 3-across crush this rework fixes; projects
  1100/900 326-cards no-ovf; all widths no overflow. Spot-checked
  landing-900 + projects-1100 renders.
- **900px 3-across? No.** 3×280 + 2×24 gap = 888px needed; content is 693
  (6rem pad) or 757 (4rem pad) at body 885. 2×326+24 = 676 fits viewports
  ≥ ~819 with 4rem padding — hence 2-across + full-width invert.
- **Scope decisions (user, Oct 15):** Q1 padding 6rem→4rem applies ≤1100
  ONLY — desktop tiers untouched, no floor-math ripple. Q2 landing ≤1100
  hides the overflowing 3rd card (3-across proven unfit): 2 cards +
  full-width invert below. Q3 hero padding matches 768: `5rem 0 6rem`.
- **Stream PS — shared theme.css** (branch `sprint/tablet-shared`):
  main side padding per Q1; nav externals icon-only from 1100 down
  (restructure the 768 `soc-label` rule upward, single breakpoint);
  article meta rail to top ≤1100 (`order:-1` + 768 rhythm, moved not
  copied). `theme.css` only.
- **Stream Q — landing** (branch `sprint/tablet-landing`): ≤1100 hide
  store, single column, invert `grid-column: 1/-1` below cards, cards
  2-across `minmax(280px,326px)` (3rd card per Q2), col-footer visible at
  content bottom, hero padding per Q3. `index.css` only. Must win the
  exact-1100 boundary vs band D (stack-query precedent).
- **Stream R — projects** (branch `sprint/tablet-projects`): filter
  collapse block 768→1100 (breakpoint change, not a copy), reconcile with
  container queries by measurement, 390 single-col intact, 2-across fluid
  grid, footer bottom. `projects.css` only.
- **Stream contract:** read PLAN.md first; branch from `dev`; ≤3 agent
  loops, then stop + report; update PLAN.md on completion; unsigned
  commits; push branch + report SHA; never touch `master`; no new JS, no
  new requests; verify by build + screenshots/measurements, not reasoning.
- **Acceptance (orchestrator):** no overflow at
  1100/1000/900/820/768/390/360 all pages; filter toggle + nav toggle
  re-proven via CDP clicks; desktop 1440 identical (projects/article hash,
  landing noise-only); desktop below-nav pixels unchanged; merge order
  PS→Q→R with rebuild + sweep per merge. User signs off when done.
- **Stream PS report:** PASS with one known interaction (see PS-5). Branch
  `sprint/tablet-shared`, `theme.css` only (8+/9-): new ≤1100 `main`
  `2rem 4rem 6rem` rule; soc icon-only breakpoint 768→1100 (single rule,
  strut untouched); article 768 rhythm + `order:-1` moved into the ≤1100
  block (768 block left with `padding-bottom` only). 2 loops used.
  - PS-1 padding: 1440 = 96px all pages; 1100/1000/900/820 = 64px
    (projects/article; landing-768 keeps 96 via its own `index.css` rule —
    Stream Q's lane); 390/360 = 32px unchanged.
  - PS-2 desktop 1440 byte-identical: landing/projects/article sha256 match
    ref (landing diff-pixels 0 — better than noise-only bar). Strut fix
    untouched; below-nav pixels identical by hash.
  - PS-3 nav: labels 50.25px visible at 1440, 1px clipped icon-only at
    1100/1000/900/820/768; hamburger appears at 390 (button `flex`) and
    expands internals on click (none/false → flex/true).
  - PS-4 article: 1440 row/order-0; 1100→390 column/order-(-1) with 768
    rhythm; shots visually clean, rail on top below lede.
  - PS-5 KNOWN INTERACTION for orchestrator/R: projects-900 now overflows
    (docSW 941 > body 885; A/B tested pre 885/885 → post 941/885). Cause:
    wider content keeps the container-query grid at 2×326 in row layout
    while the rail squeezes to 177px (676+24+177=877 > 757). Pre-existing
    layout, exposed by Q1 padding — Stream R's ≤1100 filter collapse
    removes the rail at 900 and should resolve it; re-sweep after R.
    1000/1100/820/768/390/360 projects have no overflow.
  - PS-6 toggles: filter bar flex + menu none at 768; bar click expands
    (block/true); filter button press filters 4→2 cards. Zero new JS/requests.
  - PS-7 768/390 vs ref: all 390 identical; landing-768 diffs are
    capture noise only (breathe-animation/ticker — re-shoot moves the
    bbox, ps-vs-ps also differs); projects/article-768 height deltas are
    intended Q1/rhythm reflow.
- **Stream Q report:** done in 1 loop (`index.css` only, branch `sprint/tablet-landing`).
  New `(max-width:1100px) and (min-width:769px)` block placed after the tiers with
  `body.landing`-scoped selectors: single-column page-grid (gap 2rem, 768 pattern),
  store hidden, footer bottom-left, cards `repeat(2, minmax(280px,326px))`, 3rd card
  hidden, invert `grid-column:1/-1`, hero `5rem 0 6rem`. Old bare max-1100 stack
  query removed (superseded). Min-769 bound keeps 768/390 fully under their own
  rules. Band-D re-asserts: 2nd card re-shown (`display:flex`, 0,5,1 tie won by
  later order), tracks/columns/gap replaced — wins exact-1100. Measured: zero
  overflow at 1100/1000/900/820/768/390; cards 326/326/326/294.5/269(768 2×2
  intact)/311; invert full-width below (676/676/613); hero nowrap 85.6px one line
  at 1100; store `display:none`, footer visible. Landing 1440 pixel-identical to
  ref (rmse 0.000); 768/390 diffs are sub-pixel hero-AA noise in ~50px bboxes,
  verified non-structural via crops. Zero new JS, no new requests.
- **Stream R report:** DONE (1 loop, branch `sprint/tablet-projects`): one-line
  breakpoint change `@media (max-width: 768px)` → `(max-width: 1100px)` in
  `projects.css`; no copied block, no other selectors touched.
  - Overflow: zero at 1100/1000/900/820/768/390/360 (docSW==bodyW all widths).
  - Grid: 2-across fluid at 1100 (435px)/1000 (385)/900 (335)/820 (295)/768
    (269) — media fluid tracks beat container fixed tracks by source order;
    single fluid column at 390 (311)/360 (281) — 390 block still wins (later).
  - Toggle re-proven via CDP clicks at 900 + 1000: collapsed one-line bar
    (50px, menu `display:none`), click → menu `display:block` 410px tall with
    all 9 `.filter-btn`s, click → collapsed again. Orders bar −2/menu −1/
    main 0/footer 1; footer top sits below grid bottom (1332 vs 1308 @900).
  - Desktop intact: 1440 shot sha256-identical to ref (`ac48bbea…`);
    1200 keeps sidebar pattern (326px cards, no overflow); 390 shot
    sha256-identical to ref (`3241bb9d…`).
  - Note: measured with base 6rem main padding (Stream PS not in this branch);
    2-across holds with room at every width, so the 4rem change only adds
    margin. No JS touched, `.filter-btn`/`#filter-clear` nodes unmoved.
- **Orchestrator validation (Q+R merged as `0374a59` + `7dbf228`; R merge
  had a PLAN.md adjacent-anchor conflict, resolved keeping both reports):**
  rebuilt + extended sweep 1440/1200/1100/1000/900/820/768/390/360, zero
  overflow on all 3 pages. Landing tablet 2×326 + 676 invert (295/613 at
  820, in range); band D at 1200 untouched (326+260); projects 2-across
  fluid 435→269; article ≤1100 still rail-below (PS's job). 1440/768/390
  hash diffs vs ref localized EXACTLY to wallet coin widgets
  (`0`→`10` visit awards in the shared Brave profile — bbox + crop
  verified); article hashes identical. R's CDP toggle proof stands on
  byte-identical CSS. PS merged (fc614ca); final validation below.
- **Orchestrator final validation (all streams in):** rebuilt + 9-width ×
  3-page sweep, ZERO overflow everywhere — incl. projects-900 (885/885),
  confirming PS-5's predicted R-collapse fix on merged code. Padding 96
  @≥1200 → 64 @1100–820 (all pages) → 96 landing-only @768 → 32 @390/360.
  Landing 2×326 + 676 invert at 1100/1000/900/820; hero one line at 1100
  (screenshot); band D @1200 untouched. 6/6 behavioral probes pass
  (`/tmp/opencode/probe.py`): filter collapses (50px bar, menu none) +
  expands (block, 9 btns) at 900; nav labels 1px @1000 / 50px @1440;
  article rail order -1 with sideTop<detailTop @900, order 0 row @1440.
  Spot-checks: projects-900 (Filter bar + 2×2 + bottom footer + icon
  nav), article-900 (Details rail on top), landing-1100 (target look),
  article-768 (clean reflow, +26px benign from wider measure).
  1440/768/390 diffs vs ref are coin-widget-only (`0`→`10`
  shared-profile artifact, bbox+crop verified) except intended reflows
  (projects-768 collapse, article-768 +26px); article-1440/390
  hash-identical. Zero new JS, no new requests, unsigned commits, `dev`
  pushed. Awaiting user sign-off.

## Follow-up amendments — in progress (orchestrated)

Scope (user, Oct 15): landing padding aligned to 4rem (settles the
768-96px sign-off question); invert max-height ~300px; article rail same
width as the main article; NEW global card-grid policy — where cards
can't hold 280–326, force single column, 326 max, centered.

- **Single-col breakpoint math:** 2-col needs content ≥ 2×280+24 (gap) =
  584 → body ≥ 712 → viewport ≥ 727 (scrollbar 15 + 4rem pad 128). So the
  single-col range is 391–726 (the 390 block owns ≤390). 727–768 stays
  2-col; 769+ already fits (min content 626). Desktop bands verified
  no-squish (tier floors hold, projects container math fits). A shared
  bare `.card-grid` rule would lose on specificity (0,1,0 vs 0,2,0+), so
  the policy is implemented per-page, qualified, in `index.css` +
  `projects.css` — same pattern, no duplication of intent.
- **Assumptions (flagged for sign-off):** invert 300 cap applies to
  full-width-below contexts only (769–1100 + 391–726 single-col), NOT the
  727–768 2×2 cell (capping there would misalign the row); article rail
  capped at 44rem (`.detail` max-width) in the ≤1100 stacked layout only,
  desktop 326 rail untouched.
- **Stream T — landing** (branch `sprint/followup-landing`, `index.css`
  only): 768 padding 6rem→4rem (390's 2rem block later, untouched);
  invert `max-height: 300px` in full-width contexts, content must not
  clip (scrollHeight check + visual); single-col
  `minmax(0,326px)` + centered for 391–726, placed after the 768 block.
- **Stream U — projects + article** (branch
  `sprint/followup-projects-article`, `projects.css` + the one-line
  theme.css rail rule): projects single-col 391–726 (later than the
  1100-block, 390 intact); `.article-side { max-width: 44rem }` in the
  ≤1100 block.
- **Stream contract:** as tablet rework (PLAN first, branch from `dev`,
  ≤3 loops then stop+report, PLAN update, unsigned, push + SHA, no
  `master`, no new JS/requests, build + screenshots not reasoning).
- **Acceptance (orchestrator):** boundary sweep 727/726, 391/390, 768/769
  + standard 1440/1100/900/820/768/390/360: zero overflow; single
  326-centered col at 726/700/500 (x-centering measured); 2-col intact
  727+; invert H ≤300 with no clipped content; rail width == detail width
  ±2px at 900/768; filter toggle re-proven at 700; 1440 desktop
  identical (coin-noise aside); 390 intact.
- **Stream T report:** DONE (2 loops, branch `sprint/followup-landing`,
  `index.css` only): 768 `body.landing main` padding 6rem→4rem sides; new
  391–726 single-col block (`minmax(0,326px)` + centered, after the 768
  block); invert `max-height: 300px` in the 769–1100 tablet block and the
  new single-col range only — plus `min-height: 0` in the tablet block,
  required because base `.card { min-height: 480px }` (theme.css) beats
  max-height per spec and left the invert at 480 (found loop 1 at 900:
  h=480 with maxH=300 computed). 727–768 2×2 cell uncapped as specified.
  - Padding: 768 = 64px sides (was 96); 390/360 = 32px unchanged; 1440 = 96px.
  - Invert: h=159 @1100/1000/900/800, 186 @769, 213 @726/700/600/500,
    274 @391 — all ≤300 with scrollHeight==clientHeight (zero clipping);
    visually checked at 900 (2×326 + short full-width closer) and 500
    (single stack, short closer). 768/727 2×2 invert uncapped (410/426).
  - Single-col: 326-centered @726/700/600/500 (card center within 0.5px of
    content center), full-bleed 248 @391; 2-col intact @727 (280) / 750
    (291.5) / 768 (300.5) / 769+ (301→326). Boundary 726/727 and 768/769
    both clean; 390 block owns ≤390 (pad 32, fluid 311, invert 240).
  - Desktop: 1440 shot pixel-identical to ref (diff bbox None). 390 diff is
    AA shimmer in one 64×63 status-pill crop (verified non-structural).
  - Overflow: zero at 360/390/391/500/600/700/726/727/750/768/769/800/820/
    900/1000/1100/1440. `bundle exec jekyll build` clean. Zero JS, no new requests.
- **Stream U report:** DONE (1 loop, branch `sprint/followup-projects-article`):
  `projects.css` + one-line `theme.css` rail rule, as spec'd.
  - U-1 projects single-col 391–726: new
    `@media (max-width: 726px) and (min-width: 391px)` placed after the
    1100-block, `.projects-main .card-grid { grid-template-columns:
    minmax(0, 326px); justify-content: center; }`. Measured 726/700/500:
    1 col, 326px, x-centering off +0.5px (rounding); 391: 248px
    (minmax shrink, centered, off 0.0). 727 keeps 2×280; 769+ unchanged.
    390 block (later) still owns ≤390: 390 = 311 fluid 1fr, 360 = 281.
  - U-2 article rail: `.article-side` in the ≤1100 block gains
    `max-width: 44rem` (desktop 326 rail untouched). Measured rail ==
    detail width diff 0px at 900 (704/704) and 768 (625/625).
  - U-3 filter toggle re-proven via CDP click at 700: collapsed 50px bar /
    menu none → expanded block 410px with all 9 `.filter-btn`s →
    recollapsed. Checkbox-hack nodes unmoved, zero JS.
  - U-4 desktop/390 identity: article-1440 + article-390 sha256-identical
    to ref; projects-1440 + projects-390 differ ONLY in a 43×14 bbox at
    (17,10) — coin-widget visit awards (`10` vs `5`, shared-profile
    artifact, crop-verified). Zero overflow at
    1440/1100/900/820/769/768/727/726/700/500/391/390/360. No new
    JS/requests.
- **Orchestrator final validation (T+U merged as `d2734d2` + `3ca4b7f`;
  T merge needed the usual PLAN anchor splice, both reports kept):**
  rebuilt + 15-width × 3-page sweep, ZERO overflow everywhere, with exact
  handoffs — 727 = 2×280 both pages, 726 = single 326, 391 = 248
  shrink, 390 = phone rules; landing-768 now 64px sides with 2×301 cards
  (the old 269 squish gone via the padding alignment). 17/17 probes pass
  (`/tmp/opencode/probe2.py`): invert H 159–274 across 1100→391 with
  scrollHeight==clientHeight (zero clipping); single-col x-centering off
  0.0; rail == detail 704/704 @900 and 625/625 @768; filter toggle at
  700; hero one line @1100. Spot-check landing-500: single 326 stack,
  short invert, icon nav, footer bottom. 1440/390 diffs coin-only;
  article-1440/390 hash-identical; landing-768 −85px page height is
  intended wider-measure reflow. Zero new JS/requests, unsigned, `dev`
  pushed. Awaiting sign-off (incl. the 3-cards-in-single-col flag).

## Round 3 amendments — in progress (orchestrated)

Scope (user, Oct 15): projects cards capped 326-centered near ≤1100;
hamburger menu switches at ~768 (not ~390); externals always visible in
the bar, only internals collapse.

- **Stream V — projects cap** (branch `sprint/r3-projects-cap`,
  `projects.css` only): 1100-block grid `repeat(2, minmax(0,1fr))` →
  `repeat(2, minmax(280px,326px))` + `justify-content: center` (landing-Q
  pattern). Fit: 769 content 611 ≥ 584 min-sum; 727 exact-fit 584;
  820 has 1px slack (677 vs 676) — floors absorb it, no overflow. 726
  single-col rule (later) still wins below; container queries still lose
  by order; desktop >1100 untouched.
- **Stream W — nav menu** (branch `sprint/r3-nav-menu`, `theme.css` +
  one `header.html` aria attribute): SPLIT the 390 collapse block —
  phone-only stays (main padding, K1 zero strip, full-width button
  styling, hamburger swap), collapse mechanism moves to a new 768 block
  placed before the 390 block so 390 refines it. Behavior change:
  externals never collapse (collapsed-hiding selector narrows to
  `.tally.segs`; spacer stays to right-align icons); expanded panel is
  internals-only vertical dropdown; drop the `.segs.right` expanded
  rules; `flex-wrap` moves up to 768; `aria-controls` narrows to
  `nav-internal`. Desktop >768 byte-identical.
- **Stream contract:** as before (PLAN first, branch from `dev`, ≤3 loops
  then stop+report, PLAN update, unsigned, push + SHA, no `master`, no
  new JS/requests, build + screenshots not reasoning).
- **Acceptance (orchestrator):** projects cards ≤326.5px at
  1100/1000/900/820/768/727 with symmetric L/R grid margins ±2px; 2-col
  ≥727, single <727; filter toggle re-proven; hamburger visible +
  internals hidden + externals visible at 768/700/500/391; CDP clicks
  expand internals-only at 700 + 390 (externals unmoved); 769+/1440
  desktop identical incl. below-nav pixels; 390 keeps padding/strip
  behavior; zero overflow 360–1100.
- **Stream V report:** DONE (1 loop, branch `sprint/r3-projects-cap`,
  `projects.css` only): one-line change in the ≤1100 block —
  `.projects-main .card-grid` `repeat(2, minmax(0,1fr))` →
  `repeat(2, minmax(280px,326px))` + `justify-content: center` (landing-Q pattern).
  - V-1 card cap: 326.0px at 1100/1000/900/820, 300.5 at 768, 280.0 at 727 —
    all ≤326.5. 820 1px-slack case holds (677 content vs 676 need, no overflow).
  - V-2 symmetry: card-row insets within grid exact — 140.5/140.5 at 1100,
    40.5/40.5 at 900 (±0px).
  - V-3 columns: 2-col intact ≥727 (727 = 2×280 exact fit); single-col wins
    below via the later 726 rule (726/700/500 = 1×326, 391 = 248 shrink);
    390 block owns ≤390 (311 fluid); container queries untouched, still lose
    by source order; desktop >1100 untouched (1440/1200 = 2×326 container tracks).
  - V-4 toggle re-proven via CDP click at 900: collapsed 50px bar/menu none →
    expanded block with 9 `.filter-btn`s → recollapsed. Nodes unmoved, zero JS.
  - V-5 identity: 1440 shot sha256-identical to ref (`ac48bbea…`); 390 shot
    sha256-identical to ref (`3241bb9d…`). Zero overflow at
    1440/1200/1100/1000/900/820/768/727/726/700/500/391/390/360. Spot-checked
    900/1100 renders (2×326 centered, Filter bar, bottom footer). No new JS/requests.
- **Stream W report:** DONE (1 loop, branch `sprint/r3-nav-menu`):
  `theme.css` + one `header.html` aria attribute, as spec'd. New
  `@media (max-width: 768px)` collapse block before the 390 block;
  390 keeps main padding, K1 zero-strip, full-width button, swap, K4.
  - W-1 behavior: externals never collapse (hiding narrowed to
    `.tally.segs`, spacer stays); expanded panel internals-only
    full-width below the bar; `.segs.right` expanded rules deleted;
    `flex-wrap` moved to 768; K4 hoisted so the marker is inline at
    391–767 too; `aria-controls` narrowed to `nav-internal`. One
    judgment call beyond the letter of the spec: expanded tally gets
    `order: 5` so spacer+externals keep row 1 and the bar is
    pixel-unmoved between states (without it flex-wrap pushes
    externals to row 3 when expanded).
  - W-2 states: 768/700/500/391 btn flex 109px + tally none + ext grid
    in-bar (same y as btn); 390/360 btn full-width (375/345) + ext
    visible on wrapped row; 769 btn none + tally grid (desktop bar);
    1440 desktop bar intact.
  - W-3 clicks at 700 + 390: expand internals-only (tally flex 110px
    tall below the bar), externals pixel-identical (bar-crop diff is
    ONLY the 22×17 hamburger→X bbox); second click recollapses.
  - W-4 focus-visible: genuine keyboard Tab to toggle matches
    `:focus-visible`, button outline `2px solid` (programmatic focus
    does not match — headless modality, not a bug).
  - W-5 desktop: projects/article-1440 sha256-identical to ref;
    landing-1440 differs only in a 50×49 breathing-dot glow bbox
    (animation phase, crop-verified, below-nav pixels unchanged).
  - W-6 overflow: zero at 1100/1000/900/820/769/768/727/726/700/500/
    391/390/360 all pages collapsed, plus expanded menu at 700+390 on
    all 3 pages. 390 padding 32px / 768 landing 64px preserved.
  - Zero new JS/requests. No loops remaining needed.
- **Orchestrator final validation (V+W merged as `0c27339` + `803b03c`;
  W merge needed the usual PLAN anchor splice, both reports kept):**
  rebuilt + 13-width × 3-page sweep, ZERO overflow everywhere. Projects
  cards 326.0 at 1100/1000/900/820 (was 467/417/367), 301 @769/768,
  280 @727; single-col below intact. 8/8 nav probes pass
  (`/tmp/opencode/probe3.py`): desktop bar @769+/1440 (btn 0, tally
  grid); hamburger + hidden tally + in-bar externals @768/700/391;
  full-width button + wrapped externals @390; clicks at 700+390 expand
  internals-only with externals pixel-unmoved (extTop identical),
  no overflow while expanded, recollapse clean. Spot-check projects-700:
  target look. 1440 diffs coin-only; article-1440 SAME; 390 +50px page
  height on all pages is the intended second nav row (probe-measured).
  Zero new JS/requests, unsigned, `dev` pushed. Awaiting sign-off.

## Round 4 (navbar nits) — in progress (orchestrated)

Scope (user, Oct 15): (1) when internals are collapsed, the spacer's
left border is a stray tick — remove it in the collapsed state (note:
the 390 block already zeroes it always; the 391–768 collapsed bar still
shows it; scope the fix to collapsed-only so the expanded bar keeps its
divider); (2) at 390 the menu button goes full-width and pushes
externals to a second row — keep button + externals on one line
(button auto-width; ~109 + spacer + ~169px fits 375px).

- **Stream X** (branch `sprint/r4-nav-nits`, `theme.css` only).
- **Stream contract:** as before (PLAN first, branch from `dev`, ≤3 loops
  then stop+report, PLAN update, unsigned, push + SHA, no `master`, no
  new JS/requests, build + screenshots not reasoning).
- **Acceptance (orchestrator):** collapsed bar at 700/500/390 shows no
  spacer tick (crop-verified); button + externals share one row at 390
  (same top, measured); expanded bar keeps spacer divider +
  internals-only dropdown; toggle re-proven at 390; 769+/1440 identical;
  zero overflow incl. expanded menus.
- **Stream X report:** DONE (2 loops, branch `sprint/r4-nav-nits`,
  `theme.css` only): collapsed-scoped `.nav-toggle:not(:checked) ~ .spacer
  { border-left: 0; }` added in the 768 block (covers 391–768 + 390, spec
  (0,3,0) beats base (0,2,0)); 390's always-on `.spacer { border-left: 0 }`
  deleted (expanded bar keeps its divider everywhere now); 390
  `.nav-menu-btn` `width: 100%` → `auto` (one-line bar).
  - X-1 spacer tick: collapsed spacerBLW 0px at 700/500/390 all pages;
    expanded 2px (divider kept) at 700 + 390 all pages. Bar-crop diff
    pre/post at 700/500 is EXACTLY a 2px strip (x141–143, y37–91, the
    tick), page height identical; post crops visually clean.
  - X-2 one-row at 390: btn top 37 == ext top 37, btn 108.5px + spacer
    98px + ext 169px = 375 body; pre-shot had wrapped 2nd nav row
    (pageH 2597 → 2547, −50px). Post bar crop: Menu + 3 icons, one row.
  - X-3 toggle re-proven via CDP clicks at 390 + 700 on all 3 pages:
    expand → tally flex 110px below bar, externals pixel-unmoved
    (extTop identical), recollapse clean. Internals-only dropdown intact.
  - X-4 desktop: article-1440/769 sha256-identical to dev; landing +
    projects 1440/769 diffs are coin-widget (x17–59/y10–23, known
    shared-profile artifact) + breathing-dot glow only — zero nav-bar
    pixels. Below-nav unchanged.
  - X-5 overflow: zero at 360/390/500/700/768/900/1100 all pages
    collapsed (docSW==bodyW), plus expanded menus at 390/700 all pages.

## Round 5 (nav borders) — in progress (orchestrated)

User corrections (Oct 15, with screenshots): (1) icon-only bar cell
borders don't connect; (2) expanded menu panel border must span the
whole container like mobile; (3) keep desktop endcaps to every width
until mobile takes over.

- **Root causes (measured, not reasoned):** (a) `.demo-nav ul
  { align-items: center }` leaks into `.strip .segs` grid — `li`s don't
  stretch, so externals ticks span only 93% of row height (scan:
  internals ticks 100%, icon ticks/endcap 93% @1000). Hiding the labels
  shrank externals `li` content and exposed it. (b) Tally inset by the
  nav's own 32px padding (700-expanded tally [32..653] vs nav [0..685]);
  mobile spans full width only because K1 zeroes strip padding at 390.
  (c) Menu button is a `label`, not an `li` — the desktop first-cell
  endcap rule never applied to it, so the hamburger bar has no left
  endcap.
- **Stream Y** (branch `sprint/r5-nav-borders`, `theme.css` only):
  (1) `.strip .segs { align-items: stretch; }` — all cell ticks connect
  full row height, every mode; (2) `header
  .demo-nav:has(.nav-toggle:checked) { padding-left: 0; padding-right: 0;
  }` in the 768 block — expanded panel spans the container like mobile
  (`:has` precedent exists, line 195; K1 stays for 390-collapsed);
  (3) `.nav-menu-btn { border-left: var(--card-border-w) solid
  var(--border); }` in the 768 block — desktop endcap parity, collapsed
  and expanded. 769–1100 icon bar keeps desktop padding (parity per
  correction 3); no HTML changes.
- **Stream contract:** as before (≤3 loops, PLAN update, unsigned, push
  + SHA, build + screenshots).
- **Acceptance (orchestrator):** tick-continuity scan 100% at
  1000/700-collapsed/390-collapsed; expanded tally L/R == nav L/R at
  700 + 390 (container-span); endcap ticks at bar edges all hamburger
  states; 1440 below-nav may change ONLY in tick pixels (else fail);
  toggle re-proven; zero overflow incl. expanded.
- **Stream Y report:** DONE (1 loop, branch `sprint/r5-nav-borders`,
  `theme.css` only, +10/−2): the three spec'd rules, nothing else —
  `.strip .segs` gains `align-items: stretch`; 768 block gains
  `.nav-menu-btn { border-left: ... }` + `header
  .demo-nav:has(.nav-toggle:checked) { padding: 0 sides }`. K1, the 1100
  icon-only rule, strut fix, and checkbox nodes untouched
  (diff-verified). Pre/post refs + metrics: `/tmp/opencode/r5y-pre/`,
  `/tmp/opencode/r5y-post/` (probe scripts `probe5y.py`/`probe5y-b.py`).
  - Y-1 tick continuity: icon `li` ratios 0.926 → 1.000 at 1000,
    700-collapsed, and 390-collapsed (internals already 1.0); computed
    `align-items: center` → `stretch`; collapsed 700/390 padding stays
    32px/0px (desktop parity + K1 intact).
  - Y-2 container-span: 700-expanded tally [0..685] == nav [0..685]
    (was [32..653]); 768-expanded [0..753] == nav; 390-expanded
    unchanged [0..375]. Toggle re-proven via CDP clicks (expand +
    recollapse) at 700/768/390.
  - Y-3 endcaps: `btnBL` 0px → 2px collapsed AND expanded at 700/768/390;
    right-edge `li:last-child br` 2px intact; collapsed spacer tick still
    0px, expanded divider still 2px (bar crops visually clean).
  - Y-4 desktop: article-1440 sha256-identical pre/post; landing +
    projects 1440 diffs are coin-widget digits ONLY (`10`→`15` ticker +
    store wallet, known shared-profile artifact, crop-verified) — zero
    nav-band pixels (labels visible at 1440, already full-height); 769 =
    btn none + tally grid + 32px pad.
  - Y-5 overflow: zero at 360/390/500/700/768/900/1000/1100 all pages
    collapsed, plus expanded menus at 390/700. Zero new JS/requests.
  - Note: one self-caught editing mishap (dropped + restored the 768
    toggle/button rules mid-edit); final diff re-verified rule-identical
    before measuring.

## Queued (user, Oct 15 — schedule after round 5)

- **Orchestrator final validation (X merged as `33e13c4`, clean):**
  rebuilt + 10-width × 3-page sweep, ZERO overflow. Spacer 0px collapsed
  / 2px expanded @700 (measured on merged code); 8/8 nav probes pass
  (`probe3.py`) — incl. 390 one-line bar (btn 109px, ext same row) and
  unmoved externals through toggle cycles. 1440 diffs are the known
  coin-artifact signature only (identical totals); article SAME. 390-bar
  screenshot verified. Zero new JS/requests, unsigned, `dev` pushed.
- **Orchestrator final validation (Y merged as `b15b978`, clean):**
  rebuilt + 10-width × 3-page sweep, ZERO overflow. Tick scan @1000:
  all 7 dividers span 100% (was 93% on 4 icon ticks). Expanded tally ==
  nav rect exactly @700 ([0..685]) and @390 ([0..375]); button endcap
  2px. 8/8 nav probes pass on merged code. Desktop: nav band rows
  37–95 zero changed pixels outside coin boxes (the fix is nav-pixel
  clean); landing remainder is coin + 53px hero AA shimmer (known
  noise); article SAME. Zero new JS/requests, unsigned, `dev` pushed.
  Round-5 sign-off carried into round 6 below.

## Round 6 (nav side ticks) — in progress (orchestrated)

User corrections (Oct 15, with screenshots): (1) mobile (390) collapsed
bar reads as a bordered box — remove its left/right ticks; (2) tablet
expanded: remove the menu-row side ticks; (3) tablet collapsed endcaps
must REMAIN — so all removals are strictly scoped (expanded-only via
`:checked ~`, mobile-only via the 390 block), never touching collapsed
tablet or desktop.

- **Measured ground truth (current dev):** nav outer bl/br are 0
  everywhere (lines 44–52); the verticals are all cell-level — button
  `border-left` (round-5 endcap) + last-cell `border-right` (rule 346).
  390-collapsed bar = [btn|spacer|ext] with ticks at x=0 and x≈373;
  700-expanded = same row ticks (row-height only) + full-span tally-top
  and strip-bottom. So the fixes: 390 block gets unconditional
  `.nav-menu-btn { border-left: 0 }` +
  `.strip .segs.right li:last-child { border-right: 0 }`; 768 block gets
  `.nav-toggle:checked ~ .nav-menu-btn { border-left: 0 }` and
  `.nav-toggle:checked ~ .segs.right li:last-child { border-right: 0 }`
  (0,5,1 beats rule-346's 0,4,1; verified by computed style, not
  reasoning). Spacer divider, tally-top, strip-bottom, desktop ticks all
  untouched.
- **Stream Z** (branch `sprint/r6-nav-sides`, `theme.css` only).
- **Stream contract:** as before (≤3 loops, PLAN update, unsigned, push
  + SHA, build + screenshots).
- **Acceptance (orchestrator):** 390 collapsed+expanded: button bl 0 +
  lastcell br 0 (measured), bar crop shows no side ticks; 700/768
  expanded: same 0/0 with tally still container-span; 700/768
  collapsed UNCHANGED (bl/br 2px); 769+/1440 ticks intact incl.
  below-nav pixels; toggle re-proven; zero overflow incl. expanded.
- **Stream Z report:** DONE (executed directly in `wt-z` after the
  subagent died on rate limit before its first edit — same spec, same
  branch, 1 loop used). Four scoped rules only:
  - 768 block: `.nav-toggle:checked ~ .nav-menu-btn { border-left: 0 }`
    + `.nav-toggle:checked ~ .segs.right li:last-child { border-right: 0 }`
    (expanded-only; collapsed tablet keeps both endcaps).
  - 390 block (unconditional): `.nav-menu-btn { border-left: 0 }` +
    `.strip .segs.right li:last-child { border-right: 0 }` (mobile bar
    has no side ticks in either state).
  - Nothing structural; checkbox-hack, spacer rule, tally-top, strip
    bottom, desktop cells untouched.

  **Per-item (all measured on @4020, CDP):**
  - 390 collapsed+expanded: button bl 0px, last-cell br 0px; pixel
    scan of both bar edges = 0.0 border coverage (pre-state: 2.0).
  - 700/768 expanded: same 0/0; tally still container-span (700:
    [0..685]==nav; 768: [0..753]==nav).
  - 700/768 collapsed UNCHANGED: 2px endcaps both sides (pixel cov
    0.667/0.50 = exact 2px-solid-in-window; pre/post identical).
  - Desktop 1440/1100/769 × 3 pages: nav band rows (y 37–93) have
    ZERO changed pixels vs dev; only diffs are the known coin-widget
    digits (x 18–59) and article AA shimmer (28px) — both pre-existing
    shared-profile artifacts.
  - Toggle cycles ×2 at 700/768/390: expand/collapse clean, externals
    pixel-unmoved every cycle.
  - Zero overflow: sweep 360–1100 × 3 pages on :4020, every
    `docSW == bodyW`, including expanded menus.
  - `theme.css` +12/−0 (4 rules + comments); no HTML/JS/requests;
    unsigned. Branch pushed with this report.
- **Orchestrator final validation (Z merged as `b72d3bc`, clean merge):**
  rebuilt `dev`, re-ran the 6-state matrix on :4000 — all borders at
  expected widths (0 in the 4 removed states; 2px kept in
  700/768-collapsed, endcaps pixel-verified). Sweep 9 widths × 3 pages,
  ZERO overflow. Toggle cycles re-proven on merged code (externals
  pixel-unmoved). Desktop nav band (y 37–93) byte-identical across
  1440/1100/769 × 3 pages vs round-5 baseline (only known coin digits +
  AA shimmer outside it, as in rounds 4–5). Unsigned; `dev` pushed.

## Round 7 (nav open/close consistency) — done

User correction (Oct 15, 2 screenshots of the projects bar at ~768,
open vs closed): the navstrip must read the SAME in both states.

- **Measured deltas (dev `bfb9c56`, :4000 @700):** collapsed = 32px side
  padding → button ends at x=32 with a 2px left endcap, spacer 0px
  divider, last external right at x=653 with a 2px right endcap (64px of
  inset frame). Expanded = button at x=0 (0px, flush), spacer 2px divider
  (appears on open), last icon ends flush at x=685 (0px). So the two rows
  differ in: the 32px left/right shift, the two endcaps (closed only), and
  a divider tick that appears only when open (spacer, expanded).
- **Target (390-already-there):** one consistent, flush, frameless,
  unshifted row in BOTH states. The panel below keeps its own top +
  bottom borders as its frame (unchanged). Only the 768 block's bar-row
  rules change; 1100 icon-only, 390, desktop, and the expanded panel's
  own borders are untouched.
- **Changes (theme.css, 768 block, +7/-0):**
  1. `header .demo-nav:has(.nav-toggle:not(:checked)) { padding-left: 0; padding-right: 0; }`
     — closed row now also flush (was the 32px inset).
  2. `.nav-toggle:not(:checked) ~ .nav-menu-btn { border-left: 0; }`
     — closed button tick removed.
  3. `.nav-toggle:not(:checked) ~ .segs.right li:last-child { border-right: 0; }`
     — closed end cap removed.
  4. `.nav-toggle:checked ~ .spacer { border-left: 0; }`
     — open divider removed (spacer already 0px collapsed).
- **Scope note:** these flip the "collapsed keeps endcaps" line from round
  6 in favor of the user's explicit "consistent open/closed" instruction;
  round-6 is preserved by the 390 + expanded-only rules which the 4 rules
  above do not disturb. If the user wants the endcaps back when closed,
  the single lever is rule 1 (restore the 2×32px padding) — noted here.
- **Acceptance (orchestrator):** 700 & 768 — collapsed and expanded rows
  share: button x, elil right, and every border width (all 0) with ZERO
  delta; bar crop identical open vs closed except button icon X vs hamburger;
  tally still container-span; 1100/1440 desktop nav band byte-identical;
  390 untouched (row + panel identical to round 6); toggle re-proven; zero
  overflow incl. expanded; sweep 360–1100 × 3.
- **Status:** DONE (direct, 768 block only, +5/−0 lines beyond comments):
  - `header .demo-nav { padding-left: 0; padding-right: 0; }` (768 block,
    both states — supersedes the collapsed-keeps-2rem line).
  - `.nav-menu-btn { border-left: 0 }` and
    `.strip .segs.right li:last-child { border-right: 0 }` (768 block,
    both states — replaces the checked-only pair from round 6).
  - `.strip .spacer { border-left: 0 }` (768 block, both states — was the
    collapsed-only rule; now consistent, also drops 390's open-only
    stragglers).
- **Validation (wt-r7 @4021, CDP):** 700 & 768 — open and closed rows are
  pixel-identical outside the button glyph (row-diff max x = 37, all inside
  the 0–143 button cell). 390 open/closed also consistent; external-icon
  dividers intact (2px); panel spans container at all three widths. Desktop
  1440/1100/1000/769 × 3 pages: nav-band (y37-93) byte-identical to round-5
  baseline (0 changed px). Zero overflow all pages 360–1100. Only
  whole-page deltas are the known coin-widget digits + AA shimmer.
- **Orchestrator final validation (r7 merged as `f662c5a`, clean merge):**
  rebuilt `dev`; 700/768/390 open+closed border/geometry all at expected
  widths (flush, 0px endcaps/divider both states); row-diff confined to the
  button glyph (max x 37) at 700 & 768; desktop nav band (y37-93)
  byte-identical across 1440/1100/1000/769 × 3 pages; canonical sweep
  8 widths × 3 pages `ovf no`. Unsigned; `dev` pushed.
  Awaiting sign-off; 
