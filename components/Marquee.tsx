import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/util";

type MarqueeProps = {
  items: readonly string[];
  direction?: "left" | "right";
  /** Seconds for one full cycle. */
  duration?: number;
  className?: string;
  itemClassName?: string;
  separator?: ReactNode;
};

/**
 * Seamless CSS marquee. The item list is rendered twice and the track
 * translates exactly -50%, so the loop has no visible seam. Pauses on hover.
 */
export default function Marquee({
  items,
  direction = "left",
  duration = 42,
  className,
  itemClassName,
  separator,
}: MarqueeProps) {
  const group = (key: string) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={key === "b"}>
      {items.map((item, index) => (
        <span
          key={`${key}-${item}-${index}`}
          className={cn(
            "flex items-center gap-6 px-6 font-mono text-[0.72rem] tracking-[0.28em] whitespace-nowrap uppercase sm:text-xs",
            itemClassName,
          )}
        >
          {item}
          <span className="text-lime/60" aria-hidden="true">
            {separator ?? "◆"}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={cn("marquee overflow-hidden", className)}>
      <div
        className="marquee-track"
        data-direction={direction}
        style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      >
        {group("a")}
        {group("b")}
      </div>
    </div>
  );
}
