// Sprite Studio frontend. No dependencies.
const $ = (id) => document.getElementById(id);
let current = null;   // validated {w,h,palette,rows|frames}
let currentLua = "";
let timer = null;

function hexRGB(hx) {
  return [parseInt(hx.slice(0, 2), 16), parseInt(hx.slice(2, 4), 16), parseInt(hx.slice(4, 6), 16)];
}

function blocks() {
  if (!current) return [];
  return current.frames || [current.rows];
}

function drawFrame(rows, scale) {
  const c = $("preview");
  c.width = current.w * scale;
  c.height = current.h * scale;
  const g = c.getContext("2d");
  g.clearRect(0, 0, c.width, c.height);
  const pal = current.palette;
  rows.forEach((row, y) => {
    [...row].forEach((k, x) => {
      if (k === ".") return;
      const [r, gg, b] = hexRGB(pal[k]);
      g.fillStyle = `rgb(${r},${gg},${b})`;
      g.fillRect(x * scale, y * scale, scale, scale);
    });
  });
}

function preview() {
  clearInterval(timer);
  const bs = blocks();
  if (!bs.length) return;
  const scale = Math.max(4, Math.floor(256 / current.w));
  let i = 0;
  drawFrame(bs[0], scale);
  if (bs.length > 1) {
    timer = setInterval(() => { i = (i + 1) % bs.length; drawFrame(bs[i], scale); }, 350);
  }
}

function log(msg, cls) {
  const el = $("log");
  el.innerHTML = `<span class="${cls || ""}">${msg}</span>`;
}

function luaFor(data, name) {
  // Mirrors server build_lua; the server copy is authoritative for paint.
  const pal = Object.entries(data.palette).map(([k, v]) => `  ${k} = "${v}",`).join("\n");
  const head = `-- sprite-studio export: ${name}\nlocal W, H = ${data.w}, ${data.h}\nlocal PALETTE = {\n${pal}\n}\n`;
  const paint = `
local function hexrgb(h)
  return tonumber(h:sub(1, 2), 16), tonumber(h:sub(3, 4), 16), tonumber(h:sub(5, 6), 16)
end
local function outpath(ext) return (app.params["out"] or ".") .. "/${name}." .. ext end
local function paint(img, rows)
  for y = 0, H - 1 do
    local row = rows[y + 1]
    for x = 0, W - 1 do
      local key = row:sub(x + 1, x + 1)
      if key ~= "." then
        local r, g, b = hexrgb(PALETTE[key])
        img:drawPixel(x, y, app.pixelColor.rgba(r, g, b, 255))
      end
    end
  end
end
local sprite = Sprite(W, H)
`;
  if (data.frames) {
    const fr = data.frames.map((rows) =>
      "  {\n" + rows.map((r) => `    "${r}",`).join("\n") + "\n  },").join("\n");
    return head + `local FRAMES = {\n${fr}\n}\n` + paint +
      `for i = 2, #FRAMES do sprite:newFrame() end
for f, rows in ipairs(FRAMES) do paint(sprite:newCel(sprite.layers[1], f).image, rows) end
pcall(function() for _, fr in ipairs(sprite.frames) do fr.duration = 0.35 end end)
app.refresh()
sprite:saveCopyAs(outpath("ase"))
sprite:saveCopyAs(outpath("gif"))
print("saved " .. outpath("ase") .. " + " .. outpath("gif"))
`;
  }
  const rows = data.rows.map((r) => `  "${r}",`).join("\n");
  return head + `local ROWS = {\n${rows}\n}\n` + paint +
    `paint(sprite:newCel(sprite.layers[1], 1).image, ROWS)
app.refresh()
sprite:saveCopyAs(outpath("ase"))
sprite:saveCopyAs(outpath("png"))
print("saved " .. outpath("ase") .. " + " .. outpath("png"))
`;
}

function download(name, text, type) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

async function api(path, body) {
  const r = await fetch(path, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || r.statusText);
  return d;
}

$("go").onclick = async () => {
  const btn = $("go");
  btn.disabled = true;
  log("Asking Ollama…");
  try {
    const d = await api("/api/generate", {
      model: $("model").value,
      prompt: $("prompt").value,
      size: Number($("size").value),
      frames: Number($("frames").value),
      template: $("template").value,
    });
    current = d.data;
    const n = blocks().length;
    preview();
    currentLua = luaFor(current, $("name").value || "sprite");
    const w = (d.warnings || []).map((x) => `<span class="warn">note: ${x}</span>`).join("<br>");
    log(`${current.w}x${current.h}, ${n} frame(s), ${Object.keys(current.palette).length} colours.<br>${w || "clean"}`);
    for (const id of ["dl-lua", "dl-png", "paint"]) $(id).disabled = false;
    $("result").innerHTML = "";
  } catch (e) { log("error: " + e.message, "err"); }
  btn.disabled = false;
};

$("dl-lua").onclick = () =>
  download(($("name").value || "sprite") + ".lua", currentLua, "text/plain");

$("dl-png").onclick = () =>
  $("preview").toBlob((b) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(b);
    a.download = ($("name").value || "sprite") + ".png";
    a.click();
    URL.revokeObjectURL(a.href);
  });

$("paint").onclick = async () => {
  log("Rendering in Aseprite…");
  try {
    const d = await api("/api/paint", { data: current, name: $("name").value });
    $("result").innerHTML =
      `<p>Saved <code>${d.ase}</code> + <code>${d.img}</code></p>` +
      (d.img.endsWith(".gif") || d.img.endsWith(".png")
        ? `<img src="${d.img}" style="image-rendering:pixelated;width:256px" alt="aseprite render">` : "") +
      ((d.warnings || []).map((x) => `<p class="warn">note: ${x}</p>`).join(""));
    log((d.log || []).join("<br>"));
  } catch (e) { log("error: " + e.message, "err"); }
};

fetch("/api/templates").then((r) => r.json()).then((d) => {
  const sel = $("template");
  (d.templates || []).forEach((t) => {
    const o = document.createElement("option");
    o.value = o.textContent = t;
    sel.appendChild(o);
  });
}).catch(() => {});

fetch("/api/models").then((r) => r.json()).then((d) => {
  const sel = $("model");
  (d.models || []).forEach((m) => {
    const o = document.createElement("option");
    o.value = o.textContent = m;
    sel.appendChild(o);
  });
  const fast = [...sel.options].find((o) => o.value.includes("llama3.2:3b"));
  if (fast) sel.value = fast.value;
}).catch(() => log("cannot reach server — is server.py running?", "err"));
