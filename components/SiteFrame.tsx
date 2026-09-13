import { accentColor, accentWash } from "@/lib/accents";
import type { Project } from "@/lib/dictionaries/types";
import { cn } from "@/lib/util";

type SiteFrameProps = {
  project: Project;
  className?: string;
};

/**
 * A website mockup, drawn entirely with type and CSS.
 *
 * This repository ships no image assets, so every preview here is assembled
 * from the project's own copy and accent rather than a screenshot. Type is
 * sized in container units, which is what keeps the mockup legible both as a
 * card in the reduced-motion grid and as a 40 rem frame at the front of the 3D
 * wall — the same markup, scaled by its own width.
 */
export default function SiteFrame({ project, className }: SiteFrameProps) {
  const accent = accentColor[project.accent];

  return (
    <div
      className={cn(
        "@container relative overflow-hidden rounded-2xl border border-hairline bg-ink-raised",
        className,
      )}
    >
      {/* Browser chrome. */}
      <div className="relative z-10 flex items-center gap-[3cqw] border-b border-hairline bg-ink/80 px-[3.5cqw] py-[2cqw]">
        <span aria-hidden="true" className="flex gap-[1.1cqw]">
          {[0.34, 0.22, 0.14].map((opacity) => (
            <span
              key={opacity}
              className="size-[1.15cqw] rounded-full bg-bone"
              style={{ opacity }}
            />
          ))}
        </span>

        <span className="min-w-0 flex-1 truncate rounded-full border border-hairline bg-ink/70 px-[2.5cqw] py-[0.7cqw] text-center font-mono text-[clamp(0.5rem,1.45cqw,0.7rem)] text-muted">
          {project.id}.com
        </span>

        <span
          aria-hidden="true"
          className="size-[1.35cqw] shrink-0 rounded-full"
          style={{ backgroundColor: accent }}
        />
      </div>

      {/* The page itself. */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 bg-gradient-to-br",
            accentWash[project.accent],
          )}
        />
        <div aria-hidden="true" className="grid-pattern absolute inset-0 opacity-30" />

        <div className="relative flex h-full flex-col p-[5cqw]">
          {/* Mock site nav: the client's mark, then three skeleton links. */}
          <div className="flex items-center justify-between gap-[4cqw]">
            <span className="truncate font-mono text-[clamp(0.5rem,1.7cqw,0.75rem)] tracking-[0.2em] text-bone/80 uppercase">
              {project.client}
            </span>
            <span aria-hidden="true" className="flex shrink-0 gap-[2.2cqw]">
              {[4.5, 3.2, 5].map((width, index) => (
                <span
                  key={index}
                  className="h-[0.7cqw] rounded-full bg-bone/25"
                  style={{ width: `${width}cqw` }}
                />
              ))}
            </span>
          </div>

          <p className="display-type mt-[5.5cqw] max-w-[88%] text-[clamp(0.85rem,5.2cqw,2.1rem)] text-bone">
            {project.title}
          </p>

          <div className="mt-auto flex items-end justify-between gap-[3cqw]">
            <dl className="flex shrink-0 gap-[4cqw]">
              {project.results.slice(0, 2).map((result) => (
                <div key={result.v}>
                  <dt className="sr-only">{result.v}</dt>
                  <dd>
                    <span className="iridescent-text block text-[clamp(0.7rem,3cqw,1.3rem)] font-semibold tracking-[-0.02em]">
                      {result.k}
                    </span>
                    <span className="mt-[0.8cqw] block font-mono text-[clamp(0.4rem,1.25cqw,0.6rem)] tracking-[0.12em] text-muted uppercase">
                      {result.v}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            {/* The mockup's own CTA — the first technology, on the accent. */}
            <span
              className="hidden shrink-0 rounded-full px-[3cqw] py-[1.3cqw] font-mono text-[clamp(0.45rem,1.35cqw,0.65rem)] tracking-[0.14em] uppercase @[24rem]:inline-flex"
              style={{ backgroundColor: accent, color: "#050506" }}
            >
              {project.stack[0]}
            </span>
          </div>
        </div>

        {/* Ghost index, cropped by the frame the way a real page crops. */}
        <span
          aria-hidden="true"
          className="iridescent-text pointer-events-none absolute end-[-1cqw] -bottom-[7cqw] text-[32cqw] leading-none font-semibold opacity-[0.08]"
        >
          {project.index}
        </span>
      </div>
    </div>
  );
}
