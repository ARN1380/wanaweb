import type { Locale } from "@/lib/i18n";

import { ar } from "./ar";
import { en } from "./en";
import { fa } from "./fa";
import type { Dictionary } from "./types";

/**
 * Every dictionary is imported statically: the site is prerendered per locale,
 * so a locale's copy never reaches another locale's payload — and a missing
 * translation fails the build instead of a runtime lookup.
 */
export const dictionaries: Record<Locale, Dictionary> = { en, fa, ar };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary } from "./types";
