/**
 * The live sites behind the gallery's four frames.
 *
 * Each project has a real screenshot in `public/shots/`, captured from the
 * deployment below by `scripts/capture-shots.mjs` — **keep the two files in
 * step**: that script is what produces the images, and this module is what
 * names them. A missing file is a blank frame, not a build error.
 *
 * The `url` is a deployment address, not a brand domain, so the address bar in
 * the frames shows what the site is actually served from. When a real domain is
 * attached, update `url` and `host` here and re-capture.
 */
export type SiteShot = {
  /** Path under `public/`, used by both the DOM preview and the 3D texture. */
  readonly src: string;
  /** Where the screenshot was taken from. */
  readonly url: string;
  /** `url` without the scheme, which is what a browser's address bar shows. */
  readonly host: string;
  /** Intrinsic width ÷ height, so a layout can reserve the right box. */
  readonly aspect: number;
};

export const siteShots: Record<string, SiteShot> = {
  "portfolio-arn": {
    src: "/shots/portfolio-arn.jpg",
    url: "https://portfolio-arn.vercel.app/",
    host: "portfolio-arn.vercel.app",
    aspect: 964 / 603,
  },
  "godot-cafe": {
    src: "/shots/godot-cafe.jpg",
    url: "https://godot-cafe-extracted.vercel.app/",
    host: "godot-cafe-extracted.vercel.app",
    aspect: 964 / 4284,
  },
  "digital-mixology": {
    src: "/shots/digital-mixology.jpg",
    url: "https://digital-mixology.vercel.app/",
    host: "digital-mixology.vercel.app",
    aspect: 964 / 2054,
  },
  "bakery-manfi": {
    src: "/shots/bakery-manfi.jpg",
    url: "https://bakery-manfi-1.vercel.app/",
    host: "bakery-manfi-1.vercel.app",
    aspect: 964 / 4138,
  },
};

/**
 * A project's shot, or `undefined` for a project we have not captured.
 *
 * Returning rather than throwing is deliberate: the gallery is a marketing
 * surface, and a screenshot that has not been taken yet should cost a frame,
 * not a crashed page.
 */
export function shotFor(id: string): SiteShot | undefined {
  return siteShots[id];
}
