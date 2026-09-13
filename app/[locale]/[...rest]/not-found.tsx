import { headers } from "next/headers";
import Link from "next/link";

import Logo from "@/components/Logo";
import { getDictionary } from "@/lib/dictionaries";
import { LOCALE_HEADER, parseLocale, publicHref } from "@/lib/i18n";

/**
 * The 404 boundary.
 *
 * It renders inside `[locale]/layout.tsx`, which has already set `<html lang>`
 * and `dir` — but a boundary cannot read route params, so the locale arrives on
 * the request in the header the proxy writes. Without that header (a path that
 * never reached the proxy, or Next's own `/_not-found` prerender) it falls back
 * to the default locale instead of rendering nothing.
 */
export default async function NotFound() {
  const locale = parseLocale((await headers()).get(LOCALE_HEADER) ?? undefined);
  const { nav, site, ui } = getDictionary(locale);
  const copy = ui.notFound;
  const home = publicHref(locale);

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-[var(--shell)] py-24 text-center">
      <div
        aria-hidden="true"
        className="grid-pattern absolute inset-0 opacity-40"
      />

      <div className="relative flex flex-col items-center gap-7">
        <Logo />

        <p className="font-mono text-[0.62rem] tracking-[0.22em] text-lime uppercase">
          {copy.kicker}
        </p>

        <h1 className="display-type text-[clamp(4rem,20vw,12rem)] leading-[0.85]">
          <span className="iridescent-text">{copy.headline}</span>
          <span className="text-bone/25">.</span>
        </h1>

        <p className="max-w-md text-base leading-relaxed text-muted">
          {copy.body}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <Link
            href={`${home}#top`}
            className="inline-flex items-center gap-2.5 rounded-full bg-lime px-6 py-3.5 font-mono text-[0.72rem] tracking-[0.18em] text-ink uppercase transition-colors duration-300 hover:bg-bone"
          >
            {copy.home}
          </Link>
          <Link
            href={`${home}#contact`}
            className="inline-flex items-center gap-2.5 rounded-full border border-hairline px-6 py-3.5 font-mono text-[0.72rem] tracking-[0.18em] text-bone uppercase transition-colors duration-300 hover:border-lime/60 hover:text-lime"
          >
            {ui.startProject}
          </Link>
        </div>

        <nav
          aria-label={ui.navSections}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={`${home}${item.href}`}
              className="font-mono text-[0.6rem] tracking-[0.16em] text-muted uppercase transition-colors duration-300 hover:text-lime"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <p className="mt-4 font-mono text-[0.58rem] tracking-[0.16em] text-muted/60 uppercase">
          {site.name} · {site.location}
        </p>
      </div>
    </main>
  );
}
