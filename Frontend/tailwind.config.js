/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <-- required so Tailwind picks up classes
  ],
  theme: {
    extend: {
      fontFamily: {
        cyber: ["Audiowide", "sans-serif"],
        body: ["Rajdhani", "sans-serif"],
        orbitron: ["Orbitron", "sans-serif"],
      },
      animation: {
        "slow-pan": "slow-pan 30s linear infinite",
        "pulse-slow": "pulse-slow 6s ease-in-out infinite",
        "gradient-move": "gradient-move 15s ease infinite",
        "glow-text": "glow-text 4s ease-in-out infinite",
      },
      keyframes: {
        "slow-pan": {
          "0%": { backgroundPosition: "0 0, 0 0" },
          "100%": { backgroundPosition: "80px 80px, 80px 80px" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "0.8" },
          "50%": { opacity: "1" },
        },
        "gradient-move": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "glow-text": {
          "0%, 100%": { textShadow: "0 0 20px rgba(0,255,255,0.4)" },
          "50%": { textShadow: "0 0 40px rgba(0,255,255,0.8)" },
        },
      },
    },
  },
  plugins: [],
};
