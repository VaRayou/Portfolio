"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, ZoomIn } from "lucide-react";

interface ProjectImageViewerProps {
  src: string;
  title: string;
}

export default function ProjectImageViewer({ src, title }: ProjectImageViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      {/* Main Image Canvas Container */}
      <div 
        onClick={() => setIsFullscreen(true)}
        className="relative w-full h-[380px] sm:h-[480px] md:h-[560px] max-h-[75vh] rounded-3xl overflow-hidden bg-[#09090c] border border-white/10 p-4 sm:p-6 shadow-2xl flex items-center justify-center group cursor-pointer transition-all duration-300 hover:border-white/20"
        title="Click to view full original artwork"
      >
        {/* Subtle Canvas Pattern & Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)] pointer-events-none" />
        
        {/* Artwork Image with object-contain */}
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={src}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-contain p-2 drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.015]"
            priority
          />
        </div>

        {/* Floating View Original Action Overlay */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-xs text-white/80 group-hover:text-white group-hover:bg-black/90 group-hover:border-white/30 transition-all shadow-lg">
          <ZoomIn className="w-3.5 h-3.5 text-white/70" />
          <span className="font-medium">Full Artwork</span>
          <Maximize2 className="w-3.5 h-3.5 text-white/70 ml-1" />
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col p-4 sm:p-6"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Header */}
            <div className="flex items-center justify-between z-10 py-2 px-2 max-w-7xl w-full mx-auto" onClick={(e) => e.stopPropagation()}>
              <div>
                <h3 className="text-white font-heading font-bold text-base sm:text-lg">{title}</h3>
                <p className="text-white/40 text-xs font-mono">Original Artwork - 100% Uncropped</p>
              </div>

              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
                aria-label="Close fullscreen view"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Canvas */}
            <div 
              className="relative flex-1 w-full max-w-7xl mx-auto my-auto flex items-center justify-center p-2 sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={src}
                alt={title}
                fill
                sizes="100vw"
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
