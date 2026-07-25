"use client";

import { motion, useMotionValue, useSpring, useTransform, useAnimationFrame, animate as framerAnimate } from "framer-motion";
import Image from "next/image";
import portfolioData from "@/data/portfolio.json";
import { useEffect, useRef, useState } from "react";
import { RefreshCw, QrCode } from "lucide-react";

const CARD_W = 280;
const CARD_H = 410;

function getScaleForWidth(w: number) {
  if (w < 360) return 0.55;
  if (w < 480) return 0.62;
  if (w < 640) return 0.72;
  if (w < 1024) return 0.82;
  return 1;
}

function getRestYOffset(w: number) {
  if (w < 480) return 110;
  if (w < 640) return 140;
  if (w < 1024) return 180;
  return 220;
}

export default function IDBadge() {
  const cardRef = useRef<HTMLDivElement>(null);
  const strapRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  // Motion values for card position and tilt
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const rotateZ = useMotionValue(0);

  // 3D Mouse Tilt values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 180, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 180, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10]);

  const [scale, setScale] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(1);

  const isDragging = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const anchorPosRef = useRef({ ax: 0, ay: 0 });
  const restPosRef = useRef({ x: 0, y: 0 });
  const hasDropped = useRef(false);
  const prevCardX = useRef(0);
  const angularVelocity = useRef(0);

  // Helper to find the dynamic anchor position on the Navbar clip with boundary clamping
  const getAnchorPos = () => {
    if (typeof window === "undefined") return { ax: 800, ay: 62, rawAx: 800 };
    const clipEl = document.querySelector("[data-lanyard-anchor]") || document.querySelector("[data-navbar]");
    let rawAx = window.innerWidth * 0.78;
    let ay = 62;
    if (clipEl) {
      const rect = clipEl.getBoundingClientRect();
      rawAx = rect.left + rect.width / 2;
      ay = rect.bottom - 4; // Attaches right inside the clip ring
    }

    const currentSc = getScaleForWidth(window.innerWidth);
    const scaledW = CARD_W * currentSc;
    const margin = window.innerWidth < 640 ? 14 : 24;
    const minAx = margin + scaledW / 2;
    const maxAx = window.innerWidth - margin - scaledW / 2;
    const clampedAx = Math.max(minAx, Math.min(maxAx, rawAx));

    return { ax: clampedAx, ay, rawAx };
  };

  // Scroll listener to smoothly fade out card & lanyard when scrolling down past Hero
  useEffect(() => {
    const handleScrollOpacity = () => {
      const scrollY = window.scrollY;
      const fadeDistance = Math.min(window.innerHeight * 0.5, 450);
      const op = Math.max(0, Math.min(1, 1 - scrollY / fadeDistance));
      setScrollOpacity((prev) => (Math.abs(prev - op) > 0.01 ? op : prev));
    };

    handleScrollOpacity();
    window.addEventListener("scroll", handleScrollOpacity, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollOpacity);
  }, []);

  // Handle Resize and Initial Drop Physics
  useEffect(() => {
    const { ax, ay } = getAnchorPos();
    anchorPosRef.current = { ax, ay };
    const restX = ax - CARD_W / 2;
    const restY = ay + getRestYOffset(window.innerWidth);
    restPosRef.current = { x: restX, y: restY };

    if (!hasDropped.current) {
      cardX.set(restX);
      cardY.set(-CARD_H - 100);
    }

    const isFastIntro = typeof window !== "undefined" && sessionStorage.getItem("skipIntroNext") === "true";
    const dropDelay = isFastIntro ? 100 : 4200;

    const timer = setTimeout(() => {
      if (hasDropped.current) return;
      hasDropped.current = true;
      const { x: restX, y: restY } = restPosRef.current;

      framerAnimate(cardY, restY, {
        type: "spring",
        stiffness: 85,
        damping: 13,
        mass: 1.0,
      });

      framerAnimate(cardX, [restX - 30, restX + 18, restX - 6, restX], {
        duration: 0.95,
        ease: [0.16, 1, 0.3, 1],
        times: [0, 0.35, 0.7, 1],
      });
    }, dropDelay);

    const recalcAndSnap = () => {
      const currentSc = getScaleForWidth(window.innerWidth);
      setScale(currentSc);
      const { ax, ay } = getAnchorPos();
      anchorPosRef.current = { ax, ay };
      const nextRestX = ax - CARD_W / 2;
      const nextRestY = ay + getRestYOffset(window.innerWidth);
      restPosRef.current = { x: nextRestX, y: nextRestY };

      if (!isDragging.current && hasDropped.current) {
        framerAnimate(cardX, nextRestX, { type: "spring", stiffness: 300, damping: 25 });
        framerAnimate(cardY, nextRestY, { type: "spring", stiffness: 300, damping: 25 });
      }
    };

    const handleResizeOrScroll = () => recalcAndSnap();

    handleResizeOrScroll();
    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll, { passive: true });

    // Watch the navbar for layout / transform changes (Framer Motion entrance
    // animation, font-loading layout shifts, etc.) so the card rest position
    // stays correct without requiring a manual scroll.
    let anchorRecalcTimeout: ReturnType<typeof setTimeout> | null = null;
    const debouncedRecalc = () => {
      if (anchorRecalcTimeout) clearTimeout(anchorRecalcTimeout);
      anchorRecalcTimeout = setTimeout(recalcAndSnap, 50);
    };

    const navbarEl = document.querySelector("[data-navbar]");
    let navObserver: MutationObserver | null = null;
    if (navbarEl) {
      navObserver = new MutationObserver(debouncedRecalc);
      navObserver.observe(navbarEl, { attributes: true, attributeFilter: ["style"] });
    }

    const anchorEl = document.querySelector("[data-lanyard-anchor]");
    let anchorObserver: ResizeObserver | null = null;
    if (anchorEl) {
      anchorObserver = new ResizeObserver(debouncedRecalc);
      anchorObserver.observe(anchorEl);
    }

    return () => {
      clearTimeout(timer);
      if (anchorRecalcTimeout) clearTimeout(anchorRecalcTimeout);
      navObserver?.disconnect();
      anchorObserver?.disconnect();
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll);
    };
  }, [cardX, cardY]);

  // Frame-by-frame position tracking for Lanyard Strap
  useAnimationFrame((_, delta) => {
    const { ay, rawAx } = getAnchorPos();

    const currentScale = getScaleForWidth(window.innerWidth);
    const cx = cardX.get() + CARD_W / 2;
    const cy = cardY.get() - 8 * currentScale;

    const dx = cx - rawAx;
    const dy = cy - ay;
    const length = Math.max(15, Math.sqrt(dx * dx + dy * dy));
    const angleRad = Math.atan2(dy, dx);
    const angleDeg = angleRad * (180 / Math.PI) - 90;

    if (strapRef.current) {
      strapRef.current.style.height = `${length}px`;
      strapRef.current.style.transform = `translate3d(${rawAx - 8}px, ${ay}px, 0px) rotate(${angleDeg}deg)`;
      strapRef.current.style.transformOrigin = "top center";
      const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
      const fadeDistance = typeof window !== "undefined" ? Math.min(window.innerHeight * 0.5, 450) : 400;
      const currentOpacity = Math.max(0, Math.min(1, 1 - scrollY / fadeDistance));
      strapRef.current.style.opacity = `${currentOpacity}`;
      strapRef.current.style.visibility = currentOpacity <= 0.01 ? "hidden" : "visible";
    }

    const currentX = cardX.get();
    const vel = (currentX - prevCardX.current) / Math.max(delta, 1);
    angularVelocity.current = angularVelocity.current * 0.88 + vel * 0.12;
    prevCardX.current = currentX;

    const velocityTilt = angularVelocity.current * 0.6;
    rotateZ.set(isDragging.current ? angleDeg + velocityTilt * 1.4 : angleDeg * 0.1 + velocityTilt);

    if (glareRef.current) {
      const gX = springX.get() * 180;
      const gY = springY.get() * 180;
      glareRef.current.style.transform = `translate3d(${gX}px, ${gY}px, 0px)`;
    }
  });

  // Mouse tilt handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (scrollOpacity <= 0.01) return;
    isDragging.current = true;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    dragOffsetRef.current = {
      x: e.clientX - cardX.get(),
      y: e.clientY - cardY.get(),
    };
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const nextX = e.clientX - dragOffsetRef.current.x;
    const nextY = e.clientY - dragOffsetRef.current.y;
    cardX.set(nextX);
    cardY.set(nextY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    const dx = Math.abs(e.clientX - dragStartPos.current.x);
    const dy = Math.abs(e.clientY - dragStartPos.current.y);
    if (dx < 6 && dy < 6) {
      setIsFlipped((prev) => !prev);
      return;
    }

    const { x: restX, y: restY } = restPosRef.current;
    framerAnimate(cardX, restX, { type: "spring", stiffness: 220, damping: 18 });
    framerAnimate(cardY, restY, { type: "spring", stiffness: 220, damping: 18 });
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none z-35 overflow-hidden transition-opacity duration-200"
      style={{
        opacity: scrollOpacity,
        visibility: scrollOpacity <= 0.01 ? "hidden" : "visible",
      }}
    >
      {/* ═══ CLEAN MINIMAL LANYARD STRAP ═══ */}
      <div
        ref={strapRef}
        className="fixed top-0 left-0 w-[16px] z-35 flex flex-col items-center overflow-hidden pointer-events-none shadow-xl"
        style={{
          background: "linear-gradient(90deg, #111 0%, #222 50%, #111 100%)",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          willChange: "transform, height",
        }}
      >
        <div className="absolute left-[1px] top-0 bottom-0 w-[1px] bg-white/10" />
        <div className="absolute right-[1px] top-0 bottom-0 w-[1px] bg-white/10" />
      </div>

      {/* ═══ MINIMALIST 3D CARD CONTAINER ═══ */}
      <motion.div
        ref={cardRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          x: cardX,
          y: cardY,
          rotateZ,
          scale,
          opacity: scrollOpacity,
          visibility: scrollOpacity <= 0.01 ? "hidden" : "visible",
          pointerEvents: scrollOpacity <= 0.01 ? "none" : "auto",
          position: "fixed",
          top: 0,
          left: 0,
          width: CARD_W,
          height: CARD_H,
          originX: 0.5,
          originY: 0,
          zIndex: 35,
          perspective: 1000,
        }}
        className="cursor-grab active:cursor-grabbing select-none touch-none"
      >
        {/* ═══ SLEEK METAL CLIP ═══ */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none">
          <div className="w-4 h-5 rounded-t-full border border-gray-400 bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 shadow flex items-center justify-center">
            <div className="w-2 h-3 rounded-t-full bg-[#111]" />
          </div>
          <div className="w-7 h-2.5 rounded-sm bg-gradient-to-b from-gray-400 via-gray-600 to-gray-800 border border-white/20 -mt-1 shadow-md" />
        </div>

        {/* ═══ SLEEK & SIMPLE CARD BODY ═══ */}
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative w-full h-full rounded-2xl bg-[#0d0f14] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Gloss glare sheen */}
          <div
            ref={glareRef}
            className="absolute inset-0 pointer-events-none z-20 opacity-20 mix-blend-overlay transition-transform duration-75"
            style={{
              background:
                "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.8) 50%, transparent 70%)",
            }}
          />

          {/* ════════════════════════════════════════════════ */}
          {/* FRONT SIDE (MINIMAL & CLEAN)                     */}
          {/* ════════════════════════════════════════════════ */}
          <div
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-between p-5 text-white"
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Top hole slot & Minimal Branding */}
            <div className="w-full flex flex-col items-center">
              <div className="w-8 h-2 rounded-full bg-[#050505] border border-white/10 mb-3" />
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[9px] font-mono tracking-[0.25em] text-white/50 uppercase">
                  STAFF ID • KDIB-IT
                </span>
              </div>
            </div>

            {/* Clean Portrait Photo */}
            <div className="relative w-[135px] h-[135px] rounded-xl overflow-hidden border border-white/15 shadow-xl my-auto">
              <Image
                src="/coverface.JPG"
                alt={portfolioData.personal.name}
                fill
                className="object-cover pointer-events-none"
                draggable={false}
                priority
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/20 rounded-xl pointer-events-none" />
            </div>

            {/* Typography */}
            <div className="text-center w-full space-y-1">
              <h2 className="text-lg font-heading font-bold text-white tracking-wide">
                {portfolioData.personal.name}
              </h2>
              <p className="text-[11px] font-mono text-white/50 tracking-wider">
                {portfolioData.personal.role}
              </p>
            </div>

            {/* Minimal Barcode Footer */}
            <div className="w-full pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-[1.5px] h-3.5 opacity-60">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white"
                    style={{
                      width: [2, 6, 11, 15, 20, 24].includes(i) ? "2px" : "1px",
                      height: "100%",
                    }}
                  />
                ))}
              </div>
              <span className="text-[8px] font-mono text-white/30 tracking-widest">
                ID-8492-2026
              </span>
            </div>

            {/* Flip hint */}
            <div className="absolute bottom-1 right-2 opacity-30 hover:opacity-70 transition-opacity">
              <RefreshCw className="w-2.5 h-2.5 text-white" />
            </div>
          </div>

          {/* ════════════════════════════════════════════════ */}
          {/* BACK SIDE (MINIMAL & CLEAN)                      */}
          {/* ════════════════════════════════════════════════ */}
          <div
            className="absolute inset-0 w-full h-full flex flex-col justify-between p-5 bg-[#08090c] text-white"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {/* Magnetic Stripe */}
            <div className="-mx-5 -mt-5 mb-4">
              <div className="w-full h-10 bg-[#111] border-b border-white/10" />
            </div>

            {/* QR Code & Contact */}
            <div className="flex flex-col items-center justify-center my-auto space-y-3">
              <div className="w-20 h-20 bg-white p-1.5 rounded-lg shadow-lg">
                <QrCode className="w-full h-full text-black" />
              </div>
              <div className="text-center space-y-0.5">
                <p className="text-[10px] font-mono text-white/70">Kdib-IT.dev</p>
                <p className="text-[8px] font-mono text-white/30">Scan to connect</p>
              </div>
            </div>

            {/* Footer */}
            <div className="w-full pt-3 border-t border-white/10 text-center">
              <p className="text-[7.5px] font-mono text-white/30 tracking-widest">
                VERIFIED PASS • 2026
              </p>
            </div>

            {/* Flip hint */}
            <div className="absolute bottom-1 right-2 opacity-30 hover:opacity-70 transition-opacity">
              <RefreshCw className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
