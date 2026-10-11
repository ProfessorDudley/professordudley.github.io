#!/usr/bin/env python3
"""Sprite Studio -- prompt box in front of Ollama, preview + Aseprite out.

Self-contained: stdlib only, no dependency on the rest of the repo.
Run:  python3 server.py [port]   (default 8571)
Then open http://127.0.0.1:8571/

Flow: prompt -> Ollama (JSON pixel data, validated) -> canvas preview
      -> download .lua/.png, or one click to render via Aseprite headless.
"""
import http.server
import json
import os
import re
import sys
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
OLLAMA = "http://localhost:11434"
ASEPRITE_MCP = os.environ.get(
    "ASEPRITE_MCP_DIR", os.path.expanduser("~/tools/aseprite-mcp"))
OUT = os.path.join(HERE, "studio_out")
os.makedirs(OUT, exist_ok=True)

_engine = None


def engine():
    """Lazily launch aseprite-mcp (its cwd confines all sprite files to OUT)."""
    global _engine
    if _engine is None:
        from mcp_client import Engine
        py = os.path.join(ASEPRITE_MCP, ".venv", "bin", "python")
        if not os.path.exists(py):
            py = sys.executable
        env = dict(os.environ)
        if "ASEPRITE_PATH" not in env:
            env["ASEPRITE_PATH"] = "/home/samdicken/.local/bin/Aseprite_1.3.18.1-x64.AppImage"
        env["PYTHONPATH"] = ASEPRITE_MCP + (os.pathsep + env["PYTHONPATH"] if env.get("PYTHONPATH") else "")
        _engine = Engine([py, "-u", "-m", "aseprite_mcp"], cwd=OUT, env=env)
    return _engine

HOUSE_PALETTE = {
    "K": "171214", "H": "F06BA7", "h": "A93A6E", "S": "F2C9A0",
    "s": "C98F66", "E": "241A20", "J": "2A2A33", "A": "EBA93F",
    "B": "8A5A1E", "P": "F7E3B8", "D": "5C3D12",
}

SYSTEM = (
    "You are a pixel-art sprite designer. Output ONLY a JSON object, no other text.\n"
    "Schema: {\"rows\": [\"....\", ...]} for one frame, or "
    "{\"frames\": [[\"....\"], [\"....\"]]} for animation. "
    "rows is an array of PLAIN STRINGS, never objects. Emit NO palette key.\n"
    "Use EXACTLY these letters, nothing else: "
    "K=dark outline, H=pink, h=dark pink shade, S=skin, s=skin shadow, "
    "E=dark eyes, J=dark clothes, A=amber, W=white, B=brown. "
    "Transparent pixels are '.' (dot), never 0 or space.\n"
    "Canvas is exactly WxH: every row string is exactly W characters. "
    "FILL THE CANVAS: at least 20% of all pixels must be letters, "
    "spanning at least two thirds of the rows AND two thirds of the columns. "
    "A single row of pixels or a tiny mark is a failure. "
    "Design for readability at tiny size: big clear K silhouette first, "
    "then fill, then 1-2 detail colours.\n"
    "Example 8x8 slime: {\"rows\": [\"..KKKK..\", \".KAAAKA.\", "
    "\"KAKEKEKA\", \"KAAAAAAA\", \"KAKEKEKA\", \".KAAAAA.\", "
    "\"..KKKK..\", \"........\"]}\n"
    "For 2-frame idle: frame 2 is frame 1 shifted up 1 pixel (classic bob)."
)


def extract_json(text):
    """First balanced {...} object in the text (tolerates chatter around it)."""
    start = text.find("{")
    while start != -1:
        depth, instr, esc = 0, False, False
        for i in range(start, len(text)):
            c = text[i]
            if instr:
                if esc:
                    esc = False
                elif c == "\\":
                    esc = True
                elif c == '"':
                    instr = False
            elif c == '"':
                instr = True
            elif c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    try:
                        return json.loads(text[start:i + 1])
                    except ValueError:
                        break
        start = text.find("{", start + 1)
    raise ValueError("no valid JSON object in model output")


