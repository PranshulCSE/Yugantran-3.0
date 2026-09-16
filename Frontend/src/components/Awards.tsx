import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Trophy, Bot, Shield, Code, Palette, Rocket, Star, Medal, Sparkles, Award } from "lucide-react";

const AWARDS = [
  {
    icon: Trophy,
    title: "Grand Champion",
    subtitle: "Tech Olympics Victor",
    desc: "Awarded to the ultimate multi-disciplinary team conquering all engineering challenges.",
    color: "#fbbf24",
    prize: "₹12,000 + Trophy",
  },
  {
    icon: Bot,
    title: "Best AI Solution",
    subtitle: "AI Warzone Track",
    desc: "Most innovative real-world generative AI application and prompt architecture.",
    color: "#00f2fe",
    prize: "₹8,000 + Trophy",
  },
  {
    icon: Shield,
    title: "Best Cyber Unit",
    subtitle: "Cyber Escape CTF",
    desc: "Top security team with flawless exploit breakdown and flag capture speed.",
    color: "#f43f5e",
    prize: "₹6,000 + Trophy",
  },
  {
    icon: Code,
    title: "Master Developer",
    subtitle: "Code Sprint & Git Wars",
    desc: "Exceptional algorithmic efficiency, pristine git workflow, and speed.",
    color: "#38bdf8",
    prize: "₹5,000 + Trophy",
  },
  {
    icon: Rocket,
    title: "Best Startup Pitch",
    subtitle: "Startup in 60 Arena",
    desc: "Most scalable, innovative, and market-ready tech business model.",
    color: "#a855f7",
    prize: "₹6,000 + Trophy",
  },
  {
    icon: Palette,
    title: "Best UI/UX & Design",
    subtitle: "Creative Tech Track",
    desc: "Most intuitive, aesthetically pleasing, and accessible product interface.",
    color: "#ec4899",
    prize: "Special Citation",
  },
  {
    icon: Star,
    title: "Best Hardware Hack",
    subtitle: "IoT & Autonomous Track",
    desc: "Fastest autonomous robotic rover build and smart sensor deployment.",
    color: "#2dd4bf",
    prize: "₹8,000 + Trophy",
  },
  {
    icon: Medal,
    title: "Rising Star Award",
    subtitle: "First-Year Prodigies",
    desc: "Recognizing outstanding technical promise among junior participants.",
    color: "#facc15",
    prize: "Citation + Rewards",
  },
];

export default function Awards() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="awards" ref={ref} className="relative py-28 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="section-tag mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>HONORS & RECOGNITION</span>
          </div>

          <h2 className="font-orbitron text-4xl sm:text-5xl font-black text-white mb-4">
            Bounties & <span className="gradient-text">Special Awards</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg font-body">
            Recognition that goes beyond trophies — celebrating engineering mastery, innovation, and perseverance.
          </p>
        </motion.div>

        {/* 8 Award Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {AWARDS.map((award, i) => (
            <motion.div
              key={award.title}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="glass glass-hover p-6 rounded-3xl text-center flex flex-col justify-between group border-cyan-500/20 hover:border-cyan-400/50"
            >
              <div>
                <div
                  className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{
                    background: `${award.color}15`,
                    border: `1px solid ${award.color}35`,
                    boxShadow: `0 0 25px ${award.color}20`,
                  }}
                >
                  <award.icon className="w-8 h-8" style={{ color: award.color }} />
                </div>

                <span
                  className="text-[10px] font-orbitron font-bold tracking-wider px-2.5 py-0.5 rounded-full border mb-2 inline-block"
                  style={{
                    color: award.color,
                    borderColor: `${award.color}35`,
                    background: `${award.color}10`,
                  }}
                >
                  {award.subtitle.toUpperCase()}
                </span>

                <h3 className="font-orbitron font-bold text-lg text-white mb-2 group-hover:text-cyan-300 transition-colors">
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
          ))}
        </div>

        {/* Grand Total Callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-14 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 px-8 py-5 rounded-3xl glass border-cyan-400/40 shadow-[0_0_40px_rgba(0,242,254,0.15)]">
            <Trophy className="w-7 h-7 text-amber-400" />
            <div className="text-left">
              <div className="font-orbitron font-black text-xl text-white">
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
