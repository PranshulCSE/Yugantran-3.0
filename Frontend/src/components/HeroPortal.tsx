"use client";
import { motion } from "framer-motion";

export default function HeroPortal() {
  return (
    <div className="absolute inset-0 flex items-center justify-center -z-[1] pointer-events-none">
      {/* Outer Rotating Ring */}
      <motion.div
        className="relative w-[400px] h-[400px] md:w-[550px] md:h-[550px] rounded-full border border-cyan-400/30 shadow-[0_0_80px_rgba(0,255,255,0.3)]"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {/* Inner Energy Glow */}
        <motion.div
          className="absolute inset-0 rounded-full blur-[80px] bg-cyan-500/20"
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Pulsing Rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-cyan-400/20"
            style={{ transform: `scale(${1 + i * 0.15})` }}
            animate={{ opacity: [0.3, 0.7, 0.3], scale: [1 + i * 0.15, 1.1 + i * 0.15, 1 + i * 0.15] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </motion.div>
    </div>
  );
}
