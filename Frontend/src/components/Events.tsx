import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { publicApi } from "../lib/api";
import {
  Bot, Shield, Terminal, Bug, GitBranch, Search,
  Rocket, Cpu, Zap, Car, Trophy, Gamepad2, Swords,
  Code, X, Users, IndianRupee, ChevronRight, ArrowRight,
  Layers, CheckCircle2,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Bot, Shield, Terminal, Bug, GitBranch, Search,
  Rocket, Cpu, Zap, Car, Trophy, Gamepad2, Swords, Code,
};

const CATEGORY_CONFIG: Record<string, { label: string; color: string; badge: string }> = {
  ai: { label: "AI & Generative AI", color: "#00f2fe", badge: "badge-ai" },
  cybersecurity: { label: "Cybersecurity & CTF", color: "#f43f5e", badge: "badge-cybersecurity" },
  coding: { label: "Competitive Coding", color: "#38bdf8", badge: "badge-coding" },
  swe: { label: "Software Engineering", color: "#fb923c", badge: "badge-swe" },
  iot: { label: "IoT & Hardware", color: "#2dd4bf", badge: "badge-iot" },
  innovation: { label: "Startup & Innovation", color: "#a855f7", badge: "badge-innovation" },
  gaming: { label: "Esports & Gaming", color: "#ec4899", badge: "badge-gaming" },
  interactive: { label: "Interactive Hunt", color: "#facc15", badge: "badge-interactive" },
  flagship: { label: "Flagship Arena", color: "#ffd700", badge: "badge-flagship" },
};

