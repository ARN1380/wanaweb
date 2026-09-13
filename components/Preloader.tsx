"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import Logo from "@/components/Logo";
import { prefersReducedMotion, setSmoothScrollStopped } from "@/lib/util";

type PreloaderProps = {
  tagline: string;
  compiling: string;
};

const SESSION_KEY = "wanaweb:intro-played";
const DURATION = 900;
/** Hard stop: never leave the page scroll-locked if rAF is throttled. */
const FAILSAFE = 2600;

/**
 * Decorative intro curtain. Plays at most once per browser session, never for
 * reduced-motion users, and always releases the scroll lock.
 */
export default function Preloader({ tagline, compiling }: PreloaderProps) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === "1") return;
    } catch {
      // Storage blocked (private mode) — play the intro, just do not persist it.
    }

    setVisible(true);
    setSmoothScrollStopped(true);

    const release = () => {
      setSmoothScrollStopped(false);
      document.documentElement.style.overflow = "";
    };

    document.documentElement.style.overflow = "hidden";

    let frame = 0;
    const start = performance.now();

    frame = requestAnimationFrame(function step(now: number) {
      const progressRatio = Math.min((now - start) / DURATION, 1);
      setProgress(Math.round((1 - Math.pow(1 - progressRatio, 3)) * 100));

      if (progressRatio < 1) {
        frame = requestAnimationFrame(step);
        return;
      }

      setVisible(false);
      release();

      try {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // Non-fatal: the intro simply plays again next visit.
      }
    });

    const failsafe = window.setTimeout(() => {
      setVisible(false);
      release();
    }, FAILSAFE);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(failsafe);
      release();
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
          aria-hidden="true"
          className="preloader-curtain fixed inset-0 z-[95] flex flex-col justify-between px-[var(--shell)] py-8"
        >
          <div className="flex items-start justify-between gap-6">
            <Logo />
            <span className="hidden font-mono text-[0.6rem] tracking-[0.18em] text-muted uppercase sm:block">
              {tagline}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="display-type text-[clamp(3rem,14vw,9rem)] text-bone tabular-nums">
              {progress}
            </span>
            <span className="iridescent-text font-mono text-sm tracking-[0.2em]">
              %
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <span className="h-px w-full bg-hairline">
              <span
                className="block h-px origin-left bg-gradient-to-r from-violet via-cyan to-lime transition-transform duration-200 ease-linear"
                style={{ transform: `scaleX(${progress / 100})` }}
              />
            </span>
            <span className="font-mono text-[0.6rem] tracking-[0.18em] text-muted uppercase">
              {compiling}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
