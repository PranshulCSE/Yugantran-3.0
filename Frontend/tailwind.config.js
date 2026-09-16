/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron:     ["Orbitron", "sans-serif"],
        "mono-matrix": ["Share Tech Mono", "monospace"],
        cyber:        ["Audiowide", "sans-serif"],
        body:         ["Inter", "sans-serif"],
      },
      colors: {
        matrix: {
          green:     "#00ff41",
          secondary: "#00cc33",
          dim:       "#00aa28",
          text:      "#b0ffb0",
        },
      },
      animation: {
        "gradient-shift": "gradient-shift 3.5s linear infinite",
        "pulse-green":    "pulse-green 2s ease-in-out infinite",
        float:            "float 6s ease-in-out infinite",
        "slow-pan":       "slow-pan 30s linear infinite",
      },
      keyframes: {
        "gradient-shift": {
          "0%":   { backgroundPosition: "0% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "pulse-green": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(0,255,65,0.35)" },
          "50%":      { boxShadow: "0 0 0 10px rgba(0,255,65,0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        "slow-pan": {
          "0%":   { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "80px 80px" },
        },
      },
    },
  },
  plugins: [],
};
