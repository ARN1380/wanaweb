import { cn } from "@/lib/util";

type LogoProps = {
  className?: string;
  /** Hide the wordmark and render the monogram only. */
  markOnly?: boolean;
};

/** WanaWeb monogram + wordmark. Pure SVG so it stays crisp at any size. */
export default function Logo({ className, markOnly = false }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 40 40"
        className="size-8 shrink-0"
        role="img"
        aria-label="WanaWeb"
      >
        <defs>
          <linearGradient id="ww-logo" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7c5cff" />
            <stop offset="46%" stopColor="#3ddcff" />
            <stop offset="100%" stopColor="#c8ff4d" />
          </linearGradient>
        </defs>
        <rect
          x="1"
          y="1"
          width="38"
          height="38"
          rx="11"
          fill="none"
          stroke="url(#ww-logo)"
          strokeWidth="1.4"
          opacity="0.85"
        />
        <path
          d="M8.5 13.5 13.4 27l3.9-9.2 3.9 9.2 4.9-13.5"
          fill="none"
          stroke="url(#ww-logo)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="29.4" cy="13.6" r="1.9" fill="#c8ff4d" />
      </svg>

      {!markOnly && (
        <span className="text-[0.95rem] font-semibold tracking-[-0.03em]">
          Wana<span className="text-lime">Web</span>
        </span>
      )}
    </span>
  );
}
