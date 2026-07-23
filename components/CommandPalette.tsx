"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Home, User, Code, Mail, Briefcase, GitBranch, Command } from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    {
      id: "home",
      label: "Go to Home",
      description: "Navigate to hero section",
      icon: <Home className="w-4 h-4" />,
      action: () => scrollTo("home"),
      category: "Navigation",
    },
    {
      id: "about",
      label: "Go to About",
      description: "Learn about me",
      icon: <User className="w-4 h-4" />,
      action: () => scrollTo("about"),
      category: "Navigation",
    },
    {
      id: "projects",
      label: "View Projects",
      description: "See my portfolio work",
      icon: <Code className="w-4 h-4" />,
      action: () => scrollTo("projects"),
      category: "Navigation",
    },
    {
      id: "skills",
      label: "Core Technologies",
      description: "My tech stack",
      icon: <Briefcase className="w-4 h-4" />,
      action: () => scrollTo("skills"),
      category: "Navigation",
    },
    {
      id: "contact",
      label: "Contact Me",
      description: "Get in touch",
      icon: <Mail className="w-4 h-4" />,
      action: () => scrollTo("contact"),
      category: "Navigation",
    },
    {
      id: "github",
      label: "View GitHub",
      description: "Open GitHub profile",
      icon: <GitBranch className="w-4 h-4" />,
      action: () => window.open("https://github.com", "_blank"),
      category: "Links",
    },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  const filtered = commands.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      (c.description?.toLowerCase().includes(query.toLowerCase()) ?? false) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery("");
        setSelected(0);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setSelected((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && filtered[selected]) {
      filtered[selected].action();
      setOpen(false);
    }
  };

  const categories = [...new Set(filtered.map((c) => c.category))];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="command-palette-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <motion.div
            className="command-palette-box"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0.2, 1] }}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
              <Search className="w-4 h-4 text-white/40 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
                onKeyDown={handleKey}
                placeholder="Search commands..."
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder-white/30"
                aria-label="Command palette search"
              />
              <kbd className="text-[10px] font-mono text-white/20 bg-white/5 px-2 py-1 rounded border border-white/10">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[360px] overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <div className="px-4 py-8 text-center text-white/30 text-sm">
                  No commands found for &quot;{query}&quot;
                </div>
              ) : (
                categories.map((cat) => (
                  <div key={cat}>
                    <div className="px-4 py-2 text-[10px] font-mono text-white/25 uppercase tracking-widest">
                      {cat}
                    </div>
                    {filtered
                      .filter((c) => c.category === cat)
                      .map((cmd) => {
                        const globalIndex = filtered.indexOf(cmd);
                        return (
                          <button
                            key={cmd.id}
                            id={`cmd-${cmd.id}`}
                            onClick={() => { cmd.action(); setOpen(false); }}
                            onMouseEnter={() => setSelected(globalIndex)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                              selected === globalIndex
                                ? "bg-white/[0.06] text-white"
                                : "text-white/60 hover:text-white"
                            }`}
                          >
                            <span className={`${selected === globalIndex ? "text-purple-400" : "text-white/30"} transition-colors`}>
                              {cmd.icon}
                            </span>
                            <div className="flex-1">
                              <div className="text-sm font-medium">{cmd.label}</div>
                              {cmd.description && (
                                <div className="text-xs text-white/30">{cmd.description}</div>
                              )}
                            </div>
                            {selected === globalIndex && (
                              <kbd className="text-[10px] font-mono text-white/20 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                                ↵
                              </kbd>
                            )}
                          </button>
                        );
                      })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/[0.06] px-4 py-2 flex items-center gap-4 text-[10px] font-mono text-white/20">
              <span className="flex items-center gap-1">
                <kbd className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">↑↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">↵</kbd>
                select
              </span>
              <span className="flex items-center gap-1 ml-auto">
                <Command className="w-3 h-3" />
                K to open
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
