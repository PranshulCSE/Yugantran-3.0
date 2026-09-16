import { motion, AnimatePresence } from "motion/react";
import { useInView } from "motion/react";
import { useEffect, useRef, useState, useMemo } from "react";
import { publicApi } from "../lib/api";
import {
  Bot,
  Shield,
  Terminal,
  Bug,
  GitBranch,
  Search,
  Rocket,
  Cpu,
  Zap,
  Car,
  Trophy,
  Gamepad2,
  Swords,
  Code,
  X,
  Users,
  IndianRupee,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Layers,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Bot,
  Shield,
  Terminal,
  Bug,
  GitBranch,
  Search,
  Rocket,
  Cpu,
  Zap,
  Car,
  Trophy,
  Gamepad2,
  Swords,
  Code,
};

const CATEGORY_CONFIG: Record<string, { label: string; color: string; badge: string }> = {
  ai: { label: "AI & GenAI", color: "#00f2fe", badge: "badge-ai" },
  cybersecurity: { label: "Cybersecurity CTF", color: "#f43f5e", badge: "badge-cybersecurity" },
  coding: { label: "Competitive Code", color: "#38bdf8", badge: "badge-coding" },
  swe: { label: "Software Engineering", color: "#fb923c", badge: "badge-swe" },
  iot: { label: "IoT & Hardware", color: "#2dd4bf", badge: "badge-iot" },
  innovation: { label: "Innovation & Startup", color: "#a855f7", badge: "badge-innovation" },
  gaming: { label: "Esports Arena", color: "#ec4899", badge: "badge-gaming" },
  interactive: { label: "Interactive Hunt", color: "#facc15", badge: "badge-interactive" },
  flagship: { label: "Grand Flagship", color: "#ffd700", badge: "badge-flagship" },
};

