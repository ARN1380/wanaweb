import { FadeUp } from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { testimonials } from "@/lib/people";

export default function Testimonials() {
  return (
    <section id="signal" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-[var(--shell)]">
        <SectionHeading
          index={7}
          label={testimonials.label}
          lines={[testimonials.title]}
          emphasis="partners"
        />

        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {testimonials.items.map((item, index) => (
            <FadeUp key={item.quote.slice(0, 24)} delay={index * 110}>
              <figure className="hairline-t group flex h-full flex-col gap-6 pt-8">
                <span
                  aria-hidden="true"
                  className="serif-accent text-4xl leading-none"
                >
                  &ldquo;
                </span>

                <blockquote className="text-base leading-relaxed text-bone/90 sm:text-lg">
                  {item.quote}
                </blockquote>

                <figcaption className="mt-auto flex flex-col gap-1 pt-2">
                  <span className="text-sm font-medium text-bone">
                    {item.name}
                  </span>
                  <span className="font-mono text-[0.62rem] tracking-[0.16em] text-muted uppercase">
                    {item.company}
                  </span>
                </figcaption>
              </figure>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
