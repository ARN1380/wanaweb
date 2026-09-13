/** Tiny shared helpers. No dependencies — keeps the client bundle honest. */

export type ClassValue = string | false | null | undefined;

/** Join conditional class names. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter((value): value is string => Boolean(value)).join(" ");
}

export type EmphasisParts = {
  before: string;
  /** The substring to render in the italic serif accent, if found. */
  match: string | null;
  after: string;
};

/**
 * Split `text` around `word` so a single keyword can be rendered in the
 * editorial serif face while the rest stays in the display sans.
 */
export function splitEmphasis(text: string, word: string): EmphasisParts {
  if (!word) return { before: text, match: null, after: "" };

  const index = text.toLowerCase().indexOf(word.toLowerCase());
  if (index === -1) return { before: text, match: null, after: "" };

  return {
    before: text.slice(0, index),
    match: text.slice(index, index + word.length),
    after: text.slice(index + word.length),
  };
}

/** Section numbering used by the editorial section headers. */
export function sectionNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}

/** Respect the OS-level motion preference. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Deterministic PRNG (mulberry32).
 *
 * Used to scatter particles and 3D geometry. A seeded generator keeps every
 * generated scene identical between renders and builds — and keeps the render
 * path free of impure globals such as `Math.random`.
 */
export function createRandom(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Broadcast a request to Lenis without coupling the components to it. */
export const LENIS_EVENT = "wanaweb:lenis";

export function setSmoothScrollStopped(stopped: boolean): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<{ stopped: boolean }>(LENIS_EVENT, { detail: { stopped } }),
  );
}
