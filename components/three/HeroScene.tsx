"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import {
  coreFragmentShader,
  coreVertexShader,
  particleFragmentShader,
  particleVertexShader,
} from "@/components/three/shaders";
import { prefersReducedMotion, createRandom } from "@/lib/util";

const VIOLET = "#7c5cff";
const CYAN = "#3ddcff";
const LIME = "#c8ff4d";

/**
 * The "core": an icosahedron whose vertices are displaced on the GPU by two
 * octaves of simplex noise, shaded with an iridescent ramp plus a fresnel rim.
 */
function Core({ animate }: { animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmplitude: { value: 1 },
      uPointer: { value: 0 },
      uColorA: { value: new THREE.Color(VIOLET) },
      uColorB: { value: new THREE.Color(CYAN) },
      uColorC: { value: new THREE.Color(LIME) },
    }),
    [],
  );

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (!material || !animate) return;

    const step = Math.min(delta, 1 / 30);
    const live = material.uniforms;

    live.uTime.value += step;

    const strength = Math.min(Math.hypot(state.pointer.x, state.pointer.y), 1);
    live.uPointer.value += (strength - live.uPointer.value) * 0.05;

    const node = group.current;
    if (!node) return;

    node.rotation.y += step * 0.14;
    node.rotation.x = THREE.MathUtils.lerp(
      node.rotation.x,
      -state.pointer.y * 0.26,
      0.04,
    );
    node.rotation.z = THREE.MathUtils.lerp(
      node.rotation.z,
      state.pointer.x * 0.2,
      0.04,
    );
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.28, 16]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={coreVertexShader}
          fragmentShader={coreFragmentShader}
          uniforms={uniforms}
        />
      </mesh>

      <mesh scale={1.42}>
        <icosahedronGeometry args={[1.28, 1]} />
        <meshBasicMaterial
          color="#f4f1ea"
          wireframe
          transparent
          opacity={0.07}
        />
      </mesh>
    </group>
  );
}

/** Additive, GPU-animated particle shell. No textures required. */
function ParticleField({
  animate,
  count = 900,
}: {
  animate: boolean;
  count?: number;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const random = createRandom(0x5a17c0);
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let index = 0; index < count; index += 1) {
      const radius = 2.7 + random() * 3.6;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);

      positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.68;
      positions[index * 3 + 2] = radius * Math.cos(phi);

      scales[index] = 0.45 + random() * 1.5;
      phases[index] = random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    return geo;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 28 },
      uPixelRatio: { value: 1 },
      uColorA: { value: new THREE.Color(VIOLET) },
      uColorB: { value: new THREE.Color(CYAN) },
    }),
    [],
  );

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (!material) return;

    material.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    if (!animate) return;
    material.uniforms.uTime.value += Math.min(delta, 1 / 30);
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

type HeroSceneProps = {
  /** Pauses the render loop when the hero scrolls out of view. */
  active?: boolean;
};

export default function HeroScene({ active = true }: HeroSceneProps) {
  const animate = useMemo(() => !prefersReducedMotion(), []);

  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 1.8]}
        camera={{ position: [0, 0, 6.4], fov: 40 }}
        frameloop={active ? "always" : "never"}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#050506"]} />

        <Core animate={animate} />
        <ParticleField animate={animate} />

        <EffectComposer multisampling={0}>
          <Bloom
            intensity={1.25}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.3}
            mipmapBlur
            radius={0.75}
          />
          <Vignette offset={0.3} darkness={0.72} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
