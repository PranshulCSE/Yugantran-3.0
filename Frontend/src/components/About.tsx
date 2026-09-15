import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Bot, Shield, Terminal, Cpu, Rocket, Trophy, Lightbulb, Users } from "lucide-react";

const DOMAINS = [
  { icon: Bot, label: "AI & Generative AI", color: "#00ff41" },
  { icon: Shield, label: "Cybersecurity", color: "#ff4444" },
  { icon: Terminal, label: "Software Dev", color: "#00ccff" },
  { icon: Cpu, label: "IoT & Hardware", color: "#00ffcc" },
  { icon: Rocket, label: "Innovation", color: "#88ff00" },
  { icon: Trophy, label: "Competitive Tech", color: "#ffd700" },
  { icon: Lightbulb, label: "Creative Tech", color: "#ff88ff" },
  { icon: Users, label: "Teamwork", color: "#ffaa00" },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="about" ref={ref} className="relative py-24 overflow-visible">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[rgba(0,255,65,0.04)] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[rgba(0,255,65,0.03)] rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="section-tag">// ABOUT YUGANTRAN 3.0</span>
          <h2 className="font-orbitron text-4xl md:text-5xl lg:text-6xl mt-6 mb-6">
            Where <span className="gradient-text">Innovation</span> Meets Excellence
          </h2>
          <p className="text-[rgba(176,255,176,0.55)] text-lg max-w-3xl mx-auto leading-relaxed">
            YUGANTRAN 3.0 is the annual technical festival organized by the School of Computer Science & Engineering,
            Geeta University. Building on 2.0's success, this edition introduces real-world technology challenges
            across AI, Cybersecurity, Software Engineering, IoT and Innovation.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a href="/docs/ruleBook.pdf" download className="btn-primary text-sm py-3 px-8">RULE BOOK</a>
            <a href="/docs/eventBrochure.pdf" download className="btn-outline text-sm py-3 px-8">BROCHURE</a>
          </div>
        </motion.div>

        {/* Domain Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {DOMAINS.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.08 * i }}
              whileHover={{ y: -6, scale: 1.03 }}
              className="glass glass-hover p-5 rounded-xl text-center"
            >
              <d.icon className="w-10 h-10 mx-auto mb-3" style={{ color: d.color }} />
              <p className="font-mono-matrix text-xs tracking-wider" style={{ color: d.color }}>
                {d.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Philosophy + Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="font-mono-matrix text-[#00ff41] text-xs tracking-widest mb-4">// EVOLUTION</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="text-[rgba(176,255,176,0.3)] line-through font-mono-matrix text-sm">
                    2.0: Participate → Compete → Win
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#00ff41] mt-1.5 flex-shrink-0" />
                  <div className="text-[#b0ffb0] font-mono-matrix text-sm leading-relaxed">
                    3.0: Explore → Solve → Build → Innovate → Compete → Present
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Participants Expected", value: "500+" },
                { label: "Technical Events", value: "14+" },
                { label: "Prize Pool", value: "₹73K+" },
                { label: "Tech Domains", value: "8" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="text-center p-4 bg-[rgba(0,255,65,0.04)] rounded-lg border border-[rgba(0,255,65,0.1)]"
                >
                  <div className="font-orbitron text-2xl gradient-text font-bold">{s.value}</div>
                  <div className="font-mono-matrix text-xs text-[rgba(176,255,176,0.4)] mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
