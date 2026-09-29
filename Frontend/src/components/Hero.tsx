import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  ChevronDown,
  Layers,
  ArrowRight,
  Flame,
  Zap,
} from "lucide-react";
import { publicApi } from "../lib/api";
import CircuitSparks from "./CircuitSparks";
import LogoTicker from "./LogoTicker";
import "./RegisterButton.css";

export default function Hero() {
  const navigate = useNavigate();
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

  const prizePool = settings?.totalPrizePool || "₹54,000+";
  const venue = settings?.venue || "Geeta University, Panipat-Delhi NCR, Haryana";

  return (
    <section
      id="home"
      className="relative min-h-screen w-full max-w-[100vw] flex flex-col items-center justify-center overflow-hidden pt-24 pb-16"
    >
      {/* Hero Content Layer */}
      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto flex flex-col items-center">

          {/* Registration Countdown Pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-2 sm:mb-4 inline-flex items-center justify-center gap-3 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full border border-cyan-500/30 bg-white/50 dark:bg-[#03091e]/60 backdrop-blur-xl shadow-[0_0_15px_rgba(0,242,254,0.15)] transition-all hover:border-cyan-400/50"
          >
            <div className="relative flex items-center justify-center w-4 h-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </div>
            {timeLeft.isOver ? (
              <span className="font-space text-rose-500 dark:text-rose-400 text-[10px] sm:text-xs tracking-[0.2em] font-semibold uppercase">
                Registrations Closed
              </span>
            ) : (
              <div className="font-space text-slate-800 dark:text-slate-200 text-[10px] sm:text-xs tracking-[0.15em] uppercase flex items-center gap-2">
                <span className="opacity-80">Reg. Closes In:</span>
                <span className="text-cyan-700 dark:text-cyan-400 font-bold font-mono tracking-wider">
                  {timeLeft.days}D {timeLeft.hours}H {timeLeft.minutes}M {timeLeft.seconds}S
                </span>
              </div>
            )}
          </motion.div>

          {/* Main Title Hierarchy */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.45 }}
            className="space-y-2"
          >
            <h1
              className="font-orbitron font-black tracking-tight gradient-text leading-none select-none"
              style={{ fontSize: "clamp(2.75rem, 11vw, 7.5rem)" }}
            >
              YUGANTRAN
            </h1>
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <div className="h-px flex-1 max-w-[60px] sm:max-w-[140px] bg-gradient-to-r from-transparent via-cyan-400 to-green-400" />
              <span className="font-orbitron text-2xl sm:text-3xl md:text-4xl text-cyan-600 dark:text-cyan-400 tracking-[0.35em] font-black drop-shadow-[0_0_15px_rgba(0,242,254,0.6)]">
                3.0
              </span>
              <div className="h-px flex-1 max-w-[60px] sm:max-w-[140px] bg-gradient-to-l from-transparent via-cyan-400 to-green-400" />
            </div>
          </motion.div>

          {/* Primary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 pt-3 w-full max-w-lg mx-auto"
          >
            <div className="button-wrap explore-btn-wrap w-[240px] max-w-[80vw]">
              <div className="button-shadow"></div>
              <button 
                onClick={(e) => { e.preventDefault(); navigate("/register"); }} 
                className="explore-glass-btn w-full"
              >
                <span>Register Now</span>
              </button>
            </div>

            <div className="button-wrap explore-btn-wrap w-[240px] max-w-[80vw]">
              <div className="button-shadow"></div>
              <button 
                onClick={() => navigate("/events")} 
                className="explore-glass-btn w-full"
              >
                <span>Explore Events</span>
              </button>
            </div>
          </motion.div>

          <div className="flex flex-col items-center w-full mt-2 sm:mt-0 gap-2 sm:gap-4">
            {/* Continuous Infinite Scrolling Logo Ticker */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full"
            >
              <LogoTicker />
            </motion.div>

            {/* Date & Venue Badges */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-slate-700 dark:text-slate-300 font-space text-xs sm:text-sm pt-1"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md">
              <Calendar className="w-4 h-4 text-cyan-500 dark:text-cyan-400 flex-shrink-0" />
              <span>27–28 October 2026</span>
            </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md">
                <MapPin className="w-4 h-4 text-cyan-500 dark:text-cyan-400 flex-shrink-0" />
                <span>{venue}</span>
              </div>
            </motion.div>
          </div>

          {/* Key Metric Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-8 sm:pt-10 max-w-3xl mx-auto w-full"
          >
            {[
              { label: "Prize Pool", value: prizePool, icon: Trophy, color: "text-amber-500 dark:text-amber-400" },
              { label: "Expected Hackers", value: "500+", icon: Users, color: "text-cyan-600 dark:text-cyan-400" },
              { label: "Technical Events", value: "10", icon: Zap, color: "text-emerald-600 dark:text-emerald-400" },
              { label: "Tech Tracks", value: "6", icon: Layers, color: "text-purple-600 dark:text-purple-400" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/90 text-center hover:border-cyan-500/50 transition-colors shadow-md"
              >
                <div className={`font-orbitron font-black text-xl sm:text-2xl ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="font-space text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Tagline & Organizing School */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="space-y-2"
          >
            <p className="font-orbitron text-cyan-600 dark:text-cyan-300 text-xs sm:text-sm md:text-base tracking-[0.2em] font-bold">
              INNOVATE • BUILD • COMPETE • TRANSFORM
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-body">
              Annual Technical Festival • <strong className="text-slate-900 dark:text-white font-semibold">School of Computer Science & Engineering</strong>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom subtle gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-black to-transparent pointer-events-none" />
    </section>
  );
}