function EventDetailModal({ event, onClose }: { event: any; onClose: () => void }) {
  const cfg = CATEGORY_CONFIG[event.category] || {
    color: "#00f2fe",
    badge: "badge-ai",
    label: "Tech Event",
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="glass w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-3xl p-6 sm:p-8 border-cyan-500/40 shadow-2xl relative"
        >
          {/* Top Bar */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-orbitron font-bold tracking-wider border mb-2.5"
                style={{
                  color: cfg.color,
                  borderColor: `${cfg.color}40`,
                  background: `${cfg.color}15`,
                }}
              >
                {cfg.label.toUpperCase()}
              </span>
              <h2 className="font-orbitron font-black text-2xl sm:text-3xl text-white">
                {event.name}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-cyan-400 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-3 gap-3.5 mb-6">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="font-orbitron font-black text-lg text-emerald-400">
                ₹{event.fee}
              </div>
              <div className="text-[11px] font-space text-slate-400 mt-0.5">Entry Fee</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="font-orbitron font-black text-lg text-amber-400">
                {event.prize}
              </div>
              <div className="text-[11px] font-space text-slate-400 mt-0.5">Bounty / Prize</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="font-orbitron font-black text-lg text-cyan-400">
                {event.teamType === "individual"
                  ? "Solo"
                  : `${event.minTeam}-${event.maxTeam} P`}
              </div>
              <div className="text-[11px] font-space text-slate-400 mt-0.5">Team Size</div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h4 className="text-xs font-orbitron font-bold text-slate-400 uppercase tracking-wider mb-2">
              EVENT BRIEF & OBJECTIVE
            </h4>
            <p className="text-slate-300 text-sm sm:text-base font-body leading-relaxed">
              {event.longDescription || event.description}
            </p>
          </div>

          {/* Rounds Timeline */}
          {event.rounds && event.rounds.length > 0 && (
            <div className="mb-8">
              <h4 className="text-xs font-orbitron font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>COMPETITION ROUNDS ({event.rounds.length})</span>
              </h4>

              <div className="space-y-3">
                {event.rounds.map((round: any, i: number) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex gap-4 items-start"
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center font-orbitron font-bold text-xs flex-shrink-0"
                      style={{
                        background: `${cfg.color}20`,
                        color: cfg.color,
                        border: `1px solid ${cfg.color}40`,
                      }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <h5 className="font-orbitron font-bold text-sm text-white mb-1">
                        {round.name}
                      </h5>
                      <p className="text-slate-300 text-xs font-body leading-relaxed">
                        {round.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action CTA */}
          <button
            onClick={() => {
              onClose();
              window.dispatchEvent(new CustomEvent("eventSelected", { detail: event.name }));
              setTimeout(() => {
                const el = document.querySelector("#register");
                if (el)
                  window.scrollTo({
                    top: el.getBoundingClientRect().top + window.scrollY - 85,
                    behavior: "smooth",
                  });
              }, 100);
            }}
            className="btn-primary w-full py-4 text-sm justify-center"
          >
            <span>REGISTER FOR {event.name.toUpperCase()} NOW</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function EventCard({ event, onClick }: { event: any; onClick: () => void }) {
  const Icon = ICON_MAP[event.icon] || Code;
  const cfg = CATEGORY_CONFIG[event.category] || {
    color: "#00f2fe",
    badge: "badge-ai",
    label: event.category,
  };

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 25 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="glass glass-hover p-6 rounded-3xl cursor-pointer group flex flex-col justify-between border-cyan-500/20 hover:border-cyan-400/50"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-5">
          <div
            className="w-13 h-13 p-3 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
            style={{
              background: `${cfg.color}15`,
              border: `1px solid ${cfg.color}35`,
              boxShadow: `0 0 20px ${cfg.color}20`,
            }}
          >
            <Icon className="w-7 h-7" style={{ color: cfg.color }} />
          </div>

          <span
            className="text-[10px] font-orbitron font-bold px-3 py-1 rounded-full border"
            style={{
              color: cfg.color,
              borderColor: `${cfg.color}35`,
              background: `${cfg.color}10`,
            }}
          >
            {cfg.label}
          </span>
        </div>

        {/* Title & Desc */}
        <h3 className="font-orbitron font-black text-xl text-white mb-2.5 group-hover:text-cyan-300 transition-colors">
          {event.name}
        </h3>

        <p className="text-slate-300 text-sm font-body leading-relaxed line-clamp-2 mb-6">
          {event.description}
        </p>
      </div>

      {/* Footer Specs */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <div className="font-orbitron font-black text-lg text-amber-400">{event.prize}</div>
          <div className="text-xs font-mono-matrix text-slate-400">Entry: ₹{event.fee}</div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-xs font-space font-semibold text-cyan-300 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
          <span>View Intel</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </motion.div>
  );
}

export default function Events() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [events, setEvents] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  useEffect(() => {
    publicApi
      .getEvents()
      .then((r) => setEvents(r.data))
      .catch(() => {});
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(events.map((e) => e.category));
    return ["all", ...Array.from(cats)];
  }, [events]);

  const filtered =
    activeFilter === "all" ? events : events.filter((e) => e.category === activeFilter);

  return (
    <section id="events" ref={ref} className="relative py-28 overflow-hidden scroll-mt-16">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="section-tag mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>14+ COMPETITIONS</span>
          </div>

          <h2 className="font-orbitron text-4xl sm:text-5xl font-black text-white mb-4">
            Featured <span className="gradient-text">Battlegrounds</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg font-body">
            Compete across AI & LLMs, Cybersecurity CTF, Software Engineering, Autonomous IoT, and
            Esports Tournaments.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2.5 mb-14"
        >
          {categories.map((cat) => {
            const cfg = cat === "all" ? null : CATEGORY_CONFIG[cat];
            const isSelected = activeFilter === cat;

            return (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2.5 rounded-full font-space text-xs font-bold tracking-wider border transition-all duration-200 ${
                  isSelected
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 border-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(0,242,254,0.4)]"
                    : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                {cat === "all" ? "ALL 14 EVENTS" : (cfg?.label || cat).toUpperCase()}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Events Grid */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="wait">
            {filtered.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onClick={() => setSelectedEvent(event)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {!events.length && (
          <div className="text-center py-20 text-slate-500 font-mono-matrix">
            Fetching active events...
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </section>
  );
}
