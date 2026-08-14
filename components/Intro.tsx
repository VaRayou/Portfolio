"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import portfolioData from "@/data/portfolio.json";

export default function Intro() {
  const [isLoading, setIsLoading] = useState(() => {
    try {
      if (typeof window !== "undefined" && sessionStorage.getItem("skipIntroNext") === "true") {
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
      duration: 2.6,
      delay: 0.2,
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
    }, 3600);

    return () => {
      clearTimeout(timer);
      controls.stop();
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  // Fires only once the loading screen has fully faded out, so dependent
  // animations (like the ID card drop) start strictly AFTER the landing page
  // is visible — never behind the loader.
  const handleIntroComplete = useCallback(() => {
    try {
      (window as any).__portfolioIntroComplete = true;
      window.dispatchEvent(new CustomEvent("intro-complete"));
    } catch {
      // Fallback for private browsing
    }
  }, []);

  const titleWords = portfolioData.personal.name || "PORTFOLIO";

  return (
    <AnimatePresence onExitComplete={handleIntroComplete}>
      {isLoading && (
        <motion.div
          key="intro-loader"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#050505] text-white overflow-hidden select-none font-sans"
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Ambient Soft Glow */}
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full bg-white/[0.04] blur-[150px] pointer-events-none"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0.2, 0.5, 0.3], scale: [0.8, 1.1, 1] }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />

          {/* Clean Focused Content Container */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl px-6">
            
            {/* Minimal Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mb-3"
            >
              <span className="text-[11px] sm:text-xs font-mono tracking-[0.4em] text-white/40 uppercase">
                PORTFOLIO 2026
              </span>
            </motion.div>

            {/* Clean Main Name / Title */}
            <div className="overflow-hidden mb-8 py-2">
              <div className="flex gap-[0.08em] justify-center flex-wrap">
                {titleWords.split("").map((char, charIdx) => (
                  <motion.span
                    key={charIdx}
                    initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.7,
                      delay: 0.3 + charIdx * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block font-heading font-black text-4xl sm:text-6xl md:text-7xl tracking-tight text-white"
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Minimalist Progress Line & Percentage Counter */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-48 sm:w-64 flex flex-col gap-2.5"
            >
              <div className="w-full h-[1px] bg-white/10 relative overflow-hidden rounded-full">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-white/40">
                <span className="tracking-[0.25em] uppercase">LOADING</span>
                <span className="text-white/80 font-bold tracking-wider">
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