def as_rows(block):
    """Accept a list of strings or a list of {'row_content'|'row'|'pixels': str}."""
    out = []
    for item in block or []:
        if isinstance(item, str):
            out.append(item)
        elif isinstance(item, dict):
            for key in ("row_content", "row", "pixels", "content"):
                if isinstance(item.get(key), str):
                    out.append(item[key])
                    break
    return out


def validate(data, size, frames):
    """Coerce model output to the contract. Returns (clean, warnings)."""
    warn = []
    pal = {k: v for k, v in data.get("palette", {}).items()
           if re.fullmatch(r"[A-Za-z]", k or "") and re.fullmatch(r"[0-9a-fA-F]{6}", v or "")}
    if not pal:
        pal = dict(HOUSE_PALETTE)
        warn.append("no usable palette in output, used house palette")
    blocks = data.get("frames") if frames == 2 else [data.get("rows")]
    if not blocks or any(not b for b in blocks):
        return None, ["no pixel rows in model output"]
    blocks = [as_rows(b) for b in blocks]
    if any(not b for b in blocks):
        return None, ["rows came back as objects without usable strings"]
    if frames == 1:
        blocks = blocks[:1]
    clean_blocks = []
    for b in blocks[:max(frames, 1)]:
        rows = []
        for r in b[:size]:
            r = "".join("." if c in "0 " else c for c in str(r))
            r = "".join(c if (c == "." or c in pal) else "." for c in r)[:size]
            rows.append(r.ljust(size, "."))
        while len(rows) < size:
            rows.append("." * size)
        clean_blocks.append(rows)
    while len(clean_blocks) < max(frames, 1):
        clean_blocks.append(["." * size] * size)
        warn.append("missing frame padded blank")
    clean = {"w": size, "h": size, "palette": pal}
    if frames == 2:
        clean["frames"] = clean_blocks
    else:
        clean["rows"] = clean_blocks[0]
    filled = sum(c != "." for b in clean_blocks for r in b for c in r)
    if filled / (size * size * len(clean_blocks)) < 0.10:
        try:
            with open(os.path.join(OUT, "last_sparse.txt"), "w") as f:
                f.write(json.dumps(clean, indent=1)[:20000])
        except OSError:
            pass
        return None, ["sprite too sparse (under 10% fill), retry with more detail"]
    return clean, warn


def ollama(endpoint, payload):
    req = urllib.request.Request(
        OLLAMA + endpoint, data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=300) as r:
        return json.load(r)


def ollama_get(endpoint):
    with urllib.request.urlopen(OLLAMA + endpoint, timeout=30) as r:
        return json.load(r)


def load_templates():
    """Verified starting points from the aseprite pipeline (coin, hero)."""
    out = {}
    base = os.path.join(HERE, "..", "aseprite")
    for name in ("coin", "hero"):
        try:
            with open(os.path.join(base, name + ".json")) as f:
                d = json.load(f)
            rows = d.get("rows") or (d.get("frames") or [[]])[0]
            out[name] = {"w": d["w"], "h": d["h"],
                         "palette": d["palette"], "rows": rows}
        except (OSError, ValueError, KeyError, IndexError):
            continue
    return out


