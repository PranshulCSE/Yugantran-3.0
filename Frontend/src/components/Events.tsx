import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { publicApi } from "../lib/api";
import {
  Bot, Shield, Terminal, Bug, GitBranch, Search,
  Rocket, Cpu, Zap, Car, Trophy, Gamepad2, Swords,
  Code, X, Users, IndianRupee, ChevronRight
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Bot, Shield, Terminal, Bug, GitBranch, Search,
  Rocket, Cpu, Zap, Car, Trophy, Gamepad2, Swords, Code,
};

const CATEGORY_CONFIG: Record<string, { label: string; color: string; badge: string }> = {
  ai: { label: "AI & Emerging Tech", color: "#00ff41", badge: "badge-ai" },
  cybersecurity: { label: "Cybersecurity", color: "#ff4444", badge: "badge-cybersecurity" },
  coding: { label: "Coding", color: "#00ccff", badge: "badge-coding" },
  swe: { label: "Software Engg", color: "#ff8800", badge: "badge-swe" },
  iot: { label: "IoT & Hardware", color: "#00ffcc", badge: "badge-iot" },
  innovation: { label: "Innovation", color: "#88ff00", badge: "badge-innovation" },
  gaming: { label: "Gaming", color: "#ff44cc", badge: "badge-gaming" },
  interactive: { label: "Interactive", color: "#ffcc00", badge: "badge-interactive" },
  flagship: { label: "Flagship", color: "#ffd700", badge: "badge-flagship" },
};

function EventDetailModal({ event, onClose }: { event: any; onClose: () => void }) {
  const navigate = useNavigate();
  const cfg = CATEGORY_CONFIG[event.category] || { color: "#00ff41", badge: "badge-ai" };

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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="glass w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 md:p-8"
          style={{ borderColor: `${cfg.color}30` }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-mono-matrix tracking-widest border mb-3 ${cfg.badge}`}
              >
                {cfg.label.toUpperCase()}
              </span>
              <h2 className="font-orbitron text-2xl md:text-3xl" style={{ color: cfg.color }}>
                {event.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.06)] transition-colors text-[rgba(176,255,176,0.5)] hover:text-[#b0ffb0]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Entry Fee", value: `₹${event.fee}`, icon: IndianRupee },
              { label: "Prize", value: event.prize },
              {
                label: "Team Size",
                value: event.teamType === "individual"
                  ? "Individual"
                  : event.minTeam === event.maxTeam
                    ? `Team of ${event.minTeam}`
                    : `${event.minTeam}–${event.maxTeam} Members`,
                icon: Users,
              },
            ].map((info, i) => (
              <div key={i} className="bg-[rgba(0,255,65,0.04)] border border-[rgba(0,255,65,0.1)] rounded-xl p-4 text-center">
                <div className="font-orbitron text-base mb-1" style={{ color: cfg.color }}>{info.value}</div>
                <div className="font-mono-matrix text-xs text-[rgba(176,255,176,0.4)]">{info.label}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <p className="text-[rgba(176,255,176,0.7)] leading-relaxed mb-6">
            {event.longDescription || event.description}
          </p>

          {/* Rounds */}
          {event.rounds?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-orbitron text-xs tracking-widest mb-4" style={{ color: cfg.color }}>
                EVENT ROUNDS
              </h3>
              <div className="space-y-3">
                {event.rounds.map((round: any, i: number) => (
                  <div
                    key={i}
                    className="flex gap-4 p-4 rounded-lg bg-[rgba(0,255,65,0.03)] border border-[rgba(0,255,65,0.08)]"
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-orbitron font-bold"
                      style={{ background: `${cfg.color}20`, color: cfg.color }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-orbitron text-sm mb-1" style={{ color: cfg.color }}>{round.name}</div>
                      <p className="text-[rgba(176,255,176,0.5)] text-sm">{round.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Register CTA */}
          <button
            onClick={() => {
              onClose();
              window.dispatchEvent(new CustomEvent("eventSelected", { detail: event.name }));
              navigate("/register");
            }}
            className="btn-primary w-full py-4 flex items-center justify-center gap-2"
          >
            REGISTER FOR {event.name.toUpperCase()} <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function EventCard({ event, onClick }: { event: any; onClick: () => void }) {
  const Icon = ICON_MAP[event.icon] || Code;
  const cfg = CATEGORY_CONFIG[event.category] || { color: "#00ff41", badge: "badge-ai", label: event.category };

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="glass glass-hover rounded-xl p-6 cursor-pointer group"
      style={{ borderColor: `${cfg.color}15` }}
    >
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-xl mb-5 flex items-center justify-center"
        style={{ background: `${cfg.color}12`, border: `1px solid ${cfg.color}25` }}
      >
        <Icon className="w-7 h-7" style={{ color: cfg.color }} />
      </div>

      {/* Category badge */}
      <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono-matrix border tracking-widest mb-3 ${cfg.badge}`}>
        {cfg.label}
      </span>

      {/* Title */}
      <h3 className="font-orbitron text-lg mb-2" style={{ color: cfg.color }}>{event.name}</h3>
      <p className="text-[rgba(176,255,176,0.5)] text-sm leading-relaxed mb-5 line-clamp-2">{event.description}</p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-orbitron text-lg" style={{ color: cfg.color }}>{event.prize}</div>
          <div className="font-mono-matrix text-xs text-[rgba(176,255,176,0.4)]">₹{event.fee} entry</div>
        </div>
        <span
          className="text-xs font-mono-matrix flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: cfg.color }}
        >
          Details <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </motion.div>
  );
}

export default function Events() {
  const ref = useRef(null);
  const [events, setEvents] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  useEffect(() => {
    publicApi.getEvents().then((r) => setEvents(r.data)).catch(() => {});
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(events.map((e) => e.category));
    return ["all", ...Array.from(cats)];
  }, [events]);

  const filtered = activeFilter === "all" ? events : events.filter((e) => e.category === activeFilter);

  return (
    <section id="events" ref={ref} className="relative pt-6 pb-20 md:pt-8 md:pb-24 overflow-visible scroll-mt-16">
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[rgba(0,255,65,0.04)] rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <span className="section-tag">// EVENTS</span>
          <h2 className="font-orbitron text-4xl md:text-5xl mt-6 mb-4">
            <span className="gradient-text">Compete</span> in Cutting-Edge Events
          </h2>
          <p className="text-[rgba(176,255,176,0.5)] text-lg max-w-2xl mx-auto">
            14 events across AI, Cybersecurity, Software Engineering, IoT, Innovation and Gaming.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {categories.map((cat) => {
            const cfg = cat === "all" ? null : CATEGORY_CONFIG[cat];
            return (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2 rounded-full font-mono-matrix text-xs tracking-widest border transition-all duration-200 ${
                  activeFilter === cat
                    ? "bg-[rgba(0,255,65,0.15)] border-[rgba(0,255,65,0.5)] text-[#00ff41]"
                    : "border-[rgba(0,255,65,0.15)] text-[rgba(176,255,176,0.5)] hover:border-[rgba(0,255,65,0.3)] hover:text-[#b0ffb0]"
                }`}
              >
                {cat === "all" ? "ALL EVENTS" : (cfg?.label || cat).toUpperCase()}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Events Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
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
          <div className="text-center py-20 text-[rgba(176,255,176,0.3)] font-mono-matrix">
            Loading events...
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </section>
  );
}
