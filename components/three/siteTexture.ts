/**
 * A site's screenshot, split into the two textures an inner-scrolling screen
 * needs: the **shell** (bezel and browser chrome, with the window left
 * transparent) and the **page** (the capture itself, which slides behind it).
 *
 * Drawing them together was simpler, but a single texture cannot scroll: moving
 * it would take the chrome with it. Splitting the frame is what lets the page
 * move inside a window that stays put.
 *
 * The screenshots are real captures of live sites (`scripts/capture-shots.mjs`),
 * so nothing here invents a headline or a metric — it frames what the browser
 * saw. `components/SiteFrame.tsx` is the same frame as real DOM, for the
 * reduced-motion grid, so **change both** when the frame's design changes.
 */

/** Native texture size. The panel mesh keeps this aspect (see `PANEL_ASPECT`). */
export const PANEL_WIDTH = 1024;
export const PANEL_HEIGHT = 664;
export const PANEL_ASPECT = PANEL_WIDTH / PANEL_HEIGHT;

const BEZEL = 30;
const SCREEN_W = PANEL_WIDTH - BEZEL * 2;
const SCREEN_H = PANEL_HEIGHT - BEZEL * 2;
const CHROME_H = 46;
/** The page's window inside the screen: everything under the chrome bar. */
const WINDOW_H = SCREEN_H - CHROME_H;

/**
 * A texture taller than this is refused by real hardware — the WebGL 2 floor is
 * 4096 on the devices that matter, and two of the four captures are taller than
 * that. They are scaled down to fit, which is a 4 % change nobody can see.
 */
const MAX_PAGE_TEXELS = 4096;

/** The window as a fraction of the panel, for placing the page mesh behind it. */
export const WINDOW_RATIO = {
  width: SCREEN_W / PANEL_WIDTH,
  height: WINDOW_H / PANEL_HEIGHT,
  /** Signed y offset of the window's centre from the panel's, in panel heights. */
  centerY:
    (PANEL_HEIGHT / 2 - (BEZEL + CHROME_H + WINDOW_H / 2)) / PANEL_HEIGHT,
} as const;

/** The window's aspect in texels. A page shown in it must not be stretched. */
const WINDOW_ASPECT = SCREEN_W / WINDOW_H;

/**
 * How much of a page the window can show, 0–1, from the texture's own size.
 *
 * A page shorter than the window shows all of itself (`1`) and therefore cannot
 * scroll; the portfolio is exactly that case — one viewport tall, nothing to
 * scroll to.
 */
export function windowFraction(width: number, height: number): number {
  if (width <= 0 || height <= 0) return 1;
  return Math.min(1, width / height / WINDOW_ASPECT);
}

/** Scrollable range for a page, in texture-v units: `0` means nothing to scroll. */
export function pageScrollRange(width: number, height: number): number {
  return Math.max(0, 1 - windowFraction(width, height));
}

