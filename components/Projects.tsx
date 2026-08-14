"use client";

import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import portfolioData from "@/data/portfolio.json";
import Image from "next/image";
import { ArrowRight, Search, Filter, GitBranch, ExternalLink } from "lucide-react";
import { useState, useRef, useCallback, useEffect, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import SplitTextReveal from "@/components/SplitTextReveal";
import ScrollReveal from "@/components/ScrollReveal";

const categories = ["All", "Web Application", "Graphic Design", "Networking"];

// 3D Card hover effect
function Card3D({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(nx);
    y.set(ny);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Projects");
  const router = useRouter();
  const lenis = useLenis();
  const lenisRef = useRef<typeof lenis>(null);
  useEffect(() => { lenisRef.current = lenis; }, [lenis]);

  // Read skip intro flag synchronously on client to prevent animation flash
  const skipAnimRef = useRef(false);
  if (typeof window !== "undefined" && !skipAnimRef.current) {
    try {
      if (sessionStorage.getItem("skipIntroNext") === "true") {
        skipAnimRef.current = true;
      }
    } catch {}
  }
  const skipAnim = skipAnimRef.current;

  useEffect(() => {
    try {
      if (sessionStorage.getItem("skipIntroNext") === "true") {
        sessionStorage.removeItem("skipIntroNext");
      }
    } catch {}
  }, []);

  const filteredProjects = portfolioData.projects.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const handleNavigate = (id: string) => {
    try {
      sessionStorage.setItem("lastViewedProject", id);
      // Save exact scroll position for instant restoration
      sessionStorage.setItem("portfolioScrollY", window.scrollY.toString());
    } catch {
      // Fallback
    }
    router.push(`/projects/${id}`);
  };

  // Scroll to a specific project card when returning from the detail page.
  // Because this component stays mounted during client-side navigation,
  // a mount-only useEffect won't re-fire. Instead we poll sessionStorage
  // briefly after the component renders, and also listen for focus events.
  const scrolledRef = useRef(false);

  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    if (scrolledRef.current) return;
    if (window.location.pathname !== "/") return;

    let targetY: number | null = null;
    let targetId = "";

    try {
      const storedY = sessionStorage.getItem("portfolioScrollY");
      if (storedY) {
        targetY = parseFloat(storedY);
        sessionStorage.removeItem("portfolioScrollY");
      }
      const storedId = sessionStorage.getItem("lastViewedProject");
      if (storedId) {
        targetId = storedId;
        sessionStorage.removeItem("lastViewedProject");
      }
    } catch {}

    if (targetY === null && !targetId) {
      const hash = window.location.hash;
      if (hash && hash.startsWith("#project-")) {
        targetId = hash.replace("#project-", "");
      }
    }

    if (targetY !== null) {
      scrolledRef.current = true;
      if (lenisRef.current) {
        lenisRef.current.scrollTo(targetY, { immediate: true });
      } else {
        window.scrollTo({ top: targetY, behavior: "instant" as any });
      }
      return;
    }

    if (targetId) {
      scrolledRef.current = true;
      const el = document.getElementById(`project-${targetId}`);
      if (el) {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(el, {
            offset: -(window.innerHeight / 2 - el.offsetHeight / 2),
            immediate: true,
          });
        } else {
          el.scrollIntoView({ block: "center" });
        }
      }
    }
  }, []);

  return (
    <section id="projects" className="relative min-h-screen py-20 md:py-32 flex flex-col items-center">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <ScrollReveal direction="up" duration={0.8} className="flex flex-col items-center mb-12 md:mb-16 text-center">
          <div className="text-xs font-mono tracking-[0.3em] text-white/30 uppercase mb-4">
            WORK
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-3 md:mb-4">
            <SplitTextReveal text="Portfolio Showcase" mode="words" gradient />
          </h2>
          <p className="text-white/40 text-xs sm:text-sm md:text-base max-w-md">
            Explore my journey through projects, certifications, and technical expertise.
          </p>
          
          {/* Segmented Control */}
          <div className="mt-8 md:mt-12 flex overflow-x-auto whitespace-nowrap p-1 rounded-full border border-white/10 bg-[#111] max-w-lg w-full">
            {["Projects", "Certificates", "Tech Stack"].map((tab) => (
              <button
                key={tab}
                id={`tab-${tab.toLowerCase().replace(" ", "-")}`}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-xs md:text-sm font-medium rounded-full transition-all ${
                  activeTab === tab
                    ? "bg-white/[0.08] text-white shadow-sm border border-white/10"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Tab Content */}
        <div className="mt-8 md:mt-12 min-h-[400px] md:min-h-[500px]">
          {activeTab === "Projects" && (
            <motion.div
              key="projects"
              initial={skipAnim ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Search + Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    id="project-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects, tech stack..."
                    className="search-input"
                    aria-label="Search projects"
                  />
                </div>

                {/* Category filter */}
                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      id={`filter-${cat.toLowerCase().replace(/[^a-z]/g, "-")}`}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                        activeCategory === cat
                          ? "bg-white text-black font-semibold"
                          : "bg-white/[0.03] border border-white/[0.08] text-white/50 hover:text-white/80 hover:bg-white/[0.06]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Cards */}
              <AnimatePresence mode="popLayout">
                {filteredProjects.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-20 text-white/30"
                  >
                    <Filter className="w-8 h-8 mb-3 opacity-50" />
                    <p className="text-sm font-mono">No projects match your search.</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="grid"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                    layout
                  >
                    {filteredProjects.map((project, i) => (
                      <motion.div
                        key={project.id}
                        id={`project-${project.id}`}
                        layout
                        initial={skipAnim ? false : { opacity: 0, scale: 0.9, y: 30, filter: "blur(4px)" }}
                        whileInView={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: true, margin: "-40px" }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        transition={{ duration: 0.5, delay: skipAnim ? 0 : i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <Card3D>
                          <div className="glass-card rounded-3xl p-4 flex flex-col group hover:border-white/20 transition-all duration-300 h-full">
                            {/* Thumbnail Preview Container */}
                            <div className="relative w-full h-52 sm:h-60 rounded-2xl overflow-hidden mb-5 bg-[#09090c] border border-white/[0.08] p-3 flex items-center justify-center group-hover:border-white/20 transition-all duration-300">
                              {/* Background ambient canvas glow */}
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.035)_0%,transparent_70%)] pointer-events-none" />
                              
                              <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-contain p-1 opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500 drop-shadow-md"
                              />
                              {/* Category badge */}
                              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-mono text-white/80 border border-white/10 z-10">
                                {project.category}
                              </div>
                              {/* Year badge */}
                              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-mono text-white/60 border border-white/10 z-10">
                                {project.year}
                              </div>
                            </div>

                            <div className="flex-1 flex flex-col px-1">
                              <h3 className="text-xl font-heading font-bold mb-2 text-white group-hover:text-white/90">{project.title}</h3>
                              <p className="text-sm text-white/50 leading-relaxed mb-4 line-clamp-2">
                                {project.description}
                              </p>

                              {/* Tech tags */}
                              <div className="flex flex-wrap gap-1.5 mb-5">
                                {project.technologies.map((tech) => (
                                  <span
                                    key={tech}
                                    className="px-2 py-0.5 text-[10px] font-mono text-white/40 border border-white/[0.06] bg-white/[0.02] rounded-md"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>

                              <div className="mt-auto flex items-center gap-2 pt-4 border-t border-white/5">
                                <a
                                  href={project.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-lg border border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
                                  aria-label="GitHub"
                                >
                                  <GitBranch className="w-4 h-4" />
                                </a>
                                <a
                                  href={project.liveDemo}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-lg border border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
                                  aria-label="Live demo"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                                <button
                                  onClick={() => handleNavigate(project.id)}
                                  className="ml-auto flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 hover:bg-white hover:text-black text-white transition-all text-xs font-medium"
                                >
                                  Details <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </Card3D>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === "Certificates" && (
            <motion.div
              key="certs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            >
              {portfolioData.certificates.map((cert, i) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, scale: 0.92, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-card rounded-3xl p-4 flex flex-col group hover:border-white/15 transition-all duration-300"
                >
                  <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden mb-5 bg-[#09090c] border border-white/[0.08] p-3 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.035)_0%,transparent_70%)] pointer-events-none" />
                    <Image
                      src={cert.image}
                      alt={cert.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-1 opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500 drop-shadow-md"
                    />
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-mono text-white/60 border border-white/10 z-10">
                      {cert.date}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col px-1">
                    <h3 className="text-xl font-heading font-bold mb-2">{cert.title}</h3>
                    <p className="text-xs text-white/50 font-mono mb-2">{cert.issuer}</p>
                    <p className="text-sm text-white/50 leading-relaxed line-clamp-2">{cert.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "Tech Stack" && (
            <motion.div
              key="tech"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            >
              {portfolioData.skills.map((skill, i) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  className="glass-card rounded-2xl p-4 flex items-center gap-3 hover:border-white/15 transition-all group"
                >
                  <span className="text-2xl">
                    {["⚡","⚛️","🔷","🎨","🌀","✨","🌐","🟢","🐍","🗄️","🔗","🎭"][i] || "💻"}
                  </span>
                  <span className="text-sm font-medium text-white/60 group-hover:text-white/90 transition-colors">
                    {skill}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
