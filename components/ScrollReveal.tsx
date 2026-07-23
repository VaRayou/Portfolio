"use client";

import { motion, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "zoom" | "flip" | "blur-in" | "3d-tilt";
  delay?: number;
  duration?: number;
  staggerChildren?: number;
  className?: string;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  staggerChildren = 0,
  className = "",
  once = true,
}: ScrollRevealProps) {
  const getInitialDirection = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: 50, scale: 0.96, filter: "blur(4px)" };
      case "down":
        return { opacity: 0, y: -50, scale: 0.96, filter: "blur(4px)" };
      case "left":
        return { opacity: 0, x: 50, scale: 0.96, filter: "blur(4px)" };
      case "right":
        return { opacity: 0, x: -50, scale: 0.96, filter: "blur(4px)" };
      case "zoom":
        return { opacity: 0, scale: 0.82, filter: "blur(8px)" };
      case "flip":
        return { opacity: 0, rotateX: 60, y: 40, filter: "blur(4px)" };
      case "blur-in":
        return { opacity: 0, filter: "blur(16px)", scale: 0.98 };
      case "3d-tilt":
        return { opacity: 0, y: 60, rotateX: -25, rotateY: 10, scale: 0.92 };
      default:
        return { opacity: 0, y: 50, scale: 0.96, filter: "blur(4px)" };
    }
  };

  if (staggerChildren > 0) {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-60px" }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren,
              delayChildren: delay,
            },
          },
        }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={getInitialDirection()}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once, margin: "-60px" }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScrollRevealItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.94, filter: "blur(6px)" },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
