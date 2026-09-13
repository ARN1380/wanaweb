"use client";

import { MeshReflectorMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { CanvasTexture, Group, MeshStandardMaterial, PointLight } from "three";

import { PANEL_ASPECT } from "@/components/three/siteTexture";

/** Panel dimensions in world units, and how far apart the wall stands. */
export const PANEL_WIDTH = 2.55;
export const PANEL_HEIGHT = PANEL_WIDTH / PANEL_ASPECT;
export const PANEL_STEP = 3.45;

type SitePanelProps = {
  texture: CanvasTexture;
  x: number;
  yaw: number;
  index: number;
  /** Index of the panel the camera is looking at. */
  front: number;
};

/**
 * One site on the wall: a screen — bezel, chrome and page, all drawn into the
 * texture — with a small pull towards the viewer when it is the one on show.
 *
 * The emissive map is the same texture as the colour map, which is what makes a
 * panel read as a lit screen in a dark room rather than a photograph of one.
 */
export function SitePanel({ texture, x, yaw, index, front }: SitePanelProps) {
  const group = useRef<Group>(null);
  const material = useRef<MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    const node = group.current;
    if (node) {
      const target = index === front ? 0.14 : 0;
      node.position.z += (target - node.position.z) * Math.min(1, delta * 4);
    }

    if (material.current) {
      const glow = index === front ? 0.62 : 0.34;
      material.current.emissiveIntensity +=
        (glow - material.current.emissiveIntensity) * Math.min(1, delta * 3);
    }
  });

  return (
    <group ref={group} position={[x, 0.15, 0]} rotation={[0, yaw, 0]}>
      <mesh>
        <planeGeometry args={[PANEL_WIDTH, PANEL_HEIGHT]} />
        <meshStandardMaterial
          ref={material}
          map={texture}
          emissiveMap={texture}
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

/** A soft key light that stays with whichever panel is in front. */
export function AccentLight({ color, focusRef }: AccentLightProps) {
  const light = useRef<PointLight>(null);

  useFrame((_, delta) => {
    const node = light.current;
    if (!node) return;
    node.position.x +=
      (focusRef.current - node.position.x) * Math.min(1, delta * 3);
    node.color.set(color);
  });

  return <pointLight ref={light} position={[0, 0.4, 2.4]} intensity={9} decay={0} />;
}
