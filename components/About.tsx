"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Download, ArrowUpRight, Code, Award, Globe, GitBranch, Clock, Music2 } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import ScrollHighlightText from "@/components/ScrollHighlightText";
import SplitTextReveal from "@/components/SplitTextReveal";
import ScrollReveal, { ScrollRevealItem } from "@/components/ScrollReveal";

// Animated count-up stat
function AnimatedStat({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const numeric = parseInt(value.replace(/\D/g, ""), 10);
    const suffix = value.replace(/[0-9]/g, "");
    if (isNaN(numeric)) { setDisplay(value); return; }
    let start = 0;
    const duration = 1500;
    const step = duration / numeric;
    const timer = setInterval(() => {
      start++;
      setDisplay(`${start}${suffix}`);
      if (start >= numeric) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <div
      ref={ref}
      className="bento-cell p-5 md:p-6 flex flex-col justify-between h-32 md:h-36 group cursor-default"
    >
      <div className="flex justify-between items-start text-white/30">
        {icon}
        <span className="font-heading font-bold text-xl md:text-2xl text-white stat-number group-hover:text-white/80 transition-colors">
          {display}
        </span>
      </div>
      <span className="text-[10px] md:text-xs font-mono text-white/40 tracking-widest uppercase">
        {label}
      </span>
    </div>
  );
}

// GitHub Contribution Graph (simulated)
function GitHubGraph() {
  const weeks = 16;
  const days = 7;
  const colors = [
    "rgba(255,255,255,0.05)",
    "rgba(99,102,241,0.3)",
    "rgba(99,102,241,0.5)",
    "rgba(99,102,241,0.75)",
    "rgba(168,85,247,0.9)",
  ];

  // Seeded pseudo-random for consistent SSR/CSR
  const grid = Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: days }, (_, d) => {
      const seed = (w * 7 + d + 17) % 100;
      if (seed < 30) return 0;
      if (seed < 55) return 1;
      if (seed < 75) return 2;
      if (seed < 90) return 3;
      return 4;
    })
  );

  return (
    <div className="bento-cell p-4 md:p-5 col-span-12 lg:col-span-8">
      <div className="flex items-center gap-2 mb-3">
        <GitBranch className="w-3.5 h-3.5 text-white/40" />
        <span className="text-xs font-mono text-white/30 uppercase tracking-widest">GitHub Activity</span>
      </div>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {grid.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((level, di) => (
              <div
                key={di}
                className="contribution-cell"
                style={{
                  backgroundColor: colors[level],
                  opacity: 0.6 + level * 0.1,
                }}
                title={`${level > 0 ? level * 3 : 0} contributions`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 mt-2 text-[9px] font-mono text-white/20">
        <span>Less</span>
        {colors.map((c, i) => (
          <div key={i} className="w-2 h-2 rounded-sm" style={{ backgroundColor: c }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

// Spotify "Now Playing" widget
function SpotifyWidget() {
  const [playing, setPlaying] = useState(true);
  const track = { name: "Midnight City", artist: "M83", album: "Hurry Up, We're Dreaming" };

  return (
    <div className="bento-cell p-4 md:p-5 col-span-12 sm:col-span-6 lg:col-span-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-green-400 text-xs font-mono">♫ Spotify</span>
        {playing && (
          <div className="flex items-end gap-[2px] h-4 ml-auto">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="eq-bar" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex-shrink-0 flex items-center justify-center text-lg ${playing ? "animate-spin" : ""}`}
          style={playing ? { animationDuration: "8s" } : {}}
        >
          🎵
        </div>
        <div className="overflow-hidden">
          <div className="text-sm font-semibold text-white truncate">{track.name}</div>
          <div className="text-xs text-white/40 truncate">{track.artist}</div>
        </div>
      </div>
      <button
        onClick={() => setPlaying((p) => !p)}
        className="mt-3 w-full py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono hover:bg-green-500/20 transition-colors"
      >
        {playing ? "⏸ Pause" : "▶ Play"}
      </button>
    </div>
  );
}

// Local time widget
function LocalTimeWidget() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
      setDate(now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bento-cell p-4 md:p-5 col-span-12 sm:col-span-6 lg:col-span-4">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-3 h-3 text-white/30" />
        <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Local Time</span>
      </div>
      <div className="text-2xl md:text-3xl font-heading font-bold text-white tabular-nums">{time}</div>
      <div className="text-xs text-white/30 mt-1">{date}</div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="relative min-h-screen py-20 md:py-32 overflow-hidden flex flex-col justify-center">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          
          {/* Left Side text */}
          <ScrollReveal direction="left" duration={0.8} className="flex flex-col space-y-5 md:space-y-6 text-center lg:text-left items-center lg:items-start order-2 lg:order-1">
            <div className="text-xs font-mono tracking-[0.3em] text-white/30 uppercase mb-2 md:mb-4">
              ABOUT ME
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black leading-[1.1] tracking-tighter">
              <SplitTextReveal text="Rayou Va" mode="chars" stagger={0.05} gradient />
            </h2>
            
            <div className="mt-4 max-w-md mx-auto lg:mx-0">
              <ScrollHighlightText
                paragraph="Fresh Graduate in MIS (Management Information Systems) from SETEC Institute (Class of 2026) with a strong passion for Frontend Development, Graphic Design, and Networking. Focused on building clean, responsive, and visually compelling websites backed by solid networking fundamentals to deliver optimal digital experiences."
                className="text-sm md:text-base leading-relaxed"
              />
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="border border-white/10 bg-white/[0.02] p-3 md:p-4 rounded-xl mt-4 max-w-md w-full backdrop-blur-md"
            >
              <p className="text-sm font-medium text-white/70 italic">
                &quot;Turning ideas into clean, modern, and meaningful digital experiences.&quot;
              </p>
            </motion.div>
            
            <div className="flex flex-wrap gap-3 md:gap-4 mt-6 md:mt-8 pt-2 md:pt-4 justify-center lg:justify-start">
              <button className="flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-all hover:scale-105 active:scale-95 text-sm shadow-lg shadow-white/5">
                <Download className="w-4 h-4" />
                <span>Download CV</span>
              </button>
              <a href="#projects" className="flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors text-sm">
                <ArrowUpRight className="w-4 h-4" />
                <span>View Projects</span>
              </a>
            </div>
          </ScrollReveal>
          
          {/* Right side portrait */}
          <ScrollReveal direction="right" duration={0.9} className="flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-96 lg:h-96 rounded-full overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(255,255,255,0.06)] group">
              <Image 
                src="/coverface.JPG" 
                alt="Portrait"
                fill
                className="object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent" />
            </div>
          </ScrollReveal>
        </div>

        {/* BENTO GRID — Stats + GitHub + Spotify + Time */}
        <ScrollReveal direction="3d-tilt" delay={0.2} duration={0.8} className="bento-grid mt-16 md:mt-32">
          {/* Stat cards — each span 4 of 12 cols */}
          <div className="col-span-12 sm:col-span-4">
            <AnimatedStat value="1" label="Projects" icon={<Code className="w-4 md:w-5 h-4 md:h-5" />} />
          </div>
          <div className="col-span-12 sm:col-span-4">
            <AnimatedStat value="1" label="Certificates" icon={<Award className="w-4 md:w-5 h-4 md:h-5" />} />
          </div>
          <div className="col-span-12 sm:col-span-4">
            <AnimatedStat value="1" label="Completed Works" icon={<Globe className="w-4 md:w-5 h-4 md:h-5" />} />
          </div>

          {/* GitHub contribution graph — span 8 */}
          <GitHubGraph />

          {/* Local time — span 4 */}
          <LocalTimeWidget />

          {/* Quote banner — span 12 */}
          <div className="bento-cell p-5 flex items-center gap-4 justify-center col-span-12">
            <Music2 className="w-8 h-8 text-white/10 shrink-0" />
            <div>
              <div className="text-sm text-white/60 font-medium italic">
                &quot;The best interface is no interface — but when there is one, make it extraordinary.&quot;
              </div>
              <div className="text-xs text-white/25 font-mono mt-1">— Design Philosophy</div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
