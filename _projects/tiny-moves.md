---
title: "Tiny Moves"
summary: "A 48-hour Godot jam game about tightrope walking. Physics-based controller, endless procedurally spawned rope."
tech: ["Godot", "GDScript"]
thumbnail: "https://placehold.co/1280x720/111111/e8a33d?text=Tiny+Moves"
thumbnail_alt: "Tiny Moves placeholder art"
status: "finished"
date: 2025-08-27
links:
  itch: "https://professordudley.itch.io/"
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
