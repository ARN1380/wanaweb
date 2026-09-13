"use client";

import { Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useMemo } from "react";

import {
  CubeRing,
  GlassOrbs,
  IridescentKnot,
} from "@/components/three/LabObjects";
import { prefersReducedMotion } from "@/lib/util";

type LabSceneProps = {
  /** Freezes the render loop when the section is off screen. */
  active?: boolean;
};

/**
 * Interactive showcase: drag to orbit, auto-rotates otherwise.
 *
 * Lighting is a procedurally rendered environment (coloured Lightformers),
 * so nothing is fetched from the network and there are no model downloads.
 */
export default function LabScene({ active = true }: LabSceneProps) {
  const animate = useMemo(() => !prefersReducedMotion(), []);

  return (
    <div className="absolute inset-0" data-cursor="drag">
      <Canvas
        dpr={[1, 1.7]}
        camera={{ position: [0, 0.7, 6.3], fov: 38 }}
        frameloop={active ? "always" : "never"}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#07070b"]} />

        <ambientLight intensity={0.4} />

        {/* decay={0} keeps these accent lights distance-independent. */}
        <spotLight
          position={[6, 8, 4]}
          angle={0.5}
          penumbra={1}
          intensity={2.6}
          decay={0}
          color="#c8ff4d"
        />
        <pointLight
          position={[-6, -3, -4]}
          intensity={2.4}
          decay={0}
          color="#7c5cff"
        />
        <pointLight
          position={[5, -4, 3]}
          intensity={1.8}
          decay={0}
          color="#3ddcff"
        />

        <IridescentKnot animate={animate} />
        <GlassOrbs animate={animate} />
        <CubeRing animate={animate} />

        <Environment resolution={256} frames={1}>
          <Lightformer
            form="rect"
            intensity={3.2}
            color="#7c5cff"
            position={[-4, 2, -4]}
            scale={[9, 9, 1]}
            target={[0, 0, 0]}
          />
          <Lightformer
            form="rect"
            intensity={2.6}
            color="#3ddcff"
            position={[4, -1, -3]}
            scale={[9, 9, 1]}
            target={[0, 0, 0]}
          />
          <Lightformer
            form="rect"
            intensity={2.4}
            color="#c8ff4d"
            position={[0, 5, 2]}
            scale={[11, 4, 1]}
            target={[0, 0, 0]}
          />
          <Lightformer
            form="circle"
            intensity={2}
            color="#ffffff"
            position={[0, -4, 3]}
            scale={5}
            target={[0, 0, 0]}
          />
        </Environment>

        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          autoRotate={animate}
          autoRotateSpeed={0.7}
          rotateSpeed={0.55}
          minPolarAngle={Math.PI / 3.4}
          maxPolarAngle={Math.PI / 1.65}
        />

        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.9}
            luminanceThreshold={0.34}
            luminanceSmoothing={0.4}
            mipmapBlur
            radius={0.62}
          />
          <Vignette offset={0.32} darkness={0.66} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
