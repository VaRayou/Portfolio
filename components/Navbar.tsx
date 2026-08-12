"use client";

import { motion, AnimatePresence, useScroll } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Command } from "lucide-react";

import { useActiveSection } from "@/hooks/useActiveSection";

const links = [
{ name: "Home", href: "#home", id: "home", matchIds: ["home"] },
{ name: "About", href: "#about", id: "about", matchIds: ["about"] },
{ name: "Portfolio", href: "#projects", id: "projects", matchIds: ["projects"] },
{ name: "Experience", href: "#experience", id: "experience", matchIds: ["experience"] },
{ name: "Skills", href: "#skills", id: "skills", matchIds: ["skills"] },
{ name: "Contact", href: "#contact", id: "contact", matchIds: ["contact"] },
];

function ReadingProgress() {
const { scrollYProgress } = useScroll();

return (
<motion.div
className="reading-progress"
style={{ scaleX: scrollYProgress, transformOrigin: "left", width: "100%" }}
aria-hidden="true"
/>
);
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("skipIntroNext") === "true") {
        setHasSeenIntro(true);
      }
    } catch {}
  }, []);
const [lanyardOpacity, setLanyardOpacity] = useState(1);
const activeSectionId = useActiveSection(["home", "about", "projects", "experience", "skills", "contact"]);

const activeLink = links.find(
(l) => l.id === activeSectionId || l.matchIds?.includes(activeSectionId)
)?.name || "Home";

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const fadeDistance = Math.min(window.innerHeight * 0.5, 450);
          const op = Math.max(0, Math.min(1, 1 - scrollY / fadeDistance));
          setLanyardOpacity((prev) => (Math.abs(prev - op) > 0.01 ? op : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

const navDelay = hasSeenIntro ? 0.1 : 4.2;

const handleLinkClick = () => {
setMobileOpen(false);
};

return (
<>
<motion.div
data-navbar
className="fixed top-4 left-4 right-4 md:left-6 md:right-6 z-50 flex items-center justify-between px-4 md:px-6 py-3 rounded-2xl bg-[#050505]/75 backdrop-blur-[18px] border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
initial={{ y: -120, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
transition={{ delay: navDelay, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
>
{/* Reading Progress */}
<div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
<ReadingProgress />
</div>

{/* Lanyard Attachment Clip on Navbar */}
<div
data-lanyard-anchor
className="absolute -bottom-3.5 right-20 sm:right-24 md:right-28 lg:right-36 z-30 flex flex-col items-center pointer-events-none transition-opacity duration-300"
style={{
opacity: lanyardOpacity,
visibility: lanyardOpacity <= 0.01 ? "hidden" : "visible",
}}
>
<div className="w-8 h-4 rounded-b-md bg-gradient-to-b from-[#444] via-[#222] to-[#111] border border-white/20 shadow-lg flex flex-col items-center justify-center relative">
<div className="w-4 h-1 rounded-full bg-gradient-to-b from-[#888] to-[#444] border border-white/20 shadow-inner" />
<div className="w-3 h-3 rounded-full border-[2.5px] border-gray-300 bg-transparent -mb-2 shadow-md" />
</div>
</div>

{/* Left: branding */}
<span className="text-white/80 text-sm font-mono tracking-wide">Kdib-IT.dev</span>

{/* Center */}
<div className="hidden md:block text-white/50 text-xs"></div>

{/* Desktop nav links */}
<div className="hidden md:flex items-center gap-6">
{links.map((link) => (
<Link
key={link.name}
href={link.href}
onClick={handleLinkClick}
className="relative text-sm font-medium transition-colors"
>
<span className={activeLink === link.name ? "text-white" : "text-white/40 hover:text-white/70 transition-colors"}>
{link.name}
</span>
{activeLink === link.name && (
<motion.span
layoutId="nav-underline"
className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-white rounded-full"
transition={{ type: "spring", stiffness: 500, damping: 30 }}
/>
)}
</Link>
))}
{/* Ctrl+K hint */}
<button
id="navbar-cmd-btn"
onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}
className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/25 hover:text-white/50 hover:bg-white/[0.06] transition-all"
aria-label="Open command palette"
title="Open command palette (Ctrl+K)"
>
<Command className="w-3 h-3" />
<span className="text-[10px] font-mono">K</span>
</button>
</div>

{/* Mobile hamburger */}
<button
className="md:hidden text-white/70 hover:text-white transition-colors"
onClick={() => setMobileOpen(!mobileOpen)}
aria-label="Toggle menu"
>
{mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
</button>
</motion.div>

{/* Mobile overlay menu */}
<AnimatePresence>
{mobileOpen && (
<motion.div
className="fixed inset-0 z-40 bg-[#050505]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
transition={{ duration: 0.3 }}
>
{links.map((link, i) => (
<motion.div
key={link.name}
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -20 }}
transition={{ delay: i * 0.08 }}
>
<Link
href={link.href}
onClick={handleLinkClick}
className={`text-3xl font-heading font-bold transition-colors ${
activeLink === link.name ? "text-white" : "text-white/30 hover:text-white/60"
}`}
>
{link.name}
</Link>
</motion.div>
))}
</motion.div>
)}
</AnimatePresence>
</>
);
}