function rounded(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

/**
 * The device: a bezel with a window cut out of it, and the browser chrome drawn
 * across the top of that window. Everything else stays transparent, so the page
 * behind shows through and only the frame occludes it.
 *
 * A missing host (a project with no capture) still draws its chrome — the frame
 * is the frame — and the page texture behind it carries the accent wash.
 */
export function drawDeviceShell(
  host: string,
  accent: string,
  label: string,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = PANEL_WIDTH;
  canvas.height = PANEL_HEIGHT;

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  /* ---------------------------------------------------------------- bezel --- */
  // Outer rounded rect minus the screen's, filled even-odd: a frame, not a slab.
  ctx.beginPath();
  ctx.roundRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 34);
  ctx.roundRect(BEZEL, BEZEL, SCREEN_W, SCREEN_H, 12);
  const bezel = ctx.createLinearGradient(0, 0, PANEL_WIDTH * 0.4, PANEL_HEIGHT);
  bezel.addColorStop(0, "#16161e");
  bezel.addColorStop(1, "#07070a");
  ctx.fillStyle = bezel;
  ctx.fill("evenodd");

  /* ---------------------------------------------------------------- chrome -- */
  ctx.save();
  rounded(ctx, BEZEL, BEZEL, SCREEN_W, SCREEN_H, 12);
  ctx.clip();
  ctx.translate(BEZEL, BEZEL);

  ctx.fillStyle = "rgba(5,5,6,0.94)";
  ctx.fillRect(0, 0, SCREEN_W, CHROME_H);
  ctx.fillStyle = "rgba(244,241,234,0.09)";
  ctx.fillRect(0, CHROME_H - 1, SCREEN_W, 1);

  const light = [0.34, 0.22, 0.14];
  for (let i = 0; i < light.length; i += 1) {
    ctx.beginPath();
    ctx.arc(24 + i * 22, CHROME_H / 2, 5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(244,241,234,${light[i]})`;
    ctx.fill();
  }

  const pillW = 340;
  const pillX = (SCREEN_W - pillW) / 2;
  ctx.fillStyle = "rgba(5,5,6,0.7)";
  rounded(ctx, pillX, 11, pillW, CHROME_H - 22, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(244,241,234,0.09)";
  rounded(ctx, pillX, 11, pillW, CHROME_H - 22, 12);
  ctx.stroke();

  // Addresses are Latin in every locale, so the chrome is drawn LTR regardless.
  ctx.direction = "ltr";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(244,241,234,0.56)";
  ctx.font = `500 15px ${label}`;
  ctx.fillText(host, SCREEN_W / 2, CHROME_H / 2 + 1);

  ctx.beginPath();
  ctx.arc(SCREEN_W - 26, CHROME_H / 2, 5, 0, Math.PI * 2);
  ctx.fillStyle = accent;
  ctx.fill();

  ctx.restore();

  /* ---------------------------------------------------------------- edges --- */
  ctx.strokeStyle = "rgba(244,241,234,0.16)";
  ctx.lineWidth = 1.5;
  rounded(ctx, 0.75, 0.75, PANEL_WIDTH - 1.5, PANEL_HEIGHT - 1.5, 34);
  ctx.stroke();

  // The recessed screen: a hairline where the glass meets the bezel, and a dark
  // inner lip so the window reads as *below* the frame rather than beside it.
  ctx.strokeStyle = "rgba(244,241,234,0.1)";
  rounded(ctx, BEZEL - 0.5, BEZEL - 0.5, SCREEN_W + 1, SCREEN_H + 1, 13);
  ctx.stroke();

  ctx.strokeStyle = "rgba(0,0,0,0.55)";
  rounded(ctx, BEZEL + 0.5, BEZEL + 0.5, SCREEN_W - 1, SCREEN_H - 1, 11.5);
  ctx.stroke();

  return canvas;
}

/**
 * The page itself: a whole capture, scaled so its height is a legal texture, with
 * a whisper of glass over it.
 *
 * `null` (no capture for this project) draws the accent wash instead of an empty
 * window, so an un-captured site degrades rather than looking broken.
 */
export function drawPageSheet(
  image: HTMLImageElement | null,
  accent: string,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");

  if (!image || image.width <= 0) {
    canvas.width = SCREEN_W;
    canvas.height = WINDOW_H;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#0b0b10";
      ctx.fillRect(0, 0, SCREEN_W, WINDOW_H);
      const wash = ctx.createLinearGradient(0, 0, SCREEN_W, WINDOW_H);
      wash.addColorStop(0, `${accent}3d`);
      wash.addColorStop(0.55, "rgba(5,5,6,0)");
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, SCREEN_W, WINDOW_H);
    }
    return canvas;
  }

  const scale = Math.min(1, MAX_PAGE_TEXELS / image.height);
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const sheen = ctx.createLinearGradient(0, 0, canvas.width, canvas.height * 0.4);
  sheen.addColorStop(0, "rgba(255,255,255,0.045)");
  sheen.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return canvas;
}
