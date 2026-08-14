"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  projectId?: string;
}

export default function BackButton({ projectId }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    try {
      // Skip the intro animation on return
      sessionStorage.setItem("skipIntroNext", "true");
      // Store which project card to scroll to
      if (projectId) {
        sessionStorage.setItem("lastViewedProject", projectId);
      }
    } catch {
      // Fallback for private browsing
    }
    // Navigate back client-side — no hash so browser doesn't auto-scroll to section header
    router.push("/");
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center space-x-2 text-white/50 hover:text-white transition-colors mb-8 md:mb-12"
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm font-medium">Back</span>
    </button>
  );
}
