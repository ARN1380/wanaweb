"use client";

import { MeshReflectorMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { CanvasTexture, Group, MeshStandardMaterial, PointLight } from "three";

import { PANEL_ASPECT, WINDOW_RATIO } from "@/components/three/siteTexture";

/** Panel dimensions in world units, and how far apart the wall stands. */
export const PANEL_WIDTH = 2.55;
export const PANEL_HEIGHT = PANEL_WIDTH / PANEL_ASPECT;
export const PANEL_STEP = 3.45;

/** The window inside a panel, in world units, and where it sits. */
const PAGE_WIDTH = PANEL_WIDTH * WINDOW_RATIO.width;
const PAGE_HEIGHT = PANEL_HEIGHT * WINDOW_RATIO.height;
const PAGE_Y = PANEL_HEIGHT * WINDOW_RATIO.centerY;
/**
 * How far in front of the page the frame is drawn. Small enough to be invisible
 * head-on, large enough to keep the two planes from z-fighting at a glancing
 * angle — which, on a wall that is only ever viewed at glancing angles, matters.
 */
const SHELL_LIFT = 0.006;

/**
 * The gallery's mutable scroll state: which page textures exist, how far each can
 * scroll, where the wheel has asked each one to be, where it currently is, and
 * which panel the pointer is over.
 *
 * It is one ref rather than several pieces of React state on purpose — a wheel
 * event must not re-render the room, and neither must a mouse crossing a screen.
 * The ref is created and mutated inside `GalleryScene`; the panels and the frame
 * loop reach it through callbacks, because a ref that arrives as a prop is not a
 * ref the compiler will let anyone write to.
 */
export type PanelScroll = {
  /** One page texture per panel, in wall order. */
  textures: CanvasTexture[];
  /** How far each page can scroll, in texture-v units. `0` means it cannot. */
  limits: number[];
  /** Where the wheel has asked each page to be. */
  targets: number[];
  /** Where it currently is, eased towards `targets` every frame. */
  values: number[];
  /** Panel under the pointer, or `-1`. */
  hovered: number;
};

/** A fresh, empty scroll state — every panel at its top, nothing hovered. */
export function createPanelScroll(): PanelScroll {
  return { textures: [], limits: [], targets: [], values: [], hovered: -1 };
}

type SitePanelProps = {
  shell: CanvasTexture;
  page: CanvasTexture;
  x: number;
  yaw: number;
  index: number;
  /** Index of the panel the camera is looking at. */
  front: number;
  /** The pointer is over this panel: only then does it take the wheel. */
  onHover: (index: number) => void;
  onLeave: (index: number) => void;
};

/**
 * One site on the wall: a frame, and the page inside it.
 *
 * The emissive maps are the same textures as the colour maps, which is what
 * makes a panel read as a lit screen in a dark room rather than a photograph of
 * one. The page is its own mesh so it can slide behind a frame that does not
 * move — see `PanelScrollRig` for the motion.
 */
export function SitePanel({
  shell,
  page,
  x,
  yaw,
  index,
  front,
  onHover,
  onLeave,
}: SitePanelProps) {
  const group = useRef<Group>(null);
  const frame = useRef<MeshStandardMaterial>(null);
  const screen = useRef<MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    const node = group.current;
    if (node) {
      const target = index === front ? 0.14 : 0;
      node.position.z += (target - node.position.z) * Math.min(1, delta * 4);
    }

    const glow = index === front ? 0.62 : 0.34;
    for (const material of [frame.current, screen.current]) {
      if (!material) continue;
      material.emissiveIntensity +=
        (glow - material.emissiveIntensity) * Math.min(1, delta * 3);
    }
  });

  // Only the panel under the pointer takes the wheel, so walking the wall and
  // reading a page never fight over the same gesture.
  const onOver = () => onHover(index);
  const onOut = () => onLeave(index);

  return (
    <group ref={group} position={[x, 0.15, 0]} rotation={[0, yaw, 0]}>
      {/* The page, behind the frame, cropped by the frame's window. */}
      <mesh position={[0, PAGE_Y, 0]} onPointerOver={onOver} onPointerOut={onOut}>
        <planeGeometry args={[PAGE_WIDTH, PAGE_HEIGHT]} />
        <meshStandardMaterial
          ref={screen}
          map={page}
          emissiveMap={page}
          emissive="#ffffff"
          emissiveIntensity={0.34}
          roughness={0.42}
          metalness={0.02}
        />
      </mesh>

      {/* The frame. Its window is transparent, so the page shows through it. */}
      <mesh position={[0, 0, SHELL_LIFT]}>
        <planeGeometry args={[PANEL_WIDTH, PANEL_HEIGHT]} />
        <meshStandardMaterial
          ref={frame}
          map={shell}
          emissiveMap={shell}
          emissive="#ffffff"
          emissiveIntensity={0.34}
          roughness={0.36}
          metalness={0.04}
          /* The drawn corners are transparent, so the panel is cut out, not faded. */
          alphaTest={0.5}
        />
      </mesh>
    </group>
  );
}

/**
 * The room's floor: dark, polished, and genuinely reflecting the wall. This is
 * the single cheapest thing that makes the scene read as a space rather than a
 * row of pictures, so it is worth the render target it costs.
 */
export function HallFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.32, 0]}>
      <planeGeometry args={[70, 70]} />
      <MeshReflectorMaterial
        blur={[400, 90]}
        resolution={512}
        mixBlur={1}
        mixStrength={30}
        roughness={0.85}
        depthScale={1.1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.35}
        color="#07070a"
        metalness={0.55}
        mirror={0.4}
      />
    </mesh>
  );
}

type AccentLightProps = {
  color: string;
  /** Camera X, shared by the rig, so the key light travels with the viewer. */
  focusRef: { current: number };
};

/**
 * A soft key light that stays with whichever panel is in front. Its intensity is
 * half of what the room opened with: the screens light themselves, so this only
 * has to keep the frame in front of them off the dark.
 */
export function AccentLight({ color, focusRef }: AccentLightProps) {
  const light = useRef<PointLight>(null);

  useFrame((_, delta) => {
    const node = light.current;
    if (!node) return;
    node.position.x +=
      (focusRef.current - node.position.x) * Math.min(1, delta * 3);
    node.color.set(color);
  });

  return <pointLight ref={light} position={[0, 0.4, 2.4]} intensity={4.5} decay={0} />;
}
