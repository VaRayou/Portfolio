"use client";

import { useEffect, useRef, useState } from "react";

const TRAIL_COLORS = [
  "rgba(168,85,247,0.7)",
  "rgba(99,102,241,0.7)",
  "rgba(236,72,153,0.6)",
  "rgba(6,182,212,0.6)",
  "rgba(255,255,255,0.5)",
];

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  opacity: number;
}

export default function CursorTrail() {
  const [enabled, setEnabled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || isReduced) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    let particles: Particle[] = [];
    let animFrame: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.opacity -= 0.04;
        p.radius = Math.max(0.5, p.radius * 0.96);
        if (p.opacity > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fill();
        }
      }
      particles = particles.filter((p) => p.opacity > 0);

      if (particles.length > 0) {
        animFrame = requestAnimationFrame(render);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x - 5}px, ${y - 5}px, 0)`;
      }

      if (ringRef.current) {
        const size = isHovering.current ? 50 : 36;
        ringRef.current.style.transform = `translate3d(${x - size / 2}px, ${y - size / 2}px, 0)`;
      }

      particles.push({
        x,
        y,
        radius: isHovering.current ? 6 : 4,
        color: TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)],
        opacity: 0.85,
      });
      if (particles.length > 25) particles.shift();

      if (particles.length === 1) {
        cancelAnimationFrame(animFrame);
        animFrame = requestAnimationFrame(render);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      isHovering.current =
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        !!target.closest("button") ||
        !!target.closest("a");

      if (ringRef.current) {
        const size = isHovering.current ? 50 : 36;
        ringRef.current.style.width = `${size}px`;
        ringRef.current.style.height = `${size}px`;
        ringRef.current.style.backgroundColor = isHovering.current ? "rgba(255,255,255,0.12)" : "transparent";
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animFrame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9998]"
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-white pointer-events-none z-[10000] mix-blend-difference will-change-transform"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 rounded-full border border-white/30 pointer-events-none z-[9999] transition-all duration-200 ease-out will-change-transform"
      />
    </>
  );
}

