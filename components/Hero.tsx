"use client";

import dynamic from "next/dynamic";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import Magnetic from "@/components/Magnetic";
import Marquee from "@/components/Marquee";
import { FadeUp, MaskedLines } from "@/components/Reveal";
import type { Dictionary } from "@/lib/dictionaries/types";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => <div className="canvas-fallback absolute inset-0" />,
});

type HeroProps = {
  hero: Dictionary["hero"];
  marquee: Dictionary["marquee"];
};

export default function Hero({ hero, marquee }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const canvasScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);

  return (
    <>
      <section
        id="top"
        ref={sectionRef}
        className="relative min-h-svh w-full overflow-hidden bg-ink"
      >
        <motion.div
          style={{ scale: canvasScale }}
          className="absolute inset-0 will-change-transform"
        >
          <HeroScene active={inView} />
        </motion.div>

        <div className="grid-pattern gridlines-local" aria-hidden="true" />
        <div
          className="noise-veil absolute inset-x-0 bottom-0 h-[38vh]"
          aria-hidden="true"
        />

        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-10 mx-auto flex min-h-svh max-w-7xl flex-col px-[var(--shell)] pt-32 pb-10 sm:pt-36"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <FadeUp>
              <span className="kicker">{hero.kicker}</span>
            </FadeUp>

            <FadeUp delay={120}>
              <span className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 font-mono text-[0.62rem] tracking-[0.18em] text-bone/80 uppercase">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-70" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-lime" />
                </span>
                {hero.status}
              </span>
            </FadeUp>
          </div>

          <div className="flex-1" />

          <h1 className="display-type max-w-4xl text-[clamp(2.5rem,8.4vw,6.6rem)]">
            <MaskedLines lines={hero.headline} emphasis={hero.emphasis} />
          </h1>

          <div className="mt-10 grid items-end gap-8 border-t border-hairline pt-8 lg:grid-cols-[1.15fr_auto] lg:gap-16">
            <FadeUp delay={260}>
              <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                {hero.sub}
              </p>
            </FadeUp>

            <FadeUp delay={360} className="flex flex-wrap items-center gap-3">
              <Magnetic>
                <a
                  href={hero.primaryCta.href}
                  className="group inline-flex items-center gap-2.5 rounded-full bg-lime px-6 py-3.5 font-mono text-[0.72rem] tracking-[0.18em] text-ink uppercase transition-colors duration-300 hover:bg-bone"
                >
                  {hero.primaryCta.label}
                  <span aria-hidden="true" className="arrow-forward">
                    →
                  </span>
                </a>
              </Magnetic>

              <a
                href={hero.secondaryCta.href}
                className="inline-flex items-center gap-2.5 rounded-full border border-hairline px-6 py-3.5 font-mono text-[0.72rem] tracking-[0.18em] text-bone uppercase transition-colors duration-300 hover:border-lime/60 hover:text-lime"
              >
                {hero.secondaryCta.label}
              </a>
            </FadeUp>
          </div>

          <FadeUp delay={440} className="mt-8 hidden items-center gap-3 sm:flex">
            <motion.span
              aria-hidden="true"
              className="block h-10 w-px origin-top bg-gradient-to-b from-lime to-transparent"
              animate={{ scaleY: [0.35, 1, 0.35] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="kicker">{hero.scrollCue}</span>
          </FadeUp>
        </motion.div>
      </section>

      <div className="hairline-t hairline-b relative z-10 bg-ink/60 py-5 backdrop-blur-sm">
        <Marquee items={marquee} duration={48} itemClassName="text-bone/70" />
      </div>
    </>
  );
}
