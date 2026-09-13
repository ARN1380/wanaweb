"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

import { FadeUp, Kicker, MaskedLines } from "@/components/Reveal";
import {
  projects,
  work,
  type Project,
  type ProjectAccent,
} from "@/lib/projects";
import { cn, prefersReducedMotion } from "@/lib/util";

const accentWash: Record<ProjectAccent, string> = {
  violet: "from-violet/30 via-cyan/10 to-transparent",
  cyan: "from-cyan/30 via-lime/10 to-transparent",
  lime: "from-lime/25 via-violet/10 to-transparent",
};

const accentDot: Record<ProjectAccent, string> = {
  violet: "bg-violet",
  cyan: "bg-cyan",
  lime: "bg-lime",
};

type ProjectCardProps = {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
};

/**
 * One case study. The cards are `position: sticky` siblings with a staggered
 * top offset, so each slides over the last as the page scrolls — the outgoing
 * card scales back to create depth.
 */
function ProjectCard({ project, index, total, progress }: ProjectCardProps) {
  const start = index / total;
  const end = (index + 1) / total;

  const scale = useTransform(progress, [start, end], [1, 0.94]);
  const opacity = useTransform(progress, [start, end], [1, 0.6]);

  const reduced = prefersReducedMotion();
  const top = `calc(var(--nav-h) + 0.5rem + ${index * 0.85}rem)`;

  return (
    <motion.div
      className="sticky mb-[14vh] last:mb-0"
      style={reduced ? { top } : { top, scale, opacity }}
    >
      <article className="relative overflow-hidden rounded-3xl border border-hairline bg-ink-raised shadow-[0_-24px_70px_-34px_rgb(0_0_0/0.95)]">
        <div className="grid lg:grid-cols-[1.06fr_0.94fr]">
          <div className="flex flex-col gap-6 p-7 sm:p-10 lg:p-12">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="font-mono text-[0.62rem] tracking-[0.2em] text-lime">
                {project.index}
              </span>
              <span
                aria-hidden="true"
                className={cn("size-1.5 rounded-full", accentDot[project.accent])}
              />
              <span className="font-mono text-[0.62rem] tracking-[0.16em] text-muted uppercase">
                {project.sector}
              </span>
              <span className="font-mono text-[0.62rem] tracking-[0.16em] text-muted/60 uppercase">
                {project.year}
              </span>
            </div>

            <div>
              <h3 className="display-type text-[clamp(1.7rem,4vw,2.9rem)] text-bone">
                {project.client}
              </h3>
              <p className="serif-accent mt-2 text-[clamp(1.05rem,2vw,1.4rem)]">
                {project.title}
              </p>
            </div>

            <p className="text-sm leading-relaxed text-muted sm:text-base">
              {project.summary}
            </p>

            <dl className="grid grid-cols-3 gap-4 border-t border-hairline pt-5">
              {project.results.map((result) => (
                <div key={result.v}>
                  <dt className="sr-only">{result.v}</dt>
                  <dd>
                    <span className="iridescent-text block text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                      {result.k}
                    </span>
                    <span className="mt-1 block font-mono text-[0.55rem] leading-relaxed tracking-[0.12em] text-muted uppercase">
                      {result.v}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap gap-2">
              {project.services.map((service) => (
                <span
                  key={service}
                  className="rounded-full border border-hairline px-3 py-1 font-mono text-[0.58rem] tracking-[0.12em] text-muted uppercase"
                >
                  {service}
                </span>
              ))}
            </div>

            <a
              href="#contact"
              className="group mt-1 inline-flex w-fit items-center gap-2 font-mono text-[0.66rem] tracking-[0.18em] text-lime uppercase"
            >
              {work.cta}
              <span
                aria-hidden="true"
                className="transition-transform duration-500 ease-expo group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>

          <div className="relative min-h-[17rem] overflow-hidden border-t border-hairline lg:min-h-0 lg:border-t-0 lg:border-l">
            <div
              aria-hidden="true"
              className={cn(
                "absolute inset-0 bg-gradient-to-br",
                accentWash[project.accent],
              )}
            />
            <div aria-hidden="true" className="grid-pattern absolute inset-0 opacity-50" />

            {[0, 1, 2, 3].map((ring) => (
              <span
                key={ring}
                aria-hidden="true"
                className="ring-breathe absolute top-1/2 left-1/2 rounded-full border border-bone/12"
                style={{
                  width: `${9 + ring * 6.5}rem`,
                  height: `${9 + ring * 6.5}rem`,
                  animationDelay: `${ring * 0.9}s`,
                }}
              />
            ))}

            <span className="absolute top-6 left-6 font-mono text-[0.58rem] tracking-[0.18em] text-bone/70 uppercase">
              {project.stack[0]}
            </span>

            <span className="absolute right-5 bottom-6 font-mono text-[0.55rem] tracking-[0.16em] text-bone/45 uppercase">
              {project.stack.slice(1).join(" · ")}
            </span>

            <span
              aria-hidden="true"
              className="iridescent-text absolute bottom-8 left-5 text-[7.5rem] leading-none font-semibold tracking-[-0.05em] opacity-20"
            >
              {project.index}
            </span>
          </div>
        </div>
      </article>
    </motion.div>
  );
}

export default function Work() {
  const stackRef = useRef<HTMLDivElement>(null);

  /**
   * Progress across the whole stack drives the depth effect: as each card is
   * covered by the next, it scales back and dims.
   */
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  });

  return (
    <section id="work" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-[var(--shell)]">
        <header className="flex flex-col gap-6">
          <FadeUp>
            <Kicker>{work.label}</Kicker>
          </FadeUp>

          <h2 className="display-type max-w-3xl text-[clamp(2.1rem,6.2vw,4.6rem)]">
            <MaskedLines lines={[work.title]} emphasis={work.emphasis} />
          </h2>

          <FadeUp delay={120}>
            <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {work.body}
            </p>
          </FadeUp>
        </header>
      </div>

      {/*
        Deliberately not wrapped in <FadeUp>: a transform on an ancestor turns it
        into the containing block for `position: sticky` and breaks the stack.
      */}
      <div ref={stackRef} className="mx-auto mt-16 max-w-7xl px-[var(--shell)]">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            total={projects.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}
