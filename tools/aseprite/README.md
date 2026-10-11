# LLM → Aseprite pipeline (test)

You describe a sprite in plain text. The model produces pixel data.
Aseprite turns it into a real `.ase` + `.png`. No hand-placed pixels
by the human until cleanup.

## The loop

1. Describe what you want (size, palette, subject, frames).
2. Model writes/extends `make_sprite.py` and runs it. This emits:
   - `<name>.lua` — self-contained paint script (DATA + paint + save).
   - `<name>.json` — the same data as JSON (audit trail).
   - `<name>_preview.png|.gif` — PIL render of the exact data.
     Aseprite is not installed on the dev machine, so the preview is
     the stand-in. If the preview looks wrong, the data is wrong.
3. Human runs the real step (needs Aseprite installed):

   ```sh
   cd tools/aseprite
   aseprite -b -script-param out=./out --script hero.lua
   ```

   Produces `out/hero.ase` + `out/hero.gif`. NOTE: `-script-param`
   is single-dash; `--script-param` is silently ignored (param falls
   back to `.`).
4. Open the `.ase`, clean it up by hand. It stays your art.

## Verified 2026-10-11

`hero.lua` (16x16 pink-haired character, 2-frame vertical bob) ran
through Aseprite 1.3.18.1 headless: 2 frames out, **0 mismatched
pixels** against the data on both frames. `out/` holds the real
artifacts. Idle timing via `frame.duration` (0.35s, pcall-guarded).

## Data contract (what the model must emit)

- `w`, `h` in pixels (start tiny: 16x16, max 32x32 for tests).
- `palette`: single-letter keys → hex RGB, no `#`.
- Single frame: `rows` = `h` strings of exactly `w` chars.
- Animation: `frames` = list of `rows` blocks, same dimensions.
  Row-major from top-left, `.` = transparent, every row same
  length (generator asserts this). Cheap idle: `rows[1:]` shift-up.

## Why embedded data, not file reads

`io.open`/`os.execute` trigger a permission prompt in the Aseprite GUI.
Embedding the table in the script avoids the question entirely, and the
script stays reviewable: you can read what it will paint before running it.
