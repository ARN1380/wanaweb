import Image from "next/image";

import { accentColor } from "@/lib/accents";
import type { Project } from "@/lib/dictionaries/types";
import { shotFor } from "@/lib/shots";
import { cn } from "@/lib/util";

type SiteFrameProps = {
  project: Project;
  className?: string;
};

/**
 * A real screenshot of a live site, framed as a browser window.
 *
 * `components/three/siteTexture.ts` draws the same frame into the gallery's
 * texture — this is its DOM twin, and the one the reduced-motion grid renders:
 * real `<img>` pixels, selectable text in the chrome, and a screenshot the
 * screen reader can name. **Change both** when the frame's design changes.
 *
 * A project with no capture yet falls back to the accent wash rather than an
 * empty window, so an un-captured site degrades instead of looking broken.
 */
export default function SiteFrame({ project, className }: SiteFrameProps) {
  const accent = accentColor[project.accent];
  const shot = shotFor(project.id);

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
          {shot?.host ?? project.client}
        </span>

        <span
          aria-hidden="true"
          className="size-[1.35cqw] shrink-0 rounded-full"
          style={{ backgroundColor: accent }}
        />
      </div>

      {/*
        The page itself. A capture is a whole page tall, so the window shows its
        top edge — the same crop the 3D panel makes.
      */}
      <div className="relative aspect-[16/10] overflow-hidden bg-ink">
        {shot ? (
          <Image
            src={shot.src}
            alt={`${project.client} — ${project.title}`}
            fill
            sizes="(min-width: 640px) 45vw, 92vw"
            className="object-cover object-top"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(135deg, ${accent}4d, transparent 60%)`,
            }}
          />
        )}
      </div>
    </div>
  );
}