function EventDetailModal({ event, onClose }: { event: any; onClose: () => void }) {
  const navigate = useNavigate();
  const cfg = CATEGORY_CONFIG[event.category] || { color: "#00f2fe", badge: "badge-ai", label: event.category };

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
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="glass w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8 border-cyan-500/30 shadow-[0_0_50px_rgba(0,242,254,0.2)]"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-[10px] sm:text-xs font-orbitron font-bold tracking-wider border mb-3 ${cfg.badge}`}
              >
                {cfg.label.toUpperCase()}
              </span>
              <h2 className="font-orbitron font-bold text-2xl sm:text-3xl text-white">
                {event.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 text-center">
              <div className="font-orbitron font-black text-lg sm:text-xl text-emerald-400">
                ₹{event.fee}
              </div>
              <div className="font-space text-xs text-slate-400 mt-0.5">Registration Fee</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 text-center">
              <div className="font-orbitron font-black text-lg sm:text-xl text-amber-400">
                {event.prize}
              </div>
              <div className="font-space text-xs text-slate-400 mt-0.5">Bounty Prize</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 text-center">
              <div className="font-orbitron font-black text-lg sm:text-xl text-cyan-400">
                {event.teamType === "individual"
                  ? "Solo"
                  : event.minTeam === event.maxTeam
                  ? `${event.minTeam} Players`
                  : `${event.minTeam}–${event.maxTeam} P`}
              </div>
              <div className="font-space text-xs text-slate-400 mt-0.5">Team Size</div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 mb-6">
            <h4 className="font-orbitron font-bold text-xs text-cyan-400 tracking-wider">
              ABOUT THE BATTLE
            </h4>
            <p className="text-slate-300 text-sm sm:text-base font-body leading-relaxed">
              {event.longDescription || event.description}
            </p>
          </div>

          {/* Rounds */}
          {event.rounds && event.rounds.length > 0 && (
            <div className="mb-6 space-y-3">
              <h4 className="font-orbitron font-bold text-xs text-cyan-400 tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4" />
                ROUND-BY-ROUND FORMAT
              </h4>
              <div className="space-y-2.5">
                {event.rounds.map((round: any, i: number) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex gap-3.5 items-start"
                  >
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-orbitron font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-orbitron font-bold text-xs sm:text-sm text-white mb-0.5">
                        {round.name}
                      </div>
                      <p className="text-slate-300 text-xs font-body leading-relaxed">
                        {round.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Register CTA */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                onClose();
                window.dispatchEvent(new CustomEvent("eventSelected", { detail: event.name }));
                navigate("/register");
              }}
              className="btn-primary w-full py-3.5 text-xs justify-center shadow-cyan-500/25 flex items-center gap-2"
            >
              <span>REGISTER FOR {event.name.toUpperCase()}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            {event.slug && (
              <button
                onClick={() => {
                  onClose();
                  navigate(`/events/${event.slug}`);
                }}
                className="btn-outline w-full sm:w-auto py-3.5 text-xs justify-center whitespace-nowrap"
              >
                FULL PAGE VIEW
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function EventCard({
  event,
  onClick,
  onRegister,
}: {
  event: any;
  onClick: () => void;
  onRegister: () => void;
}) {
  const Icon = ICON_MAP[event.icon] || Code;
  const cfg = CATEGORY_CONFIG[event.category] || {
    color: "#00f2fe",
    badge: "badge-ai",
    label: event.category,
  };

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ duration: 0.25 }}
      className="glass glass-hover rounded-3xl p-6 flex flex-col justify-between group border-cyan-500/20 hover:border-cyan-400/50"
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ background: `${cfg.color}15`, border: `1px solid ${cfg.color}35` }}
          >
            <Icon className="w-6 h-6" style={{ color: cfg.color }} />
          </div>

          <span
            className="text-[10px] font-orbitron font-bold px-2.5 py-0.5 rounded-full border"
            style={{
              color: cfg.color,
              borderColor: `${cfg.color}35`,
              background: `${cfg.color}10`,
            }}
          >
            {cfg.label}
          </span>
        </div>

        {/* Title & Short Description */}
        <h3 className="font-orbitron font-bold text-lg text-white mb-2 group-hover:text-cyan-300 transition-colors">
          {event.name}
        </h3>
        <p className="text-slate-300 text-xs sm:text-sm font-body leading-relaxed mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Format details pill */}
        <div className="flex items-center gap-2 mb-4 text-[11px] font-space text-slate-400">
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            {event.teamType === "individual"
              ? "Solo Battle"
              : event.minTeam === event.maxTeam
              ? `Team (${event.minTeam} Members)`
              : `Team (${event.minTeam}–${event.maxTeam} Members)`}
          </span>
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-orbitron font-black text-amber-400">{event.prize}</div>
            <div className="text-[11px] font-space text-slate-400">Fee: ₹{event.fee}</div>
          </div>
          <button
            onClick={onClick}
            className="text-xs font-space font-semibold text-cyan-400 hover:text-white transition-colors inline-flex items-center gap-1"
          >
            <span>View Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={onRegister}
          className="btn-primary w-full py-2.5 text-xs justify-center shadow-cyan-500/20"
        >
          <span>REGISTER NOW</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

export default function Events() {
  const ref = useRef(null);
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  useEffect(() => {
    publicApi
      .getEvents()
      .then((r) => setEvents(r.data))
      .catch(() => {});
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(events.map((e) => e.category)));
    return ["all", ...cats];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesCat = activeFilter === "all" || e.category === activeFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [events, activeFilter, searchQuery]);

  return (
    <section id="events" ref={ref} className="relative py-0 overflow-visible">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="section-tag mb-4">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>THE ARENA</span>
          </div>
          <h1 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            Battle Catalog & <span className="gradient-text">Competitions</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base font-body">
            10 high-octane technical competitions across AI, Cybersecurity, Software Engineering, IoT,
            Startups, and Esports.
          </p>
        </motion.div>

        {/* Search & Domain Filter Bar */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search competitions by name, keywords, or tech stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-input pl-11 !rounded-2xl !py-3.5"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear ×
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => {
              const cfg = cat === "all" ? null : CATEGORY_CONFIG[cat];
              const isSel = activeFilter === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-2 rounded-full font-mono-matrix text-xs tracking-wider border transition-all duration-200 ${
                    isSel
                      ? "bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.3)] font-bold"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  {cat === "all" ? `ALL (${events.length || 10})` : (cfg?.label || cat).toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Events Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event) => (
              <EventCard
                key={event._id || event.slug}
                event={event}
                onClick={() => setSelectedEvent(event)}
                onRegister={() => {
                  window.dispatchEvent(
                    new CustomEvent("eventSelected", { detail: event.name })
                  );
                  navigate("/register");
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-16 text-slate-400 font-mono-matrix glass p-8 rounded-3xl max-w-md mx-auto">
            No competitions found matching your search.
          </div>
        )}
      </div>

      {/* Modal Popup */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </section>
  );
}
