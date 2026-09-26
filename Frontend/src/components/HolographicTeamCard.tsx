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
      <div className="relative rounded-2xl overflow-hidden holographic-card shadow-lg p-3.5 bg-slate-900/80 border border-cyan-400/20">
        <div className="absolute inset-0 rounded-2xl neon-border-animated pointer-events-none opacity-60" />

        <motion.div
          className="relative rounded-xl overflow-hidden"
          animate={{
            boxShadow: isHovered
              ? "0 12px 30px rgba(6,182,212,0.15)"
              : "0 4px 14px rgba(6,182,212,0.06)",
          }}
          transition={{ duration: 0.28 }}
        >
          {/* Image Section with Padding & Clean Framing */}
          <div className="relative h-72 overflow-hidden rounded-xl bg-slate-950 border border-cyan-400/20">
            <ImageWithFallback
              src={image}
              alt={name}
              className={`w-full h-full object-cover object-top transition-transform duration-300 ${isHovered ? "scale-105" : "scale-100"}`}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

            {/* Corner Cyber Accents */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400/50" />
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-400/50" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-400/50" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400/50" />
          </div>

          {/* Info Section */}
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
            className="relative p-4 pt-3 bg-black/90 cursor-pointer rounded-b-xl"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <h3
                  className="text-lg font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-1"
                  style={{ WebkitFontSmoothing: "antialiased" }}
                >
                  {name}
                </h3>
                <p className="text-cyan-300/80 text-xs tracking-widest uppercase">
                  {role}
                </p>
              </div>

              {/* Social Icons (LinkedIn + Mail + Socials) */}
              <div className="flex items-center gap-2 ml-3">
                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center ${socialClass("cyan")} shadow-sm transition-transform duration-150 hover:scale-105`}
                    aria-label={`${name} on LinkedIn`}
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}

                {email && (
                  <a
                    href={`mailto:${email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center ${socialClass("pink")} shadow-sm transition-transform duration-150 hover:scale-105`}
                    aria-label={`Email ${name}`}
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}