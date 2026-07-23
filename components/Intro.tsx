"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import portfolioData from "@/data/portfolio.json";

const line1Words = "WELCOME TO MY".split(" ");
const line2Words = "PORTFOLIO WEBSITE".split(" ");

export default function Intro() {
  const [isLoading, setIsLoading] = useState(() => {
    try {
      if (typeof window !== "undefined" && sessionStorage.getItem("skipIntroNext") === "true") {
        sessionStorage.removeItem("skipIntroNext");
        return false;
      }
    } catch {
      // Fallback for private browsing
    }
    return true;
  });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    document.body.style.overflow = "hidden";

    const controls = animate(0, 100, {
      duration: 3.0,
      delay: 0.3,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        setProgress(Math.round(v));
      },
    });

    const timer = setTimeout(() => {
      setIsLoading(false);
      try {
        sessionStorage.setItem("hasSeenIntro", "true");
      } catch {
        // Fallback for private browsing
      }
      document.body.style.overflow = "";
    }, 4200);

    return () => {
      clearTimeout(timer);
      controls.stop();
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#050505] text-white overflow-hidden select-none font-sans"
          exit={{ y: "-100%" }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Animated Ambient Light Orbs */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full bg-white/[0.04] blur-[180px] pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0.3, 0.8, 0.5], scale: [0.8, 1.25, 1.1] }}
            transition={{ duration: 3.5, ease: "easeInOut" }}
          />

          {/* Technical Corner Tick Marks */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="absolute inset-8 sm:inset-12 pointer-events-none flex flex-col justify-between"
          >
            <div className="flex justify-between text-xs font-mono text-white/50">
              <span>+ SYS_INIT // 2026</span>
              <span>[ 0x8492 ]</span>
            </div>
            <div className="flex justify-between text-xs font-mono text-white/50">
              <span>LATENCY // OPTIMAL</span>
              <span>+ PORTFOLIO.DEV</span>
            </div>
          </motion.div>

          {/* Background Grid Pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.12]"
            style={{
              backgroundImage: `
                repeating-linear-gradient(to right, rgba(255, 255, 255, 0.04) 0px, rgba(255, 255, 255, 0.04) 1px, transparent 1px, transparent 60px),
                repeating-linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 0px, rgba(255, 255, 255, 0.04) 1px, transparent 1px, transparent 60px)
              `,
            }}
          />

          {/* Main Content Container with 3D Perspective */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-3xl px-6 [perspective:1000px]">
            
            {/* Top Subtitle Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.03)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] sm:text-xs font-mono tracking-[0.3em] text-white/60 uppercase">
                {portfolioData.personal.name} — CREATIVE DIGITAL EXPERIENCE
              </span>
            </motion.div>

            {/* Line 1: WELCOME TO MY (Character Wave Reveal) */}
            <div className="overflow-hidden mb-2">
              <div className="flex gap-[0.4em] justify-center">
                {line1Words.map((word, wordIdx) => (
                  <div key={wordIdx} className="flex overflow-hidden py-1">
                    {word.split("").map((char, charIdx) => {
                      const globalIdx = wordIdx * 5 + charIdx;
                      return (
                        <motion.span
                          key={charIdx}
                          initial={{ opacity: 0, y: 50, rotateX: -70, filter: "blur(8px)" }}
                          animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
                          transition={{
                            duration: 0.7,
                            delay: 0.35 + globalIdx * 0.035,
                            ease: [0.215, 0.61, 0.355, 1],
                          }}
                          className="inline-block font-sans font-semibold text-xs sm:text-sm md:text-base tracking-[0.35em] text-white/50 uppercase"
                        >
                          {char}
                        </motion.span>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Line 2: PORTFOLIO WEBSITE (Massive Kinetic Metallic Shimmer) */}
            <div className="overflow-hidden mb-10 py-2">
              <div className="flex gap-[0.35em] justify-center flex-wrap">
                {line2Words.map((word, wordIdx) => (
                  <div key={wordIdx} className="flex overflow-hidden py-1">
                    {word.split("").map((char, charIdx) => {
                      const globalIdx = wordIdx * 9 + charIdx;
                      return (
                        <motion.span
                          key={charIdx}
                          initial={{ opacity: 0, y: 70, rotateX: -90, scale: 0.7, filter: "blur(12px)" }}
                          animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1, filter: "blur(0px)" }}
                          transition={{
                            duration: 0.85,
                            delay: 0.6 + globalIdx * 0.04,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="inline-block font-heading font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight"
                        >
                          <motion.span
                            animate={{
                              color: ["#ffffff", "rgba(255,255,255,0.6)", "#ffffff"],
                              textShadow: [
                                "0 0 20px rgba(255,255,255,0.2)",
                                "0 0 35px rgba(255,255,255,0.5)",
                                "0 0 20px rgba(255,255,255,0.2)"
                              ]
                            }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              delay: globalIdx * 0.05,
                              ease: "easeInOut"
                            }}
                            className="inline-block bg-gradient-to-b from-white via-white/90 to-white/50 bg-clip-text text-transparent"
                          >
                            {char}
                          </motion.span>
                        </motion.span>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Modern High-Tech Progress Counter & Ring Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="w-56 sm:w-80 flex flex-col gap-3"
            >
              {/* Animated Glowing Track */}
              <div className="w-full h-[2px] bg-white/10 relative overflow-hidden rounded-full p-[0.5px]">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-white/30 via-white to-white/90 shadow-[0_0_15px_rgba(255,255,255,0.9)] rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Monospace Digital Counter */}
              <div className="flex justify-between items-center text-[10px] sm:text-xs font-mono text-white/40">
                <span className="tracking-[0.25em] uppercase flex items-center gap-1.5">
                  <span className="inline-block w-1 h-1 bg-white/60 rounded-full animate-ping" />
                  LOADING EXPERIENCE
                </span>
                <span className="text-white font-bold tracking-wider text-xs">
                  {progress < 10 ? `0${progress}` : progress}%
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