TEMPLATES = load_templates()


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=HERE, **kw)

    def _json(self, obj, code=200):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/api/models":
            try:
                d = ollama_get("/api/tags")
                models = [m["name"] for m in d.get("models", [])]
            except Exception as e:  # noqa: BLE001
                return self._json({"error": str(e)}, 502)
            return self._json({"models": models})
        if self.path == "/api/templates":
            return self._json({"templates": sorted(TEMPLATES),
                               "rows": {k: v["rows"] for k, v in TEMPLATES.items()},
                               "palettes": {k: v["palette"] for k, v in TEMPLATES.items()}})
        if self.path.startswith("/artifacts/"):
            self.path = "/studio_out/" + self.path[len("/artifacts/"):]
        return super().do_GET()

    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        try:
            req = json.loads(self.rfile.read(length) or b"{}")
        except ValueError:
            return self._json({"error": "bad JSON"}, 400)

        if self.path == "/api/generate":
            model = req.get("model", "llama3.2:3b")
            size = max(8, min(32, int(req.get("size", 16))))
            frames = 2 if int(req.get("frames", 1)) == 2 else 1
            shape = f'{size}x{size} {"2-frame idle" if frames == 2 else "single frame"}'
            base = f"Design this sprite at exactly {shape}: {req.get('prompt', '')}\n"
            tpl = TEMPLATES.get(req.get("template") or "")
            if tpl:
                base += ("Modify THESE rows and return the FULL modified rows "
                         "(same size, copy through what you don't change):\n"
                         + json.dumps(tpl["rows"]) + "\n"
                         + f"Available colours: {json.dumps(tpl['palette'])}\n")
            base += ("Emit \"frames\" (2 blocks)." if frames == 2 else "Emit \"rows\" (1 block).")
            last_err, raw = "no attempts", None
            for attempt in range(3):
                res = {}
                try:
                    res = ollama("/api/generate", {
                        "model": model, "system": SYSTEM,
                        "prompt": base + (f"\nPrevious attempt failed: {last_err}. Try harder to fill the canvas." if attempt else ""),
                        "format": "json", "stream": False,
                        "options": {"temperature": 0.5 + attempt * 0.15, "num_predict": 8000,
                                    "repeat_penalty": 1.25}})
                    raw = extract_json(res["response"])
                except Exception as e:  # noqa: BLE001
                    try:
                        with open(os.path.join(OUT, "last_raw.txt"), "w") as f:
                            f.write(res.get("response", "")[:20000])
                    except OSError:
                        pass
                    return self._json({"error": f"ollama: {e}"}, 502)
                clean, warn = validate(raw, size, frames)
                if clean is not None:
                    return self._json({"data": clean, "warnings": warn + ([f"after {attempt + 1} tries"] if attempt else [])})
                last_err = "; ".join(warn)
            return self._json({"error": last_err, "raw": raw}, 422)

        if self.path == "/api/paint":
            data = req.get("data")
            name = re.sub(r"[^a-z0-9_-]", "", (req.get("name") or "sprite").lower())[:32] or "sprite"
            nframes = 2 if isinstance(data, dict) and "frames" in data else 1
            size = int((data or {}).get("w", 16))
            clean, warn = validate(data or {}, size, nframes)
            if clean is None:
                return self._json({"error": "; ".join(warn)}, 422)
            try:
                eng = engine()
                ase = f"{name}.aseprite"
                eng.call("create_canvas", {"width": size, "height": size, "filename": ase})
                blocks = clean["frames"] if "frames" in clean else [clean["rows"]]
                if len(blocks) > 1:
                    eng.call("add_frames", {"filename": ase, "count": len(blocks) - 1,
                                            "duration_ms": 350})
                pal = clean["palette"]
                for fi, rows in enumerate(blocks, start=1):
                    px = [{"x": x, "y": y, "color": "#" + pal[k]}
                          for y, row in enumerate(rows)
                          for x, k in enumerate(row) if k != "."]
                    if px:
                        eng.call("draw_pixels_at", {
                            "filename": ase, "layer_name": "Layer 1",
                            "frame_index": fi, "pixels": px})
                log = [eng.call("export_frame", {
                    "filename": ase, "frame_index": 1,
                    "output_filename": f"{name}_preview.png", "scale": 8})]
                if "frames" in clean:
                    eng.call("set_tag", {"filename": ase, "name": "idle",
                                         "from_frame": 1, "to_frame": len(blocks)})
                    log.append(eng.call("export_tag", {
                        "filename": ase, "tag_name": "idle",
                        "output_filename": f"{name}.gif", "scale": 4}))
                    img = f"/artifacts/{name}.gif"
                else:
                    log.append(eng.call("export_sprite", {
                        "filename": ase, "output_filename": f"{name}.png",
                        "format": "png"}))
                    img = f"/artifacts/{name}.png"
            except Exception as e:  # noqa: BLE001
                return self._json({"error": str(e)}, 500)
            return self._json({
                "ase": f"/artifacts/{ase}", "img": img,
                "preview": f"/artifacts/{name}_preview.png",
                "log": log, "warnings": warn,
            })

        return self._json({"error": "unknown endpoint"}, 404)


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8571
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print(f"sprite-studio on http://127.0.0.1:{port}/")
    srv.serve_forever()
