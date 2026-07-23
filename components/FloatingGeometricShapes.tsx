"use client";

export default function FloatingGeometricShapes() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Triangle - top left */}
      <div
        className="geo-shape-1 absolute top-32 left-16 opacity-[0.06]"
        style={{ animationDelay: "0s" }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <polygon
            points="30,4 56,52 4,52"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>

      {/* Square rotated - top right */}
      <div
        className="geo-shape-3 absolute top-48 right-24 opacity-[0.05]"
        style={{ animationDelay: "1s" }}
      >
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
          <rect
            x="5"
            y="5"
            width="40"
            height="40"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.5"
            fill="none"
            transform="rotate(15 25 25)"
          />
        </svg>
      </div>

      {/* Hexagon - mid left */}
      <div
        className="geo-shape-2 absolute top-1/2 left-8 opacity-[0.05]"
        style={{ animationDelay: "2s" }}
      >
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
          <polygon
            points="35,5 62,20 62,50 35,65 8,50 8,20"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>

      {/* Circle - bottom right */}
      <div
        className="geo-shape-1 absolute bottom-48 right-16 opacity-[0.04]"
        style={{ animationDelay: "3s" }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="8 4"
          />
        </svg>
      </div>

      {/* Small diamond - bottom left */}
      <div
        className="geo-shape-3 absolute bottom-32 left-32 opacity-[0.06]"
        style={{ animationDelay: "1.5s" }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <polygon
            points="20,2 38,20 20,38 2,20"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>

      {/* Pentagon - mid right */}
      <div
        className="geo-shape-2 absolute top-3/4 right-12 opacity-[0.04]"
        style={{ animationDelay: "4s" }}
      >
        <svg width="55" height="55" viewBox="0 0 55 55" fill="none">
          <polygon
            points="27.5,3 52,19 43,47 12,47 3,19"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}
