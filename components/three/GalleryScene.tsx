"use client";

import { Environment, Lightformer, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import type { MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  CanvasTexture,
  SRGBColorSpace,
  type PerspectiveCamera as ThreePerspectiveCamera,
} from "three";

import {
  AccentLight,
  HallFloor,
  PANEL_STEP,
  SitePanel,
} from "@/components/three/GalleryObjects";
import { drawSitePanel, type TextureFonts } from "@/components/three/siteTexture";
import { accentColor } from "@/lib/accents";
import type { Project } from "@/lib/dictionaries/types";

type GallerySceneProps = {
  projects: readonly Project[];
  /** Scroll progress across the gallery track, read per frame — never state. */
  progress: MotionValue<number>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  front: number;
  /** Freezes the render loop when the gallery is off screen. */
  active: boolean;
};

type SceneState = {
  textures: CanvasTexture[];
  /** -1 in RTL, so the wall is read and travelled in the reading direction. */
  sign: number;
};

/**
 * The site "screenshots" are drawn once, after the webfonts are ready.
 *
 * Drawing before the fonts land would bake the fallback face into the texture
 * for the whole session, so this waits — and the Persian and Arabic galleries
 * wait for Vazirmatn and Noto Sans Arabic, which is why they are worth a frame
 * of empty room rather than a flash of the wrong script.
 */
function useSiteTextures(projects: readonly Project[]): SceneState | null {
  const [scene, setScene] = useState<SceneState | null>(null);

  useEffect(() => {
    let cancelled = false;
    let built: CanvasTexture[] = [];

    const build = async () => {
      await document.fonts.ready;

      const root = getComputedStyle(document.documentElement);
      const fonts: TextureFonts = {
        body: root.getPropertyValue("--font-body").trim() || "sans-serif",
        label: root.getPropertyValue("--font-label").trim() || "monospace",
      };
      const rtl = document.documentElement.dir === "rtl";

      built = projects.map((project) => {
        const texture = new CanvasTexture(
          drawSitePanel(project, rtl ? "rtl" : "ltr", fonts),
        );
        texture.colorSpace = SRGBColorSpace;
        texture.anisotropy = 4;
        return texture;
      });

      if (!cancelled) setScene({ textures: built, sign: rtl ? -1 : 1 });
    };

    void build();

    return () => {
      cancelled = true;
      built.forEach((texture) => texture.dispose());
    };
  }, [projects]);

  return scene;
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
  const scene = useSiteTextures(projects);
  const focusRef = useRef(0);
  const count = projects.length;

  /*
    The canvas mounts only once the textures exist, which is also once the
    webfonts have landed. Mounting it earlier was a real bug in Persian and
    Arabic: the layout is still settling while those fonts load, R3F measured a
    container mid-shift and kept the stale height, and the room rendered at the
    wrong aspect inside a correctly sized box. Waiting costs one frame of the
    gradient placeholder and makes the aspect deterministic.
  */
  if (!scene) return <div className="canvas-fallback absolute inset-0" />;

  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 1.7]}
        frameloop={active ? "always" : "never"}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#050506"]} />
        <ViewportGuard />

        <ambientLight intensity={0.5} />

        {/* decay={0} keeps these accent lights distance-independent (§8.3). */}
        <spotLight
          position={[5, 7, 5]}
          angle={0.6}
          penumbra={1}
          intensity={2.4}
          decay={0}
          color="#7c5cff"
        />
        <pointLight position={[-6, -1, 2]} intensity={1.6} decay={0} color="#3ddcff" />

        {projects.map((project, index) => {
          const x = (index - (count - 1) / 2) * PANEL_STEP * scene.sign;
          // Side panels turn gently in towards the room, like a curved wall.
          return (
            <SitePanel
              key={project.id}
              texture={scene.textures[index]}
              x={x}
              yaw={-x * 0.11}
              index={index}
              front={front}
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
            intensity={3.4}
            color="#7c5cff"
            position={[-5, 3, -3]}
            scale={[10, 8, 1]}
            target={[0, 0, 0]}
          />
          <Lightformer
            form="rect"
            intensity={2.6}
            color="#3ddcff"
            position={[5, -1, -2]}
            scale={[10, 8, 1]}
            target={[0, 0, 0]}
          />
          <Lightformer
            form="rect"
            intensity={2.2}
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
    </div>
  );
}
