import { FadeUp } from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import ServiceIcon from "@/components/ServiceIcon";
import type { Dictionary } from "@/lib/dictionaries/types";

type ServicesProps = {
  services: Dictionary["services"];
};

export default function Services({ services }: ServicesProps) {
  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-[var(--shell)]">
        <SectionHeading
          index={2}
          label={services.label}
          lines={[services.title]}
          emphasis={services.emphasis}
          body={services.body}
        />

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.items.map((service, index) => (
            <FadeUp key={service.id} delay={(index % 3) * 90}>
              <article className="group relative h-full overflow-hidden rounded-2xl">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-violet via-cyan to-lime opacity-10 transition-opacity duration-700 group-hover:opacity-30"
                />

                <div className="relative m-px flex h-full flex-col gap-5 rounded-[15px] bg-ink/92 p-6 sm:p-7">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-violet/20 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:bg-cyan/20"
                  />

                  <div className="relative flex items-start justify-between gap-4">
                    <span className="flex size-11 items-center justify-center rounded-xl border border-hairline bg-ink-raised/80 text-lime transition-colors duration-500 group-hover:border-lime/40 group-hover:text-bone">
                      <ServiceIcon name={service.icon} className="size-5" />
                    </span>
                    <span className="font-mono text-[0.62rem] tracking-[0.2em] text-muted/60 transition-colors duration-500 group-hover:text-lime">
                      {service.index}
                    </span>
                  </div>

                  <h3 className="relative text-lg font-semibold tracking-[-0.02em] text-balance text-bone">
                    {service.title}
                  </h3>

                  <p className="relative text-sm leading-relaxed text-muted">
                    {service.blurb}
                  </p>

                  <ul className="relative mt-auto flex flex-wrap gap-2 pt-2">
                    {service.points.map((point) => (
                      <li
                        key={point}
                        className="rounded-full border border-hairline px-3 py-1 font-mono text-[0.6rem] tracking-[0.12em] text-muted uppercase transition-colors duration-500 group-hover:border-bone/15 group-hover:text-bone/80"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
