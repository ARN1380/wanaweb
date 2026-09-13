"use client";

import { useEffect, useRef } from "react";

/**
 * Two-part custom cursor: a crisp dot that tracks the pointer directly and a
 * lagging ring that grows over interactive elements. Disabled entirely for
 * coarse pointers and reduced-motion users.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = dotRef.current;
    const ring = ringRef.current;
    if (!el || !ring) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;

    document.body.classList.add("has-custom-cursor");

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let ringX = pointerX;
    let ringY = pointerY;
    let frame = 0;
    let visible = false;

    const render = () => {
      ringX += (pointerX - ringX) * 0.16;
      ringY += (pointerY - ringY) * 0.16;

      el.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

      frame = requestAnimationFrame(render);
    };

    const setVisible = (next: boolean) => {
      if (visible === next) return;
      visible = next;
      const opacity = next ? "1" : "0";
      el.style.opacity = opacity;
      ring.style.opacity = opacity;
    };

    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      setVisible(true);
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest) return;

      const interactive = target.closest(
        'a, button, input, select, textarea, [data-cursor]',
      );

      if (!interactive) {
        ring.dataset.state = "idle";
        return;
      }

      const explicit = interactive.getAttribute("data-cursor");
      ring.dataset.state = explicit === "drag" ? "drag" : "hover";
    };

    const onLeave = () => setVisible(false);

    frame = requestAnimationFrame(render);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        data-state="idle"
        aria-hidden="true"
        style={{ opacity: 0 }}
      />
      <div
        ref={ringRef}
        className="cursor-ring"
        data-state="idle"
        aria-hidden="true"
        style={{ opacity: 0 }}
      />
    </>
  );
}
