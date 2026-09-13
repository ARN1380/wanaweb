import type { MetadataRoute } from "next";

import { site } from "@/lib/content";

/**
 * Single-page site: one canonical URL. Section anchors are not listed because
 * they are the same document.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
