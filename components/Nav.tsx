"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import { useEffect, useMemo, useState } from "react";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import Logo from "@/components/Logo";
import type { Dictionary } from "@/lib/dictionaries/types";
import type { Locale } from "@/lib/i18n";
import { cn, setSmoothScrollStopped } from "@/lib/util";

type NavProps = {
  locale: Locale;
  nav: Dictionary["nav"];
  site: Dictionary["site"];
  ui: Dictionary["ui"];
};

/** Highlights the nav item for whichever section owns the viewport middle. */
function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.6] },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ids]);

  return active;
}

export default function Nav({ locale, nav, site, ui }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // The list is derived from props, so it has to be memoised: a fresh array on
  // every render would re-subscribe the observer below in a loop.
  const ids = useMemo(
    () => nav.map((item) => item.href.replace("#", "")),
    [nav],
  );

  const active = useActiveSection(ids);

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.3,
  });

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 28);
  });

  useEffect(() => {
    setSmoothScrollStopped(open);
    document.body.style.overflow = open ? "hidden" : "";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 z-[80] h-px w-full origin-left bg-gradient-to-r from-violet via-cyan to-lime"
        style={{ scaleX: progress }}
      />

      <header className="fixed top-0 left-0 z-[70] w-full">
        <div
          className={cn(
            "transition-all duration-500 ease-expo",
            scrolled ? "px-3 pt-3 sm:px-5 sm:pt-4" : "px-0 pt-0",
          )}
        >
          <div
            className={cn(
              "mx-auto flex items-center justify-between gap-6 transition-all duration-500 ease-expo",
              scrolled
                ? "glass max-w-6xl rounded-2xl px-4 py-2.5 shadow-[0_18px_60px_-30px_rgb(0_0_0/0.9)] sm:px-5"
                : "max-w-none border-b border-transparent px-[var(--shell)] py-5",
            )}
          >
            <a
              href="#top"
              className="group flex items-center"
              aria-label={`${site.name} — ${ui.backToTop}`}
            >
              <Logo className="transition-opacity duration-300 group-hover:opacity-80" />
            </a>

            <nav aria-label={ui.navPrimary} className="hidden items-center gap-1 lg:flex">
              {nav.map((item) => {
                const id = item.href.replace("#", "");
                const isActive = active === id;

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative rounded-full px-3.5 py-2 font-mono text-[0.7rem] tracking-[0.18em] uppercase transition-colors duration-300",
                      isActive ? "text-bone" : "text-muted hover:text-bone",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute bottom-1 left-3.5 h-px w-[calc(100%-1.75rem)] origin-left bg-lime transition-transform duration-500 ease-expo",
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-2 font-mono text-[0.65rem] tracking-[0.16em] text-muted uppercase xl:flex">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-70" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-lime" />
                </span>
                {ui.openForWork}
              </span>

              <LanguageSwitcher
                locale={locale}
                label={ui.language.label}
                className="hidden sm:flex"
              />

              <a
                href="#contact"
                className="hidden rounded-full bg-bone px-5 py-2.5 font-mono text-[0.7rem] tracking-[0.16em] text-ink uppercase transition-colors duration-300 hover:bg-lime sm:inline-flex"
              >
                {ui.startProject}
              </a>

              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                className="relative flex size-10 items-center justify-center rounded-full border border-hairline text-bone transition-colors duration-300 hover:border-lime/60 lg:hidden"
              >
                <span className="sr-only">
                  {open ? ui.menuClose : ui.menuOpen}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute h-px w-4 bg-current transition-transform duration-500 ease-expo",
                    open ? "rotate-45" : "-translate-y-1",
                  )}
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute h-px w-4 bg-current transition-transform duration-500 ease-expo",
                    open ? "-rotate-45" : "translate-y-1",
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[65] flex flex-col justify-between bg-ink/95 px-[var(--shell)] pt-28 pb-10 backdrop-blur-xl lg:hidden"
          >
            <nav aria-label={ui.navMobile} className="flex flex-col">
              {nav.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.14 + index * 0.055,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="display-type hairline-b flex items-baseline justify-between py-4 text-[clamp(2rem,10vw,3.4rem)] text-bone"
                >
                  {item.label}
                  <span className="font-mono text-[0.65rem] tracking-[0.2em] text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </motion.a>
              ))}
            </nav>

            <div className="flex flex-col gap-5 font-mono text-[0.7rem] tracking-[0.16em] uppercase">
              <LanguageSwitcher locale={locale} label={ui.language.label} className="w-fit" />
              <a href={`mailto:${site.email}`} className="text-lime">
                {site.email}
              </a>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-muted">
                {site.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="transition-colors hover:text-bone"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
