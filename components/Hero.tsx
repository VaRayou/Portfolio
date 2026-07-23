"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import IDBadge from "@/components/IDBadge";
import SplitTextReveal from "@/components/SplitTextReveal";
import ScrambleText from "@/components/ScrambleText";

const TYPING_ROLES = [
  "Frontend Developer",
  "Graphic Designer",
  "Networking",
];

function useTypingText(roles: string[], typingSpeed = 80, deletingSpeed = 50, pauseTime = 2000) {
  const [text, setText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (text.length < currentRole.length) {
          setText(currentRole.slice(0, text.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (text.length > 0) {
          setText(text.slice(0, -1));
        } else {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timeout);
  }, [text, isDeleting, roleIndex, roles, typingSpeed, deletingSpeed, pauseTime]);

  return text;
}

function TypingText({ roles }: { roles: string[] }) {
  const text = useTypingText(roles);
  return (
    <span>
      {text}
      <span className="inline-block w-[2px] h-[1em] bg-white/50 ml-0.5 align-middle animate-pulse" />
    </span>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const [hasSeenIntro] = useState(() => {
    try {
      return typeof window !== "undefined" && sessionStorage.getItem("skipIntroNext") === "true";
    } catch {
      return false;
    }
  });

  const delayBase = hasSeenIntro ? 0.1 : 4.2;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax scroll transforms for Hero text
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen flex items-start lg:items-center justify-center pt-24 sm:pt-28 md:pt-32 lg:pt-20 overflow-visible"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Mobile/Tablet: column layout. Desktop: row layout */}
        <div className="flex flex-col lg:flex-row relative z-10 w-full">
          {/* Left side Typography */}
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            className="flex flex-col space-y-3 sm:space-y-4 md:space-y-6 pt-4 sm:pt-6 md:pt-10 text-left items-start w-full lg:w-[55%] xl:w-1/2 relative z-10"
          >
            {/* Available badge */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: delayBase, ease: [0.2, 0, 0.2, 1] }}
            >
              <div className="flex items-center space-x-2 mb-4 sm:mb-6 md:mb-8 justify-start">
                <span className="w-1.5 h-1.5 bg-white/40 rotate-45 animate-pulse" />
                <span className="text-[10px] sm:text-xs font-mono text-white/40 uppercase tracking-widest">
                  <ScrambleText text="AVAILABLE FOR WORK" trigger="inView" scrambleSpeed={40} />
                </span>
              </div>
            </motion.div>

            {/* Heading */}
            <div className="overflow-visible">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[6.5rem] font-heading font-black leading-[1.05] tracking-tighter">
                <SplitTextReveal text="Frontend" mode="chars" delay={delayBase + 0.2} stagger={0.03} />
                <br />
                <SplitTextReveal text="Developer" mode="chars" delay={delayBase + 0.5} stagger={0.03} gradient />
              </h1>
            </div>

            {/* Typing text + description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: delayBase + 0.8, ease: [0.2, 0, 0.2, 1] }}
            >
              <p className="text-xs sm:text-sm font-mono text-white/50 mb-3 sm:mb-4 md:mb-6 mt-2 md:mt-4">
                <TypingText roles={TYPING_ROLES} />
              </p>
              <p className="text-xs sm:text-sm md:text-base text-white/40 max-w-[280px] sm:max-w-sm md:max-w-md leading-relaxed">
                Creating modern websites with a clean, responsive, and elegant look.
                Transforming ideas and designs into engaging and easy-to-use digital experiences.
              </p>
            </motion.div>

            {/* Tech tags */}
            <motion.div
              className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-6 md:mt-8 justify-start"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: delayBase + 1.0, ease: [0.2, 0, 0.2, 1] }}
            >
              {["TypeScript", "React.js", "Tailwind"].map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: delayBase + 1.0 + i * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-mono text-white/60 border border-white/10 bg-white/[0.03] rounded-md hover:bg-white/[0.08] hover:border-white/20 hover:text-white transition-all duration-300 cursor-default shadow-sm"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>

            {/* Bottom info */}
            <motion.div
              className="flex flex-col gap-2 mt-6 sm:mt-8 md:mt-16 lg:mt-20 pt-4 sm:pt-6 md:pt-10 items-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: delayBase + 1.2 }}
            >
              <div className="flex items-center space-x-2 text-white/30 text-[10px] sm:text-xs font-mono">
                <span className="w-1.5 h-1.5 border border-white/30 rotate-45" />
                <span>explore my work below</span>
              </div>
              <div className="flex items-center space-x-2 text-white/30 text-[10px] sm:text-xs font-mono">
                <span className="w-1.5 h-1.5 border border-white/30 rotate-45" />
                <span>open to full-time &amp; freelance opportunities</span>
              </div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              className="mt-6 sm:mt-8 md:mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delayBase + 1.4, duration: 1 }}
            >
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1.5">
                  <motion.div
                    className="w-1 h-1.5 bg-white/40 rounded-full"
                    animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right side — ID Badge with Hero Glow & Rings */}
          <div className="w-full lg:w-[45%] xl:w-1/2 flex justify-center items-center relative">
            {/* Soft circular glow */}
            <div className="absolute w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full bg-white/[0.035] blur-3xl pointer-events-none -z-10" />
            
            {/* Subtle rings */}
            <div className="absolute w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full border border-white/[0.04] pointer-events-none -z-10" />
            <div className="absolute w-[420px] sm:w-[540px] h-[420px] sm:h-[540px] rounded-full border border-white/[0.025] pointer-events-none -z-10" />

            <IDBadge />
          </div>
        </div>
      </div>
    </section>
  );
}
