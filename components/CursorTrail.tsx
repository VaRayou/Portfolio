"use client";

import { useEffect, useRef, useState } from "react";

interface TrailDot {
  id: number;
  x: number;
  y: number;
  opacity: number;
  color: string;
}

const TRAIL_COLORS = [
  "rgba(168,85,247,0.7)",
  "rgba(99,102,241,0.7)",
  "rgba(236,72,153,0.6)",
  "rgba(6,182,212,0.6)",
  "rgba(255,255,255,0.5)",
];

export default function CursorTrail() {
  const [dots, setDots] = useState<TrailDot[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [mounted, setMounted] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const idRef = useRef(0);
  const frameRef = useRef<number>(0);
  const throttleRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (throttleRef.current) {
        cancelAnimationFrame(throttleRef.current);
      }

      throttleRef.current = requestAnimationFrame(() => {
        const newDot: TrailDot = {
          id: idRef.current++,
          x: e.clientX,
          y: e.clientY,
          opacity: 1,
          color: TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)],
        };

        setDots((prev) => [...prev.slice(-20), newDot]);
      });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(
        target.tagName.toLowerCase() === "button" ||
          target.tagName.toLowerCase() === "a" ||
          !!target.closest("button") ||
          !!target.closest("a")
      );
    };

    const fade = () => {
      setDots((prev) =>
        prev
          .map((d) => ({ ...d, opacity: d.opacity - 0.06 }))
          .filter((d) => d.opacity > 0)
      );
      frameRef.current = requestAnimationFrame(fade);
    };

    frameRef.current = requestAnimationFrame(fade);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Trail dots */}
      {dots.map((dot, index) => (
        <div
          key={dot.id}
          className="cursor-trail-dot"
          style={{
            left: dot.x,
            top: dot.y,
            opacity: dot.opacity,
            backgroundColor: dot.color,
            width: `${4 + index * 0.3}px`,
            height: `${4 + index * 0.3}px`,
            filter: `blur(${index > 10 ? 1 : 0}px)`,
          }}
        />
      ))}

      {/* Main cursor dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[10000] mix-blend-difference"
        style={{
          transform: `translate(${mousePos.current.x - 5}px, ${mousePos.current.y - 5}px)`,
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "white",
          transition: "transform 0.05s linear",
        }}
      />

      {/* Cursor ring */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] border border-white/30 rounded-full"
        style={{
          transform: `translate(${mousePos.current.x - 20}px, ${mousePos.current.y - 20}px)`,
          width: isHovering ? 50 : 40,
          height: isHovering ? 50 : 40,
          background: isHovering ? "rgba(255,255,255,0.1)" : "transparent",
          transition: "width 0.2s, height 0.2s, background 0.2s, transform 0.12s linear",
        }}
      />
    </>
  );
}
