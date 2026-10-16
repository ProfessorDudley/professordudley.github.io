# Project file template

Copy this into `_projects/<slug>.md` (lowercase, hyphens, no spaces).
Everything except `title` degrades gracefully when missing.

```markdown
---
title: "Project Title"          # required
summary: "One or two lines. Used on cards AND the detail page — write once."
tech: ["Godot", "GDScript"]     # list, renders as chips
thumbnail: "https://..."        # 16:9 ideally; omit and the card shows text-only
thumbnail_alt: "What the image shows"
status: "finished"              # finished | ongoing | shelved
date: 2026-01-15                # first release / jam date
writeup: true                   # false = no article page generated, card hides its "Read" button (game still links to itch)
links:
  itch: "https://professordudley.itch.io/<game>"
  github: "https://github.com/ProfessorDudley/<repo>"
  demo: "/apps/<demo>/"         # only if playable on this site
---

## Context

What it is, who it was for, constraints (jam? weekend? client?).

## What I did

Your role, the decisions, the tech. Concretely.

## What I learned

One honest paragraph. This is the seed of a future blog post.
```

## Tier guide

- **Tier 1 (card-ready):** frontmatter down to `links`. Enough to list it.
- **Tier 2 (detail-ready):** the three sections above. Write incrementally.
- Projects with empty bodies render an "writeup incoming" state — see
  `_layouts/article.html`. Thin is fine; missing is not.
