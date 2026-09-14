"use client";

import { Environment, Lightformer, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import type { MotionValue } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CanvasTexture,
  ClampToEdgeWrapping,
  SRGBColorSpace,
  type PerspectiveCamera as ThreePerspectiveCamera,
} from "three";

import {
  AccentLight,
  createPanelScroll,
  HallFloor,
  PANEL_STEP,
  SitePanel,
} from "@/components/three/GalleryObjects";
import {
  drawDeviceShell,
  drawPageSheet,
  pageScrollRange,
} from "@/components/three/siteTexture";
import { accentColor } from "@/lib/accents";
import type { Project } from "@/lib/dictionaries/types";
import { shotFor } from "@/lib/shots";

type GallerySceneProps = {
  projects: readonly Project[];
  /** Scroll progress across the gallery track, read per frame — never state. */
  progress: MotionValue<number>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  front: number;
  /**
   * True while the gallery is on screen: gates the render loop *and* the fetch
   * of the screenshots, so nothing is downloaded until the wall is reached.
   */
  active: boolean;
};

type SceneState = {
  /** One frame and one page texture per panel, in wall order. */
  textures: { shell: CanvasTexture; page: CanvasTexture; range: number }[];
  /** -1 in RTL, so the wall is read and travelled in the reading direction. */
  sign: number;
};

/** A wheel notch moves this share of the visible page; the gesture is relative. */
const NOTCH = 0.3;

/**
 * Load one site's screenshot, or resolve to null if it will not decode.
 *
 * A frame with no capture still renders — as the accent wash behind real
 * chrome — so a missing file degrades instead of leaving a hole in the wall.
 */
