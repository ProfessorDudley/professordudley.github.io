# Game exploration

Goal: make something small, finish it, and have it playable on the site.
Proof of craft first — site chrome later.

## Constraints (agreed so far)

- Playable in the browser, static hosting (GitHub Pages). No backend.
- Tiny scope: one mechanic, one session loop, shippable in days not months.
- Must give the landing page something real: a still, a clip, or an embed.
- Terminal-flavoured presentation is on the table and fits CLI interests.

## Candidate directions

1. **Terminal gacha** — the idea from DESIGN_IDEAS.md. A gacha-like roll
   that runs in a terminal window. Low art burden, high personality.
   Could later roll real projects on the site itself.
2. **Tiny arcade toy** — one-screen canvas game (dodge/collect/survive).
   60–100 lines of JS. Proves real-time chops, embeds anywhere.
3. **CLI game first** — build the game logic for the terminal (Node or
   shell), then wrap the same logic for the web. Two artifacts, one design.

## Open questions

- Which direction?
- Godot (itch build + web export) or hand-rolled JS?
- What is the smallest version that still feels like a game?
