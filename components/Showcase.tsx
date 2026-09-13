"use client";

import dynamic from "next/dynamic";
import {
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

import {
  FadeUp,
  Kicker,
  MaskedLines,
  usePrefersReducedMotion,
} from "@/components/Reveal";
import SiteFrame from "@/components/SiteFrame";
import type { Dictionary } from "@/lib/dictionaries/types";
import { NAV_OFFSET, cn } from "@/lib/util";

/** Scroll distance between two sites, in vh. Also sets the section's length. */
const SLOT_SCROLL = 62;

/*
  The room is real 3D — panels, lights, reflections — so it is a canvas, and
  every canvas in this repository is dynamically imported with `ssr: false` and
  a CSS placeholder, per the conventions in AGENTS.md.
*/
const GalleryScene = dynamic(() => import("@/components/three/GalleryScene"), {
  ssr: false,
  loading: () => <div className="canvas-fallback absolute inset-0" />,
});

type ShowcaseProps = {
  gallery: Dictionary["gallery"];
  projects: Dictionary["projects"];
};

/**
 * The gallery itself: one tall track, one sticky viewport, four sites on a wall
 * that the page's scroll turns through. Scrolling is the interaction, so the
 * caption strip carries the two things scrolling cannot: where you are, and
 * where to go next.
 */
function GalleryStage({ gallery, projects }: ShowcaseProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const items = projects.items;
  const total = items.length;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const [front, setFront] = useState(0);

  // Only the frame that has just reached the front re-renders the caption.
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.max(0, Math.min(total - 1, Math.round(value * (total - 1))));
    setFront((current) => (current === next ? current : next));
  });

  // Pointer parallax: the camera leans with the cursor, which is what stops a
  // 3D scene reading as a flat slideshow. The scene reads these per frame.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const stageRef = useRef<HTMLDivElement>(null);
  const onScreen = useInView(stageRef, { amount: 0.05 });

  const span = (total - 1) * SLOT_SCROLL;
  const current = items[front];

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;

    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const resetParallax = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <div
      ref={trackRef}
      className="relative mt-16"
      style={{ height: `calc(100svh + ${span}vh)` }}
    >
      {/*
        Scroll targets for the dots below. SmoothScroll parks every anchor 84px
        under the top of the viewport, so each marker is placed that much
        further down the track — which is what makes a dot land on its frame.
      */}
      {items.map((item, index) => (
        <span
          key={`marker-${item.id}`}
          id={`gallery-${index + 1}`}
          aria-hidden="true"
          className="pointer-events-none absolute start-0 w-px"
          style={{
            top: `calc(${(index * SLOT_SCROLL).toFixed(2)}vh + ${NAV_OFFSET}px)`,
            height: "1px",
          }}
        />
      ))}

      {/*
        Deliberately not wrapped in <FadeUp>: a transform on an ancestor makes
        it the containing block for `position: sticky` and breaks the track.
      */}
      <div
        ref={stageRef}
        className="sticky top-0 h-[100svh] overflow-hidden"
        onPointerMove={onPointerMove}
        onPointerLeave={resetParallax}
      >
        <GalleryScene
          projects={items}
          progress={scrollYProgress}
          pointerX={pointerX}
          pointerY={pointerY}
          front={front}
          active={onScreen}
        />

        <div className="pointer-events-none absolute inset-x-0 top-[calc(var(--nav-h)+1.25rem)] z-20">
          <div className="mx-auto max-w-7xl px-[var(--shell)]">
            <span className="glass inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 font-mono text-[0.6rem] tracking-[0.18em] text-bone/80 uppercase">
              <span
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full bg-lime"
              />
              {gallery.hint}
            </span>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20">
          <div className="mx-auto max-w-7xl px-[var(--shell)] pb-6 sm:pb-9">
            <div className="glass flex flex-wrap items-center justify-between gap-x-6 gap-y-4 rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4">
              <div className="flex min-w-0 items-center gap-4">
                <span className="font-mono text-[0.62rem] tracking-[0.2em] text-lime">
                  {current.index}
                  <span className="text-muted">
                    {" / "}
                    {String(total).padStart(2, "0")}
                  </span>
                </span>

                <div className="min-w-0">
                  <p className="display-type truncate text-base text-bone sm:text-lg">
                    {current.client}
                  </p>
                  <p className="mt-1 truncate font-mono text-[0.56rem] tracking-[0.16em] text-muted uppercase">
                    {current.sector}
                    {" · "}
                    {current.year}
                  </p>
                </div>
              </div>

              <div className="flex flex-1 items-center justify-end gap-4 sm:gap-6">
                <div className="flex items-center gap-1.5">
                  {items.map((item, index) => (
                    <a
                      key={`dot-${item.id}`}
                      href={`#gallery-${index + 1}`}
                      aria-label={item.client}
                      aria-current={index === front ? "true" : undefined}
                      className="group grid size-6 place-items-center"
                    >
                      <span
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-500 ease-expo",
                          index === front
                            ? "w-7 bg-lime"
                            : "w-1.5 bg-bone/30 group-hover:bg-bone/70",
                        )}
                      />
                    </a>
                  ))}
                </div>

                <a
                  href="#contact"
                  className="group inline-flex items-center gap-2 rounded-full bg-bone px-4 py-2 font-mono text-[0.6rem] tracking-[0.16em] text-ink uppercase transition-colors duration-300 hover:bg-lime"
                >
                  {gallery.cta}
                  <span aria-hidden="true" className="arrow-forward">
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Reduced motion gets the same four previews, laid out flat and static. */
function GalleryGrid({ projects }: { projects: Dictionary["projects"] }) {
  return (
    <div className="mx-auto mt-16 grid max-w-7xl gap-x-8 gap-y-10 px-[var(--shell)] sm:grid-cols-2">
      {projects.items.map((project, index) => (
        <FadeUp
          key={project.id}
          delay={index * 80}
          className="flex flex-col gap-4"
        >
          <SiteFrame project={project} />

          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.58rem] tracking-[0.16em] uppercase">
            <span className="text-lime">{project.index}</span>
            <span className="text-bone/80">{project.client}</span>
            <span className="text-muted">{project.sector}</span>
          </p>
        </FadeUp>
      ))}
    </div>
  );
}

export default function Showcase({ gallery, projects }: ShowcaseProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <section id="gallery" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-[var(--shell)]">
        <header className="flex flex-col gap-6">
          <FadeUp>
            <Kicker>{gallery.label}</Kicker>
          </FadeUp>

          <h2 className="display-type max-w-3xl text-[clamp(2.1rem,6.2vw,4.6rem)]">
            <MaskedLines lines={[gallery.title]} emphasis={gallery.emphasis} />
          </h2>

          <FadeUp delay={120}>
            <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {gallery.body}
            </p>
          </FadeUp>
        </header>
      </div>

      {reduced ? (
        <GalleryGrid projects={projects} />
      ) : (
        <GalleryStage gallery={gallery} projects={projects} />
      )}
    </section>
  );
}
