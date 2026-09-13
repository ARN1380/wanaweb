"use client";

import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/** Slow, continuous spin shared by every object in the lab scene. */
function useSpin(speed: number, animate: boolean, axis: "x" | "y" = "y") {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!animate) return;
    const node = ref.current;
    if (!node) return;
    node.rotation[axis] += Math.min(delta, 1 / 30) * speed;
  });

  return ref;
}

/** Chrome-like torus knot driven entirely by the procedural environment. */
export function IridescentKnot({ animate }: { animate: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!animate) return;
    const node = group.current;
    if (!node) return;

    const step = Math.min(delta, 1 / 30);
    node.rotation.x += step * 0.14;
    node.rotation.y += step * 0.2;

    node.rotation.z = THREE.MathUtils.lerp(
      node.rotation.z,
      state.pointer.x * 0.18,
      0.03,
    );
  });

  return (
    <group ref={group}>
      <mesh>
        <torusKnotGeometry args={[1.02, 0.33, 260, 36]} />
        <meshStandardMaterial
          metalness={1}
          roughness={0.13}
          color="#9a8bff"
          envMapIntensity={1.7}
        />
      </mesh>
    </group>
  );
}

/** Refracting glass spheres drifting on their own orbits. */
export function GlassOrbs({ animate }: { animate: boolean }) {
  const group = useSpin(-0.22, animate);

  const orbs = useMemo(
    () =>
      [0, 1, 2, 3].map((index) => {
        const angle = (index / 4) * Math.PI * 2 + 0.4;
        return {
          key: index,
          angle,
          radius: 2.3 + (index % 2) * 0.42,
          size: 0.27 + (index % 3) * 0.075,
          y: Math.sin(index * 1.9) * 0.85,
        };
      }),
    [],
  );

  return (
    <group ref={group}>
      {orbs.map((orb) => (
        <Float
          key={orb.key}
          speed={1.5}
          rotationIntensity={0.5}
          floatIntensity={1.3}
        >
          <mesh
            position={[
              Math.cos(orb.angle) * orb.radius,
              orb.y,
              Math.sin(orb.angle) * orb.radius,
            ]}
          >
            <sphereGeometry args={[orb.size, 48, 48]} />
            <MeshTransmissionMaterial
              samples={4}
              resolution={256}
              thickness={0.65}
              roughness={0.06}
              ior={1.42}
              chromaticAberration={0.34}
              anisotropy={0.3}
              distortion={0.18}
              distortionScale={0.4}
              temporalDistortion={0.06}
              color="#ffffff"
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

/** A ring of instanced micro-cubes — one draw call for the whole halo. */
export function CubeRing({ animate }: { animate: boolean }) {
  const group = useSpin(0.16, animate);
  const instanced = useRef<THREE.InstancedMesh>(null);
  const count = 28;

  useEffect(() => {
    const mesh = instanced.current;
    if (!mesh) return;

    const dummy = new THREE.Object3D();

    for (let index = 0; index < count; index += 1) {
      const angle = (index / count) * Math.PI * 2;
      const radius = 3.05 + (index % 3) * 0.16;

      dummy.position.set(
        Math.cos(angle) * radius,
        Math.sin(index * 1.7) * 0.42,
        Math.sin(angle) * radius,
      );
      dummy.rotation.set(angle, angle * 1.6, index * 0.2);
      dummy.scale.setScalar(0.075 + (index % 5) * 0.035);
      dummy.updateMatrix();

      mesh.setMatrixAt(index, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  }, [count]);

  return (
    <group ref={group}>
      <instancedMesh ref={instanced} args={[undefined, undefined, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          metalness={0.85}
          roughness={0.3}
          color="#3ddcff"
          envMapIntensity={1.2}
        />
      </instancedMesh>
    </group>
  );
}
