"use client";

import { useInView } from "motion/react";
import { useRef, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";

import { cn, splitEmphasis } from "@/lib/util";

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToMotion(event: () => void): () => void {
  const query = window.matchMedia(MOTION_QUERY);
  query.addEventListener("change", event);
  return () => query.removeEventListener("change", event);
}

const motionAllowed = () => !window.matchMedia(MOTION_QUERY).matches;
const motionAllowedOnServer = () => true;

/**
 * Hydration-safe reduced-motion check, for components that render a *different
 * tree* rather than merely different styles.
 *
 * Reading the media query during the first client render is what makes React
 * throw a hydration error — the server has no way to know the preference, so it
 * ships the motion version. `useSyncExternalStore` gives React an explicit
 * server snapshot, so hydration keeps the server's tree and the reduced-motion
 * branch lands in a second render, one frame later.
 */
export function usePrefersReducedMotion(): boolean {
  return !useSyncExternalStore(
    subscribeToMotion,
    motionAllowed,
    motionAllowedOnServer,
  );
}

type FadeUpProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

/** Fades and lifts content into place the first time it enters the viewport. */
export function FadeUp({ children, delay = 0, className }: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

  return (
    <div
      ref={ref}
      className={cn("fade-up", className)}
      data-inview={inView}
      style={{ "--fade-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

type MaskedLinesProps = {
  lines: readonly string[];
  /** Keyword rendered in the italic serif accent face. */
  emphasis?: string;
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
};

/**
 * Editorial masked line reveal: each line slides up from behind its own
 * overflow-hidden mask, staggered from top to bottom.
 */
export function MaskedLines({
  lines,
  emphasis = "",
  className,
  lineClassName,
  delay = 0,
  stagger = 110,
}: MaskedLinesProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px -8% 0px" });

  return (
    <span ref={ref} className={cn("block", className)}>
      {lines.map((line, index) => {
        const { before, match, after } = splitEmphasis(line, emphasis);

        return (
          <span key={`${line}-${index}`} className="reveal-mask">
            <span
              className={cn("reveal-line", lineClassName)}
              data-inview={inView}
              style={{
                transitionDelay: `${delay + index * stagger}ms`,
              }}
            >
              {match ? (
                <>
                  {before}
                  <em className="serif-accent">{match}</em>
                  {after}
                </>
              ) : (
                line
              )}
            </span>
          </span>
        );
      })}
    </span>
  );
}

/** Small mono label with a leading rule, used above every section title. */
export function Kicker({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("kicker inline-flex items-center gap-3", className)}>
      <span
        aria-hidden="true"
        className="h-px w-8 bg-gradient-to-r from-violet via-cyan to-lime"
      />
      {children}
    </span>
  );
}
