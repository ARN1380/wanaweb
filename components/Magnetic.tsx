"use client";

import {
  useRef,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

import { cn } from "@/lib/util";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** How far the element may drift toward the pointer, in px. */
  strength?: number;
};

/**
 * Pointer-follow "magnetic" hover. The child eases toward the cursor while it
 * is inside the bounds and springs back on exit. Disabled for coarse pointers.
 */
export default function Magnetic({
  children,
  className,
  strength = 14,
}: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const reset = () => {
    const node = ref.current;
    if (node) node.style.transform = "translate3d(0, 0, 0)";
  };

  const onMove = (event: ReactPointerEvent<HTMLSpanElement>) => {
    const node = ref.current;
    if (!node) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const rect = node.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);

    node.style.transform = `translate3d(${(x / rect.width) * strength * 2}px, ${
      (y / rect.height) * strength * 2
    }px, 0)`;
  };

  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={cn(
        "inline-block transition-transform duration-500 ease-expo will-change-transform",
        className,
      )}
    >
      {children}
    </span>
  );
}
