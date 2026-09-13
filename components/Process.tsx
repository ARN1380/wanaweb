"use client";

import { useInView } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { FadeUp } from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import type { Dictionary } from "@/lib/dictionaries/types";
import { cn } from "@/lib/util";

type Step = Dictionary["process"]["steps"][number];

type ProcessProps = {
  process: Dictionary["process"];
};

function StepCard({
  step,
  index,
  onActive,
}: {
  step: Step;
  index: number;
  onActive: (index: number) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { margin: "-40% 0px -40% 0px" });

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <li ref={ref} className="hairline-t py-10 first:border-t-0 first:pt-0">
      <FadeUp>
        <div className="flex items-baseline gap-5">
          <span className="font-mono text-[0.62rem] tracking-[0.2em] text-lime/80">
            {step.step}
          </span>
          <span className="font-mono text-[0.62rem] tracking-[0.18em] text-muted uppercase">
            {step.duration}
          </span>
        </div>

        <h3 className="display-type mt-4 text-[clamp(1.6rem,3.6vw,2.4rem)] text-bone">
          {step.title}
        </h3>

        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          {step.body}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {step.deliverables.map((item) => (
            <li
              key={item}
              className="rounded-full border border-hairline px-3 py-1 font-mono text-[0.6rem] tracking-[0.12em] text-muted uppercase"
            >
              {item}
            </li>
          ))}
        </ul>
      </FadeUp>
    </li>
  );
}

export default function Process({ process }: ProcessProps) {
  const [active, setActive] = useState(0);
  const onActive = useCallback((index: number) => setActive(index), []);

  return (
    <section id="process" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-[var(--shell)]">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <SectionHeading
              index={4}
              label={process.label}
              lines={[process.title]}
              emphasis={process.emphasis}
            />

            <ol className="mt-10 hidden flex-col gap-1 lg:flex">
              {process.steps.map((step, index) => (
                <li key={step.step}>
                  <span
                    className={cn(
                      "flex items-center gap-3 py-2 font-mono text-[0.7rem] tracking-[0.16em] uppercase transition-colors duration-500",
                      active === index ? "text-bone" : "text-muted/60",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-px transition-all duration-500 ease-expo",
                        active === index
                          ? "w-10 bg-lime"
                          : "w-4 bg-bone/25",
                      )}
                    />
                    {step.title}
                  </span>
                </li>
              ))}
            </ol>

            <div
              aria-hidden="true"
              className="mt-6 hidden h-px w-full bg-hairline lg:block"
            >
              <span
                className="block h-px bg-gradient-to-r from-violet via-cyan to-lime transition-all duration-700 ease-expo"
                style={{
                  width: `${((active + 1) / process.steps.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <ol className="flex flex-col">
            {process.steps.map((step, index) => (
              <StepCard
                key={step.step}
                step={step}
                index={index}
                onActive={onActive}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
