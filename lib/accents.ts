import type { Accent } from "@/lib/dictionaries/types";

/**
 * Accent maps.
 *
 * A project, service or team member carries an `accent` name; the sections that
 * render them need that name as a *class* (Tailwind can only see literal class
 * strings) or as a raw colour (for gradients built at runtime). Both live here
 * so the Selected Work section and the gallery cannot drift apart.
 *
 * Every string below is a complete literal class or hex value: never build one
 * by concatenation, or Tailwind's scanner will not emit it.
 */

/** Background wash for a tinted panel. Pair with `bg-gradient-to-br`. */
export const accentWash: Record<Accent, string> = {
  violet: "from-violet/30 via-cyan/10 to-transparent",
  cyan: "from-cyan/30 via-lime/10 to-transparent",
  lime: "from-lime/25 via-violet/10 to-transparent",
};

/** Solid dot used in counters and index rows. */
export const accentDot: Record<Accent, string> = {
  violet: "bg-violet",
  cyan: "bg-cyan",
  lime: "bg-lime",
};

/** The accent as a raw colour, for gradients assembled at runtime. */
export const accentColor: Record<Accent, string> = {
  violet: "#7c5cff",
  cyan: "#3ddcff",
  lime: "#c8ff4d",
};
