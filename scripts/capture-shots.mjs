#!/usr/bin/env node
/**
 * Capture the gallery's site screenshots.
 *
 * The gallery hangs real sites on its wall, and a screenshot of a real site
 * cannot be drawn the way the old mockups were — so this script fetches them:
 * it drives headless Chrome over the DevTools protocol, waits for the webfonts
 * and the lazily-loaded content, captures each page beyond the fold, and
 * re-encodes the result at the width the gallery screen actually needs.
 *
 *   node scripts/capture-shots.mjs [slug ...]
 *
 * Run it from the repository root. It is deliberately dependency-free: nothing
 * here ships in the bundle, so `node` + an installed Chrome is the whole
 * toolchain, and the shots in `public/shots/` can be regenerated at any time.
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

/** The live sites behind each gallery frame, in wall order. */
const SITES = [
  { slug: "portfolio-arn", url: "https://portfolio-arn.vercel.app/" },
  { slug: "godot-cafe", url: "https://godot-cafe-extracted.vercel.app/" },
  { slug: "digital-mixology", url: "https://digital-mixology.vercel.app/" },
  { slug: "bakery-manfi", url: "https://bakery-manfi-1.vercel.app/" },
];

/** A desktop viewport, so each site renders the layout a visitor would see. */
const VIEWPORT = { width: 1440, height: 900 };
/** How long to let a page settle after `load`, in ms. */
const SETTLE = Number(flag("--settle") ?? 4200);
/** Extra wait before a second attempt at a frame that came back flat, in ms. */
const RETRY = 7000;
/** A texture cannot be arbitrarily tall, and a preview does not need to be. */
const MAX_HEIGHT = 6400;
/** Output width: the gallery panel's screen area is 964 texture px wide. */
const TARGET_WIDTH = 964;
const QUALITY = 0.82;
const PORT = 9333;
const OUT = path.resolve("public/shots");

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  path.join(process.env.LOCALAPPDATA ?? "", "Google/Chrome/Application/chrome.exe"),
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** `--flag=value` from argv, or undefined. */
function flag(name) {
  const hit = process.argv.find((arg) => arg.startsWith(`${name}=`));
  return hit?.slice(name.length + 1);
}

/**
 * The page's own words, in document order. The dictionaries describe these four
 * sites and the studios behind them, so the copy is read off the live pages
 * rather than guessed at: `node scripts/capture-shots.mjs --text`.
 */
const COPY = `(() => {
  const headings = [...document.querySelectorAll("h1, h2, h3")]
    .map((node) => node.innerText.replace(/\\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 24);
  return {
    lang: document.documentElement.lang,
    dir: document.documentElement.dir,
    headings,
    text: document.body.innerText.replace(/\\n{2,}/g, "\\n").slice(0, 2200),
  };
})()`;

/**
 * What the page looks like to a browser that may have no GPU. A site whose
 * centrepiece is WebGL renders nothing without one — and reports no error while
 * doing it — so this is the first thing to check when a shot comes back flat.
 */
const PROBE = `(() => {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
  const info = gl && gl.getExtension("WEBGL_debug_renderer_info");
  return {
    webgl: gl ? gl.getParameter(gl.VERSION) : "unavailable",
    renderer: info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : "n/a",
    nodes: document.querySelectorAll("*").length,
    canvases: [...document.querySelectorAll("canvas")].map(
      (node) => node.width + "x" + node.height,
    ),
    text: document.body.innerText.replace(/\\s+/g, " ").slice(0, 140),
  };
})()`;

