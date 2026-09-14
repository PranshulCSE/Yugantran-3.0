import { motion } from "motion/react";
import { useState, useRef } from "react";
import { Linkedin, Instagram, Mail } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HolographicTeamCardProps {
  name: string;
  role: string;
  image: string;
  linkedin: string;
  github: string;
  email: string;
  index: number;
}

export default function HolographicTeamCard({
  name,
  role,
  image,
  linkedin,
  github,
  email,
  index,
}: HolographicTeamCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showSocials, setShowSocials] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const socialClass = (color: "cyan" | "purple" | "pink") => {
    if (color === "cyan")
      return "bg-cyan-500/20 border-cyan-400/50 hover:bg-cyan-500 hover:border-cyan-400 text-white";
    if (color === "purple")
      return "bg-purple-500/20 border-purple-400/50 hover:bg-purple-500 hover:border-purple-400 text-white";
    return "bg-pink-500/20 border-pink-400/50 hover:bg-pink-500 hover:border-pink-400 text-white";
  };

  const onEnter = () => {
    setIsHovered(true);
    setShowSocials(true);
  };
  const onLeave = () => {
    setIsHovered(false);
    setShowSocials(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{
        opacity: 1,
        scale: isHovered ? 1.02 : 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
        delay: index * 0.06,
        ease: "easeOut",
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative group z-30"
    >
      <div className="relative rounded-xl overflow-hidden holographic-card shadow-[0_0_18px_rgba(0,255,255,0.12)]">
        <div className="absolute inset-0 rounded-xl neon-border-animated pointer-events-none opacity-80" />

        <motion.div
          className="relative bg-gray-900/80 rounded-xl overflow-hidden border border-cyan-400/20"
          animate={{
            boxShadow: isHovered
              ? "0 12px 30px rgba(6,182,212,0.12)"
              : "0 6px 18px rgba(6,182,212,0.06)",
            borderColor: isHovered ? "rgba(236,72,153,0.38)" : "rgba(6,182,212,0.2)",
          }}
          transition={{ duration: 0.28 }}
        >
          {/* Image Section */}
          <div className="relative h-80 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/12 via-purple-500/6 to-pink-500/12" />
            <ImageWithFallback
              src={image}
              alt={name}
              className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? "scale-105" : "scale-100"}`}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

            {["t-l", "t-r", "b-l", "b-r"].map((pos) => (
              <div
                key={pos}
                className={`absolute w-6 h-6 opacity-60 ${
                  pos === "t-l"
                    ? "top-3 left-3 border-l-2 border-t-2 border-cyan-400/40"
                    : pos === "t-r"
                    ? "top-3 right-3 border-r-2 border-t-2 border-cyan-400/40"
                    : pos === "b-l"
                    ? "bottom-3 left-3 border-l-2 border-b-2 border-cyan-400/40"
                    : "bottom-3 right-3 border-r-2 border-b-2 border-cyan-400/40"
                }`}
              />
            ))}
          </div>

          {/* Info Section: removed the decorative dot + gradient rule below name/role */}
          <div
            onClick={() => setShowSocials((s) => !s)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setShowSocials((s) => !s);
                e.preventDefault();
              }
            }}
            className="relative p-6 bg-black cursor-pointer rounded-b-xl"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <h3
                  className="text-xl font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-1"
                  style={{ WebkitFontSmoothing: "antialiased", filter: "none" }}
                >
                  {name}
                </h3>
                <p
                  className="text-cyan-300/80 text-xs tracking-widest uppercase mb-2"
                  style={{ filter: "none" }}
                >
                  {role}
                </p>
              </div>

              {/* Social Icons: shown on hover/click */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={showSocials ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                transition={{ duration: 0.18 }}
                className="flex items-center gap-3 ml-4"
                aria-hidden={!showSocials}
              >
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-lg border flex items-center justify-center ${socialClass("cyan")} shadow-sm transition-transform duration-150 hover:scale-105`}
                  aria-label={`${name} on LinkedIn`}
                >
                  <Linkedin className="w-5 h-5" />
                </a>

                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-lg border flex items-center justify-center ${socialClass("purple")} shadow-sm transition-transform duration-150 hover:scale-105`}
                  aria-label={`${name} on GitHub/Instagram`}
                >
                  <Instagram className="w-5 h-5" />
                </a>

                <a
                  href={`mailto:${email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-lg border flex items-center justify-center ${socialClass("pink")} shadow-sm transition-transform duration-150 hover:scale-105`}
                  aria-label={`Email ${name}`}
                >
                  <Mail className="w-5 h-5" />
                </a>
              </motion.div>
            </div>

            {/* (removed the small dot + horizontal gradient bar and the extra decorative data lines) */}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}