import { cn } from "@/lib/util";
import { FadeUp, Kicker, MaskedLines } from "@/components/Reveal";

type SectionHeadingProps = {
  index: number;
  label: string;
  lines: readonly string[];
  emphasis?: string;
  body?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
};

/** Numbered editorial section header shared by every block on the page. */
export default function SectionHeading({
  index,
  label,
  lines,
  emphasis,
  body,
  align = "left",
  className,
  titleClassName,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <header
      className={cn(
        "flex flex-col gap-6",
        centered && "items-center text-center",
        className,
      )}
    >
      <FadeUp className={cn(centered && "flex justify-center")}>
        <Kicker>
          {String(index).padStart(2, "0")} / {label}
        </Kicker>
      </FadeUp>

      <h2
        className={cn(
          "display-type text-[clamp(2.1rem,6.2vw,4.6rem)]",
          titleClassName,
        )}
      >
        <MaskedLines lines={lines} emphasis={emphasis} />
      </h2>

      {body && (
        <FadeUp delay={120} className={cn("max-w-2xl", centered && "mx-auto")}>
          <p className="text-base leading-relaxed text-muted sm:text-lg">
            {body}
          </p>
        </FadeUp>
      )}
    </header>
  );
}
