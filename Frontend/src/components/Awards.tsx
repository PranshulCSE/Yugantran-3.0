import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Trophy, Bot, Shield, Code, Palette, Rocket, Star, Medal, Award } from "lucide-react";
import { publicApi } from "../lib/api";

const ICON_MAP: Record<string, any> = {
  Trophy, Bot, Shield, Code, Palette, Rocket, Star, Medal, Award,
};

// Fallback data — used only if the API is unreachable or the admin hasn't
// added any awards yet, so the section never renders empty.
const FALLBACK_AWARDS = [
  {
    icon: "Trophy",
    title: "Grand Champion",
    subtitle: "Tech Olympics Victor",
    desc: "Awarded to the ultimate multi-disciplinary team conquering all engineering challenges.",
    color: "#fbbf24",
    prize: "₹12,000 + Trophy",
  },
  {
    icon: "Bot",
    title: "Best AI Solution",
    subtitle: "AI Warzone Track",
    desc: "Most innovative real-world generative AI application and prompt architecture.",
    color: "#00f2fe",
    prize: "₹8,000 + Trophy",
  },
  {
    icon: "Shield",
    title: "Best Cyber Unit",
    subtitle: "Cyber Escape CTF",
    desc: "Top security team with flawless exploit breakdown and flag capture speed.",
    color: "#f43f5e",
    prize: "₹6,000 + Trophy",
  },
  {
    icon: "Code",
    title: "Master Developer",
    subtitle: "Code Sprint & Git Wars",
    desc: "Exceptional algorithmic efficiency, pristine git workflow, and speed.",
    color: "#38bdf8",
    prize: "₹5,000 + Trophy",
  },
];

export default function Awards() {
  const ref = useRef(null);
  const [awards, setAwards] = useState<any[]>(FALLBACK_AWARDS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    publicApi
      .getAwards()
      .then((r) => {
        if (mounted && Array.isArray(r.data) && r.data.length > 0) {
          setAwards(r.data);
        }
      })
      .catch(() => {
        // Keep fallback data on error — section stays populated.
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="awards" ref={ref} className="relative pt-6 pb-20 md:pt-8 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-3xl mx-auto mb-10 md:mb-14"
        >
          <div className="section-tag mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>HONORS & RECOGNITION</span>
          </div>

          <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            Bounties & <span className="gradient-text">Special Awards</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg font-body px-2">
            Recognition that goes beyond trophies — celebrating engineering mastery, innovation, and perseverance.
          </p>
        </motion.div>

        {/* Award Cards Grid */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 transition-opacity duration-300 ${
            loading ? "opacity-70" : "opacity-100"
          }`}
        >
          {awards.map((award, i) => {
            const Icon = ICON_MAP[award.icon] || Trophy;
            return (
              <motion.div
                key={award._id || award.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: Math.min(i * 0.04, 0.32), duration: 0.3 }}
                className="glass glass-hover p-5 sm:p-6 rounded-3xl text-center flex flex-col justify-between group border-cyan-500/20 hover:border-cyan-400/50"
              >
                <div>
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl mx-auto mb-4 sm:mb-5 flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      background: `${award.color}15`,
                      border: `1px solid ${award.color}35`,
                      boxShadow: `0 0 25px ${award.color}20`,
                    }}
                  >
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: award.color }} />
                  </div>

                  <span
                    className="text-[10px] font-orbitron font-bold tracking-wider px-2.5 py-0.5 rounded-full border mb-2 inline-block"
                    style={{
                      color: award.color,
                      borderColor: `${award.color}35`,
                      background: `${award.color}10`,
                    }}
                  >
                    {award.subtitle?.toUpperCase()}
                  </span>

                  <h3 className="font-orbitron font-bold text-base sm:text-lg text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {award.title}
                  </h3>

                  <p className="text-slate-300 text-xs font-body leading-relaxed mb-4">
                    {award.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <span className="text-xs font-orbitron font-bold" style={{ color: award.color }}>
                    {award.prize}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Grand Total Callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.35 }}
          className="mt-10 md:mt-14 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 px-6 sm:px-8 py-4 sm:py-5 rounded-3xl glass border-cyan-400/40 shadow-[0_0_40px_rgba(0,242,254,0.15)] max-w-full">
            <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400 flex-shrink-0" />
            <div className="text-center sm:text-left">
              <div className="font-orbitron font-black text-base sm:text-xl text-white">
                TOTAL FESTIVAL POOL: <span className="text-amber-400">₹73,000+ CASH</span>
              </div>
              <div className="text-xs font-space text-slate-300">
                + Official Participation & Winner Certificates for all students + Mentor Networking
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
