import { accentColor } from "@/lib/accents";
import type { Project } from "@/lib/dictionaries/types";

/**
 * A project's site, drawn into a canvas so it can be a texture on a 3D screen.
 *
 * This repository ships no image assets, so the "screenshots" in the gallery are
 * generated the same way everything else here is: from the project's own copy
 * and accent. The DOM mockup in `components/SiteFrame.tsx` is the design this
 * follows — the texture is its canvas twin, because a mesh needs pixels rather
 * than elements.
 */

/** Native texture size. The panel mesh keeps this aspect (see `PANEL_ASPECT`). */
export const PANEL_WIDTH = 1024;
export const PANEL_HEIGHT = 664;
export const PANEL_ASPECT = PANEL_WIDTH / PANEL_HEIGHT;

const BEZEL = 30;
const SCREEN_W = PANEL_WIDTH - BEZEL * 2;
const SCREEN_H = PANEL_HEIGHT - BEZEL * 2;
const CHROME_H = 46;

export type TextureFonts = {
  /** Resolved `--font-body`, for the headline. */
  body: string;
  /** Resolved `--font-label`, for kickers, domains and numerals. */
  label: string;
};

/** Greedy wrap. Canvas has no layout engine, so this is the whole of it. */
function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
      if (lines.length === maxLines - 1 && maxLines > 1) {
        // Last line: keep the remainder, trimming if it will not fit.
        const rest = words.slice(words.indexOf(word)).join(" ");
        let clipped = rest;
        while (clipped.length > 1 && ctx.measureText(clipped).width > maxWidth) {
          clipped = clipped.slice(0, -1);
        }
        lines.push(clipped === rest ? rest : `${clipped.trimEnd()}…`);
        return lines;
      }
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
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
 * Draw one panel: device bezel, browser chrome, then the site itself.
 *
 * `dir` matters: the page's own language decides the mockup's reading direction,
 * so the Persian and Arabic galleries show RTL sites rather than mirrored Latin
 * ones. Numerals, domains and technology names stay Latin exactly as they do on
 * the page (see the i18n conventions).
 */
export function drawSitePanel(
  project: Project,
  dir: "ltr" | "rtl",
  fonts: TextureFonts,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = PANEL_WIDTH;
  canvas.height = PANEL_HEIGHT;

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const accent = accentColor[project.accent];
  const rtl = dir === "rtl";
  const { body, label } = fonts;

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

  const wash = ctx.createLinearGradient(0, 0, SCREEN_W, SCREEN_H);
  wash.addColorStop(0, `${accent}3d`);
  wash.addColorStop(0.55, "rgba(5,5,6,0)");
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

  ctx.strokeStyle = "rgba(244,241,234,0.045)";
  ctx.lineWidth = 1;
  for (let x = 60; x < SCREEN_W; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, SCREEN_H);
    ctx.stroke();
  }
  for (let y = 60; y < SCREEN_H; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(SCREEN_W, y);
    ctx.stroke();
  }

  /* ---------------------------------------------------------------- chrome -- */
  ctx.fillStyle = "rgba(5,5,6,0.82)";
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

  const pillW = 320;
  const pillX = (SCREEN_W - pillW) / 2;
  ctx.fillStyle = "rgba(5,5,6,0.7)";
  rounded(ctx, pillX, 11, pillW, CHROME_H - 22, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(244,241,234,0.09)";
  rounded(ctx, pillX, 11, pillW, CHROME_H - 22, 12);
  ctx.stroke();

  // The domain is Latin in every locale, so it is drawn LTR regardless.
  ctx.direction = "ltr";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(244,241,234,0.56)";
  ctx.font = `500 16px ${label}`;
  ctx.fillText(`${project.id}.com`, SCREEN_W / 2, CHROME_H / 2 + 1);

  ctx.beginPath();
  ctx.arc(SCREEN_W - 26, CHROME_H / 2, 5, 0, Math.PI * 2);
  ctx.fillStyle = accent;
  ctx.fill();

  /* --------------------------------------------------------------- content -- */
  ctx.direction = rtl ? "rtl" : "ltr";
  ctx.textAlign = rtl ? "right" : "left";
  const start = rtl ? SCREEN_W - 48 : 48;
  const end = rtl ? 48 : SCREEN_W - 48;

  ctx.save();
  ctx.translate(0, CHROME_H);

  // Mock site nav: the client's mark, then three skeleton links.
  ctx.fillStyle = "rgba(244,241,234,0.8)";
  ctx.font = `500 19px ${label}`;
  ctx.fillText(project.client, start, 52);

  ctx.fillStyle = "rgba(244,241,234,0.25)";
  const bars = [74, 52, 82];
  let barX = end;
  for (const width of bars) {
    rounded(ctx, barX - width, 44, width, 5, 3);
    ctx.fill();
    barX -= width + 22;
  }

  // The site's own headline, in the locale's display face.
  ctx.fillStyle = "#f4f1ea";
  ctx.font = `600 58px ${body}`;
  const lines = wrap(ctx, project.title, SCREEN_W - 220, 2);
  lines.forEach((line, index) => {
    ctx.fillText(line, start, 146 + index * 66);
  });

  // Metrics, in the site's iridescent ramp.
  const ramp = ctx.createLinearGradient(start - (rtl ? 260 : 0), 0, start + (rtl ? 0 : 260), 0);
  ramp.addColorStop(0, "#7c5cff");
  ramp.addColorStop(0.46, "#3ddcff");
  ramp.addColorStop(1, "#c8ff4d");

  project.results.slice(0, 2).forEach((result, index) => {
    const x = start + (rtl ? -1 : 1) * index * 180;
    ctx.fillStyle = ramp;
    ctx.font = `600 34px ${body}`;
    ctx.fillText(result.k, x, 452);

    ctx.fillStyle = "rgba(244,241,234,0.56)";
    ctx.font = `500 14px ${label}`;
    ctx.fillText(result.v.toUpperCase(), x, 478);
  });

  // The mockup's own CTA — the first technology, on the accent.
  ctx.font = `500 15px ${label}`;
  const cta = project.stack[0].toUpperCase();
  const ctaW = ctx.measureText(cta).width + 48;
  const ctaX = rtl ? 48 : SCREEN_W - 48 - ctaW;
  ctx.fillStyle = accent;
  rounded(ctx, ctaX, 430, ctaW, 40, 20);
  ctx.fill();
  ctx.fillStyle = "#050506";
  ctx.direction = "ltr";
  ctx.textAlign = "left";
  ctx.fillText(cta, ctaX + 24, 456);
  ctx.direction = rtl ? "rtl" : "ltr";
  ctx.textAlign = rtl ? "right" : "left";

  // Ghost index, cropped by the screen the way a real page crops.
  ctx.fillStyle = `${accent}14`;
  ctx.font = `600 300px ${body}`;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(project.index, rtl ? SCREEN_W + 40 : SCREEN_W - 150, SCREEN_H + 30);

  ctx.restore();

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
