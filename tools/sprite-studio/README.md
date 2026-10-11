# Sprite Studio

Local prompt-to-sprite app. Ollama paints rows, aseprite-mcp renders them
in real Aseprite. Stdlib-only server; no ties to the rest of the repo.

## Run

```sh
python3 server.py [port]   # default http://127.0.0.1:8571/
```

Needs Ollama on `localhost:11434` and the engine below on first paint.

## Engine: aseprite-mcp (external, `~/tools/aseprite-mcp`)

Cloned from https://github.com/diivi/aseprite-mcp — lives OUTSIDE this
repo on purpose. Reinstall notes:

```sh
cd ~/tools/aseprite-mcp
python3 -m venv .venv
.venv/bin/pip install httpx "mcp[cli]>=1.6.0,<2" "pillow>=10.0.0"
```

- `mcp<2` is load-bearing: v2 renamed `FastMCP` and the server won't
  import. If paint hangs with no error, check this first.
- `ASEPRITE_PATH` env points at the AppImage (defaults are set in
  `server.py:engine()` if unset).
- `server.py` launches it over MCP stdio with `-u` (unbuffered);
  without `-u`, responses buffer forever and every call times out.

## Endpoints

- `GET /api/models`, `GET /api/templates`
- `POST /api/generate` {model, prompt, size, frames, template} →
  validated `{data, warnings}` (10% fill gate, 3 auto-retries).
- `POST /api/paint` {data, name} → real `.aseprite` + 8x preview PNG
  (+ GIF for 2-frame) in `studio_out/`, served back under `/artifacts/`.
