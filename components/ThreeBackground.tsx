"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function ParticleConstellation({ isMobile }: { isMobile: boolean }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const bgPointsRef = useRef<THREE.Points>(null!);
  const accentPointsRef = useRef<THREE.Points>(null!);
  const shouldReduceMotion = useFramerReducedMotion();

  const positions = useMemo(() => {
    const count = isMobile ? 800 : 3500;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (seededRandom(i * 3) - 0.5) * 14;
      pos[i * 3 + 1] = (seededRandom(i * 3 + 1) - 0.5) * 14;
      pos[i * 3 + 2] = (seededRandom(i * 3 + 2) - 0.5) * 10;
    }
    return pos;
  }, [isMobile]);

  const bgPositions = useMemo(() => {
    const count = isMobile ? 400 : 2500;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (seededRandom(i * 3 + 10000) - 0.5) * 20;
      pos[i * 3 + 1] = (seededRandom(i * 3 + 10001) - 0.5) * 20;
      pos[i * 3 + 2] = (seededRandom(i * 3 + 10002) - 0.5) * 14 - 2;
    }
    return pos;
  }, [isMobile]);

  const accentPositions = useMemo(() => {
    const count = isMobile ? 150 : 800;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (seededRandom(i * 3 + 20000) - 0.5) * 12;
      pos[i * 3 + 1] = (seededRandom(i * 3 + 20001) - 0.5) * 12;
      pos[i * 3 + 2] = (seededRandom(i * 3 + 20002) - 0.5) * 8 + 1;
    }
    return pos;
  }, [isMobile]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (pointsRef.current) {
      const speed = shouldReduceMotion ? 0.01 : 0.04;
      pointsRef.current.rotation.y = time * speed * 0.3;
      pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.08;

      if (!isMobile) {
        const targetX = state.pointer.x * 0.3;
        const targetY = state.pointer.y * 0.3;

        pointsRef.current.rotation.y += (targetX - pointsRef.current.rotation.y) * 0.05;
        pointsRef.current.rotation.x += (-targetY - pointsRef.current.rotation.x) * 0.05;
      }
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
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={isMobile ? 0.03 : 0.02}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      <Points ref={bgPointsRef} positions={bgPositions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#94a3b8"
          size={isMobile ? 0.025 : 0.015}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      <Points ref={accentPointsRef} positions={accentPositions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#e2e8f0"
          size={isMobile ? 0.035 : 0.025}
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-90 transition-opacity duration-1000">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        frameloop={shouldReduceMotion ? "demand" : "always"}
        performance={{ min: 0.5 }}
      >
        <ParticleConstellation isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
