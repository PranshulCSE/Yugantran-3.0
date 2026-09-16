import { motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useState, useRef } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Sparkles,
  Bot,
  Shield,
  Code2,
  Cpu,
  Rocket,
  ArrowRight,
  Zap,
  Terminal,
  Play,
} from "lucide-react";
import { publicApi } from "../lib/api";

const ORBITING_NODES = [
  { label: "AI & GenAI Warzone", icon: Bot, color: "#00f2fe", angle: 0, delay: 0 },
  { label: "Cyber Escape CTF", icon: Shield, color: "#f43f5e", angle: 60, delay: 0.2 },
  { label: "Code Sprint Arena", icon: Code2, color: "#38bdf8", angle: 120, delay: 0.4 },
  { label: "Autonomous Racing", icon: Cpu, color: "#2dd4bf", angle: 180, delay: 0.6 },
  { label: "Startup in 60", icon: Rocket, color: "#a855f7", angle: 240, delay: 0.8 },
  { label: "₹73,000+ Bounty", icon: Trophy, color: "#fbbf24", angle: 300, delay: 1.0 },
];

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [0, 1], [3, -3]);
  const rotateY = useTransform(mouseX, [0, 1], [-3, 3]);

  const [settings, setSettings] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  useEffect(() => {
    publicApi
      .getSettings()
      .then((r) => setSettings(r.data))
      .catch(() => {});
  }, []);

  // Real-time Countdown Timer
  useEffect(() => {
    const deadline = settings?.registrationDeadline
      ? new Date(settings.registrationDeadline)
      : new Date("2026-10-26T23:59:00+05:30");

    const tick = () => {
      const diff = deadline.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        isOver: false,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [settings]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el)
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      });
  };

  const prizePool = settings?.totalPrizePool || "₹73,000+";

  return (
    <section
      id="home"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center pt-28 pb-20 overflow-hidden"
    >
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Content & Typography */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 space-y-7"
          >
            {/* Floating Top Badges (Inspired by User's NextGen Hackathon Image) */}
            <div className="flex flex-wrap items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 font-orbitron text-xs font-bold shadow-[0_0_15px_rgba(0,242,254,0.3)] backdrop-blur-md"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>2 DAYS OF MADNESS</span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/60 border border-blue-400/40 text-blue-300 font-space text-xs font-semibold shadow-[0_0_15px_rgba(59,130,246,0.3)] backdrop-blur-md"
              >
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>OCTOBER 27–28, 2026</span>
              </motion.div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-700/60 text-slate-300 font-mono-matrix text-xs">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>GEETA UNIVERSITY, PANIPAT</span>
              </div>
            </div>

            {/* Massive Bold Headline */}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="font-space text-slate-400 uppercase tracking-[0.25em] text-sm font-semibold">
                  ANNUAL TECHNICAL FESTIVAL
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-cyan-500/40 to-transparent max-w-[120px]" />
              </div>

              <h1 className="font-orbitron font-black text-5xl sm:text-6xl md:text-7xl lg:text-[5.4rem] tracking-tight leading-[1.05]">
                <span className="block text-white">NextGen</span>
                <span className="block gradient-text text-glow-cyan">CYBER & AI</span>
                <span className="block text-slate-200">FESTIVAL</span>
              </h1>
            </div>

            {/* Subtitle & Tagline */}
            <p className="text-slate-300 text-lg md:text-xl font-body max-w-2xl leading-relaxed">
              Step into <span className="text-cyan-400 font-semibold">YUGANTRAN 3.0</span> — where
              cutting-edge Artificial Intelligence, Cybersecurity CTF battles, Autonomous Robotics,
              and High-Stakes Coding collide.
            </p>

            {/* High-Tech Countdown Timer Cards */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/25 backdrop-blur-xl shadow-2xl max-w-xl">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-orbitron font-semibold text-cyan-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  REGISTRATION COUNTDOWN
                </span>
                <span className="text-[11px] font-mono-matrix text-slate-400">
                  {timeLeft.isOver ? "REGISTRATION OVER" : "CLOSING SOON"}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2.5 sm:gap-3 text-center">
                {[
                  { label: "DAYS", val: timeLeft.days },
                  { label: "HOURS", val: timeLeft.hours },
                  { label: "MINUTES", val: timeLeft.minutes },
                  { label: "SECONDS", val: timeLeft.seconds },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/60 shadow-inner"
                  >
                    <div className="font-orbitron text-2xl sm:text-3xl font-black text-cyan-300">
                      {String(item.val).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] font-mono-matrix text-slate-400 tracking-wider mt-1">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollTo("#register")}
                className="btn-primary text-sm py-4 px-8"
              >
                <span>REGISTER NOW</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollTo("#events")}
                className="btn-outline text-sm py-4 px-8"
              >
                <span>EXPLORE 14+ EVENTS</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Right Column: NextGen Cyber HUD Portal & Orbiting Badges */}
          <motion.div
            style={{ rotateX, rotateY }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            {/* Cyber Portal Backdrop */}
            <div className="relative w-full max-w-[440px] aspect-square flex items-center justify-center">
              {/* Outer HUD Rings */}
              <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-spin-slow" />
              <div className="absolute inset-6 rounded-full border border-dashed border-blue-400/30 animate-orbit" />
              <div className="absolute inset-14 rounded-full border border-cyan-400/15" />

              {/* Central Glowing Cyber AI Card */}
              <div className="relative z-10 w-64 h-64 rounded-3xl bg-gradient-to-br from-cyan-950/70 via-slate-950/90 to-blue-950/80 border border-cyan-400/50 p-6 flex flex-col items-center justify-center text-center shadow-[0_0_60px_rgba(0,242,254,0.25)] backdrop-blur-2xl group hover:border-cyan-300 transition-all duration-300">
                <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(0,242,254,0.5)]">
                    <Bot className="w-10 h-10 text-slate-950" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
                </div>

                <div className="font-orbitron font-black text-xl text-white tracking-wider">
                  YUGANTRAN
                </div>
                <div className="text-xs font-orbitron font-bold text-cyan-400 tracking-[0.2em] mt-0.5">
                  EDITION 3.0
                </div>

                <div className="mt-3 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-[11px] font-mono-matrix text-cyan-300">
                  PRIZE POOL: {prizePool}
                </div>
              </div>

              {/* Orbiting Tech Badges (Matching User's Reference Image) */}
              {ORBITING_NODES.map((node, i) => {
                const radius = 175;
                const rad = (node.angle * Math.PI) / 180;
                const x = Math.cos(rad) * radius;
                const y = Math.sin(rad) * radius;

                return (
                  <motion.div
                    key={node.label}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + node.delay }}
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                    className="absolute z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-400/30 shadow-[0_0_20px_rgba(0,242,254,0.2)] backdrop-blur-md cursor-pointer hover:border-cyan-300 hover:scale-110 transition-all"
                  >
                    <node.icon className="w-3.5 h-3.5" style={{ color: node.color }} />
                    <span className="text-[11px] font-space font-semibold text-slate-200 whitespace-nowrap">
                      {node.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Bottom Key Metric Cards Strip */}
        {/* Bottom Key Metric Cards Strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-16 pt-10 border-t border-slate-800/80"
        >
          {[
            {
              label: "Grand Prize Pool",
              val: prizePool,
              sub: "Cash & Rewards",
              icon: Trophy,
              color: "#fbbf24",
            },
            {
              label: "High-Octane Events",
              val: "14+",
              sub: "AI, Cyber, Code & Gaming",
              icon: Zap,
              color: "#00f2fe",
            },
            {
              label: "Participants Expected",
              val: "500+",
              sub: "Colleges Across India",
              icon: Users,
              color: "#38bdf8",
            },
            {
              label: "Tech Domains",
              val: "8 Domains",
              sub: "Industry-Oriented Tracks",
              icon: Terminal,
              color: "#a855f7",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="glass p-5 rounded-2xl hover:border-cyan-500/40 transition-all duration-300 flex items-center gap-4"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}35` }}
              >
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <div>
                <div className="font-orbitron text-xl sm:text-2xl font-black text-white">
                  {stat.val}
                </div>
                <div className="text-xs font-space text-slate-400 mt-0.5">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Geeta University Logos (3 in Parallel) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-12 p-6 rounded-3xl glass border-cyan-500/20 text-center"
        >
          <div className="text-xs font-orbitron font-bold text-cyan-400 tracking-widest uppercase mb-4">
            ORGANIZED UNDER THE AEGIS OF GEETA UNIVERSITY, PANIPAT
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center justify-items-center max-w-4xl mx-auto">
            <div className="p-3 rounded-2xl bg-white/95 border border-cyan-500/30 shadow-[0_0_20px_rgba(0,242,254,0.15)] flex items-center justify-center w-full max-w-[260px] h-24 hover:scale-105 transition-transform duration-300">
              <img
                src="/images/Geeta/univ-1.jpg"
                alt="Geeta University Logo 1"
                className="max-h-16 w-auto object-contain"
              />
            </div>

            <div className="p-3 rounded-2xl bg-white/95 border border-cyan-500/30 shadow-[0_0_20px_rgba(0,242,254,0.15)] flex items-center justify-center w-full max-w-[260px] h-24 hover:scale-105 transition-transform duration-300">
              <img
                src="/images/Geeta/univ-2.jpg"
                alt="Geeta University Logo 2"
                className="max-h-16 w-auto object-contain"
              />
            </div>

            <div className="p-3 rounded-2xl bg-white/95 border border-cyan-500/30 shadow-[0_0_20px_rgba(0,242,254,0.15)] flex items-center justify-center w-full max-w-[260px] h-24 hover:scale-105 transition-transform duration-300">
              <img
                src="/images/Geeta/univ-3.jpg"
                alt="Geeta University Logo 3"
                className="max-h-16 w-auto object-contain"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}