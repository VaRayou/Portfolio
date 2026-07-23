"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ScrollHighlightTextProps {
  paragraph: string;
  className?: string;
}

export default function ScrollHighlightText({
  paragraph,
  className = "",
}: ScrollHighlightTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "start 0.25"],
  });

  const words = paragraph.split(" ");

  return (
    <p ref={containerRef} className={`flex flex-wrap gap-x-[0.3em] gap-y-[0.1em] ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: any;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  const scale = useTransform(progress, range, [0.96, 1]);
  const y = useTransform(progress, range, [4, 0]);

  return (
    <span className="relative inline-block">
      <motion.span
        style={{ opacity, scale, y }}
        className="inline-block transition-colors duration-200"
      >
        {children}
      </motion.span>
    </span>
  );
}