function loadShot(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

/**
 * The panels are drawn once the screenshots have arrived and the webfonts are
 * ready — the chrome's address is type, and drawing before the fonts land would
 * bake the fallback face into the texture for the whole session.
 *
 * Nothing is fetched until the gallery is on screen, and the built textures are
 * kept in state, so scrolling away and back does not throw the room away. Coming
 * back re-slices the canvases from images the browser has already cached, which
 * is a handful of milliseconds and not worth a second piece of state to avoid.
 */
function useSiteTextures(
  projects: readonly Project[],
  active: boolean,
): SceneState | null {
  const [scene, setScene] = useState<SceneState | null>(null);

  useEffect(() => {
    if (!active) return;

    let cancelled = false;
    let built: SceneState["textures"] = [];

    const build = async () => {
      await document.fonts.ready;

      const root = getComputedStyle(document.documentElement);
      const label =
        root.getPropertyValue("--font-label").trim() || "monospace";
      const rtl = document.documentElement.dir === "rtl";

      const images = await Promise.all(
        projects.map((project) => {
          const shot = shotFor(project.id);
          return shot ? loadShot(shot.src) : Promise.resolve(null);
        }),
      );
      if (cancelled) return;

      built = projects.map((project, index) => {
        const shot = shotFor(project.id);
        const accent = accentColor[project.accent];
        const image = images[index];
        const shell = new CanvasTexture(
          drawDeviceShell(shot?.host ?? "", accent, label),
        );
        const page = new CanvasTexture(drawPageSheet(image, accent));
        const range = image ? pageScrollRange(image.width, image.height) : 0;

        // `range` is the scrollable remainder, so the window shows `1 - range` of
        // the page: a page no taller than its window shows all of itself and
        // scrolls nowhere, which is exactly the portfolio's case.
        page.repeat.y = 1 - range;
        page.offset.y = range; // v = 0 is a texture's bottom, so this is its top.
        page.wrapS = ClampToEdgeWrapping;
        page.wrapT = ClampToEdgeWrapping;

        for (const texture of [shell, page]) {
          texture.colorSpace = SRGBColorSpace;
          texture.anisotropy = 4;
        }

        return { shell, page, range };
      });

      setScene({ textures: built, sign: rtl ? -1 : 1 });
    };

    void build();

    return () => {
      cancelled = true;
      built.forEach((entry) => {
        entry.shell.dispose();
        entry.page.dispose();
      });
    };
  }, [projects, active]);

  return scene;
}

/**
 * One frame per tick, and nothing else. The work lives in the callback its
 * *parent* owns: the scroll state is a ref created inside `GalleryScene`, and
 * React's compiler rightly refuses to see a ref that arrives as a prop mutated,
 * so the mutation happens where it was created and this only drives the clock.
 */
function FrameTick({ onTick }: { onTick: (delta: number) => void }) {
  useFrame((_, delta) => onTick(delta));
  return null;
}

/**
 * Keep the drawing buffer in step with the host element.
 *
 * Measured on this site: in the Persian page **every** R3F canvas — this one
 * included, and the hero's and the 3D lab's too — is sized 1001.12px tall,
 * while their containers are 900px and 702px. The value is R3F's measurement,
 * latched at mount and never revisited, and a canvas whose buffer disagrees with
 * its box renders at the wrong aspect: the room looks vertically stretched, in
 * one locale only.
 *
 * So the guard compares the *buffer itself* — ground truth — against the host box
 * and corrects both the renderer and R3F's store when they disagree. It settles
 * within a frame or two and then stops doing anything.
 */
function ViewportGuard() {
  const setSize = useThree((state) => state.setSize);
  const gl = useThree((state) => state.gl);

  useFrame(() => {
    const canvas = gl.domElement;
    const host = canvas.parentElement;
    if (!host) return;

    const width = host.clientWidth;
    const height = host.clientHeight;
    const dpr = gl.getPixelRatio();

    if (
      canvas.width !== Math.round(width * dpr) ||
      canvas.height !== Math.round(height * dpr)
    ) {
      gl.setSize(width, height);
      setSize(width, height);
    }
  });

  return null;
}

type CameraRigProps = {
  progress: MotionValue<number>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  count: number;
  sign: number;
  focusRef: { current: number };
};

/**
 * The camera walks the wall: scroll progress places it in front of a panel, and
 * the pointer leans it a few centimetres. Everything is read from motion values
 * inside the frame loop, so scrubbing the gallery never re-renders React.
 */
function CameraRig({
  progress,
  pointerX,
  pointerY,
  count,
  sign,
  focusRef,
}: CameraRigProps) {
  const cameraRef = useRef<ThreePerspectiveCamera>(null);

  useFrame((_, delta) => {
    const node = cameraRef.current;
    if (!node) return;

    const value = Math.min(1, Math.max(0, progress.get()));
    const target = (value * (count - 1) - (count - 1) / 2) * PANEL_STEP * sign;

    focusRef.current += (target - focusRef.current) * Math.min(1, delta * 5);

    node.position.x = focusRef.current + pointerX.get() * 0.24;
    node.position.y = 0.32 - pointerY.get() * 0.12;
    node.position.z = 4.6;
    node.lookAt(focusRef.current, 0.12, 0);
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      fov={38}
      position={[0, 0.32, 4.6]}
    />
  );
}

/**
 * A lit room with four site panels in it, rather than four cards pretending to
 * be 3D. Bloom is deliberately above the panels' mid-tones so the screens glow
 * at their highlights only and the artwork stays legible.
 */
export default function GalleryScene({
  projects,
  progress,
  pointerX,
  pointerY,
  front,
  active,
}: GallerySceneProps) {
  /*
    The inner scroll lives in one ref owned here: a wheel event must not re-render
    the room, and neither must a pointer crossing a screen. It is filled from the
    built textures and then driven from the frame loop.
  */
  const scroll = useRef(createPanelScroll());
  const scene = useSiteTextures(projects, active);
  const focusRef = useRef(0);
  const count = projects.length;
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const state = scroll.current;
    state.textures = scene ? scene.textures.map((entry) => entry.page) : [];
    state.limits = scene ? scene.textures.map((entry) => entry.range) : [];
    state.targets = state.limits.map(() => 0);
    state.values = state.limits.map(() => 0);
    state.hovered = -1;
  }, [scene]);

  const onHover = useCallback((index: number) => {
    scroll.current.hovered = index;
  }, []);

  const onLeave = useCallback((index: number) => {
    if (scroll.current.hovered === index) scroll.current.hovered = -1;
  }, []);

  /**
   * The page textures ease towards the wheel's target every frame. Easing — 
   * rather than jumping — is what makes a wheel gesture feel like a page
   * scrolling rather than a picture sliding, and writing the offset here is what
   * keeps it off React's render path.
   */
  const onTick = useCallback((delta: number) => {
    const state = scroll.current;

    for (let index = 0; index < state.textures.length; index += 1) {
      const limit = state.limits[index] ?? 0;
      const target = Math.max(0, Math.min(limit, state.targets[index] ?? 0));
      const current = state.values[index] ?? target;
      const next = current + (target - current) * Math.min(1, delta * 9);

      state.values[index] = Math.abs(next - target) < 0.0002 ? target : next;
      // v = 0 is a texture's bottom, so scrolling *down* lowers the offset.
      state.textures[index].offset.y = limit - state.values[index];
    }
  }, []);

  /*
    The inner scroll.

    A wheel event belongs to the page inside a screen only while the pointer is
    over that screen, which is what keeps walking the wall and reading a frame
    from fighting over the same gesture. Both ends hand the gesture back: when a
    page is already at its top or its bottom, nothing consumes the event and the
    wall moves on — so a visitor can never be trapped inside a frame.

    The listener is non-passive because it has to cancel the default scroll, and
    it stops propagation because Lenis listens for `wheel` on the window during
    the bubble phase: without that, the page would scroll *and* the screen would.
    Touch is deliberately not handled — a touch visitor walks the wall and the
    frames stay still (§10.16).
  */
  useEffect(() => {
    const node = host.current;
    if (!node) return;

    const onWheel = (event: WheelEvent) => {
      const state = scroll.current;
      const index = state.hovered;
      if (index < 0) return;

      const limit = state.limits[index] ?? 0;
      if (limit <= 0) return;

      // Normalise line- and page-mode deltas, as Lenis does.
      const delta =
        event.deltaMode === 1
          ? event.deltaY * 16
          : event.deltaMode === 2
            ? event.deltaY * 100
            : event.deltaY;

      const target = state.targets[index] ?? 0;
      const next = Math.max(
        0,
        Math.min(limit, target + (delta / 100) * NOTCH * (1 - limit)),
      );
      if (next === target) return;

      state.targets[index] = next;
      event.preventDefault();
      event.stopPropagation();
    };

    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, []);

  /*
    The canvas mounts only once the textures exist, which is also once the
    webfonts have landed. Mounting it earlier was a real bug in Persian and
    Arabic: the layout is still settling while those fonts load, R3F measured a
    container mid-shift and kept the stale height, and the room rendered at the
    wrong aspect inside a correctly sized box. Waiting costs one frame of the
    gradient placeholder and makes the aspect deterministic.
  */
  return (
    <div ref={host} className="absolute inset-0">
      {!scene ? (
        <div className="canvas-fallback absolute inset-0" />
      ) : (
        <Canvas
          dpr={[1, 1.7]}
          frameloop={active ? "always" : "never"}
          gl={{ antialias: true, powerPreference: "high-performance" }}
        >
          <color attach="background" args={["#050506"]} />
          <ViewportGuard />
          <FrameTick onTick={onTick} />

          {/*
            Deliberately dim: the panels are emissive, so the room's own light is
            only here to describe the hall and its floor. Every value below is
            half of what the room opened with — the screens are the subject.
          */}
          <ambientLight intensity={0.25} />

          {/* decay={0} keeps these accent lights distance-independent (§8.3). */}
          <spotLight
            position={[5, 7, 5]}
            angle={0.6}
            penumbra={1}
            intensity={1.2}
            decay={0}
            color="#7c5cff"
          />
          <pointLight
            position={[-6, -1, 2]}
            intensity={0.8}
            decay={0}
            color="#3ddcff"
          />

          {projects.map((project, index) => {
            const x = (index - (count - 1) / 2) * PANEL_STEP * scene.sign;
            // Side panels turn gently in towards the room, like a curved wall.
            return (
              <SitePanel
                key={project.id}
                shell={scene.textures[index].shell}
                page={scene.textures[index].page}
                index={index}
                x={x}
                yaw={-x * 0.11}
                front={front}
                onHover={onHover}
                onLeave={onLeave}
              />
            );
          })}

          <CameraRig
            progress={progress}
            pointerX={pointerX}
            pointerY={pointerY}
            count={count}
            sign={scene.sign}
            focusRef={focusRef}
          />

          <AccentLight
            color={accentColor[projects[front].accent]}
            focusRef={focusRef}
          />
          <HallFloor />

          <Environment resolution={256} frames={1}>
            <Lightformer
              form="rect"
              intensity={1.7}
              color="#7c5cff"
              position={[-5, 3, -3]}
              scale={[10, 8, 1]}
              target={[0, 0, 0]}
            />
            <Lightformer
              form="rect"
              intensity={1.3}
              color="#3ddcff"
              position={[5, -1, -2]}
              scale={[10, 8, 1]}
              target={[0, 0, 0]}
            />
            <Lightformer
              form="rect"
              intensity={1.1}
              color="#c8ff4d"
              position={[0, 5, 3]}
              scale={[12, 4, 1]}
              target={[0, 0, 0]}
            />
          </Environment>

          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.75}
              luminanceThreshold={0.42}
              luminanceSmoothing={0.35}
              mipmapBlur
              radius={0.7}
            />
            <Vignette offset={0.3} darkness={0.72} />
          </EffectComposer>
        </Canvas>
      )}
    </div>
  );
}
