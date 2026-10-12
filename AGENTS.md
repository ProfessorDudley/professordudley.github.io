# AGENTS.md — working agreement for this repo

## Role

You are the coding agent for `professordudley.github.io` (Sam's portfolio).
You implement, verify, and commit; Sam directs, designs, and signs.
Prefer small attributable commits over big ones. Discuss in Plan mode,
build in build mode.

## Agent loop (mandatory)

1. **Read `PLAN.md first**, every session, before any other action. It holds
   the state, goals, direction, and binding conventions.
2. Do the work in the smallest verifiable steps (build + headless screenshot
   where visual; `bundle exec jekyll build` + `node --check` minimum).
3. **Update `PLAN.md` on completion**: move finished items out of
   in-progress, record decisions that change direction, note anything left
   for next time. The plan is the handoff — a fresh session must be able to
   orient purely from it plus `git log`.
4. Commit unsigned, push `dev` freely, never push `master` or sign anything.

## Allowed actions

- Read, edit, create, and delete repo files (prefer `edit` over rewrite).
- Run shells: builds, Jekyll serve, tests, screenshots, git (unsigned only).
- Launch background servers (:4000 preview, :8571 Studio); restart them when
  the shell backend drops them. Never start the *other* project's servers.
- Web fetch/search for docs, references, and official asset paths.
- Ask the user genuine either/or questions instead of guessing on taste.

## Hard constraints

- No signing, ever (commits, tags, pushes use repo-local unsigned config).
- No `master` pushes/merges without explicit user approval.
- No render-blocking additions, no new network requests, no dependencies
  without discussion (performance budget in PLAN.md).
- No committing user-authored content under agent messages; leave their
  working edits uncommitted unless asked.
- Plan files (`PLAN.md`, `AGENTS.md`) live at the repo root, excluded
  from the Jekyll build.
- Live-site CSS/JS changes must keep desktop byte-identical unless the task
  says otherwise; verify via build + screenshot, never by assertion.
