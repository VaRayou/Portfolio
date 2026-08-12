"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, User, Briefcase, FolderOpen, Zap, Mail } from "lucide-react";
import { useActiveSection } from "@/hooks/useActiveSection";

interface DockItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  action: () => void;
}

export default function FloatingDock() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const activeSection = useActiveSection(["home", "about", "projects", "experience", "skills", "contact"]);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("skipIntroNext") === "true") {
        setHasSeenIntro(true);
      }
    } catch {}
  }, []);

  const dockDelay = hasSeenIntro ? 0.1 : 4.2;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const items: DockItem[] = [
    { id: "home", icon: <Home className="w-5 h-5" />, label: "Home", action: () => scrollTo("home") },
    { id: "about", icon: <User className="w-5 h-5" />, label: "About", action: () => scrollTo("about") },
    { id: "projects", icon: <FolderOpen className="w-5 h-5" />, label: "Portfolio", action: () => scrollTo("projects") },
    { id: "experience", icon: <Briefcase className="w-5 h-5" />, label: "Experience", action: () => scrollTo("experience") },
    { id: "skills", icon: <Zap className="w-5 h-5" />, label: "Skills", action: () => scrollTo("skills") },
    { id: "contact", icon: <Mail className="w-5 h-5" />, label: "Contact", action: () => scrollTo("contact") },
  ];

  const getScale = (index: number) => {
    if (hoveredIndex === null) return 1;
    const dist = Math.abs(index - hoveredIndex);
    if (dist === 0) return 1.4;
    if (dist === 1) return 1.2;
    if (dist === 2) return 1.08;
    return 1;
  };

  return (
    <motion.div 
      className="floating-dock" 
      aria-label="Floating navigation dock"
      initial={{ opacity: 0, x: "-50%", y: 50 }}
      animate={{ opacity: 1, x: "-50%", y: 0 }}
      transition={{ duration: 0.85, delay: dockDelay, ease: [0.16, 1, 0.3, 1] }}
    >
      {items.map((item, i) => {
        if (item.id === "sep") {
          return (
            <div key="sep" className="w-px h-6 bg-white/10 mx-1 self-center" />
          );
        }

        const isActive = activeSection === item.id;

        return (
          <div key={item.id} className="relative flex flex-col items-center">
            {/* Tooltip */}
            <AnimatePresence>
              {tooltip === item.id && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className="absolute -top-9 px-2.5 py-1 bg-[#151515]/90 backdrop-blur-md border border-white/15 rounded-md text-[11px] font-mono text-white/90 whitespace-nowrap pointer-events-none shadow-lg z-30"
                >
                  {item.label}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              id={`dock-${item.id}`}
              onClick={item.action}
              onMouseEnter={() => { setHoveredIndex(i); setTooltip(item.id); }}
              onMouseLeave={() => { setHoveredIndex(null); setTooltip(null); }}
              animate={{ scale: getScale(i) }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                isActive
                  ? "bg-white/20 text-white border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.25)]"
                  : "text-white/40 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05]"
              }`}
              aria-label={item.label}
            >
              {item.icon}

              {/* Active Dot Pin */}
              {isActive && (
                <motion.span
                  layoutId="dock-active-dot"
                  className="absolute -bottom-1 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_6px_#fff]"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          </div>
        );
      })}
    </motion.div>
  );
}
