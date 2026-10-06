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
          <h1 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black mb-5">
            <span className="anim-silver-royal">Where Innovation Meets Extreme Competition</span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg font-body leading-relaxed">
            Hosted by the <strong className="text-slate-900 dark:text-white font-semibold">School of Computer Science & Engineering (SCSE)</strong> at Geeta University, YUGANTRAN 3.0 is the ultimate high-octane proving ground where developers, cyber warriors, and innovators collide for absolute technical supremacy.
          </p>

          {/* Official Rule Book & Brochure Downloads */}
          <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
            <a
              href="/docs/ruleBook.pdf"
              download
              className="anim-silver-bg px-6 py-3 rounded-full font-orbitron text-xs sm:text-sm font-bold tracking-widest text-slate-900 shadow-[0_0_15px_rgba(209,213,219,0.5)] flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>OFFICIAL RULE BOOK</span>
              <Download className="w-3.5 h-3.5 opacity-80" />
            </a>

            <a
              href="/docs/eventBrochure.pdf"
              download
              className="glass glass-hover px-6 py-3 rounded-full font-orbitron text-xs sm:text-sm font-bold tracking-widest text-slate-800 dark:text-slate-200 flex items-center gap-2 border-slate-200/50 dark:border-white/10"
            >
              <Zap className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>EVENT BROCHURE</span>
              <Download className="w-3.5 h-3.5 opacity-60" />
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
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              className="glass p-7 rounded-3xl border-cyan-500/20 flex flex-col justify-between shadow-lg transition-transform duration-200 ease-out-custom [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1"
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
                <h3 className="font-orbitron font-bold text-lg text-slate-900 dark:text-white mb-2">{card.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm font-body leading-relaxed">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
