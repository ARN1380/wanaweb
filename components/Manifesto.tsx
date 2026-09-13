import Counter from "@/components/Counter";
import { FadeUp } from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import type { Dictionary } from "@/lib/dictionaries/types";

type ManifestoProps = {
  manifesto: Dictionary["manifesto"];
  stats: Dictionary["stats"];
};

export default function Manifesto({ manifesto, stats }: ManifestoProps) {
  return (
    <section id="studio" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-[var(--shell)]">
        <SectionHeading
          index={1}
          label={manifesto.label}
          lines={[manifesto.title]}
          emphasis={manifesto.emphasis}
        />

        <div className="mt-14 grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div className="flex flex-col gap-6">
            {manifesto.body.map((paragraph, index) => (
              <FadeUp key={paragraph.slice(0, 24)} delay={index * 90}>
                <p className="text-base leading-relaxed text-muted sm:text-lg">
                  {paragraph}
                </p>
              </FadeUp>
            ))}
          </div>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline">
            {stats.map((stat, index) => (
              <FadeUp
                key={stat.label}
                delay={index * 80}
                className="bg-ink-raised/70 p-5 sm:p-6"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="iridescent-text block text-[clamp(1.9rem,5vw,2.9rem)] font-semibold tracking-[-0.04em]">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="mt-2 block text-sm leading-snug text-bone/85">
                    {stat.label}
                  </span>
                  <span className="mt-1 block font-mono text-[0.62rem] tracking-[0.14em] text-muted uppercase">
                    {stat.hint}
                  </span>
                </dd>
              </FadeUp>
            ))}
          </dl>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {manifesto.pillars.map((pillar, index) => (
            <FadeUp key={pillar.title} delay={index * 110}>
              <article className="hairline-t group flex h-full flex-col gap-4 pt-6">
                <span className="font-mono text-[0.62rem] tracking-[0.2em] text-lime/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-semibold tracking-[-0.02em] text-bone">
                  {pillar.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">{pillar.body}</p>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
