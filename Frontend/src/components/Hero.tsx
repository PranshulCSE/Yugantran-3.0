import { motion } from "motion/react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Layers,
  Zap,
  Lock,
} from "lucide-react";
import { publicApi } from "../lib/api";
import LogoTicker from "./LogoTicker";

interface MysteryStat {
  label: string;
  badge: string;
  mysteryDisplay: string;
  icon: any;
  color: string;
  glowColor: string;
  borderHover: string;
}

const MYSTERY_STATS: MysteryStat[] = [
  {
    label: "Prize Pool",
    badge: "CLASSIFIED",
    mysteryDisplay: "₹??,???+",
    icon: Trophy,
    color: "text-amber-500 dark:text-amber-400",
    glowColor: "rgba(245, 158, 11, 0.45)",
    borderHover: "hover:border-amber-400/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]",
  },
  {
    label: "Expected Hackers",
    badge: "UNDISCLOSED",
    mysteryDisplay: "???+",
    icon: Users,
    color: "text-cyan-600 dark:text-cyan-400",
    glowColor: "rgba(34, 211, 238, 0.45)",
    borderHover: "hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]",
  },
  {
    label: "Technical Events",
    badge: "ENCRYPTED",
    mysteryDisplay: "??",
    icon: Zap,
    color: "text-emerald-600 dark:text-emerald-400",
    glowColor: "rgba(52, 211, 153, 0.45)",
    borderHover: "hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.2)]",
  },
  {
    label: "Tech Tracks",
    badge: "TOP SECRET",
    mysteryDisplay: "??",
    icon: Layers,
    color: "text-purple-600 dark:text-purple-400",
    glowColor: "rgba(168, 85, 247, 0.45)",
    borderHover: "hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]",
  },
];

