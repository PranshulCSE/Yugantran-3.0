import { useEffect, useState } from "react";

// Pure CSS animations — no JS thread cost, GPU composited via opacity/transform
const nodes = [
  { x: "12%", y: "18%", color: "#00f2fe", delay: "0s" },
  { x: "88%", y: "22%", color: "#00ff41", delay: "1.2s" },
  { x: "50%", y: "8%",  color: "#38bdf8", delay: "0.6s" },
  { x: "20%", y: "75%", color: "#00ff41", delay: "1.8s" },
  { x: "82%", y: "78%", color: "#00f2fe", delay: "2.4s" },
  { x: "92%", y: "45%", color: "#a855f7", delay: "0.9s" },
  { x: "8%",  y: "48%", color: "#00f2fe", delay: "1.5s" },
];

export default function CircuitSparks() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* SVG laser arcs — filter only on SVG element, not individual paths */}
      <svg
        className="absolute inset-0 w-full h-full opacity-35 dark:opacity-55"
        xmlns="http://www.w3.org/2000/svg"
        style={{ willChange: "transform" }}
      >
        <defs>
          <linearGradient id="neon-cyan-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#00f2fe" stopOpacity="0" />
            <stop offset="50%"  stopColor="#00f2fe" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00ff41" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="neon-purple-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="50%"  stopColor="#a855f7" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#00f2fe" stopOpacity="0" />
          </linearGradient>
          {/* Shared glow filter — applied once at SVG level via feComposite */}
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g filter="url(#neon-glow)">
          <path
            d="M 50 120 Q 300 20, 600 150 T 1200 80"
            stroke="url(#neon-cyan-grad)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="180 600"
            className="animate-neon-laser"
            style={{ animationDuration: "7s" }}
          />
          <path
            d="M 1200 500 Q 800 650, 400 480 T 50 620"
            stroke="url(#neon-purple-grad)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="220 700"
            className="animate-neon-laser"
            style={{ animationDuration: "9s", animationDelay: "2s" }}
          />
          <line
            x1="0" y1="35%" x2="100%" y2="35%"
            stroke="url(#neon-cyan-grad)"
            strokeWidth="1.5"
            strokeDasharray="150 800"
            className="animate-neon-laser"
            style={{ animationDuration: "5s", animationDelay: "1s" }}
          />
          <line
            x1="100%" y1="68%" x2="0" y2="68%"
            stroke="url(#neon-cyan-grad)"
            strokeWidth="1.5"
            strokeDasharray="160 900"
            className="animate-neon-laser"
            style={{ animationDuration: "6.5s", animationDelay: "3s" }}
          />
        </g>
      </svg>

      {/* Pulsing nodes — pure CSS keyframes, GPU composited (opacity + transform only) */}
      {nodes.map((node, i) => (
        <div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2 circuit-node-pulse"
          style={{
            left: node.x,
            top: node.y,
            animationDelay: node.delay,
            background: node.color,
            boxShadow: `0 0 8px ${node.color}`,
          }}
        />
      ))}
    </div>
  );
}
