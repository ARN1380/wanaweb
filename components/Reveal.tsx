"use client";

import { useInView } from "motion/react";
import { useRef, type CSSProperties, type ReactNode } from "react";

import { cn, splitEmphasis } from "@/lib/util";

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
