import type { Metadata } from "next";
import Link from "next/link";

import Logo from "@/components/Logo";
import { nav, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "That page does not exist — head back to the studio and find what you were looking for.",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-[var(--shell)] py-24 text-center">
      <div
        aria-hidden="true"
        className="grid-pattern absolute inset-0 opacity-40"
      />

      <div className="relative flex flex-col items-center gap-7">
        <Logo />

        <p className="font-mono text-[0.62rem] tracking-[0.22em] text-lime uppercase">
          Error 404
        </p>

        <h1 className="display-type text-[clamp(4rem,20vw,12rem)] leading-[0.85]">
          <span className="iridescent-text">Lost</span>
          <span className="text-bone/25">.</span>
        </h1>

        <p className="max-w-md text-base leading-relaxed text-muted">
          This page does not exist — or it moved while we were
          rewriting the render path. Everything worth seeing is on the studio
          site.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <Link
            href="/#top"
            className="inline-flex items-center gap-2.5 rounded-full bg-lime px-6 py-3.5 font-mono text-[0.72rem] tracking-[0.18em] text-ink uppercase transition-colors duration-300 hover:bg-bone"
          >
            Back to the studio
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2.5 rounded-full border border-hairline px-6 py-3.5 font-mono text-[0.72rem] tracking-[0.18em] text-bone uppercase transition-colors duration-300 hover:border-lime/60 hover:text-lime"
          >
            Start a project
          </Link>
        </div>

        <nav
          aria-label="Site sections"
          className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={`/${item.href}`}
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
