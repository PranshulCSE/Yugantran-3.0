import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bot, Shield, Terminal, Bug, Search, Rocket, Cpu, Zap,
  Gamepad2, Swords, Code, ArrowRight, IndianRupee, Trophy,
  ShieldCheck, Users, Award, Calendar, Clock, Lightbulb, Compass,
  ChevronRight, CheckCircle2,
} from "lucide-react";
import { publicApi } from "../lib/api";

const ICON_MAP: Record<string, any> = {
  Bot, Shield, Terminal, Bug, Search,
  Rocket, Cpu, Zap, Gamepad2, Swords, Code, Trophy,
};

const CATEGORY_COLOR: Record<string, string> = {
  ai: "#00f2fe",
  cybersecurity: "#f43f5e",
  coding: "#38bdf8",
  swe: "#fb923c",
  iot: "#2dd4bf",
  innovation: "#a855f7",
  gaming: "#ec4899",
  interactive: "#facc15",
  flagship: "#ffd700",
};

// ─── 1. WHY YUGANTRAN? ──────────────────────────────────────────
export function WhyYugantran() {
  const pillars = [
    {
      title: "INNOVATE",
      subtitle: "Next-Gen Tech",
      desc: "Harness Generative AI, LLMs, IoT microcontrollers, and modern full-stack frameworks to solve real-world problems.",
      icon: Lightbulb,
      color: "#00f2fe",
      badge: "01",
    },
    {
      title: "COMPETE",
      subtitle: "Industry Battlegrounds",
      desc: "Live Cybersecurity quizzes, rapid 2-hour code sprints, blindfolded pair programming, and esports arenas.",
      icon: Swords,
      color: "#f43f5e",
      badge: "02",
    },
    {
      title: "LEARN",
      subtitle: "Hands-on Mastery",
      desc: "Step outside traditional textbook theory into real-time repository debugging, prompt battlecraft, and IoT prototyping.",
      icon: Compass,
      color: "#38bdf8",
      badge: "03",
    },
    {
      title: "CONNECT",
      subtitle: "Ecosystem & Mentors",
      desc: "Network with over 500+ top student developers, industry mentors, tech founders, and faculty leaders.",
      icon: Users,
      color: "#00ff41",
      badge: "04",
    },
  ];

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="section-tag mb-4">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>THE EXPERIENCE</span>
          </div>

          <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            Why <span className="gradient-text">YUGANTRAN 3.0</span>?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base font-body">
            Not just another college festival — an engineered ecosystem built to test your logic,
            creativity, speed, and engineering stamina under competitive pressure.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: idx * 0.08, duration: 0.35 }}
              className="glass glass-hover p-6 rounded-3xl border-cyan-500/20 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      background: `${item.color}15`,
                      border: `1px solid ${item.color}35`,
                      boxShadow: `0 0 20px ${item.color}20`,
                    }}
                  >
                    <item.icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <span
                    className="font-orbitron text-xs font-black px-2.5 py-1 rounded-full border"
                    style={{
                      color: item.color,
                      borderColor: `${item.color}35`,
                      background: `${item.color}10`,
                    }}
                  >
                    {item.badge}
                  </span>
                </div>

                <h3 className="font-orbitron font-black text-xl text-white mb-1 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs font-space font-semibold mb-3" style={{ color: item.color }}>
                  {item.subtitle}
                </p>
                <p className="text-slate-300 text-xs sm:text-sm font-body leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] font-mono-matrix text-slate-400 group-hover:text-cyan-300 transition-colors">
                <span>CORE PILLAR</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 2. ABOUT TEASER ─────────────────────────────────────────────