/** A tiny flat-protocol CDP client: one browser socket, one session per page. */
async function connect(wsUrl) {
  const socket = new WebSocket(wsUrl);
  let nextId = 0;
  const pending = new Map();
  const waiters = new Set();

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);

    if (message.id !== undefined) {
      const entry = pending.get(message.id);
      pending.delete(message.id);
      if (!entry) return;
      if (message.error) entry.reject(new Error(message.error.message));
      else entry.resolve(message.result);
      return;
    }

    for (const waiter of [...waiters]) waiter(message);
  });

  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const id = (nextId += 1);
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params, sessionId }));
    });

  /** Resolve on the next protocol event with this method and session. */
  const waitFor = (method, sessionId, timeout = 30_000) =>
    new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        waiters.delete(waiter);
        reject(new Error(`timed out waiting for ${method}`));
      }, timeout);
      const waiter = (message) => {
        if (message.method !== method || message.sessionId !== sessionId) return;
        clearTimeout(timer);
        waiters.delete(waiter);
        resolve(message.params);
      };
      waiters.add(waiter);
    });

  return { send, waitFor, close: () => socket.close() };
}

async function browserSocket() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      const version = await response.json();
      if (version.webSocketDebuggerUrl) return version.webSocketDebuggerUrl;
    } catch {
      /* not listening yet */
    }
    await sleep(250);
  }
  throw new Error("Chrome never opened its debugging port");
}

/** Scroll the whole page once, so lazy images and scroll reveals have run. */
const WARM_UP = `(async () => {
  const step = window.innerHeight * 0.8;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 220));
  }
  window.scrollTo(0, 0);
  await document.fonts.ready;
  await new Promise((r) => setTimeout(r, 900));
  return document.documentElement.scrollHeight;
})()`;

/**
 * Downscale and re-encode in the page — no image library needed here — and
 * measure the result while it is in hand.
 *
 * The measurement is not decoration: a headless browser without a GPU renders a
 * WebGL site to a *black* canvas and reports a clean success, so the only way to
 * tell a real screenshot from an empty one is to look at the pixels. `ink` is the
 * share of pixels that are not near-black, and a flat frame is a failure worth
 * knowing about before it reaches the repository.
 */
const shrink = (dataUrl) => `(async () => {
  const image = new Image();
  image.src = ${JSON.stringify(dataUrl)};
  await image.decode();
  const scale = ${TARGET_WIDTH} / image.width;
  const canvas = document.createElement("canvas");
  canvas.width = ${TARGET_WIDTH};
  canvas.height = Math.round(image.height * scale);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const luma = new Float32Array(canvas.width * canvas.height);
  let lit = 0;
  for (let i = 0, p = 0; i < data.length; i += 4, p += 1) {
    luma[p] = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    if (luma[p] > 26) lit += 1;
  }

  // Detail separates a real render from a flat frame: a blank canvas has
  // near-zero variance and no neighbouring-pixel difference at all.
  let sum = 0;
  let edges = 0;
  for (let p = 0; p < luma.length; p += 1) {
    sum += luma[p];
    if (p % canvas.width !== canvas.width - 1 && Math.abs(luma[p] - luma[p + 1]) > 6) {
      edges += 1;
    }
  }
  const mean = sum / luma.length;
  let variance = 0;
  for (let p = 0; p < luma.length; p += 1) variance += (luma[p] - mean) ** 2;

  return {
    dataUrl: canvas.toDataURL("image/jpeg", ${QUALITY}),
    ink: Math.round((lit / luma.length) * 100),
    spread: Math.round(Math.sqrt(variance / luma.length)),
    detail: Math.round((edges / luma.length) * 100),
  };
})()`;

