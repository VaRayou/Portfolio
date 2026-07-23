"use client";

import { motion } from "framer-motion";

interface AnimatedHeadingProps {
  subtitle?: string;
  title: string;
  gradientText?: string;
  description?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export default function AnimatedHeading({
  subtitle,
  title,
  gradientText,
  description,
  align = "center",
  className = "",
}: AnimatedHeadingProps) {
  const words = title.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 30, rotateX: -45, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 180,
        damping: 16,
      },
    },
  };

  const alignClass =
    align === "center"
      ? "items-center text-center mx-auto"
      : align === "right"
      ? "items-end text-right ml-auto"
      : "items-start text-left mr-auto";

  return (
    <div className={`flex flex-col ${alignClass} mb-12 md:mb-16 ${className}`}>
      {/* Subtitle / Eyebrow Badge */}
      {subtitle && (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.2, 0, 0.2, 1] }}
          className="flex items-center gap-2 mb-3"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-mono text-white/40 uppercase tracking-[0.3em]">
            {subtitle}
          </span>
        </motion.div>
      )}

      {/* Staggered Word Reveal Title */}
      <motion.h2
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight leading-[1.1] text-white"
        style={{ perspective: 1000 }}
      >
        {words.map((word, index) => (
          <span key={index} className="inline-block whitespace-nowrap mr-[0.25em]">
            <motion.span variants={wordVariants} className="inline-block">
              {word}
            </motion.span>
          </span>
        ))}

        {/* Gradient Text Highlight */}
        {gradientText && (
          <motion.span
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="inline-block ml-[0.25em] bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent"
          >
            {gradientText}
          </motion.span>
        )}
      </motion.h2>

      {/* Description paragraph */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-white/50 text-xs sm:text-sm md:text-base max-w-lg mt-3 md:mt-4 leading-relaxed font-sans"
        >
          {description}
        </motion.p>
      )}

      {/* Expanding Accent Line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-20 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent mt-4 rounded-full"
      />
    </div>
  );
}
