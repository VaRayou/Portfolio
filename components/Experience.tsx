"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import portfolioData from "@/data/portfolio.json";
import { useRef } from "react";
import SplitTextReveal from "@/components/SplitTextReveal";
import ScrollReveal from "@/components/ScrollReveal";

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.7", "end 0.3"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" ref={containerRef} className="relative min-h-screen py-20 md:py-32 bg-white/[0.01]">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <ScrollReveal direction="up" duration={0.8} className="mb-10 md:mb-16 text-center md:text-left">
          <div className="text-xs font-mono tracking-[0.3em] text-white/30 uppercase mb-4">
            CAREER & MILESTONES
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold">
            <SplitTextReveal text="Experience" mode="chars" stagger={0.04} gradient />
          </h2>
        </ScrollReveal>

        <div className="relative border-l border-white/10 ml-4 md:ml-0 pl-2">
          {/* Glowing Animated Timeline Beam on Scroll */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute top-0 -left-[1px] w-[2px] bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_12px_rgba(168,85,247,0.8)]"
          />

          {portfolioData.experience.map((exp, index) => (
            <ScrollReveal
              key={exp.id}
              direction={index % 2 === 0 ? "right" : "left"}
              delay={index * 0.15}
              duration={0.7}
              className="mb-12 md:mb-16 pl-6 md:pl-12 relative group"
            >
              {/* Timeline node */}
              <div className="absolute w-4 h-4 rounded-full bg-black border-2 border-white -left-[25px] md:-left-[25px] top-1.5 ring-4 ring-black group-hover:border-indigo-400 group-hover:scale-125 transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />

              <div className="glass-card p-6 md:p-8 rounded-2xl md:rounded-3xl hover:border-white/20 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2 md:mb-4">
                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">{exp.role}</h3>
                  <span className="text-indigo-400 text-xs sm:text-sm font-mono mt-1 md:mt-0 font-medium">
                    {exp.period}
                  </span>
                </div>

                <h4 className="text-base sm:text-lg text-white/80 mb-3 md:mb-4 font-mono">{exp.company}</h4>
                <p className="text-sm sm:text-base text-white/60 leading-relaxed mb-4 md:mb-6">{exp.description}</p>

                <div className="flex flex-wrap gap-2 md:gap-3">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 font-mono hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
