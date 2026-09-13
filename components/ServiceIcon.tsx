import type { ReactNode, SVGProps } from "react";

import type { Service } from "@/lib/work";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const shapes: Record<Service["icon"], ReactNode> = {
  layout: (
    <>
      <rect x="3" y="3.5" width="18" height="17" rx="2.5" />
      <path d="M3 9h18M9.5 9v11.5" />
    </>
  ),
  cube: (
    <>
      <path d="M12 2.8 20.4 7.4v9.2L12 21.2 3.6 16.6V7.4z" />
      <path d="M3.6 7.4 12 12l8.4-4.6M12 12v9.2" />
    </>
  ),
  bolt: (
    <>
      <path d="M13.6 2.5 4.8 13.4h5.4l-.8 8.1 8.8-10.9h-5.4z" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9.2" />
      <path d="m15.8 8.2-2.2 5.4-5.4 2.2 2.2-5.4z" />
    </>
  ),
  cart: (
    <>
      <path d="M5.2 8h13.6l-1.3 11.2a1.6 1.6 0 0 1-1.6 1.4H8.1a1.6 1.6 0 0 1-1.6-1.4z" />
      <path d="M8.8 8V6.2a3.2 3.2 0 0 1 6.4 0V8" />
    </>
  ),
  wave: (
    <>
      <path d="M2.8 15.4c2.3 0 2.7-3.1 4.6-3.1s2.3 3.1 4.6 3.1 2.7-3.1 4.6-3.1 2.3 3.1 4.6 3.1" />
      <path d="M2.8 9.6c2.3 0 2.7-3.1 4.6-3.1s2.3 3.1 4.6 3.1 2.7-3.1 4.6-3.1 2.3 3.1 4.6 3.1" opacity="0.45" />
    </>
  ),
};

export default function ServiceIcon({
  name,
  ...props
}: IconProps & { name: Service["icon"] }) {
  return (
    <svg {...base} aria-hidden="true" {...props}>
      {shapes[name]}
    </svg>
  );
}
