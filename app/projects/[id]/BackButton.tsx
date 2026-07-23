"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const handleClick = () => {
    try {
      sessionStorage.setItem("skipIntroNext", "true");
    } catch (e) {
      // Fallback
    }
  };

  return (
    <Link 
      href="/#projects"
      onClick={handleClick}
      className="inline-flex items-center space-x-2 text-white/50 hover:text-white transition-colors mb-8 md:mb-12"
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm font-medium">Back</span>
    </Link>
  );
}
