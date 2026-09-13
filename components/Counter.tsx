"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { prefersReducedMotion } from "@/lib/util";

type CounterProps = {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
};

/** Counts up once, the first time the number scrolls into view. */
export default function Counter({
  value,
  suffix = "",
  duration = 1700,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -12% 0px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }

    const start = performance.now();
    let frame = requestAnimationFrame(function step(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3.2);
      setDisplay(value * eased);
      if (progress < 1) frame = requestAnimationFrame(step);
    });

    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {Math.round(display)}
      {suffix}
    </span>
  );
}
