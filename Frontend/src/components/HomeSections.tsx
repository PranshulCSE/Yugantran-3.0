import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bot, Shield, Terminal, Bug, GitBranch, Search, Rocket, Cpu, Zap,
  Car, Trophy, Gamepad2, Swords, Code, ArrowRight, Sparkles, IndianRupee,
  ShieldCheck, Users, Award,
} from "lucide-react";
import { publicApi } from "../lib/api";

const ICON_MAP: Record<string, any> = {
  Bot, Shield, Terminal, Bug, GitBranch, Search,
  Rocket, Cpu, Zap, Car, Trophy, Gamepad2, Swords, Code,
};

const CATEGORY_COLOR: Record<string, string> = {
  ai: "#00ff41",
  cybersecurity: "#ff4444",
  coding: "#00ccff",
  swe: "#ff8800",
  iot: "#00ffcc",
  innovation: "#88ff00",
  gaming: "#ff44cc",
  interactive: "#ffcc00",
  flagship: "#ffd700",
};

// ─── About Teaser ────────────────────────────────────────────────
export function AboutTeaser() {
  const navigate = useNavigate();
  const highlights = [
    { icon: Sparkles, label: "6 Domains", sub: "AI, Cyber, SWE, IoT & more" },
    { icon: Users, label: "500+ Hackers", sub: "National participation" },
    { icon: ShieldCheck, label: "Industry-Grade", sub: "Real-world challenges" },
  ];

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
          className="glass p-6 sm:p-10 md:p-12 rounded-3xl border-cyan-500/25 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7">
              <div className="section-tag mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ABOUT THE FEST</span>
              </div>
              <h2 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4">
                Where <span className="gradient-text">Innovation</span> Meets Extreme Competition
              </h2>
              <p className="text-slate-300 text-sm sm:text-base font-body leading-relaxed mb-6">
                Organized by the School of Computer Science & Engineering (SCSE) at Geeta University,
                Panipat — YUGANTRAN 3.0 pushes beyond conventional college tech fests into
                industry-grade battlegrounds across AI, Cybersecurity, Software Engineering, IoT,
                Startups and Gaming.
              </p>
              <button
                onClick={() => navigate("/about")}
                className="btn-outline text-xs py-3 px-6 inline-flex"
              >
                <span>READ FULL STORY</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="lg:col-span-5 grid grid-cols-3 lg:grid-cols-1 gap-3">
              {highlights.map((h, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col lg:flex-row items-center lg:items-center gap-2 lg:gap-4 text-center lg:text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center flex-shrink-0">
                    <h.icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="font-orbitron font-bold text-sm sm:text-base text-white">{h.label}</div>
                    <div className="text-[10px] sm:text-xs text-slate-400 font-space">{h.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Featured Events Preview ─────────────────────────────────────
export function FeaturedEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    publicApi.getEvents().then((r) => setEvents(r.data.slice(0, 4))).catch(() => {});
  }, []);

  if (!events.length) return null;

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10"
        >
          <div>
            <div className="section-tag mb-4">
              <Zap className="w-3.5 h-3.5" />
              <span>FEATURED BATTLES</span>
            </div>
            <h2 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-black text-white">
              A Glimpse of the <span className="gradient-text">Arena</span>
            </h2>
          </div>
          <button
            onClick={() => navigate("/events")}
            className="btn-outline text-xs py-3 px-6 self-start sm:self-auto whitespace-nowrap"
          >
            <span>VIEW ALL 14 EVENTS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {events.map((event, i) => {
            const Icon = ICON_MAP[event.icon] || Code;
            const color = CATEGORY_COLOR[event.category] || "#00f2fe";
            return (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: Math.min(i * 0.06, 0.24), duration: 0.3 }}
                onClick={() => navigate("/events")}
                className="glass glass-hover rounded-2xl p-5 cursor-pointer group"
                style={{ borderColor: `${color}20` }}
              >
                <div
                  className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                  style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                >
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <h3 className="font-orbitron font-bold text-sm sm:text-base text-white mb-1.5 group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {event.name}
                </h3>
                <p className="text-slate-400 text-xs font-body leading-relaxed line-clamp-2 mb-3">
                  {event.description}
                </p>
                <div className="text-xs font-orbitron font-bold" style={{ color }}>
                  {event.prize}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Prize Pool Banner ────────────────────────────────────────────
export function PrizePoolBanner() {
  const navigate = useNavigate();
  const [prizePool, setPrizePool] = useState("₹73,000+");

  useEffect(() => {
    publicApi.getSettings().then((r) => {
      if (r.data?.totalPrizePool) setPrizePool(r.data.totalPrizePool);
    }).catch(() => {});
  }, []);

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
          className="glass rounded-3xl border-amber-400/30 shadow-[0_0_50px_rgba(251,191,36,0.1)] p-6 sm:p-10 relative overflow-hidden"
        >
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-center md:text-left">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-400/15 border border-amber-400/40 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400" />
              </div>
              <div>
                <div className="font-orbitron font-black text-2xl sm:text-3xl text-white">
                  {prizePool} <span className="text-amber-400">CASH POOL</span>
                </div>
                <div className="text-xs sm:text-sm font-space text-slate-300 mt-1">
                  8 Special Award Categories + Certificates for every participant
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/awards")}
              className="btn-outline text-xs py-3 px-6 whitespace-nowrap flex-shrink-0"
            >
              <Award className="w-4 h-4" />
              <span>VIEW ALL AWARDS</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Final CTA ─────────────────────────────────────────────────────
export function FinalCTA() {
  const navigate = useNavigate();
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,65,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4">
            Ready to <span className="gradient-text">Transform</span> the Game?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-body mb-8">
            Seats are limited. Lock in your spot across 14 battles before registration closes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/register")}
              className="btn-primary px-8 py-4 text-sm"
            >
              REGISTER NOW
              <IndianRupee className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/events")}
              className="btn-outline px-8 py-4 text-sm"
            >
              EXPLORE EVENTS
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
