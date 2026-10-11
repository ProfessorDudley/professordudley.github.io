---
title: "Tiny Moves"
summary: "A short causal game about not falling from a great hight."
tech: ["Godot", "GDScript"]
thumbnail: "https://img.itch.zone/aW1nLzE5NTg4NjUzLnBuZw==/347x500/IVOitw.png"
thumbnail_alt: "Tiny Moves game screenshot"
status: "finished"
date: 2025-08-27
links:
  itch: "https://professordudley.itch.io/tiny-moves"
  github: "https://github.com/ProfessorDudley/tinyjam"
---

## Context

Built for a weekend game jam organised with friends, on the theme "Tiny".
Two days, Friday afternoon to Sunday afternoon, then everyone played and
reviewed each other's entries.

## What I did

Settled on a balance-beam idea: tiny adjustments to keep from falling. The
player controller is a physics hamster-ball — an invisible collision sphere
driven by torque with the character model riding inside — tuned until the
wobble felt right. Levels use a stock asset pack for the starting field, and
the tightrope itself is a ladder side that reads as a thin line from the
camera. A spawner extends the rope ahead of the player, so the run is
effectively endless. Difficulty comes from sideways shove forces rather than
trickier geometry — more on-theme, and faster to build.

## What I learned

Feel first, then content: the whole game stands or falls on the torque
tuning. And constraints compound — one verb (balance), one endlessly
repeating level piece, one score number (distance) was exactly the right
scope for 48 hours.
