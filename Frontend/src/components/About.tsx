import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  Shield,
  Terminal,
  Cpu,
  Rocket,
  Gamepad2,
  FileText,
  Download,
  Zap,
  ArrowRight,
  Flame,
  Building2,
  Award,
  Users,
  Target,
  CheckCircle2,
} from "lucide-react";
import { publicApi } from "../lib/api";

const ICON_MAP: Record<string, any> = { Bot, Shield, Terminal, Cpu, Rocket, Gamepad2 };

export default function About() {
  const ref = useRef(null);
  const navigate = useNavigate();
  const [domains, setDomains] = useState<any[]>([]);

  useEffect(() => {
    publicApi
      .getDomains()
      .then((r) => setDomains(r.data))
      .catch(() => {});
  }, []);

  return (
    <section id="about" ref={ref} className="relative py-0 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Header Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="section-tag mb-4">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>ABOUT YUGANTRAN 3.0</span>
          </div>

          <h1 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-5">
            Where <span className="gradient-text">Innovation</span> Meets Extreme Competition
          </h1>

          <p className="text-slate-300 text-base sm:text-lg font-body leading-relaxed">
            Organized by the{" "}
            <strong className="text-cyan-300 font-semibold">
              School of Computer Science & Engineering (SCSE)
            </strong>{" "}
            at <strong className="text-white font-semibold">Geeta University</strong>, Panipat —
            YUGANTRAN 3.0 is a premier national-scale technical confluence engineered to challenge,
            inspire, and elevate the next generation of engineers, cyber warriors, coders, and
            innovators.
          </p>

          {/* Official Rule Book & Brochure Downloads */}
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 mt-8">
            <a
              href="/docs/ruleBook.pdf"
              download
              className="btn-primary text-xs py-3 px-5 sm:px-6 shadow-cyan-500/25 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>OFFICIAL RULE BOOK</span>
              <Download className="w-3.5 h-3.5 opacity-80" />
            </a>

            <a
              href="/docs/eventBrochure.pdf"
              download
              className="btn-outline text-xs py-3 px-5 sm:px-6 flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>EVENT BROCHURE</span>
              <Download className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </motion.div>

        {/* Core Mission & Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "What is YUGANTRAN?",
              desc: "The flagship annual tech festival of Geeta University, designed to bridge academic knowledge with high-intensity practical engineering, problem-solving, and esports.",
              icon: Target,
              color: "#00f2fe",
            },
            {
              title: "Why Does it Exist?",
              desc: "To provide an open proving ground where students test real-world skillsets — prompt architecture, CTF defense, sprint development, and rapid product pitching under pressure.",
              icon: Flame,
              color: "#00ff41",
            },
            {
              title: "Who Organizes It?",
              desc: "Led by the School of Computer Science & Engineering (SCSE) in collaboration with Geeta Technical Hub (GTH), backed by dedicated faculty mentors and student architects.",
              icon: Building2,
              color: "#a855f7",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              className="glass p-7 rounded-3xl border-cyan-500/20 flex flex-col justify-between"
            >
              <div>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{
                    background: `${card.color}15`,
                    border: `1px solid ${card.color}35`,
                  }}
                >
                  <card.icon className="w-6 h-6" style={{ color: card.color }} />
                </div>
                <h3 className="font-orbitron font-bold text-lg text-white mb-2">{card.title}</h3>
                <p className="text-slate-300 text-sm font-body leading-relaxed">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 6 High-Impact Domain Tracks */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="section-tag mb-3">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>THE 6 DOMAINS</span>
            </div>
            <h2 className="font-orbitron text-3xl sm:text-4xl font-black text-white">
              Explore Our <span className="gradient-text">Core Arenas</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {domains.map((domain, i) => {
              const Icon = ICON_MAP[domain.icon] || Bot;
              return (
                <motion.div
                  key={domain._id || domain.title || i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: Math.min(0.05 * i, 0.35), duration: 0.3 }}
                  onClick={() => navigate("/events")}
                  className="glass glass-hover p-6 sm:p-7 rounded-3xl flex flex-col justify-between group cursor-pointer border-cyan-500/20"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{
                          background: `${domain.color}18`,
                          border: `1px solid ${domain.color}40`,
                          boxShadow: `0 0 20px ${domain.color}25`,
                        }}
                      >
                        <Icon className="w-6 h-6" style={{ color: domain.color }} />
                      </div>

                      <span
                        className="text-[10px] font-orbitron font-bold px-2.5 py-1 rounded-full border"
                        style={{
                          color: domain.color,
                          borderColor: `${domain.color}40`,
                          background: `${domain.color}10`,
                        }}
                      >
                        {domain.badge}
                      </span>
                    </div>

                    <h3 className="font-orbitron font-bold text-lg sm:text-xl text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {domain.title}
                    </h3>

                    <p className="text-slate-300 text-sm font-body leading-relaxed">
                      {domain.desc}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-800/80 flex items-center justify-between text-xs font-space font-medium text-slate-400 group-hover:text-cyan-400 transition-colors">
                    <span>Explore Track Battles</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Evolution Comparison: 2.0 vs 3.0 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="glass p-6 sm:p-8 md:p-10 rounded-3xl border-cyan-500/30 shadow-2xl relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-orbitron font-bold text-cyan-400 tracking-widest uppercase">
                THE NEXT EVOLUTION
              </span>

              <h3 className="font-orbitron font-black text-xl sm:text-2xl md:text-3xl text-white">
                How YUGANTRAN 3.0 Levelled Up
              </h3>

              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs sm:text-sm font-mono-matrix flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-bold text-xs line-through">
                    2.0 MODEL
                  </span>
                  <span>Basic Quizzes ➔ Simple Problem Statements ➔ Traditional Presentation</span>
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 text-xs sm:text-sm font-space font-medium flex flex-wrap items-center gap-2 sm:gap-3 shadow-[0_0_20px_rgba(0,242,254,0.1)]">
                  <span className="px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-bold text-xs">
                    3.0 MODEL
                  </span>
                  <span>
                    AI Prompt Wars ➔ Real-time CTF ➔ Autonomous Hardware ➔ Industry Pitch ➔ Tech Olympics
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              {[
                { title: "500+ Hackers", sub: "National Reach" },
                { title: "14 Battles", sub: "6 Tech Domains" },
                { title: "₹73,000+", sub: "Total Prize Pool" },
                { title: "Certificates", sub: "For All Participants" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center"
                >
                  <div className="font-orbitron font-black text-lg text-white">{item.title}</div>
                  <div className="text-xs font-space text-slate-400 mt-0.5">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