function MysteryStatCard({ stat }: { stat: MysteryStat }) {
  const [displayText, setDisplayText] = useState(stat.mysteryDisplay);
  const [isScrambling, setIsScrambling] = useState(false);
  const glyphs = "?#%*&X01!?";

  const triggerCipher = useCallback(() => {
    if (isScrambling) return;
    setIsScrambling(true);
    let count = 0;
    const maxCount = 6;
    const timer = setInterval(() => {
      setDisplayText(
        stat.mysteryDisplay
          .split("")
          .map((ch) => {
            if (ch === "₹" || ch === "+" || ch === "," || ch === " ") return ch;
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join("")
      );
      count++;
      if (count >= maxCount) {
        clearInterval(timer);
        setDisplayText(stat.mysteryDisplay);
        setIsScrambling(false);
      }
    }, 45);
  }, [isScrambling, stat.mysteryDisplay]);

  useEffect(() => {
    const interval = setInterval(() => {
      triggerCipher();
    }, 6000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, [triggerCipher]);

  return (
    <div
      onMouseEnter={triggerCipher}
      className={`group relative overflow-hidden glass p-2.5 sm:p-4 rounded-2xl border border-cyan-500/20 text-center shadow-lg transition-all duration-200 ease-out-custom hover:-translate-y-1 flex flex-col items-center justify-center min-h-[92px] sm:min-h-[110px] ${stat.borderHover}`}
    >
      {/* Top Classified Badge */}
      <div className="flex items-center justify-center gap-1 mb-1">
        <Lock className="w-2.5 h-2.5 text-cyan-600 dark:text-cyan-400/80 animate-pulse flex-shrink-0" />
        <span className="font-mono text-[8px] sm:text-[9px] font-bold tracking-wider sm:tracking-widest text-slate-500 dark:text-cyan-300/80 uppercase">
          {stat.badge}
        </span>
      </div>

      {/* Mystery Value with Glitch/Cipher Effect - Guaranteed single line */}
      <div
        className={`font-orbitron font-black text-base sm:text-xl md:text-2xl ${stat.color} tracking-tight sm:tracking-normal drop-shadow-md select-none whitespace-nowrap`}
        style={{
          textShadow: `0 0 14px ${stat.glowColor}`,
        }}
      >
        {displayText}
      </div>

      {/* Label */}
      <div className="font-space text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 mt-0.5 sm:mt-1 font-medium opacity-90 whitespace-nowrap">
        {stat.label}
      </div>

      {/* Cyber Shimmer Sweep on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
    </div>
  );
}

function LaserConduit({ direction }: { direction: "left" | "right" }) {
  const isLeft = direction === "left";

  return (
    <div className="relative flex-1 flex items-center gap-1 sm:gap-1.5 py-1">
      {/* Outer Diamond Node (for Left side) */}
      {isLeft && (
        <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rotate-45 bg-cyan-500/40 dark:bg-cyan-500/50 flex-shrink-0" />
      )}

      {/* Inner Terminal Node (for Right side) */}
      {!isLeft && (
        <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-cyan-500/40 dark:bg-cyan-500/50 flex-shrink-0" />
      )}

      {/* Clean Track Container - Sleek & Refined */}
      <div className="relative flex-1 h-[1.5px] rounded-full overflow-hidden bg-slate-300/30 dark:bg-cyan-950/60 border-t border-slate-400/20 dark:border-cyan-500/20">
        {/* Subtle, Crisp Traveling Light Pulse - Confined strictly to the line */}
        <motion.div
          className={`absolute inset-y-0 w-14 sm:w-20 md:w-24 ${
            isLeft
              ? "bg-gradient-to-r from-transparent via-cyan-300 via-white to-transparent"
              : "bg-gradient-to-l from-transparent via-cyan-300 via-white to-transparent"
          } drop-shadow-[0_0_3px_#22d3ee]`}
          animate={{
            [isLeft ? "left" : "right"]: ["-25%", "115%"],
            opacity: [0, 0.95, 0.95, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      </div>

      {/* Inner Terminal Node (for Left side) */}
      {isLeft && (
        <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-cyan-500/40 dark:bg-cyan-500/50 flex-shrink-0" />
      )}

      {/* Outer Diamond Node (for Right side) */}
      {!isLeft && (
        <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rotate-45 bg-cyan-500/40 dark:bg-cyan-500/50 flex-shrink-0" />
      )}
    </div>
  );
}

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
      .catch(() => { });
  }, []);

  const isRegistrationOpen = useMemo(() => {
    if (!settings) return false;
    return Boolean(settings.isRegistrationOpen);
  }, [settings]);

  // Countdown timer logic when registrations are open
  useEffect(() => {
    if (!isRegistrationOpen) return;

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
  }, [isRegistrationOpen, settings?.registrationDeadline]);

  const venue = settings?.venue || "Geeta University, Panipat-Delhi NCR, Haryana";
  const prizePool = settings?.totalPrizePool || "₹21,000+";

  const eventDateText = useMemo(() => {
    if (!settings?.eventDateStart) return "27–28 October 2026";
    try {
      const start = new Date(settings.eventDateStart);
      const end = settings.eventDateEnd ? new Date(settings.eventDateEnd) : null;
      const startDay = start.getDate();
      const startMonth = start.toLocaleString("en-US", { month: "long" });
      const startYear = start.getFullYear();
      if (end && !isNaN(end.getTime())) {
        const endDay = end.getDate();
        const endMonth = end.toLocaleString("en-US", { month: "long" });
        const endYear = end.getFullYear();
        if (startMonth === endMonth && startYear === endYear) {
          return `${startDay}–${endDay} ${startMonth} ${startYear}`;
        }
        return `${startDay} ${startMonth} – ${endDay} ${endMonth} ${endYear}`;
      }
      return `${startDay} ${startMonth} ${startYear}`;
    } catch {
      return "27–28 October 2026";
    }
  }, [settings?.eventDateStart, settings?.eventDateEnd]);

  return (
    <section
      id="home"
      className="relative min-h-screen w-full max-w-[100vw] flex flex-col items-center justify-center overflow-hidden pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-28 md:pb-20"
    >

      {/* Hero Content Layer */}
      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className={`max-w-4xl mx-auto flex flex-col items-center ${isRegistrationOpen ? "space-y-4 sm:space-y-5" : "space-y-3 sm:space-y-4"}`}>

          {/* Registration Status Pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`inline-flex items-center justify-center rounded-full backdrop-blur-xl transition-all ${
              !isRegistrationOpen
                ? "gap-2 px-3 py-1 sm:px-4 sm:py-1.5 border border-rose-500/30 bg-rose-500/10 dark:bg-rose-950/30 shadow-[0_0_12px_rgba(244,63,94,0.15)]"
                : "gap-2 sm:gap-3 px-3.5 py-1.5 sm:px-5 sm:py-2 border border-cyan-500/30 bg-white/50 dark:bg-[#03091e]/60 shadow-[0_0_15px_rgba(0,242,254,0.15)] hover:border-cyan-400/50"
            }`}
          >
            {!isRegistrationOpen ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <span className="font-space text-rose-600 dark:text-rose-400 text-[10px] sm:text-xs tracking-[0.2em] font-bold uppercase">
                  Registrations Closed
                </span>
              </>
            ) : timeLeft.isOver ? (
              <span className="font-space text-rose-500 dark:text-rose-400 text-[10px] sm:text-xs tracking-[0.2em] font-semibold uppercase">
                Registrations Closed
              </span>
            ) : (
              <div className="font-space text-slate-800 dark:text-slate-200 text-[10px] sm:text-xs tracking-[0.15em] uppercase flex items-center gap-1.5 sm:gap-2">
                <span className="opacity-80">Reg. Closes In:</span>
                <span className="text-cyan-700 dark:text-cyan-400 font-bold font-mono tracking-wider">
                  {timeLeft.days}D {timeLeft.hours}H {timeLeft.minutes}M {timeLeft.seconds}S
                </span>
              </div>
            )}
          </motion.div>

          {/* Main Title Hierarchy - Enlarged Impactful Logo in both states */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="space-y-1.5 sm:space-y-2.5 w-full"
          >
            <h1
              className="font-orbitron font-black tracking-tight gradient-text leading-none select-none"
              style={{ fontSize: "clamp(2.15rem, 9.8vw, 7.8rem)" }}
            >
              YUGANTRAN
            </h1>
            {/* 3.0 Accent with High-Tech Synchronized Glowing Laser Conduits */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-4 w-full max-w-xs sm:max-w-lg md:max-w-xl mx-auto px-1 sm:px-2">
              <LaserConduit direction="left" />

              {/* 3.0 Number */}
              <span className="font-orbitron text-xl sm:text-3xl md:text-4xl text-cyan-400 font-black tracking-[0.25em] sm:tracking-[0.35em] mr-[-0.25em] sm:mr-[-0.35em] drop-shadow-[0_0_16px_rgba(0,242,254,0.9)] select-none flex-shrink-0 px-1 sm:px-2">
                3.0
              </span>

              <LaserConduit direction="right" />
            </div>

            {/* Coming Soon indicator - prominent & clearly visible across all screens */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 select-none pt-1.5 sm:pt-2.5">
              <div className="w-5 sm:w-16 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/40 to-cyan-400/80" />
              <span className="font-orbitron text-xs sm:text-base md:text-lg font-bold tracking-[0.2em] sm:tracking-[0.3em] text-cyan-600 dark:text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.55)] uppercase">
                COMING SOON
              </span>
              <div className="w-5 sm:w-16 h-[1.5px] bg-gradient-to-l from-transparent via-cyan-400/40 to-cyan-400/80" />
            </div>
          </motion.div>

          {/* Primary Action Buttons - Roomy, spacious layout when registrations are open */}
          {isRegistrationOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 pt-3 sm:pt-4 pb-2 sm:pb-3 w-full max-w-md sm:max-w-lg mx-auto px-3"
            >
              <button
                onClick={(e) => { e.preventDefault(); navigate("/register"); }}
                className="anim-silver-bg group relative w-full sm:w-auto min-w-0 sm:min-w-[220px] px-6 py-2.5 sm:px-8 sm:py-3.5 font-orbitron text-[10px] sm:text-[12px] font-bold tracking-[0.15em] rounded-full shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.97] transition-[transform,opacity] duration-[160ms] ease-out-custom flex items-center justify-center uppercase overflow-hidden cursor-pointer"
              >
                <span className="relative z-10 whitespace-nowrap">REGISTER NOW</span>
              </button>

              <button
                onClick={() => navigate("/awards")}
                className="relative w-full sm:w-auto min-w-0 sm:min-w-[220px] px-6 py-2.5 sm:px-8 sm:py-3.5 bg-slate-900/5 dark:bg-white/10 hover:bg-slate-900/10 dark:hover:bg-white/20 backdrop-blur-xl border border-slate-900/20 dark:border-white/30 text-slate-950 dark:text-white font-orbitron text-[10px] sm:text-[12px] font-bold tracking-[0.15em] rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-[0.97] transition-[transform,opacity,background-color,border-color] duration-[160ms] ease-out-custom flex items-center justify-center uppercase cursor-pointer"
              >
                <span className="relative z-10 whitespace-nowrap">See Exciting Awards !!</span>
              </button>
            </motion.div>
          )}

          {/* Partner Logo Marquee & Badges */}
          <div className={`flex flex-col items-center w-full gap-2 sm:gap-3 ${isRegistrationOpen ? "mt-4 sm:mt-6" : "mt-2 sm:mt-4"}`}>
            {/* Continuous Infinite Scrolling Logo Ticker */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full"
            >
              <LogoTicker />
            </motion.div>

            {/* Date & Venue Badges */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-slate-700 dark:text-slate-300 font-space text-xs sm:text-sm pt-1 w-full max-w-xl mx-auto px-2"
            >
              <div className="flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl glass border-cyan-500/20 shadow-md w-full sm:w-auto text-center">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-500 dark:text-cyan-400 flex-shrink-0" />
                <span className="font-semibold tracking-wide text-cyan-700 dark:text-cyan-300 whitespace-nowrap">
                  {isRegistrationOpen ? eventDateText : "To be announced"}
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl glass border-cyan-500/20 shadow-md w-full sm:w-auto text-center">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-500 dark:text-cyan-400 flex-shrink-0" />
                <span className="truncate max-w-[270px] sm:max-w-none">{venue}</span>
              </div>
            </motion.div>
          </div>

          {/* Key Metric Highlights - Shows Real Stats when Open, Mystery Cards when Closed */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 max-w-3xl mx-auto w-full px-2 ${isRegistrationOpen ? "pt-4 sm:pt-6" : "pt-2 sm:pt-4"}`}
          >
            {isRegistrationOpen
              ? [
                  { label: "Prize Pool", value: prizePool, icon: Trophy, color: "text-amber-500 dark:text-amber-400" },
                  { label: "Expected Hackers", value: "500+", icon: Users, color: "text-cyan-600 dark:text-cyan-400" },
                  { label: "Technical Events", value: "10", icon: Zap, color: "text-emerald-600 dark:text-emerald-400" },
                  { label: "Tech Tracks", value: "6", icon: Layers, color: "text-purple-600 dark:text-purple-400" },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="glass glass-hover p-2.5 sm:p-4 rounded-2xl border border-cyan-500/20 text-center shadow-lg transition-all duration-200 ease-out-custom hover:-translate-y-1 hover:shadow-cyan-500/20 flex flex-col items-center justify-center min-h-[92px] sm:min-h-[110px]"
                  >
                    <div className={`font-orbitron font-black text-base sm:text-xl md:text-2xl ${stat.color} tracking-tight sm:tracking-normal drop-shadow-md whitespace-nowrap select-none`}>
                      {stat.value}
                    </div>
                    <div className="font-space text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1 opacity-90 whitespace-nowrap font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))
              : MYSTERY_STATS.map((stat, idx) => (
                  <MysteryStatCard key={idx} stat={stat} />
                ))}
          </motion.div>

          {/* Tagline & Organizing School */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className={`space-y-1 sm:space-y-1.5 ${isRegistrationOpen ? "pt-4 sm:pt-6" : "pt-2 sm:pt-4"}`}
          >
            <p className="font-orbitron text-cyan-600 dark:text-cyan-300 text-[9px] sm:text-xs md:text-sm tracking-[0.12em] sm:tracking-[0.2em] font-bold px-2">
              INNOVATE • BUILD • COMPETE • TRANSFORM
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] sm:text-sm md:text-base max-w-2xl mx-auto font-body px-2">
              Annual Technical Festival • <strong className="text-slate-900 dark:text-white font-semibold">School of Computer Science & Engineering</strong>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
