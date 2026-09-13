import type { MetadataRoute } from "next";

import { getDictionary } from "@/lib/dictionaries";
import { defaultLocale } from "@/lib/i18n";

export default function robots(): MetadataRoute.Robots {
  const { site } = getDictionary(defaultLocale);

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
