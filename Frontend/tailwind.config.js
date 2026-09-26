/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        "mono-matrix": ["Share Tech Mono", "monospace"],
        space: ["Space Grotesk", "sans-serif"],
        body: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      colors: {
        cyber: {
          bg: "#030712",
          dark: "#060d1f",
          card: "rgba(10, 24, 52, 0.65)",
          border: "rgba(56, 189, 248, 0.2)",
          cyan: "#00f2fe",
          sky: "#38bdf8",
          blue: "#2563eb",
          indigo: "#6366f1",
          purple: "#a855f7",
          neon: "#00f0ff",
          text: "#e2e8f0",
          muted: "#94a3b8",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "cyber-grid": "linear-gradient(to right, rgba(56, 189, 248, 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.07) 1px, transparent 1px)",
        "gradient-cyber": "linear-gradient(135deg, #00f2fe 0%, #4facfe 50%, #6366f1 100%)",
        "gradient-neon": "linear-gradient(90deg, #00f2fe, #38bdf8, #818cf8, #c084fc, #00f2fe)",
        "gradient-dark-glass": "linear-gradient(135deg, rgba(14, 30, 60, 0.7) 0%, rgba(6, 15, 34, 0.85) 100%)",
      },
      animation: {
        "gradient-shift": "gradient-shift 4s linear infinite",
        "pulse-cyan": "pulse-cyan 2.5s ease-in-out infinite",
        "float": "float 5s ease-in-out infinite",
        "float-delayed": "float 5s ease-in-out 2.5s infinite",
        "orbit": "orbit 20s linear infinite",
        "spin-slow": "spin 25s linear infinite",
        "radar-sweep": "radar-sweep 4s linear infinite",
        "scanline": "scanline 8s linear infinite",
      },
      keyframes: {
        "gradient-shift": {
          "0%": { backgroundPosition: "0% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "pulse-cyan": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(0, 242, 254, 0.45)" },
          "50%": { boxShadow: "0 0 0 15px rgba(0, 242, 254, 0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "radar-sweep": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
      },
    },
  },
  plugins: [],
};
