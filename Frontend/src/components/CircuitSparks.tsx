import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function CircuitSparks() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Neon pulsing nodes positioned across the hero / background
  const nodes = [
    { x: "12%", y: "18%", color: "#00f2fe", delay: 0 },
    { x: "88%", y: "22%", color: "#00ff41", delay: 1.2 },
    { x: "50%", y: "8%", color: "#38bdf8", delay: 0.6 },
    { x: "20%", y: "75%", color: "#00ff41", delay: 1.8 },
    { x: "82%", y: "78%", color: "#00f2fe", delay: 2.4 },
    { x: "92%", y: "45%", color: "#a855f7", delay: 0.9 },
    { x: "8%", y: "48%", color: "#00f2fe", delay: 1.5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Ambient Neon Laser Beams & Pulsing Grid Paths */}
      <svg
        className="absolute inset-0 w-full h-full opacity-60"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="neon-cyan-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f2fe" stopOpacity="0" />
            <stop offset="50%" stopColor="#00f2fe" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#00ff41" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="neon-purple-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#00f2fe" stopOpacity="0" />
          </linearGradient>

          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Animated Neon Light Arc 1 */}
        <path
          d="M 50 120 Q 300 20, 600 150 T 1200 80"
          stroke="url(#neon-cyan-grad)"
          strokeWidth="2.5"
          fill="none"
          filter="url(#neon-glow)"
          strokeDasharray="180 600"
          className="animate-neon-laser"
          style={{ animationDuration: "7s" }}
        />

        {/* Animated Neon Light Arc 2 */}
        <path
          d="M 1200 500 Q 800 650, 400 480 T 50 620"
          stroke="url(#neon-purple-grad)"
          strokeWidth="2.5"
          fill="none"
          filter="url(#neon-glow)"
          strokeDasharray="220 700"
          className="animate-neon-laser"
          style={{ animationDuration: "9s", animationDelay: "2s" }}
        />

        {/* Horizontal Laser Line Across Hero */}
        <line
          x1="0"
          y1="35%"
          x2="100%"
          y2="35%"
          stroke="url(#neon-cyan-grad)"
          strokeWidth="1.5"
          strokeDasharray="150 800"
          filter="url(#neon-glow)"
          className="animate-neon-laser"
          style={{ animationDuration: "5s", animationDelay: "1s" }}
        />

        <line
          x1="100%"
          y1="68%"
          x2="0"
          y2="68%"
          stroke="url(#neon-cyan-grad)"
          strokeWidth="1.5"
          strokeDasharray="160 900"
          filter="url(#neon-glow)"
          className="animate-neon-laser"
          style={{ animationDuration: "6.5s", animationDelay: "3s" }}
        />
      </svg>

      {/* Pulsing Neon Circuit Nodes */}
      {nodes.map((node, i) => (
        <div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: node.x, top: node.y }}
        >
          <motion.div
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.3, 0.9, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              delay: node.delay,
              ease: "easeInOut",
            }}
            className="w-3.5 h-3.5 rounded-full"
            style={{
              background: node.color,
              boxShadow: `0 0 15px ${node.color}, 0 0 30px ${node.color}`,
            }}
          />
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-40"
            style={{ background: node.color }}
          />
        </div>
      ))}
    </div>
  );
}
