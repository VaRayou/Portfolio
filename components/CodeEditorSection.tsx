"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SplitTextReveal from "@/components/SplitTextReveal";
import ScrollReveal from "@/components/ScrollReveal";

const CODE_SNIPPETS = [
  {
    filename: "hero.tsx",
    language: "tsx",
    lines: [
      { code: `import { motion } from "framer-motion";`, color: "#c792ea" },
      { code: `import { useEffect, useState } from "react";`, color: "#c792ea" },
      { code: ``, color: "#fff" },
      { code: `export default function Hero() {`, color: "#82aaff" },
      { code: `  const [text, setText] = useState("");`, color: "#eeffff" },
      { code: ``, color: "#fff" },
      { code: `  useEffect(() => {`, color: "#ffcb6b" },
      { code: `    // Typing animation magic ✨`, color: "#546e7a" },
      { code: `    const words = ["Frontend Dev", "UI Designer"];`, color: "#c3e88d" },
      { code: `    let i = 0, j = 0;`, color: "#eeffff" },
      { code: `    const interval = setInterval(() => {`, color: "#ffcb6b" },
      { code: `      setText(words[i].slice(0, j++));`, color: "#eeffff" },
      { code: `    }, 100);`, color: "#eeffff" },
      { code: `  }, []);`, color: "#eeffff" },
      { code: ``, color: "#fff" },
      { code: `  return (`, color: "#82aaff" },
      { code: `    <motion.h1`, color: "#f07178" },
      { code: `      animate={{ opacity: 1, y: 0 }}`, color: "#c792ea" },
      { code: `    >`, color: "#f07178" },
      { code: `      {text}<span className="cursor" />`, color: "#c3e88d" },
      { code: `    </motion.h1>`, color: "#f07178" },
      { code: `  );`, color: "#82aaff" },
      { code: `}`, color: "#82aaff" },
    ],
  },
];

export default function CodeEditorSection() {
  const [displayedLines, setDisplayedLines] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const snippet = CODE_SNIPPETS[0];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const editorRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -15]);
  const editorY = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -40]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    let lineIdx = 0;
    let charIdx = 0;

    const typeChar = () => {
      if (lineIdx >= snippet.lines.length) return;
      const currentLine = snippet.lines[lineIdx];
      if (charIdx <= currentLine.code.length) {
        setDisplayedLines(lineIdx);
        setCharCount(charIdx);
        charIdx++;
        setTimeout(typeChar, 35 + Math.random() * 30);
      } else {
        lineIdx++;
        charIdx = 0;
        setDisplayedLines(lineIdx);
        setCharCount(0);
        setTimeout(typeChar, 60);
      }
    };

    const t = setTimeout(typeChar, 400);
    return () => clearTimeout(t);
  }, [inView, snippet.lines]);

  return (
    <section
      ref={sectionRef}
      id="code-editor"
      className="relative py-20 md:py-32 overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left: text */}
          <ScrollReveal direction="left" duration={0.8} className="order-1 lg:order-1">
            <div className="text-xs font-mono tracking-[0.3em] text-white/30 uppercase mb-4">
              CRAFTED IN CODE
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black leading-[1.1] tracking-tighter mb-6">
              <SplitTextReveal text="Clean code," mode="words" />{" "}
              <span className="text-gradient-color">beautiful</span>
              {" "}results.
            </h2>
            <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-md mb-8">
              Every pixel is intentional. Every animation has purpose. I write code that not
              only works flawlessly but reads clearly — maintainable, scalable, and elegant.
            </p>

            <div className="flex flex-wrap gap-3">
              {["TypeScript", "React 19", "Next.js 16", "Framer Motion"].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 text-xs font-mono text-white/50 border border-white/[0.06] bg-white/[0.02] rounded-lg"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* SVG path drawing decoration */}
            <div className="mt-8 opacity-30">
              <svg width="200" height="40" viewBox="0 0 200 40" fill="none">
                <path
                  d="M 0 20 Q 50 0 100 20 T 200 20"
                  stroke="url(#grad1)"
                  strokeWidth="1.5"
                  fill="none"
                  className="svg-draw-path"
                  style={inView ? { animation: "svg-draw 2s ease-in-out forwards" } : {}}
                />
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366f1" />
                    <stop offset="0.5" stopColor="#a855f7" />
                    <stop offset="1" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </ScrollReveal>

          {/* Right: code editor */}
          <motion.div
            style={{ rotateX: editorRotateX, y: editorY, perspective: 1000 }}
            className="code-editor-window order-2 lg:order-2 shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10"
          >
            {/* Title bar */}
            <div className="code-editor-titlebar">
              <div className="code-editor-dot bg-[#ff5f57]" />
              <div className="code-editor-dot bg-[#febc2e]" />
              <div className="code-editor-dot bg-[#28c840]" />
              <span className="ml-3 text-xs text-white/30 font-mono">{snippet.filename}</span>
            </div>

            {/* Code area */}
            <div className="p-4 md:p-6 font-mono text-xs md:text-sm overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody>
                  {snippet.lines.map((line, i) => {
                    let content: string;
                    if (i < displayedLines) {
                      content = line.code;
                    } else if (i === displayedLines) {
                      content = line.code.slice(0, charCount);
                    } else {
                      content = "";
                    }

                    const showCursor = i === displayedLines && inView;

                    return (
                      <tr key={i}>
                        <td className="pr-4 text-right select-none text-white/[0.15] w-8 align-top py-0.5">
                          {i + 1}
                        </td>
                        <td className="py-0.5 align-top" style={{ color: line.color }}>
                          <span>{content || "\u00A0"}</span>
                          {showCursor && (
                            <span className="inline-block w-[2px] h-[14px] bg-white/80 ml-[1px] align-middle typing-cursor" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
