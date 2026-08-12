"use client";

import dynamic from "next/dynamic";
import { motion, MotionConfig } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ScrollProgressBar from "@/components/ScrollProgressBar";

// SmoothScroll uses Lenis which needs browser APIs — ssr:false
const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"), { ssr: false });

// Intro uses document.body — ssr:false
const Intro = dynamic(() => import("@/components/Intro"), { ssr: false });

// Below-the-fold sections — lazy loaded for LCP performance
const About = dynamic(() => import("@/components/About"));
const Projects = dynamic(() => import("@/components/Projects"));
const Experience = dynamic(() => import("@/components/Experience"));
const Skills = dynamic(() => import("@/components/Skills"));
const Contact = dynamic(() => import("@/components/Contact"));
const CodeEditorSection = dynamic(() => import("@/components/CodeEditorSection"));

// Background decorations — no SSR needed (purely visual)
const FuturisticBackground = dynamic(() => import("@/components/FuturisticBackground"), { ssr: false });
const FloatingGeometricShapes = dynamic(() => import("@/components/FloatingGeometricShapes"), { ssr: false });

// Client-only interactive overlays
const CommandPalette = dynamic(() => import("@/components/CommandPalette"), { ssr: false });
const FloatingDock = dynamic(() => import("@/components/FloatingDock"), { ssr: false });
const ThreeBackground = dynamic(() => import("@/components/ThreeBackground"), { ssr: false });
const CursorTrail = dynamic(() => import("@/components/CursorTrail"), { ssr: false });

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <Intro />
        
        {/* ── Global UI overlays ────────────────────── */}
        <ScrollProgressBar />
        <CommandPalette />
        <CursorTrail />

        {/* ── Fixed Backgrounds ─────────────────────── */}
        <FuturisticBackground />
        <ThreeBackground />
        <FloatingGeometricShapes />

        {/* ── Navigation ────────────────────────────── */}
        <Navbar />

        {/* ── Floating widgets ──────────────────────── */}
        <FloatingDock />

        {/* ── Main Content ──────────────────────────── */}
        <motion.main
          className="relative z-10 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Hero />
          <CodeEditorSection />
          <About />
          <Projects />
          <Experience />
          <Skills />
          <Contact />

          {/* Footer */}
          <footer className="py-8 border-t border-white/5">
            <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/20 text-xs font-mono">
              <span>© 2026 Rayou Va — All rights reserved</span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span>Built with Next.js 16 + React 19</span>
              </div>
              <div className="flex items-center gap-4">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors">
                  GitHub
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors">
                  LinkedIn
                </a>
                <a href="#contact" className="hover:text-white/60 transition-colors">
                  Contact
                </a>
              </div>
            </div>
          </footer>
        </motion.main>
      </SmoothScroll>
    </MotionConfig>
  );
}
