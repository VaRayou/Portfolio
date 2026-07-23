"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame, wrap } from "framer-motion";
import portfolioData from "@/data/portfolio.json";
import SplitTextReveal from "@/components/SplitTextReveal";
import ScrollReveal from "@/components/ScrollReveal";

const skillIcons: Record<string, string> = {
  "Next.js": "⚡",
  "React": "⚛️",
  "TypeScript": "🔷",
  "TailwindCSS": "🎨",
  "Framer Motion": "🌀",
  "GSAP": "✨",
  "Three.js": "🌐",
  "Node.js": "🟢",
  "Python": "🐍",
  "Supabase": "🗄️",
  "GraphQL": "🔗",
  "Figma": "🎭",
};

const allSkills = portfolioData.skills;
// Duplicate for seamless loop. We need enough duplicates to fill the screen twice over.
const row1 = [...allSkills, ...allSkills, ...allSkills, ...allSkills];
const row2 = [...[...allSkills].reverse(), ...[...allSkills].reverse(), ...[...allSkills].reverse(), ...[...allSkills].reverse()];

function VelocityTrack({ children, baseVelocity = 1 }: { children: React.ReactNode; baseVelocity: number }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const directionFactor = useRef<number>(1);
  
  // Interactivity: Smoothly pause on hover
  const [isHovered, setIsHovered] = useState(false);
  const hoverMultiplier = useSpring(1, { damping: 40, stiffness: 300 });

  useEffect(() => {
    hoverMultiplier.set(isHovered ? 0 : 1);
  }, [isHovered, hoverMultiplier]);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    // Change direction based on scroll
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    // Add scroll velocity to movement
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    
    // Apply hover multiplier for smooth pause
    moveBy *= hoverMultiplier.get();
    
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div 
      className="overflow-hidden whitespace-nowrap flex flex-nowrap w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div className="flex flex-nowrap w-[200vw] sm:w-[max-content]" style={{ x }}>
        {children}
      </motion.div>
    </div>
  );
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const watermarkScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.1, 0.9]);
  const watermarkOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.01, 0.04, 0.01]);

  return (
    <section ref={sectionRef} id="skills" className="relative py-20 md:py-32 overflow-hidden">
      {/* Background Watermark Marquee */}
      <motion.div
        style={{ scale: watermarkScale, opacity: watermarkOpacity }}
        className="absolute top-1/2 left-0 -translate-y-1/2 w-full overflow-hidden pointer-events-none select-none flex whitespace-nowrap z-0"
      >
        <VelocityTrack baseVelocity={-2}>
          <h2 className="text-[10rem] md:text-[15rem] font-black uppercase text-white font-heading mr-8">
            FRONTEND • BACKEND • DESIGN • FRONTEND • BACKEND • DESIGN •
          </h2>
        </VelocityTrack>
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 mb-12 md:mb-16 relative z-10">
        <ScrollReveal direction="up" duration={0.8} className="text-center">
          <div className="text-xs font-mono tracking-[0.3em] text-white/30 uppercase mb-4">
            TECHNOLOGIES
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold">
            <SplitTextReveal text="Core Technologies" mode="words" gradient />
          </h2>
          <p className="text-white/40 text-sm mt-4 max-w-md mx-auto">
            My toolkit for building exceptional digital experiences
          </p>
        </ScrollReveal>
      </div>

      {/* Row 1 — left to right */}
      <div className="relative overflow-hidden mb-4 md:mb-6 z-10 w-full">
        <VelocityTrack baseVelocity={-3}>
          <div className="flex items-center gap-3 px-2">
            {row1.map((skill, i) => (
              <div
                key={`r1-${i}`}
                className="flex items-center gap-2 px-5 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl glass-card text-sm md:text-base font-medium whitespace-nowrap cursor-default select-none shrink-0 group hover:border-white/30 hover:scale-105 transition-all shadow-lg shadow-black/40"
              >
                <span className="text-lg" role="img" aria-hidden="true">
                  {skillIcons[skill] || "💻"}
                </span>
                <span className="text-white/70 group-hover:text-white transition-colors">
                  {skill}
                </span>
              </div>
            ))}
          </div>
        </VelocityTrack>
      </div>

      {/* Row 2 — right to left */}
      <div className="relative overflow-hidden z-10 w-full">
        <VelocityTrack baseVelocity={3}>
          <div className="flex items-center gap-3 px-2">
            {row2.map((skill, i) => (
              <div
                key={`r2-${i}`}
                className="flex items-center gap-2 px-5 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl glass-card text-sm md:text-base font-medium whitespace-nowrap cursor-default select-none shrink-0 group hover:border-white/30 hover:scale-105 transition-all shadow-lg shadow-black/40"
                style={{
                  background: "rgba(255,255,255,0.015)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <span className="text-lg" role="img" aria-hidden="true">
                  {skillIcons[skill] || "💻"}
                </span>
                <span className="text-white/50 group-hover:text-white/80 transition-colors">
                  {skill}
                </span>
              </div>
            ))}
          </div>
        </VelocityTrack>
      </div>

      {/* Faded edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-64 bg-gradient-to-r from-[#050505] to-transparent z-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-64 bg-gradient-to-l from-[#050505] to-transparent z-20" />
    </section>
  );
}
