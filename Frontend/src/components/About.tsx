import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
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
} from "lucide-react";
import { publicApi } from "../lib/api";

const ICON_MAP: Record<string, any> = { Bot, Shield, Terminal, Cpu, Rocket, Gamepad2 };

// Fallback data — used only if the API is unreachable or the admin hasn't
// added any tracks yet, so the section never renders empty.
const FALLBACK_DOMAINS = [
  {
    icon: "Bot",
    title: "AI & Generative AI",
    desc: "Prompt engineering, LLM app building, AI warzones, and generative vision.",
    color: "#00f2fe",
    badge: "TRACK 01",
  },
  {
    icon: "Shield",
    title: "Cybersecurity & CTF",
    desc: "Capture the Flag, network security, ethical hacking, and vulnerability discovery.",
    color: "#f43f5e",
    badge: "TRACK 02",
  },
  {
    icon: "Terminal",
    title: "Software Engineering",
    desc: "Git wars, clean code architectures, sprint coding, and full-stack development.",
    color: "#38bdf8",
    badge: "TRACK 03",
  },
  {
    icon: "Cpu",
    title: "IoT & Hardware Hack",
    desc: "Microcontrollers, embedded sensors, autonomous bot racing, and smart devices.",
    color: "#2dd4bf",
    badge: "TRACK 04",
  },
  {
    icon: "Rocket",
    title: "Startup & Innovation",
    desc: "Pitching tech ideas in 60 seconds, business modeling, and venture validation.",
    color: "#a855f7",
    badge: "TRACK 05",
  },
  {
    icon: "Gamepad2",
    title: "Esports & Gaming Arena",
    desc: "High-intensity battles in BGMI, Free Fire, and Tekken 7 tournaments.",
    color: "#ec4899",
    badge: "TRACK 06",
  },
];

export default function About() {
  const ref = useRef(null);
  const [domains, setDomains] = useState<any[]>(FALLBACK_DOMAINS);

  useEffect(() => {
    let mounted = true;
    publicApi
      .getDomains()
      .then((r) => {
        if (mounted && Array.isArray(r.data) && r.data.length > 0) {
          setDomains(r.data);
        }
      })
      .catch(() => {
        // Keep fallback data on error.
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="about" ref={ref} className="relative pt-6 pb-20 md:pt-8 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-3xl mx-auto mb-10 md:mb-14"
        >
          <div className="section-tag mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>ABOUT YUGANTRAN 3.0</span>
          </div>

          <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-5 md:mb-6">
            Where <span className="gradient-text">Innovation</span> Meets Extreme Competition
          </h2>

          <p className="text-slate-300 text-base sm:text-lg font-body leading-relaxed">
            Organized by the <strong className="text-cyan-400 font-semibold">School of Computer Science & Engineering (SCSE)</strong> at{" "}
            <strong className="text-white font-semibold">Geeta University, Panipat</strong>, YUGANTRAN 3.0 is engineered to push beyond conventional college tech fests into industry-grade battlegrounds.
          </p>

          {/* Quick PDF Downloads */}
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 mt-8">
            <a
              href="/docs/ruleBook.pdf"
              download
              className="btn-primary text-xs py-3 px-5 sm:px-6 shadow-cyan-500/25"
            >
              <FileText className="w-4 h-4" />
              <span>OFFICIAL RULE BOOK</span>
              <Download className="w-3.5 h-3.5 opacity-80" />
            </a>

            <a
              href="/docs/eventBrochure.pdf"
              download
              className="btn-outline text-xs py-3 px-5 sm:px-6"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>EVENT BROCHURE</span>
              <Download className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </motion.div>

        {/* High-Impact Track Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 md:mb-16">
          {domains.map((domain, i) => {
            const Icon = ICON_MAP[domain.icon] || Bot;
            return (
              <motion.div
                key={domain._id || domain.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: Math.min(0.05 * i, 0.35), duration: 0.3 }}
                className="glass glass-hover p-5 sm:p-7 rounded-2xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <div
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{
                        background: `${domain.color}18`,
                        border: `1px solid ${domain.color}40`,
                        boxShadow: `0 0 20px ${domain.color}25`,
                      }}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: domain.color }} />
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

                <div className="pt-5 mt-5 sm:pt-6 sm:mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-space font-medium text-slate-400 group-hover:text-cyan-400 transition-colors">
                  <span>Explore Events in Track</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Comparison Feature Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
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
                  <span>Participate ➔ Traditional Quizzes ➔ Win</span>
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 text-xs sm:text-sm font-space font-medium flex flex-wrap items-center gap-2 sm:gap-3 shadow-[0_0_20px_rgba(0,242,254,0.1)]">
                  <span className="px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-bold text-xs">
                    3.0 MODEL
                  </span>
                  <span>AI Prompt Wars ➔ Real-time CTF ➔ Autonomous Hardware ➔ Industry Pitch</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              {[
                { title: "500+ Hackers", sub: "National Reach" },
                { title: "14 Battles", sub: "Diverse Tracks" },
                { title: "₹73,000+", sub: "Total Prize Pool" },
                { title: "Certificates", sub: "For All Participants" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 text-center"
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
