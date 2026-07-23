"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Cursor() {
const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
const [isHovering, setIsHovering] = useState(false);
const [mounted, setMounted] = useState(false);

useEffect(() => {
setMounted(true);
const updateMousePosition = (e: MouseEvent) => {
setMousePosition({ x: e.clientX, y: e.clientY });
};

const handleMouseOver = (e: MouseEvent) => {
const target = e.target as HTMLElement;
if (
target.tagName.toLowerCase() === "button" ||
target.tagName.toLowerCase() === "a" ||
target.closest("button") ||
target.closest("a")
) {
setIsHovering(true);
} else {
setIsHovering(false);
}
};

window.addEventListener("mousemove", updateMousePosition);
window.addEventListener("mouseover", handleMouseOver);

return () => {
window.removeEventListener("mousemove", updateMousePosition);
window.removeEventListener("mouseover", handleMouseOver);
};
}, []);

if (!mounted) return null;

return (
<>
<motion.div
className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[100] mix-blend-difference"
animate={{
x: mousePosition.x - 6,
y: mousePosition.y - 6,
scale: isHovering ? 0 : 1,
}}
transition={{ type: "spring", stiffness: 1000, damping: 40, mass: 0.1 }}
/>
<motion.div
className="fixed top-0 left-0 w-10 h-10 border border-white/30 rounded-full pointer-events-none z-[99] mix-blend-difference flex items-center justify-center"
animate={{
x: mousePosition.x - 20,
y: mousePosition.y - 20,
scale: isHovering ? 1.5 : 1,
backgroundColor: isHovering ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)",
}}
transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
/>
</>
);
}
