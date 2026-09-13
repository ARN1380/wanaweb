"use client";

import { useState } from "react";

import { FadeUp, Kicker, MaskedLines } from "@/components/Reveal";
import { faq } from "@/lib/faq";
import { cn } from "@/lib/util";

export default function Faq() {
  // The first answer is open so the pattern is legible without interaction.
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-[var(--shell)]">
        <div className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <header className="flex flex-col gap-6 lg:sticky lg:top-28 lg:h-fit">
            <FadeUp>
              <Kicker>{faq.label}</Kicker>
            </FadeUp>

            <h2 className="display-type text-[clamp(2.1rem,6.2vw,4.2rem)]">
              <MaskedLines lines={[faq.title]} emphasis={faq.emphasis} />
            </h2>

            <FadeUp delay={120}>
              <p className="max-w-md text-base leading-relaxed text-muted">
                {faq.body}
              </p>
            </FadeUp>

            <FadeUp delay={200}>
              <a
                href="#contact"
                className="group inline-flex w-fit items-center gap-2 font-mono text-[0.66rem] tracking-[0.18em] text-lime uppercase"
              >
                Ask us directly
                <span
                  aria-hidden="true"
                  className="transition-transform duration-500 ease-expo group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </FadeUp>
          </header>

          <ul className="flex flex-col">
            {faq.items.map((item, index) => {
              const isOpen = open === index;

              return (
                <li key={item.q} className="hairline-b first:border-t first:border-hairline">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${index}`}
                      className="flex w-full items-start justify-between gap-6 py-6 text-left"
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="font-mono text-[0.58rem] tracking-[0.2em] text-lime/70">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cn(
                            "text-base font-medium tracking-[-0.01em] transition-colors duration-300 sm:text-lg",
                            isOpen ? "text-bone" : "text-bone/75 hover:text-bone",
                          )}
                        >
                          {item.q}
                        </span>
                      </span>

                      <span
                        aria-hidden="true"
                        className={cn(
                          "relative mt-1.5 size-4 shrink-0 transition-transform duration-500 ease-expo",
                          isOpen && "rotate-45",
                        )}
                      >
                        <span className="absolute top-1/2 left-0 h-px w-4 -translate-y-1/2 bg-lime" />
                        <span className="absolute top-0 left-1/2 h-4 w-px -translate-x-1/2 bg-lime" />
                      </span>
                    </button>
                  </h3>

                  {/*
                    grid-template-rows 0fr → 1fr animates to intrinsic height
                    without measuring anything in JS.
                  */}
                  <div
                    id={`faq-panel-${index}`}
                    className={cn(
                      "grid transition-[grid-template-rows] duration-500 ease-expo",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p
                        className={cn(
                          "max-w-2xl pb-7 pl-0 text-sm leading-relaxed text-muted transition-opacity duration-500 sm:pl-10 sm:text-base",
                          isOpen ? "opacity-100" : "opacity-0",
                        )}
                      >
                        {item.a}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
