import { motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  ChevronDown,
  Layers,
  Sparkles,
  ArrowRight,
  Flame,
} from "lucide-react";
import { publicApi } from "../lib/api";
import CircuitSparks from "./CircuitSparks";

export default function Hero() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
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

  // Countdown timer logic
  useEffect(() => {
    const deadline = settings?.registrationDeadline
      ? new Date(settings.registrationDeadline)
      : new Date("2026-10-25T23:59:00+05:30");

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

  const prizePool = settings?.totalPrizePool || "₹73,000+";
  const venue = settings?.venue || "Geeta University, Panipat-Delhi NCR, Haryana";

  return (
    <section
      id="home"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-24 pb-16"
      style={{ perspective: "1200px" }}
    >
      {/* Dynamic Circuit Sparks & Subtle Ambient Glow */}
      <CircuitSparks />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Content Layer */}
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="space-y-6 sm:space-y-7 max-w-4xl mx-auto">
          {/* YUGA-BOT Interactive Mascot with Cyber HUD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex justify-center"
          >
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative group cursor-pointer inline-block"
              onClick={() => navigate("/events")}
              title="Click to discover battles"
            >
              <div className="absolute inset-0 bg-cyan-400/25 rounded-full blur-xl group-hover:bg-cyan-400/50 transition-all duration-300" />
              <img
                src="/images/bot/bot.png"
                alt="YUGANTRAN 3.0 Mascot YUGA-BOT"
                className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain drop-shadow-[0_0_25px_rgba(0,242,254,0.45)] group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-0.5 rounded-full bg-[#020617]/90 border border-cyan-400/40 text-[10px] font-orbitron text-cyan-300 shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>YUGA-BOT 3.0</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Registration Countdown Pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 backdrop-blur-md shadow-[0_0_20px_rgba(0,242,254,0.15)] max-w-full"
          >
            <Flame className="w-4 h-4 text-cyan-400 animate-pulse flex-shrink-0" />
            {timeLeft.isOver ? (
              <span className="font-mono-matrix text-rose-400 text-xs sm:text-sm tracking-widest font-bold">
                REGISTRATIONS CONCLUDED
              </span>
            ) : (
              <span className="font-mono-matrix text-cyan-200 text-xs sm:text-sm tracking-wider">
                REG. CLOSES IN:{" "}
                <strong className="text-white font-bold">
                  {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                </strong>
              </span>
            )}
          </motion.div>

          {/* Main Title Hierarchy */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="space-y-2"
          >
            <h1
              className="font-orbitron font-black tracking-tight gradient-text leading-none select-none"
              style={{ fontSize: "clamp(2.75rem, 11vw, 7.5rem)" }}
            >
              YUGANTRAN
            </h1>
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <div className="h-px flex-1 max-w-[60px] sm:max-w-[120px] bg-gradient-to-r from-transparent to-cyan-400" />
              <span className="font-orbitron text-2xl sm:text-3xl md:text-4xl text-cyan-400 tracking-[0.35em] font-black">
                3.0
              </span>
              <div className="h-px flex-1 max-w-[60px] sm:max-w-[120px] bg-gradient-to-l from-transparent to-cyan-400" />
            </div>
          </motion.div>

          {/* Tagline & Organizing School */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="space-y-2"
          >
            <p className="font-orbitron text-cyan-300 text-xs sm:text-sm md:text-base tracking-[0.2em] font-bold">
              INNOVATE • BUILD • COMPETE • TRANSFORM
            </p>
            <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-body">
              Annual Technical Festival • <strong className="text-white font-semibold">School of Computer Science & Engineering</strong>
            </p>
          </motion.div>

          {/* Date & Venue Badges */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-slate-300 font-space text-xs sm:text-sm pt-1"
          >
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <Calendar className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>27–28 October 2026</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>{venue}</span>
            </div>
          </motion.div>

          {/* Key Metric Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 max-w-3xl mx-auto"
          >
            {[
              { label: "Prize Pool", value: prizePool, icon: Trophy, color: "text-amber-400" },
              { label: "Expected Hackers", value: "500+", icon: Users, color: "text-cyan-400" },
              { label: "Battles & Events", value: "14+", icon: Sparkles, color: "text-emerald-400" },
              { label: "Tech Domains", value: "6", icon: Layers, color: "text-purple-400" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/70 border border-slate-800/90 text-center hover:border-cyan-500/40 transition-colors"
              >
                <div className={`font-orbitron font-black text-xl sm:text-2xl ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="font-space text-xs text-slate-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Primary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/register")}
              className="btn-primary w-full sm:w-auto px-8 py-3.5 text-xs sm:text-sm flex items-center justify-center gap-2 shadow-cyan-500/30"
            >
              <span>REGISTER NOW</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/events")}
              className="btn-outline w-full sm:w-auto px-8 py-3.5 text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <span>EXPLORE EVENTS</span>
              <ChevronDown className="w-4 h-4 text-cyan-400" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom subtle gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#020617] to-transparent pointer-events-none" />
    </section>
  );
}