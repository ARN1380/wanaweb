import { FadeUp } from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { stack } from "@/lib/work";

export default function Stack() {
  return (
    <section id="stack" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-[var(--shell)]">
        <SectionHeading
          index={5}
          label={stack.label}
          lines={[stack.title]}
          emphasis={stack.emphasis}
          body={stack.body}
        />

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stack.groups.map((group, groupIndex) => (
            <FadeUp key={group.name} delay={groupIndex * 90}>
              <div className="flex flex-col">
                <h3 className="kicker mb-5 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="inline-block size-1.5 rounded-full bg-lime"
                  />
                  {group.name}
                </h3>

                <ul className="flex flex-col">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="group/item hairline-b flex items-center justify-between gap-4 py-3.5"
                    >
                      <span className="text-sm text-muted transition-colors duration-300 group-hover/item:text-bone">
                        {item}
                      </span>
                      <span
                        aria-hidden="true"
                        className="translate-x-0 font-mono text-xs text-lime opacity-0 transition-all duration-500 ease-expo group-hover/item:translate-x-0.5 group-hover/item:opacity-100"
                      >
                        →
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
