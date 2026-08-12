"use client";

import { motion, useMotionValue, useSpring, useTransform, useAnimationFrame, animate as framerAnimate, AnimatePresence } from "framer-motion";
import Image from "next/image";
import portfolioData from "@/data/portfolio.json";
import { useEffect, useRef, useState, useCallback } from "react";
import { RefreshCw, QrCode, Sparkles } from "lucide-react";

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
  if (w < 480) return 80;
  if (w < 640) return 110;
  if (w < 1024) return 180;
  return 220;
}

// Responsive starting height: the card must begin completely above the viewport
// (and therefore above the fixed navbar), scaled for small screens.
function getStartY(w: number, h: number) {
  const sc = getScaleForWidth(w);
  const cardH = CARD_H * sc;
  const aboveViewportMargin = Math.max(h * 0.22, 150);
  return -(cardH + aboveViewportMargin);
}

export default function IDBadge() {
  const cardRef = useRef<HTMLDivElement>(null);
  const strapRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  // Motion values for card position and Z-rotation
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const rotateZ = useMotionValue(0);

  // 3D Drop physics & impact motion values
  const dropRotateX = useMotionValue(0);
  const dropRotateY = useMotionValue(0);
  const dropRotateZ = useMotionValue(-3.5);
  const dropScaleX = useMotionValue(1);
  const dropScaleY = useMotionValue(1);
  const strapTension = useMotionValue(0);

  // 3D Mouse Tilt values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 180, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 180, damping: 20 });

  const mouseRotateX = useTransform(springY, [-0.5, 0.5], [12, -12]);
  const mouseRotateY = useTransform(springX, [-0.5, 0.5], [-12, 12]);

  // Combine mouse 3D tilt + physical drop pitch/roll
  const combinedRotateX = useTransform(
    [mouseRotateX, dropRotateX],
    ([mRx, dRx]: number[]) => mRx + dRx
  );

  const combinedRotateY = useTransform(
    [mouseRotateY, dropRotateY],
    ([mRy, dRy]: number[]) => mRy + dRy
  );

  // Entrance opacity — used only for the reduced-motion fade-in.
  const settleOpacity = useMotionValue(1);

  const [isFlipped, setIsFlipped] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [landingGlow, setLandingGlow] = useState(false);
  const [isDraggingState, setIsDraggingState] = useState(false);

  const isDragging = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const anchorPosRef = useRef({ ax: 0, ay: 0 });
  const restPosRef = useRef({ x: 0, y: 0 });
  const hasDropped = useRef(false);
  const prevCardX = useRef(0);
  const angularVelocity = useRef(0);

  const lastPointerTime = useRef(0);
  const lastPointerPos = useRef({ x: 0, y: 0 });
  const pointerVelocity = useRef({ x: 0, y: 0 });

  // Helper to find dynamic anchor position on Navbar clip
  const getAnchorPos = () => {
    if (typeof window === "undefined") return { ax: 800, ay: 62, rawAx: 800 };
    const clipEl = document.querySelector("[data-lanyard-anchor]") || document.querySelector("[data-navbar]");
    const isMobileScreen = window.innerWidth < 768;
    let rawAx = isMobileScreen ? window.innerWidth * 0.88 : window.innerWidth * 0.78;
    let ay = 62;
    if (clipEl) {
      const rect = clipEl.getBoundingClientRect();
      rawAx = rect.left + rect.width / 2;
      if (isMobileScreen) {
        rawAx = Math.max(rawAx, window.innerWidth * 0.72);
      }
      ay = rect.bottom - 4;
    }

    const currentSc = getScaleForWidth(window.innerWidth);
    const scaledW = CARD_W * currentSc;
    const margin = window.innerWidth < 640 ? 8 : 24;
    const minAx = margin + scaledW / 2;
    const maxAx = window.innerWidth - margin - scaledW / 2;
    const clampedAx = Math.max(minAx, Math.min(maxAx, rawAx));

    return { ax: clampedAx, ay, rawAx };
  };

  // High-performance physical drop & natural swing animation sequence
  const executeDropAnimation = useCallback((restX: number, restY: number, responsiveScale: number) => {
    const startY = getStartY(window.innerWidth, window.innerHeight);

    // Phase 1: Hidden above the navbar — fully out of view, tilted & offset.
    // The card hangs from the string by its top-center attachment point.
    cardX.set(restX + 8);
    cardY.set(startY);
    dropRotateZ.set(-5);
    dropRotateX.set(-14);
    dropRotateY.set(8);
    dropScaleY.set(responsiveScale);
    dropScaleX.set(responsiveScale);
    strapTension.set(0);

    // Phase 2 + 3: Fast gravity fall, then rope-tension recoil & settle.
    // Easing is cubic-bezier (accelerating), never linear — it reads as weight.
    framerAnimate(cardY, [startY, restY + 18, restY + 5, restY], {
      duration: 1.05,
      ease: [
        [0.55, 0, 1, 0.45], // accelerating fall (gravity)
        [0.2, 0.8, 0.3, 1], // rope tension recoil back up
        [0.45, 0, 0.55, 1], // gentle final settle
      ],
      times: [0, 0.55, 0.82, 1],
    });

    // Natural decreasing swing from the TOP-CENTER attachment point.
    // A damped spring from -5deg naturally produces: -5 -> +4 -> -3 -> +2 -> -1 -> ~0
    // with progressively longer, softer oscillation (momentum + damping).
    framerAnimate(dropRotateZ, 0, {
      type: "spring",
      stiffness: 55,
      damping: 2.2,
      mass: 1,
      from: -5,
    });

    // Coupled horizontal momentum sway — subtle, feels like the string allows drift
    framerAnimate(cardX, [restX + 8, restX - 6, restX + 4, restX - 2, restX], {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      times: [0, 0.3, 0.5, 0.72, 1],
    });

    // 3D pitch stabilization (impact nose-down, then settle flat)
    framerAnimate(dropRotateX, [-14, 18, -8, 3, 0], {
      duration: 1.5,
      ease: "easeOut",
      times: [0, 0.28, 0.55, 0.8, 1],
    });

    // Strap tension pulse & subtle landing glint as the string goes taut
    framerAnimate(strapTension, [0, 1, 0.2, 0], { duration: 0.6, ease: "easeOut" });
    setLandingGlow(true);
    setTimeout(() => setLandingGlow(false), 600);
  }, [cardX, cardY, dropRotateZ, dropRotateX, dropRotateY, dropScaleX, dropScaleY, strapTension]);

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

    const responsiveScale = getScaleForWidth(window.innerWidth);
    const prefersReducedMotion =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (!hasDropped.current) {
      // Place the card high above the navbar, fully out of view, tilted & offset
      cardX.set(restX + 8);
      cardY.set(getStartY(window.innerWidth, window.innerHeight));
      dropRotateZ.set(-5);
      dropRotateX.set(-14);
      dropRotateY.set(8);
      dropScaleX.set(responsiveScale);
      dropScaleY.set(responsiveScale);
      settleOpacity.set(1);
    }

    if (prefersReducedMotion) {
      // Reduced-motion users skip the physical drop/swing: show the card in its
      // final position with a simple fade-in instead.
      hasDropped.current = true;
      cardX.set(restX);
      cardY.set(restY);
      dropRotateZ.set(0);
      dropRotateX.set(0);
      dropRotateY.set(0);
      strapTension.set(0);
      settleOpacity.set(0);
      framerAnimate(settleOpacity, 1, { duration: 0.6, ease: "easeOut" });
    }

    const isFastIntro = typeof window !== "undefined" && sessionStorage.getItem("skipIntroNext") === "true";

    // Trigger the drop only AFTER the loading/landing page has finished so the
    // card is not falling behind the intro screen. The event fires as the intro
    // starts its exit fade; the short delay lets the screen clear before the
    // card drops through the navbar. A fallback timer guarantees it always runs.
    let dropTimer: ReturnType<typeof setTimeout> | null = null;
    let introCompleteHandler: (() => void) | null = null;

    if (!prefersReducedMotion) {
      const triggerDrop = () => {
        if (hasDropped.current) return;
        hasDropped.current = true;
        const { x: rx, y: ry } = restPosRef.current;
        executeDropAnimation(rx, ry, responsiveScale);
      };

      if (isFastIntro) {
        // Intro is skipped entirely — drop quickly once the page is visible.
        dropTimer = setTimeout(triggerDrop, 100);
      } else {
        const landingReady = typeof window !== "undefined" && (window as any).__portfolioIntroComplete === true;
        if (landingReady) {
          dropTimer = setTimeout(triggerDrop, 250);
        } else {
          // Only start the card animation after the intro loader has fully exited.
          // The custom event is emitted by Intro after the loading screen disappears.
          introCompleteHandler = () => {
            if (hasDropped.current) return;
            if (dropTimer) clearTimeout(dropTimer);
            dropTimer = setTimeout(triggerDrop, 250);
          };
          window.addEventListener("intro-complete", introCompleteHandler);

          // Safety fallback for edge cases where the intro event isn't received.
          // This is intentionally long so the loader always has time to disappear.
          dropTimer = setTimeout(() => {
            if (!hasDropped.current) triggerDrop();
          }, 10000);
        }
      }
    }

    const recalcAndSnap = () => {
      const currentSc = getScaleForWidth(window.innerWidth);
      if (hasDropped.current && !isDragging.current) {
        dropScaleX.set(currentSc);
        dropScaleY.set(currentSc);
      }
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
      if (dropTimer) clearTimeout(dropTimer);
      if (introCompleteHandler) window.removeEventListener("intro-complete", introCompleteHandler);
      if (anchorRecalcTimeout) clearTimeout(anchorRecalcTimeout);
      navObserver?.disconnect();
      anchorObserver?.disconnect();
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll);
    };
  }, [cardX, cardY, dropScaleX, dropScaleY, dropRotateZ, dropRotateX, dropRotateY, strapTension, settleOpacity, executeDropAnimation]);

  // Frame-by-frame position tracking for Lanyard Strap
  useAnimationFrame((_, delta) => {
    if (scrollOpacity <= 0.01) return;

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
      // Keep the string hidden while the card is entirely above the viewport —
      // it would otherwise point up into the sky before the drop.
      const cardTopVisible = cy + CARD_H * currentScale >= -20;
      const entranceFactor = settleOpacity.get();
      strapRef.current.style.opacity = `${currentOpacity * entranceFactor}`;
      strapRef.current.style.visibility =
        currentOpacity <= 0.01 || !cardTopVisible || entranceFactor <= 0.01 ? "hidden" : "visible";

      const tensionVal = strapTension.get();
      if (tensionVal > 0.01) {
        strapRef.current.style.boxShadow = `0 0 ${16 * tensionVal}px rgba(255, 255, 255, ${0.5 * tensionVal})`;
      } else {
        strapRef.current.style.boxShadow = "none";
      }
    }

    const currentX = cardX.get();
    const vel = (currentX - prevCardX.current) / Math.max(delta, 1);
    angularVelocity.current = angularVelocity.current * 0.88 + vel * 0.12;
    prevCardX.current = currentX;

    const velocityTilt = angularVelocity.current * 0.6;
    const cinematicZ = dropRotateZ.get();
    // Only the taut string (card hanging below the anchor) pulls the card into
    // alignment; while the card is still falling above it the string is folded
    // and the card keeps its own swing momentum.
    const stringAlign = cy >= ay ? angleDeg * 0.15 : 0;
    rotateZ.set(isDragging.current ? angleDeg + velocityTilt * 1.4 : stringAlign + velocityTilt + cinematicZ);

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

  // Advanced Drag & Throw Release Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (scrollOpacity <= 0.01) return;
    isDragging.current = true;
    setIsDraggingState(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    dragOffsetRef.current = {
      x: e.clientX - cardX.get(),
      y: e.clientY - cardY.get(),
    };
    lastPointerPos.current = { x: e.clientX, y: e.clientY };
    lastPointerTime.current = performance.now();
    pointerVelocity.current = { x: 0, y: 0 };

    const currentSc = getScaleForWidth(window.innerWidth);
    framerAnimate(dropScaleX, 1.03 * currentSc, { duration: 0.15 });
    framerAnimate(dropScaleY, 1.03 * currentSc, { duration: 0.15 });

    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const now = performance.now();
    const dt = Math.max(1, now - lastPointerTime.current);
    const dx = e.clientX - lastPointerPos.current.x;
    const dy = e.clientY - lastPointerPos.current.y;
    pointerVelocity.current = {
      x: (dx / dt) * 1000,
      y: (dy / dt) * 1000,
    };
    lastPointerPos.current = { x: e.clientX, y: e.clientY };
    lastPointerTime.current = now;

    const nextX = e.clientX - dragOffsetRef.current.x;
    const nextY = e.clientY - dragOffsetRef.current.y;
    cardX.set(nextX);
    cardY.set(nextY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setIsDraggingState(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    const currentSc = getScaleForWidth(window.innerWidth);
    framerAnimate(dropScaleX, currentSc, { duration: 0.25 });
    framerAnimate(dropScaleY, currentSc, { duration: 0.25 });

    const distMoved = Math.hypot(e.clientX - dragStartPos.current.x, e.clientY - dragStartPos.current.y);
    if (distMoved < 6) {
      setIsFlipped((prev) => !prev);
      return;
    }

    const { x: restX, y: restY } = restPosRef.current;
    const { x: vx, y: vy } = pointerVelocity.current;

    // Realistic release momentum physics with spring inertia
    framerAnimate(cardX, restX, {
      type: "spring",
      stiffness: 160,
      damping: 15,
      mass: 1.0,
      velocity: vx,
    });

    framerAnimate(cardY, restY, {
      type: "spring",
      stiffness: 160,
      damping: 15,
      mass: 1.0,
      velocity: vy,
    });

    // 3D Pitch tilt response based on release velocity vector
    const pitchImpulse = Math.min(24, Math.max(-24, vy * 0.03));
    framerAnimate(dropRotateX, [pitchImpulse, -pitchImpulse * 0.4, 0], {
      duration: 0.75,
      ease: "easeOut",
    });

    if (e.clientY > restY) {
      framerAnimate(strapTension, [0, 0.6, 0], { duration: 0.5 });
    }
  };

  // Re-trigger drop animation when metal clip is clicked
  const handleClipClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const { x: restX, y: restY } = restPosRef.current;
    const responsiveScale = getScaleForWidth(window.innerWidth);
    executeDropAnimation(restX, restY, responsiveScale);
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
        className="fixed top-0 left-0 w-[16px] z-35 flex flex-col items-center overflow-hidden pointer-events-none shadow-xl transition-shadow duration-300"
        style={{
          background: "linear-gradient(90deg, #111 0%, #222 50%, #111 100%)",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
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
          scaleX: dropScaleX,
          scaleY: dropScaleY,
          opacity: settleOpacity,
          visibility: scrollOpacity <= 0.01 ? "hidden" : "visible",
          pointerEvents: scrollOpacity <= 0.01 ? "none" : "auto",
          position: "fixed",
          top: 0,
          left: 0,
          width: CARD_W,
          height: CARD_H,
          transformOrigin: "50% 0%",
          originX: 0.5,
          originY: 0,
          zIndex: 35,
          perspective: 1000,
        }}
        className="cursor-grab active:cursor-grabbing select-none touch-none"
      >
        {/* ═══ SLEEK METAL CLIP (WITH RE-DROP TRIGGER) ═══ */}
        <div
          onClick={handleClipClick}
          className="absolute -top-5 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center cursor-pointer group pointer-events-auto"
          title="Click metal clip to drop card again!"
        >
          <div className="w-4 h-5 rounded-t-full border border-white/40 bg-gradient-to-r from-gray-300 via-white to-gray-400 shadow-md flex items-center justify-center group-hover:border-emerald-400 group-hover:shadow-[0_0_10px_rgba(52,211,153,0.5)] transition-all">
            <div className="w-2 h-3 rounded-t-full bg-[#0c0d12]" />
          </div>
          <div className="w-7 h-2.5 rounded-sm bg-gradient-to-b from-gray-200 via-gray-400 to-gray-700 border border-white/30 -mt-1 shadow-lg group-hover:brightness-125 transition-all" />
        </div>

        {/* ═══ SLEEK & SIMPLE CARD BODY ═══ */}
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          style={{
            rotateX: combinedRotateX,
            rotateY: isFlipped ? 180 : combinedRotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative w-full h-full rounded-2xl bg-[#0c0d12] border border-white/12 shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden"
        >
          {/* Landing glow burst & dynamic glass sheen */}
          <AnimatePresence>
            {landingGlow && (
              <motion.div
                key="landing-glow"
                className="absolute inset-0 pointer-events-none z-30 rounded-2xl"
                initial={{ opacity: 0.95, scale: 0.96 }}
                animate={{ opacity: 0, scale: 1.04 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: "easeOut" }}
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 40%, transparent 70%)",
                  boxShadow:
                    "0 0 50px 15px rgba(255,255,255,0.18), inset 0 0 40px rgba(255,255,255,0.1)",
                }}
              />
            )}
          </AnimatePresence>

          {/* Gloss glare sheen */}
          <div
            ref={glareRef}
            className="absolute inset-0 pointer-events-none z-20 opacity-25 mix-blend-overlay transition-transform duration-75"
            style={{
              background:
                "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.85) 50%, transparent 70%)",
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
              <div className="w-8 h-2 rounded-full bg-[#050505] border border-white/15 mb-3" />
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-[9px] font-mono tracking-[0.25em] text-white/60 uppercase">
                  STAFF ID • KDIB-IT
                </span>
              </div>
            </div>

            {/* Clean Portrait Photo with Holographic Accent */}
            <div className="relative w-[135px] h-[135px] rounded-xl overflow-hidden border border-white/20 shadow-2xl my-auto group">
              <Image
                src="/coverface.JPG"
                alt={portfolioData.personal.name}
                fill
                className="object-cover pointer-events-none"
                draggable={false}
                priority
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/20 rounded-xl pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>

            {/* Typography */}
            <div className="text-center w-full space-y-1">
              <h2 className="text-lg font-heading font-bold text-white tracking-wide flex items-center justify-center gap-1.5">
                {portfolioData.personal.name}
                <Sparkles className="w-3 h-3 text-emerald-400 opacity-80" />
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
              <span className="text-[8px] font-mono text-white/40 tracking-widest">
                ID-8492-2026
              </span>
            </div>

            {/* Flip hint */}
            <div className="absolute bottom-1.5 right-2.5 opacity-40 hover:opacity-100 transition-opacity">
              <RefreshCw className="w-3 h-3 text-white" />
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
            <div className="absolute bottom-1.5 right-2.5 opacity-40 hover:opacity-100 transition-opacity">
              <RefreshCw className="w-3 h-3 text-white" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
