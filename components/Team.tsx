import { FadeUp } from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import type { Accent, Dictionary } from "@/lib/dictionaries/types";
import { cn } from "@/lib/util";

type TeamProps = {
  team: Dictionary["team"];
};

const accentStyles: Record<Accent, string> = {
  violet: "from-violet via-cyan/70 to-violet/30",
  cyan: "from-cyan via-lime/60 to-cyan/30",
  lime: "from-lime via-violet/60 to-lime/30",
};

export default function Team({ team }: TeamProps) {
  return (
    <section id="team" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-[var(--shell)]">
        <SectionHeading
          index={6}
          label={team.label}
          lines={[team.title]}
          emphasis={team.emphasis}
          body={team.body}
        />

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.members.map((member, index) => (
            <FadeUp key={member.name} delay={(index % 3) * 90}>
              <article className="group relative h-full overflow-hidden rounded-2xl">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-violet via-cyan to-lime opacity-[0.08] transition-opacity duration-700 group-hover:opacity-30"
                />

                <div className="relative m-px flex h-full flex-col gap-5 rounded-[15px] bg-ink/92 p-6 sm:p-7">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-20 -right-20 size-44 rounded-full bg-cyan/15 blur-3xl transition-all duration-700 group-hover:scale-125"
                  />

                  <div className="relative flex items-center gap-4">
                    <span className="relative flex size-14 shrink-0 items-center justify-center">
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-2xl border border-dashed border-bone/20 transition-transform duration-700 ease-expo group-hover:rotate-45"
                      />
                      <span
                        className={cn(
                          "flex size-11 items-center justify-center rounded-xl bg-gradient-to-br font-mono text-xs font-semibold tracking-[0.06em] text-ink",
                          accentStyles[member.accent],
                        )}
                      >
                        {member.initials}
                      </span>
                    </span>

                    <span className="flex flex-col">
                      <h3 className="text-base leading-tight font-semibold tracking-[-0.02em] text-bone">
                        {member.name}
                      </h3>
                      <span className="mt-1 font-mono text-[0.62rem] tracking-[0.16em] text-lime/80 uppercase">
                        {member.role}
                      </span>
                    </span>
                  </div>

                  <p className="relative text-sm leading-relaxed text-muted">
                    {member.bio}
                  </p>

                  <div className="relative mt-auto flex flex-wrap items-center justify-between gap-3 pt-1">
                    <span className="font-mono text-[0.58rem] tracking-[0.12em] text-muted/70 uppercase">
                      {member.focus}
                    </span>

                    {member.links.length > 0 && (
                      <span className="flex gap-3">
                        {member.links.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="font-mono text-[0.58rem] tracking-[0.14em] text-bone/70 uppercase transition-colors duration-300 hover:text-lime"
                          >
                            {link.label}
                          </a>
                        ))}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
