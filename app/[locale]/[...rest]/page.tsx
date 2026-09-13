import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary } from "@/lib/dictionaries";
import { parseLocale } from "@/lib/i18n";

/**
 * Anything under a known locale that has no page of its own.
 *
 * The middleware rewrites default-locale paths onto this segment, so this one
 * route is what gives every 404 a real HTTP status, the right `<title>` and —
 * through `not-found.tsx` — copy in the visitor's language.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDictionary(parseLocale(locale)).ui.notFound.title };
}

export default function CatchAll() {
  notFound();
}
