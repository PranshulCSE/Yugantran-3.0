import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Trophy, Bot, Shield, Code, Palette, Rocket, Star, Medal } from "lucide-react";

const AWARDS = [
  { icon: Trophy, title: "Best Overall", desc: "Tech Olympics Champion — YUGANTRAN TECH OLYMPION", color: "#ffd700" },
  { icon: Bot, title: "Best AI Solution", desc: "Most innovative AI application in AI Warzone", color: "#00ff41" },
  { icon: Shield, title: "Best Cybersecurity", desc: "Top team in Cyber Escape CTF challenge", color: "#ff4444" },
  { icon: Code, title: "Best Developer", desc: "Outstanding coding skills in Code Sprint or Git Wars", color: "#00ccff" },
  { icon: Palette, title: "Best UI/UX", desc: "Most exceptional user interface design", color: "#ff88ff" },
  { icon: Rocket, title: "Best Startup Idea", desc: "Most innovative and viable startup pitch", color: "#88ff00" },
  { icon: Star, title: "Best Innovation", desc: "Most creative tech solution across all events", color: "#ffaa00" },
  { icon: Medal, title: "Special Recognition", desc: "Outstanding contribution to the fest", color: "#00ffcc" },
];

export default function Awards() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="awards" ref={ref} className="relative py-24 overflow-visible">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <span className="section-tag">// RECOGNITION</span>
          <h2 className="font-orbitron text-4xl md:text-5xl mt-6 mb-4">
            Awards & <span className="gradient-text">Recognition</span>
          </h2>
          <p className="text-[rgba(176,255,176,0.5)] text-lg max-w-2xl mx-auto">
            Beyond trophies — recognizing innovation, skill and the spirit of technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {AWARDS.map((award, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass glass-hover p-6 rounded-xl text-center"
            >
              <div
                className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: `${award.color}15`, border: `1px solid ${award.color}30` }}
              >
                <award.icon className="w-7 h-7" style={{ color: award.color }} />
              </div>
              <h3 className="font-orbitron text-sm mb-2" style={{ color: award.color }}>{award.title}</h3>
              <p className="text-[rgba(176,255,176,0.5)] text-sm leading-relaxed">{award.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Prize note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-10 text-center"
        >
          <div className="inline-block glass px-8 py-4 rounded-full">
            <p className="font-mono-matrix text-[#00ff41] text-sm tracking-wider">
              🏆 TOTAL PRIZE POOL: <strong>₹73,000+</strong> &nbsp;+&nbsp; Certificates, Internship Opportunities & Sponsor Rewards
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
