"use client";

import { useEffect } from "react";
import Lenis from "lenis";

import { LENIS_EVENT, prefersReducedMotion } from "@/lib/util";

const NAV_OFFSET = 84;

/**
 * Lenis-powered inertial scrolling plus smooth anchor navigation.
 * Renders nothing — it only attaches behaviour.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3.2),
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    });

    let frame = requestAnimationFrame(function loop(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    });

    const onLenisEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ stopped: boolean }>).detail;
      if (detail?.stopped) lenis.stop();
      else lenis.start();
    };

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;

      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, {
        offset: -NAV_OFFSET,
        duration: 1.35,
      });
      window.history.replaceState(null, "", hash);
    };

    window.addEventListener(LENIS_EVENT, onLenisEvent);
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener(LENIS_EVENT, onLenisEvent);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return null;
}
