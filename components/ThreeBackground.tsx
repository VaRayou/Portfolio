"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

function ParticleConstellation() {
  const pointsRef = useRef<THREE.Points>(null!);
  const bgPointsRef = useRef<THREE.Points>(null!);
  const accentPointsRef = useRef<THREE.Points>(null!);
  const shouldReduceMotion = useFramerReducedMotion();

  // 1. Primary Cyan/Sky Starfield
  const positions = useMemo(() => {
    const count = 3500;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  // 2. Amethyst/Purple Cosmic Dust
  const bgPositions = useMemo(() => {
    const count = 2500;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2;
    }
    return pos;
  }, []);

  // 3. Electric Magenta Glowing Nodes
  const accentPositions = useMemo(() => {
    const count = 800;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 + 1;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (pointsRef.current) {
      const speed = shouldReduceMotion ? 0.01 : 0.04;
      pointsRef.current.rotation.y = time * speed * 0.3;
      pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.08;

      // Smooth mouse parallax shift
      const targetX = state.pointer.x * 0.3;
      const targetY = state.pointer.y * 0.3;

      pointsRef.current.rotation.y += (targetX - pointsRef.current.rotation.y) * 0.05;
      pointsRef.current.rotation.x += (-targetY - pointsRef.current.rotation.x) * 0.05;
    }

    if (bgPointsRef.current) {
      bgPointsRef.current.rotation.y = -time * 0.015;
      bgPointsRef.current.rotation.z = Math.cos(time * 0.05) * 0.05;
    }

    if (accentPointsRef.current) {
      accentPointsRef.current.rotation.y = time * 0.06;
      accentPointsRef.current.rotation.x = -time * 0.04;
    }
  });

  return (
    <group>
      {/* Primary white starfield */}
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Secondary slate cosmic dust */}
      <Points ref={bgPointsRef} positions={bgPositions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#94a3b8"
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Glowing subtle white highlights */}
      <Points ref={accentPointsRef} positions={accentPositions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#e2e8f0"
          size={0.025}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

export default function ThreeBackground() {
  const shouldReduceMotion = useFramerReducedMotion();

  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-90 transition-opacity duration-1000">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        frameloop={shouldReduceMotion ? "demand" : "always"}
        performance={{ min: 0.5 }}
      >
        <ParticleConstellation />
      </Canvas>
    </div>
  );
}

