/**
 * A site's screenshot, framed as a screen and drawn into a canvas texture.
 *
 * The screenshot is a real capture of the live site (`scripts/capture-shots.mjs`
 * puts it in `public/shots/`), so this function no longer invents anything: it
 * draws the device bezel, the browser chrome, and the page inside it, cropped to
 * the top of the capture the way a browser window crops it.
 *
 * `components/SiteFrame.tsx` is the same frame as real DOM, for the
 * reduced-motion grid. **Change both** when the frame's design changes.
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
const VIEW_H = SCREEN_H - CHROME_H;

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
 * Draw one panel.
 *
 * `image` is the capture. It is anchored to its top edge and scaled so it always
 * fills the window width — a tall page is cropped by the window rather than
 * squashed into it, which is what makes the frame read as a browser.
 *
 * A missing image (the file was not captured yet, or the request failed) leaves
 * the accent wash in the window instead of an empty screen, so a frame with no
 * screenshot looks deliberate rather than broken.
 */
export function drawSitePanel(
  image: HTMLImageElement | null,
  host: string,
  accent: string,
  label: string,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = PANEL_WIDTH;
  canvas.height = PANEL_HEIGHT;

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  /* ---------------------------------------------------------------- device -- */
  const bezel = ctx.createLinearGradient(0, 0, PANEL_WIDTH * 0.4, PANEL_HEIGHT);
  bezel.addColorStop(0, "#16161e");
  bezel.addColorStop(1, "#07070a");
  ctx.fillStyle = bezel;
  rounded(ctx, 0, 0, PANEL_WIDTH, PANEL_HEIGHT, 34);
  ctx.fill();

  /* ---------------------------------------------------------------- screen -- */
  ctx.save();
  rounded(ctx, BEZEL, BEZEL, SCREEN_W, SCREEN_H, 12);
  ctx.clip();
  ctx.translate(BEZEL, BEZEL);

  ctx.fillStyle = "#0b0b10";
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

  // The page itself, cropped to the window.
  if (image && image.width > 0) {
    const scale = SCREEN_W / image.width;
    ctx.drawImage(image, 0, CHROME_H, image.width * scale, image.height * scale);
  } else {
    const wash = ctx.createLinearGradient(0, 0, SCREEN_W, SCREEN_H);
    wash.addColorStop(0, `${accent}3d`);
    wash.addColorStop(0.55, "rgba(5,5,6,0)");
    ctx.fillStyle = wash;
    ctx.fillRect(0, CHROME_H, SCREEN_W, VIEW_H);
  }

  /* ---------------------------------------------------------------- chrome -- */
  ctx.fillStyle = "rgba(5,5,6,0.86)";
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

  // Screen sheen: a little glass over the whole page.
  const sheen = ctx.createLinearGradient(0, 0, SCREEN_W, SCREEN_H);
  sheen.addColorStop(0, "rgba(255,255,255,0.05)");
  sheen.addColorStop(0.4, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

  ctx.restore();

  /* ---------------------------------------------------------------- bezel --- */
  ctx.strokeStyle = "rgba(244,241,234,0.16)";
  ctx.lineWidth = 1.5;
  rounded(ctx, 0.75, 0.75, PANEL_WIDTH - 1.5, PANEL_HEIGHT - 1.5, 34);
  ctx.stroke();

  ctx.strokeStyle = "rgba(244,241,234,0.1)";
  rounded(ctx, BEZEL - 1, BEZEL - 1, SCREEN_W + 2, SCREEN_H + 2, 13);
  ctx.stroke();

  return canvas;
}
