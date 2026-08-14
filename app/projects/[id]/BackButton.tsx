"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useState, useCallback } from "react";

interface BackButtonProps {
  projectId?: string;
}

export default function BackButton({ projectId }: BackButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleClick = useCallback(() => {
    if (isPending) return;
    setIsPending(true);

    try {
      sessionStorage.setItem("skipIntroNext", "true");
      if (projectId) {
        sessionStorage.setItem("lastViewedProject", projectId);
      }
    } catch {}

    // Navigate immediately. Use native history back if possible for true instant navigation
    // Next.js intercepts this but using the native API is sometimes faster for triggering the popstate
    if (window.history.length > 1) {
      window.history.back();
    } else {
      router.push("/");
    }

    // Re-enable after a short delay to prevent double taps but not permanently lock it
    setTimeout(() => {
      setIsPending(false);
    }, 1000);
  }, [isPending, projectId, router]);

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`inline-flex items-center space-x-2 text-white/50 mb-8 md:mb-12 transition-all duration-200 cursor-pointer touch-manipulation select-none ${
        isPending ? "opacity-50" : "hover:text-white active:scale-95 active:text-white active:brightness-110"
      }`}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm font-medium">Back</span>
    </button>
  );
}
