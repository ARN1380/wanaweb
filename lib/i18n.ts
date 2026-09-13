/**
 * Locale configuration — the single source of truth for which languages exist,
 * how they are labelled, and how they are written on screen.
 */

export const locales = ["en", "fa", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export type Direction = "ltr" | "rtl";

export type LocaleConfig = {
  /** BCP-47 tag written to <html lang>. */
  htmlLang: string;
  /** `fa-IR` / `ar` are what crawlers and social cards expect in hreflang. */
  hreflang: string;
  direction: Direction;
  /** Short label for the language switcher, in the site's mono/uppercase voice. */
  code: string;
  /** The language's own name, for the switcher's accessible label. */
  label: string;
  /** The language's English name, for the switcher's accessible label. */
  englishLabel: string;
  /** Font stack family key used by `globals.css` via `html[lang="…"]`. */
  fontKey: string;
};

export const localeConfig: Record<Locale, LocaleConfig> = {
  en: {
    htmlLang: "en",
    hreflang: "en",
    direction: "ltr",
    code: "EN",
    label: "English",
    englishLabel: "English",
    fontKey: "latin",
  },
  fa: {
    htmlLang: "fa",
    hreflang: "fa-IR",
    direction: "rtl",
    code: "FA",
    label: "فارسی",
    englishLabel: "Persian",
    fontKey: "persian",
  },
  ar: {
    htmlLang: "ar",
    hreflang: "ar",
    direction: "rtl",
    code: "AR",
    label: "العربية",
    englishLabel: "Arabic",
    fontKey: "arabic",
  },
};

/**
 * Request header the proxy writes so a locale-agnostic boundary — the 404 — can
 * still render in the visitor's language.
 */
export const LOCALE_HEADER = "x-wanaweb-locale";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Narrow an arbitrary route param to a Locale, falling back to the default. */
export function parseLocale(value: string | undefined): Locale {
  return value && isLocale(value) ? value : defaultLocale;
}

export function directionOf(locale: Locale): Direction {
  return localeConfig[locale].direction;
}

/**
 * Internal route path for a locale — `/en`, `/fa`, `/ar`. This is the path the
 * router matches; `/` is rewritten onto it by `middleware.ts`.
 */
export function localePath(locale: Locale, hash = ""): string {
  return `/${locale}${hash}`;
}

/**
 * Canonical, crawlable path for a locale. English is the default locale and
 * keeps the unprefixed URL, so `/` stays the canonical home page and only the
 * translations are namespaced.
 */
export function publicHref(locale: Locale, hash = ""): string {
  return locale === defaultLocale ? `/${hash}` : `/${locale}${hash}`;
}

export function otherLocales(locale: Locale): Locale[] {
  return locales.filter((candidate) => candidate !== locale);
}
