import { motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, Trophy, ChevronDown } from "lucide-react";
import { publicApi } from "../lib/api";
import CircuitSparks from "./CircuitSparks";

export default function Hero() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [0, 1], [4, -4]);
  const rotateY = useTransform(mouseX, [0, 1], [-4, 4]);

  const [settings, setSettings] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: false });

  useEffect(() => {
    publicApi.getSettings().then((r) => setSettings(r.data)).catch(() => {});
  }, []);

  // Countdown
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

  const festDate = settings?.eventDateStart ? new Date(settings.eventDateStart) : new Date("2026-10-27T09:00:00+05:30");
  const festDateEnd = settings?.eventDateEnd ? new Date(settings.eventDateEnd) : new Date("2026-10-28T17:00:00+05:30");
  const venue = settings?.venue || "Geeta University, Panipat";
  const prizePool = settings?.totalPrizePool || "₹73,000+";

  return (
    <section
      id="home"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      style={{ perspective: "1200px" }}
    >
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,65,0.12)_0%,transparent_70%)] pointer-events-none" />

      {/* Animated circuit sparks — lightweight CSS/SVG layer */}
      <CircuitSparks />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(0,255,65,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative z-10 container mx-auto px-4 sm:px-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <div className="space-y-6 sm:space-y-8">
          {/* Cyber Bot Mascot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="relative group cursor-pointer inline-block"
              onClick={() => navigate("/events")}
            >
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-2xl group-hover:bg-cyan-400/40 transition-all" />
              <img
                src="/images/bot/bot.png"
                alt="YUGANTRAN 3.0 Bot Mascot"
                className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain drop-shadow-[0_0_25px_rgba(0,242,254,0.4)] group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-0.5 rounded-full bg-slate-900/90 border border-cyan-400/40 text-[10px] font-mono-matrix text-cyan-300 shadow-md">
                ⚡ YUGA-BOT 3.0
              </div>
            </motion.div>
          </motion.div>

          {/* Countdown / Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border border-[rgba(0,255,65,0.25)] bg-[rgba(0,255,65,0.06)] backdrop-blur-sm max-w-[92vw]"
          >
            <div className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse flex-shrink-0" />
            {timeLeft.isOver ? (
              <span className="font-mono-matrix text-[#ff6666] text-xs sm:text-sm tracking-widest">REGISTRATION CLOSED</span>
            ) : (
              <span className="font-mono-matrix text-[#00ff41] text-[11px] sm:text-sm tracking-widest whitespace-nowrap">
                REG. CLOSES IN: <strong>{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</strong>
              </span>
            )}
          </motion.div>

          {/* Title */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <h1
              className="font-orbitron font-black tracking-tight gradient-text text-glow-green leading-none px-2"
              style={{ fontSize: "clamp(2.75rem, 13vw, 9rem)" }}
            >
              YUGANTRAN
            </h1>
            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-3">
              <div className="h-px flex-1 max-w-[80px] sm:max-w-none bg-gradient-to-r from-transparent to-[rgba(0,255,65,0.4)]" />
              <span className="font-orbitron text-2xl sm:text-3xl md:text-4xl text-[#00ff41] tracking-[0.4em] sm:tracking-[0.5em]">3.0</span>
              <div className="h-px flex-1 max-w-[80px] sm:max-w-none bg-gradient-to-l from-transparent to-[rgba(0,255,65,0.4)]" />
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
            <p className="font-mono-matrix text-[#00ff41] text-sm md:text-base tracking-[0.25em] opacity-80">
              INNOVATE &nbsp;•&nbsp; BUILD &nbsp;•&nbsp; COMPETE &nbsp;•&nbsp; TRANSFORM
            </p>
            <p className="text-[rgba(176,255,176,0.6)] text-base sm:text-lg md:text-xl mt-4 max-w-2xl mx-auto px-2">
              Annual Technical Festival • School of Computer Science & Engineering
            </p>
          </motion.div>

          {/* Event Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-[rgba(176,255,176,0.6)] px-2"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#00ff41] flex-shrink-0" />
              <span className="font-mono-matrix text-xs sm:text-sm">
                {festDate.toLocaleDateString("en-IN", { day: "numeric", month: "long" })}–{festDateEnd.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[rgba(0,255,65,0.4)] hidden sm:block" />
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#00ff41] flex-shrink-0" />
              <span className="font-mono-matrix text-xs sm:text-sm">{venue}</span>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="flex flex-wrap justify-center gap-5 sm:gap-8"
          >
            {[
              { icon: Trophy, label: "Prize Pool", value: prizePool },
              { icon: Users, label: "Expected", value: "500+" },
              { label: "Events", value: "14+" },
              { label: "Domains", value: "6" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-orbitron text-xl sm:text-2xl gradient-text font-bold">{s.value}</div>
                <div className="font-mono-matrix text-[10px] sm:text-xs text-[rgba(176,255,176,0.4)] tracking-widest mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95 }}
            className="flex flex-col sm:flex-row justify-center gap-4 pt-4 sm:pt-6"
          >
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/events")}
              className="btn-primary px-8 sm:px-10 py-3.5 sm:py-4 text-sm"
            >
              EXPLORE EVENTS
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/register")}
              className="btn-outline px-8 sm:px-10 py-3.5 sm:py-4 text-sm"
            >
              REGISTER NOW
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-1 pointer-events-none"
      >
        <span className="font-mono-matrix text-[10px] text-[rgba(176,255,176,0.35)] tracking-widest">SCROLL</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}>
          <ChevronDown className="w-4 h-4 text-[rgba(0,255,65,0.4)]" />
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#000000] to-transparent pointer-events-none" />
    </section>
  );
}