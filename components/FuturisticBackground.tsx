"use client";

import { useEffect, useRef, useState } from "react";

export default function FuturisticBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -1000, y: -1000 });
  const currentPos = useRef({ x: -1000, y: -1000 });
  const gridOffset = useRef({ x: 0, y: 0 });
  const targetGridOffset = useRef({ x: 0, y: 0 });
  const animFrameId = useRef<number | null>(null);

  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkResponsive = () => {
      const desktop = window.innerWidth >= 768 && !window.matchMedia("(pointer: coarse)").matches;
      setIsDesktop(desktop);
    };

    checkResponsive();
    window.addEventListener("resize", checkResponsive, { passive: true });

    let isAnimating = false;

    const startLoop = () => {
      if (!isAnimating && isDesktop) {
        isAnimating = true;
        animFrameId.current = requestAnimationFrame(updatePosition);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const moveX = ((e.clientX - centerX) / centerX) * 8;
      const moveY = ((e.clientY - centerY) / centerY) * 8;
      targetGridOffset.current = { x: moveX, y: moveY };

      startLoop();
    };

    if (isDesktop) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    const updatePosition = () => {
      if (!isDesktop) {
        isAnimating = false;
        return;
      }

      const dx = mousePos.current.x - currentPos.current.x;
      const dy = mousePos.current.y - currentPos.current.y;
      const gdx = targetGridOffset.current.x - gridOffset.current.x;
      const gdy = targetGridOffset.current.y - gridOffset.current.y;

      currentPos.current.x += dx * 0.08;
      currentPos.current.y += dy * 0.08;

      gridOffset.current.x += gdx * 0.08;
      gridOffset.current.y += gdy * 0.08;

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${currentPos.current.x - 300}px, ${currentPos.current.y - 300}px, 0)`;
      }

      if (gridContainerRef.current) {
        gridContainerRef.current.style.transform = `translate3d(${gridOffset.current.x}px, ${gridOffset.current.y}px, 0)`;
      }

      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1 || Math.abs(gdx) > 0.05 || Math.abs(gdy) > 0.05) {
        animFrameId.current = requestAnimationFrame(updatePosition);
      } else {
        isAnimating = false;
      }
    };

    return () => {
      window.removeEventListener("resize", checkResponsive);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isDesktop]);


  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050505]"
      aria-hidden="true"
    >
      {/* 1. Base Layer: Multi-layered subtle radial gradients */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.04), transparent 35%),
            radial-gradient(circle at 80% 30%, rgba(255, 255, 255, 0.03), transparent 30%),
            radial-gradient(circle at 50% 100%, rgba(255, 255, 255, 0.02), transparent 50%),
            radial-gradient(ellipse 70% 50% at 50% 15%, rgba(255, 255, 255, 0.04), transparent 70%)
          `,
        }}
      />

      {/* 2. Fine Technical Grid + Upward Slow Drift Animation */}
      <div
        ref={gridContainerRef}
        className="absolute -top-[100px] -left-[50px] -right-[50px] -bottom-[100px] z-10 will-change-transform animate-grid-drift"
        style={{
          backgroundImage: `
            repeating-linear-gradient(to right, rgba(255, 255, 255, 0.05) 0px, rgba(255, 255, 255, 0.05) 1px, transparent 1px, transparent ${isDesktop ? "50px" : "75px"}),
            repeating-linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 0px, rgba(255, 255, 255, 0.05) 1px, transparent 1px, transparent ${isDesktop ? "50px" : "75px"})
          `,
        }}
      />

      {/* 4. Large Glow Effects — Desktop only to avoid GPU crash on mobile */}
      {isDesktop && (
        <>
          {/* Top-left white glow */}
          <div
            className="absolute -top-32 -left-32 w-[800px] h-[800px] rounded-full z-10 pointer-events-none opacity-60"
            style={{
              background: "radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 50%, transparent 75%)",
              filter: "blur(180px)",
            }}
          />

          {/* Center ambient glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full z-10 pointer-events-none opacity-40"
            style={{
              background: "radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)",
              filter: "blur(220px)",
            }}
          />

          {/* Bottom-right gray glow */}
          <div
            className="absolute -bottom-40 -right-40 w-[850px] h-[850px] rounded-full z-10 pointer-events-none opacity-50"
            style={{
              background: "radial-gradient(circle, rgba(200, 200, 200, 0.04) 0%, rgba(150, 150, 150, 0.01) 50%, transparent 75%)",
              filter: "blur(200px)",
            }}
          />
        </>
      )}

      {/* 6. Mouse Spotlight (Desktop only, GPU lerp) */}
      {isDesktop && (
        <div
          ref={spotlightRef}
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full z-20 pointer-events-none will-change-transform"
          style={{
            background: "radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 40%, transparent 75%)",
            filter: "blur(40px)",
          }}
        />
      )}

      {/* 5. Vignette Layer */}
      <div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, transparent 35%, rgba(5, 5, 5, 0.75) 80%, #050505 100%)",
        }}
      />

      {/* 3. Noise Texture Overlay — Desktop only (feTurbulence is heavy on mobile) */}
      {isDesktop && (
        <div className="absolute inset-0 z-40 pointer-events-none opacity-30 mix-blend-overlay animate-noise">
          <svg className="w-full h-full opacity-60">
            <filter id="futuristicNoise">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#futuristicNoise)" />
          </svg>
        </div>
      )}
    </div>
  );
}
