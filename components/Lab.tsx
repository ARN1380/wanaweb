"use client";

import dynamic from "next/dynamic";
import { useInView } from "motion/react";
import { useRef } from "react";

import { FadeUp } from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import type { Dictionary } from "@/lib/dictionaries/types";

const LabScene = dynamic(() => import("@/components/three/LabScene"), {
  ssr: false,
  loading: () => <div className="canvas-fallback absolute inset-0" />,
});

type LabProps = {
  lab: Dictionary["lab"];
  stage: Dictionary["ui"]["labStage"];
};

export default function Lab({ lab, stage }: LabProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.05 });

  return (
    <section id="lab" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-[var(--shell)]">
        <SectionHeading
          index={3}
          label={lab.label}
          lines={[lab.title]}
          emphasis={lab.emphasis}
          body={lab.body}
        />
      </div>

      <FadeUp delay={120} className="mt-14">
        <div
          ref={stageRef}
          className="relative h-[64vh] min-h-[420px] w-full overflow-hidden border-y border-hairline sm:h-[78vh]"
        >
          <LabScene active={inView} />

          <div
            aria-hidden="true"
            className="grid-pattern pointer-events-none absolute inset-0 opacity-20"
          />

          <div className="pointer-events-none absolute top-5 left-5 flex items-center gap-2 sm:top-7 sm:left-7">
            <span className="glass rounded-full px-3.5 py-1.5 font-mono text-[0.6rem] tracking-[0.18em] text-bone/80 uppercase">
              {lab.hints.auto}
            </span>
          </div>

          <div className="pointer-events-none absolute top-5 right-5 hidden sm:top-7 sm:right-7 sm:block">
            <span className="font-mono text-[0.6rem] tracking-[0.18em] text-muted uppercase">
              {stage.live}
            </span>
          </div>

          <div className="pointer-events-none absolute bottom-5 left-5 sm:bottom-7 sm:left-7">
            <span className="glass inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 font-mono text-[0.6rem] tracking-[0.18em] text-lime uppercase">
              <span
                aria-hidden="true"
                className="inline-block size-1.5 rounded-full bg-lime"
              />
              {lab.hints.drag}
            </span>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-5 bottom-5 hidden font-mono text-[0.6rem] tracking-[0.18em] text-muted uppercase sm:right-7 sm:bottom-7 sm:block"
          >
            {stage.geometry}
          </div>
        </div>
      </FadeUp>

      <div className="mx-auto mt-10 max-w-7xl px-[var(--shell)]">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline lg:grid-cols-4">
          {lab.facts.map((fact, index) => (
            <FadeUp key={fact.v} delay={index * 70} className="bg-ink/65 p-5">
              <dt className="font-mono text-[0.62rem] tracking-[0.16em] text-muted uppercase">
                {fact.v}
              </dt>
              <dd className="iridescent-text mt-2 text-xl font-semibold tracking-[-0.02em]">
                {fact.k}
              </dd>
            </FadeUp>
          ))}
        </dl>
      </div>
    </section>
  );
}