async function capture(client, site) {
  const { targetId } = await client.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await client.send("Target.attachToTarget", {
    targetId,
    flatten: true,
  });
  const session = (method, params) => client.send(method, params, sessionId);

  try {
    await session("Page.enable");
    await session("Runtime.enable");
    await session("Emulation.setDeviceMetricsOverride", {
      ...VIEWPORT,
      deviceScaleFactor: 1,
      mobile: false,
    });

    const loaded = client.waitFor("Page.loadEventFired", sessionId);
    await session("Page.navigate", { url: site.url });
    await loaded;
    // Client-side hydration, intro animations and webfonts all land after load.
    await sleep(SETTLE);

    const evaluate = async (expression) => {
      const { result, exceptionDetails } = await session("Runtime.evaluate", {
        expression,
        awaitPromise: true,
        returnByValue: true,
      });
      if (exceptionDetails) throw new Error(exceptionDetails.text ?? "evaluate failed");
      return result.value;
    };

    if (process.argv.includes("--probe")) {
      console.log(`  probe ${JSON.stringify(await evaluate(PROBE))}`);
    }

    if (process.argv.includes("--text")) {
      const copy = await evaluate(COPY);
      console.log(`\n=== ${site.slug} · ${copy.lang} ${copy.dir}\n${copy.text}`);
    }

    const title = await evaluate("document.title");
    const full = await evaluate(WARM_UP);
    const height = Math.min(Math.round(full), MAX_HEIGHT);
    const canvases = await evaluate("document.querySelectorAll('canvas').length");

    /*
      `captureBeyondViewport` re-renders the page into a surface larger than the
      window, and a WebGL canvas comes back as its clear colour when it does — a
      perfectly flat frame, reported as success. So it is only asked for when the
      page is genuinely taller than the viewport, and never for a full-screen
      experience like the portfolio, which is exactly one viewport tall.
    */
    const beyond = height > VIEWPORT.height;

    const grab = async () => {
      const { data } = await session("Page.captureScreenshot", {
        format: "jpeg",
        quality: Math.round(QUALITY * 100),
        captureBeyondViewport: beyond,
        optimizeForSpeed: false,
        clip: { x: 0, y: 0, width: VIEWPORT.width, height, scale: 1 },
      });
      return evaluate(shrink(`data:image/jpeg;base64,${data}`));
    };

    /*
      A WebGL scene compiles its shaders and uploads its textures on its own
      schedule: the portfolio was still a flat clear colour three seconds after
      load and fully drawn at ten. So a flat *canvas* frame is retried once
      rather than shipped, because a blank screen that reports success is the
      worst possible failure — it looks deliberate.
    */
    let shot = await grab();
    if (canvases > 0 && shot.detail < 3) {
      await sleep(RETRY);
      shot = await grab();
    }

    const bytes = Buffer.from(String(shot.dataUrl).split(",")[1], "base64");
    const file = path.join(OUT, `${site.slug}.jpg`);
    await writeFile(file, bytes);

    return {
      title,
      height,
      full,
      canvases,
      ink: shot.ink,
      spread: shot.spread,
      detail: shot.detail,
      bytes: bytes.length,
      file,
    };
  } finally {
    await client.send("Target.closeTarget", { targetId });
  }
}

const chrome = CHROME_CANDIDATES.find((candidate) => existsSync(candidate));
if (!chrome) throw new Error("Chrome not found — set CHROME_PATH");

const wanted = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const sites = wanted.length
  ? SITES.filter((site) => wanted.includes(site.slug))
  : SITES;

const profile = await mkdtemp(path.join(tmpdir(), "wanaweb-shots-"));
await mkdir(OUT, { recursive: true });

const child = spawn(
  chrome,
  [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    `--window-size=${VIEWPORT.width},${VIEWPORT.height}`,
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    "--enable-unsafe-swiftshader",
    "--force-color-profile=srgb",
    "about:blank",
  ],
  { stdio: "ignore" },
);

const client = await connect(await browserSocket());

try {
  for (const site of sites) {
    try {
      const shot = await capture(client, site);
      console.log(
        `${site.slug.padEnd(17)} ${String(Math.round(shot.bytes / 1024)).padStart(4)} KB  ` +
          `page ${String(shot.full).padStart(5)}px → ${String(shot.height).padStart(5)}px  ` +
          `ink ${String(shot.ink).padStart(3)}%  spread ${String(shot.spread).padStart(2)}  ` +
          `detail ${String(shot.detail).padStart(2)}%  ctx ${shot.canvases}  ` +
          `${shot.title.slice(0, 34)}`,
      );
      if (shot.detail < 3) {
        console.warn(
          `  ! ${site.slug} still looks flat — check the shot by eye before committing`,
        );
        process.exitCode = 1;
      }
    } catch (error) {
      console.error(`${site.slug}: ${error.message}`);
      process.exitCode = 1;
    }
  }
} finally {
  client.close();
  child.kill();
}