export function AboutTeaser() {
  const navigate = useNavigate();
  const highlights = [
    { icon: Zap, label: "6 Tech Domains", sub: "AI, Cyber, SWE, IoT & more" },
    { icon: Users, label: "500+ Expected Hackers", sub: "National participation" },
    { icon: ShieldCheck, label: "10 Competitive Events", sub: "Real-world engineering challenges" },
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
            <div className="lg:col-span-7 space-y-4">
              <div className="section-tag">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>ABOUT THE FEST</span>
              </div>
              <h2 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-black text-white">
                Where <span className="gradient-text">Innovation</span> Meets Extreme Competition
              </h2>
              <p className="text-slate-300 text-sm sm:text-base font-body leading-relaxed">
                Organized by the <strong className="text-cyan-300 font-semibold">School of Computer Science & Engineering (SCSE)</strong> at{" "}
                <strong className="text-white font-semibold">Geeta University</strong>, Panipat — YUGANTRAN 3.0 pushes beyond conventional college tech fests into industry-grade battlegrounds across AI, Cybersecurity, Software Engineering, IoT, Startups and Gaming.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigate("/about")}
                  className="btn-outline text-xs py-3 px-6 inline-flex"
                >
                  <span>DISCOVER THE FULL STORY</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 gap-3.5">
              {highlights.map((h, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-4 text-left"
                >
                  <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center flex-shrink-0">
                    <h.icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="font-orbitron font-bold text-sm text-white">{h.label}</div>
                    <div className="text-xs text-slate-400 font-space mt-0.5">{h.sub}</div>
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

// ─── 3. FEATURED BATTLES ─────────────────────────────────────────
export function FeaturedEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    publicApi
      .getEvents()
      .then((r) => setEvents(r.data.slice(0, 4)))
      .catch(() => {});
  }, []);

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
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
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
            <span>VIEW ALL 10 EVENTS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {events.map((event, i) => {
            const Icon = ICON_MAP[event.icon] || Code;
            const color = CATEGORY_COLOR[event.category] || "#00f2fe";
            return (
              <motion.div
                key={event._id || event.slug || i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: Math.min(i * 0.06, 0.24), duration: 0.3 }}
                onClick={() => navigate(`/events/${event.slug || ""}`)}
                className="glass glass-hover rounded-3xl p-6 cursor-pointer group flex flex-col justify-between border-cyan-500/20"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ background: `${color}15`, border: `1px solid ${color}35` }}
                    >
                      <Icon className="w-6 h-6" style={{ color }} />
                    </div>

                    <span
                      className="text-[10px] font-orbitron font-bold px-2.5 py-0.5 rounded-full border"
                      style={{
                        color,
                        borderColor: `${color}35`,
                        background: `${color}10`,
                      }}
                    >
                      {event.category?.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="font-orbitron font-bold text-base sm:text-lg text-white mb-2 group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {event.name}
                  </h3>

                  <p className="text-slate-400 text-xs font-body leading-relaxed line-clamp-2 mb-4">
                    {event.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-orbitron font-bold text-amber-400">
                      {event.prize}
                    </div>
                    <div className="text-[11px] font-space text-slate-400">Entry: ₹{event.fee}</div>
                  </div>

                  <span className="text-xs font-space font-medium text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Details <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── 4. TIMELINE PREVIEW ─────────────────────────────────────────
export function TimelinePreview() {
  const navigate = useNavigate();

  const previewItems = [
    { day: "DAY 1", time: "10:00 AM", title: "Grand Inaugural & Keynote", track: "CEREMONY" },
    { day: "DAY 1", time: "11:00 AM", title: "AI Warzone & Cyber Escape Kickoff", track: "AI & CYBER" },
    { day: "DAY 2", time: "10:00 AM", title: "Code Sprint & Hardware Hack", track: "DEVELOPMENT" },
    { day: "DAY 2", time: "02:30 PM", title: "Blind Byte & Grand Valedictory", track: "FINALS" },
  ];

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
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>OCTOBER 27–28, 2026</span>
            </div>
            <h2 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-black text-white">
              Schedule <span className="gradient-text">Snapshot</span>
            </h2>
          </div>
          <button
            onClick={() => navigate("/timeline")}
            className="btn-outline text-xs py-3 px-6 self-start sm:self-auto whitespace-nowrap"
          >
            <span>FULL 2-DAY TIMELINE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {previewItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: idx * 0.06, duration: 0.3 }}
              className="glass p-5 rounded-2xl border-cyan-500/20 relative"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/30 text-[10px] font-orbitron font-bold text-cyan-300">
                  {item.day}
                </span>
                <span className="text-xs font-mono-matrix text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  {item.time}
                </span>
              </div>
              <h4 className="font-orbitron font-bold text-sm text-white mb-2">{item.title}</h4>
              <span className="text-[10px] font-space text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                {item.track}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 5. PRIZE POOL BANNER ─────────────────────────────────────────
export function PrizePoolBanner() {
  const navigate = useNavigate();
  const [prizePool, setPrizePool] = useState("₹54,000+");

  useEffect(() => {
    publicApi
      .getSettings()
      .then((r) => {
        if (r.data?.totalPrizePool) setPrizePool(r.data.totalPrizePool);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
          className="glass rounded-3xl border-amber-400/30 shadow-[0_0_50px_rgba(251,191,36,0.12)] p-6 sm:p-10 relative overflow-hidden"
        >
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-400/15 border border-amber-400/40 flex items-center justify-center flex-shrink-0 shadow-[0_0_25px_rgba(251,191,36,0.3)]">
                <Trophy className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <div className="font-orbitron font-black text-2xl sm:text-3xl text-white">
                  {prizePool} <span className="text-amber-400">CASH BOUNTIES</span>
                </div>
                <div className="text-xs sm:text-sm font-space text-slate-300 mt-1">
                  Official Winner Trophies + Merit & Participation Certificates for all registered students
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/awards")}
              className="btn-outline text-xs py-3 px-6 whitespace-nowrap flex-shrink-0"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>REWARDS & RECOGNITION</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── 6. FINAL CTA ─────────────────────────────────────────────────
export function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,242,254,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
          className="glass p-8 sm:p-12 rounded-3xl border-cyan-400/30 shadow-[0_0_50px_rgba(0,242,254,0.15)]"
        >
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center mx-auto mb-6 text-cyan-300">
            <Bot className="w-7 h-7" />
          </div>

          <h2 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4">
            Ready to <span className="gradient-text">Transform</span> the Game?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base font-body mb-8 max-w-xl mx-auto">
            Limited slots per battle. Assemble your squad, sharpen your tools, and register before spots run out.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/register")}
              className="btn-primary w-full sm:w-auto px-8 py-3.5 text-xs sm:text-sm shadow-cyan-500/30 flex items-center justify-center gap-2"
            >
              <span>REGISTER FOR YUGANTRAN 3.0</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/events")}
              className="btn-outline w-full sm:w-auto px-8 py-3.5 text-xs sm:text-sm"
            >
              BROWSE 10 EVENTS
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
