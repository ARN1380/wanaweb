import type { MetadataRoute } from "next";

import { getDictionary } from "@/lib/dictionaries";
import { defaultLocale, localeConfig, locales, publicHref } from "@/lib/i18n";

/**
 * Single-page site: one entry per language, each carrying the full hreflang
 * set — so a crawler reads the three translations as one document with
 * alternates rather than three competing pages. Section anchors are not listed
 * because they are the same document.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const { site } = getDictionary(defaultLocale);

  // hreflang annotations in a sitemap have to be absolute URLs.
  const languages = Object.fromEntries(
    locales.map((locale) => [
      localeConfig[locale].hreflang,
      `${site.url}${publicHref(locale)}`,
    ]),
  );

  const entries: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${site.url}${publicHref(locale)}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === defaultLocale ? 1 : 0.9,
    alternates: { languages },
  }));

  return entries;
}
