"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useInView } from "framer-motion";

interface ScrambleTextProps {
  text: string;
  className?: string;
  scrambleSpeed?: number;
  trigger?: "inView" | "hover" | "mount";
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

export default function ScrambleText({
  text,
  className = "",
  scrambleSpeed = 30,
  trigger = "inView",
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });

  const scramble = useCallback(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        setDisplayText(text);
      }

      iteration += 1 / 2;
    }, scrambleSpeed);
  }, [text, scrambleSpeed]);

  useEffect(() => {
    if (trigger === "mount") {
      scramble();
    } else if (trigger === "inView" && isInView) {
      scramble();
    }
  }, [isInView, trigger, scramble]);

  return (
    <span
      ref={containerRef}
      onMouseEnter={() => {
        if (trigger === "hover") scramble();
      }}
      className={`font-mono ${className}`}
    >
      {displayText}
    </span>
  );
}
