"use client";

import { useEffect, useState } from "react";

export default function MorphingBlobs() {
const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

useEffect(() => {
const handleMouseMove = (e: MouseEvent) => {
setMousePos({ x: e.clientX, y: e.clientY });
};

window.addEventListener("pointermove", handleMouseMove, { passive: true });
return () => window.removeEventListener("pointermove", handleMouseMove);
}, []);

return (
<div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
{/* Mouse Follow Spotlight Glow Orb */}
<div
className="absolute w-[650px] h-[650px] rounded-full transition-transform duration-300 ease-out opacity-30"
style={{
transform: `translate(${mousePos.x - 325}px, ${mousePos.y - 325}px)`,
background: "radial-gradient(circle, rgba(99, 102, 241, 0.28) 0%, rgba(168, 85, 247, 0.16) 45%, transparent 70%)",
filter: "blur(55px)",
mixBlendMode: "screen",
}}
/>

{/* Blob 1 - top left, violet/indigo aurora */}
<div
className="blob-1 absolute -top-40 -left-40 w-[650px] h-[650px] opacity-25"
style={{
background: "radial-gradient(circle, #8b5cf6 0%, #6366f1 40%, transparent 75%)",
filter: "blur(75px)",
mixBlendMode: "screen",
}}
/>

{/* Blob 2 - top right, neon cyan/sky glow */}
<div
className="blob-2 absolute -top-32 -right-32 w-[600px] h-[600px] opacity-20"
style={{
background: "radial-gradient(circle, #06b6d4 0%, #3b82f6 50%, transparent 75%)",
filter: "blur(85px)",
mixBlendMode: "screen",
}}
/>

{/* Blob 3 - center/bottom, magenta & hyper violet */}
<div
className="blob-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] opacity-18"
style={{
background: "radial-gradient(ellipse, #ec4899 0%, #a855f7 40%, transparent 75%)",
filter: "blur(95px)",
animationDelay: "2s",
mixBlendMode: "screen",
}}
/>

{/* Blob 4 - mid right, emerald accent */}
<div
className="blob-2 absolute top-1/3 -right-40 w-[550px] h-[550px] opacity-18"
style={{
background: "radial-gradient(circle, #10b981 0%, #06b6d4 45%, transparent 75%)",
filter: "blur(80px)",
animationDelay: "4s",
mixBlendMode: "screen",
}}
/>

{/* Blob 5 - bottom left, cosmic purple */}
<div
className="blob-1 absolute -bottom-32 -left-20 w-[650px] h-[650px] opacity-22"
style={{
background: "radial-gradient(circle, #6366f1 0%, #ec4899 50%, transparent 75%)",
filter: "blur(90px)",
animationDelay: "6s",
mixBlendMode: "screen",
}}
/>

{/* Cosmic Shooting Star Light Streaks */}
<div className="absolute top-12 right-1/4 w-40 h-[2px] shooting-star" style={{ animationDelay: "0s" }} />
<div className="absolute top-1/3 right-10 w-48 h-[2px] shooting-star" style={{ animationDelay: "3.5s" }} />
<div className="absolute top-2/3 left-1/3 w-36 h-[2px] shooting-star" style={{ animationDelay: "7s" }} />
</div>
);
}
