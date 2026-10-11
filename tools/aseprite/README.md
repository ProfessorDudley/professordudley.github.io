# LLM → Aseprite pipeline (test)

You describe a sprite in plain text. The model produces pixel data.
Aseprite turns it into a real `.ase` + `.png`. No hand-placed pixels
by the human until cleanup.

## The loop

1. Describe what you want (size, palette, subject).
2. Model writes/extends `make_sprite.py` and runs it. This emits:
   - `<name>.lua` — self-contained paint script (DATA + paint + save).
   - `<name>.json` — the same data as JSON (audit trail).
   - `<name>_preview.png` — PIL render of the exact data, 8x nearest.
     Aseprite is not installed on the dev machine, so the preview is
     the stand-in. If the preview looks wrong, the data is wrong.
3. Human runs the real step (needs Aseprite installed):

   ```sh
   cd tools/aseprite
   aseprite -b --script coin.lua --script-param out=./out
   ```

   Produces `out/coin.ase` + `out/coin.png`.
4. Open the `.ase`, clean it up by hand. It stays your art.

## Data contract (what the model must emit)

- `w`, `h` in pixels (start tiny: 16x16, max 32x32 for tests).
- `palette`: single-letter keys → hex RGB, no `#`.
- `rows`: `h` strings of exactly `w` chars, row-major from top-left.
  `.` = transparent. Every row same length (generator asserts this).

## Why embedded data, not file reads

`io.open`/`os.execute` trigger a permission prompt in the Aseprite GUI.
Embedding the table in the script avoids the question entirely, and the
script stays reviewable: you can read what it will paint before running it.
