"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface SplitTextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  mode?: "words" | "chars";
  stagger?: number;
  gradient?: boolean;
}

export default function SplitTextReveal({
  text,
  className = "",
  delay = 0,
  mode = "words",
  stagger = 0.04,
  gradient = false,
}: SplitTextRevealProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });

  if (mode === "chars") {
    const chars = Array.from(text);
    return (
      <span ref={containerRef} className={`inline-block overflow-hidden ${className}`}>
        {chars.map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: "110%", rotateX: -60, filter: "blur(4px)" }}
            animate={
              isInView
                ? { opacity: 1, y: "0%", rotateX: 0, filter: "blur(0px)" }
                : { opacity: 0, y: "110%", rotateX: -60, filter: "blur(4px)" }
            }
            transition={{
              duration: 0.6,
              delay: delay + index * stagger,
              ease: [0.215, 0.61, 0.355, 1],
            }}
            className={`inline-block ${char === " " ? "w-[0.25em]" : ""} ${
              gradient ? "bg-gradient-to-r from-white via-white/90 to-white/50 bg-clip-text text-transparent" : ""
            }`}
            style={{ transformStyle: "preserve-3d" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>
    );
  }

  const words = text.split(" ");

  return (
    <span ref={containerRef} className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}>
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden py-0.5">
          <motion.span
            initial={{ opacity: 0, y: "120%", rotateX: -45, filter: "blur(8px)" }}
            animate={
              isInView
                ? { opacity: 1, y: "0%", rotateX: 0, filter: "blur(0px)" }
                : { opacity: 0, y: "120%", rotateX: -45, filter: "blur(8px)" }
            }
            transition={{
              duration: 0.7,
              delay: delay + index * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`inline-block ${
              gradient && index === words.length - 1
                ? "bg-gradient-to-r from-white/90 via-white/70 to-white/40 bg-clip-text text-transparent"
                : ""
            }`}
            style={{ transformStyle: "preserve-3d", perspective: 1000 }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
