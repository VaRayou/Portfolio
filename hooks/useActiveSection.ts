"use client";

import { useState, useEffect } from "react";

export function useActiveSection(
  sectionIds: string[] = ["home", "about", "projects", "experience", "skills", "contact"]
) {
  const [activeSection, setActiveSection] = useState<string>("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          const topEntry = visibleEntries[0];
          if (topEntry.target.id) {
            setActiveSection(topEntry.target.id);
          }
        }
      },
      {
        rootMargin: "-20% 0px -40% 0px",
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSection;
}

