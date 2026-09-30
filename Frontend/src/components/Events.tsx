import { motion, AnimatePresence } from "motion/react";
import React, { forwardRef, useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { publicApi } from "../lib/api";
import {
  Bot, Shield, Terminal, Bug, GitBranch, Search,
  Rocket, Cpu, Zap, Car, Trophy, Gamepad2, Swords,
  Code, X, Users, IndianRupee, ChevronRight, ArrowRight,
  Layers, CheckCircle2, ChevronDown,
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
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-24 sm:p-6 sm:pt-28 pb-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[85vh] rounded-[2rem] bg-slate-50/70 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/30 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Ambient Glow */}
          <div 
            className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[4rem] opacity-20 dark:opacity-30 pointer-events-none"
            style={{ background: cfg.color }}
          />

          <div 
            className="p-6 sm:p-8 overflow-y-auto overflow-x-hidden w-full h-full [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full"
            style={{ scrollbarWidth: "thin" }}
          >
            {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-[10px] sm:text-xs font-orbitron font-bold tracking-wider border mb-3 ${cfg.badge}`}
              >
                {cfg.label.toUpperCase()}
              </span>
              <h2 className="font-orbitron font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                {event.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
            <div className="bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-sm rounded-2xl p-4 text-center backdrop-blur-sm">
              <div className="font-orbitron font-black text-lg sm:text-xl text-emerald-600 dark:text-emerald-400">
                ₹{event.fee}
              </div>
              <div className="font-space text-xs text-slate-500 dark:text-slate-400 mt-1">Reg. Fee</div>
            </div>

            <div className="bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-sm rounded-2xl p-4 text-center backdrop-blur-sm">
              <div className="font-orbitron font-black text-lg sm:text-xl text-amber-600 dark:text-amber-400">
                {event.prize}
              </div>
              <div className="font-space text-xs text-slate-500 dark:text-slate-400 mt-1">Bounty Prize</div>
            </div>

            <div className="bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-sm rounded-2xl p-4 text-center backdrop-blur-sm">
              <div className="font-orbitron font-black text-lg sm:text-xl text-cyan-600 dark:text-cyan-400">
                {event.teamType === "individual"
                  ? "Solo"
                  : event.minTeam === event.maxTeam
                  ? `${event.minTeam} Players`
                  : `${event.minTeam}–${event.maxTeam} P`}
              </div>
              <div className="font-space text-xs text-slate-500 dark:text-slate-400 mt-1">Team Size</div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 mb-6">
            <h4 className="font-orbitron font-bold text-xs text-cyan-600 dark:text-cyan-400 tracking-wider">
              ABOUT THE BATTLE
            </h4>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-body leading-relaxed">
              {event.longDescription || event.description}
            </p>
          </div>

          {/* Rounds */}
          {event.rounds && event.rounds.length > 0 && (
            <div className="mb-8 space-y-3">
              <h4 className="font-orbitron font-bold text-xs text-cyan-600 dark:text-cyan-400 tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4" />
                ROUND-BY-ROUND FORMAT
              </h4>
              <div className="space-y-3">
                {event.rounds.map((round: any, i: number) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-white/30 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-sm flex gap-4 items-start"
                  >
                    <div className="w-8 h-8 rounded-xl bg-white/50 dark:bg-black/20 border border-white/40 dark:border-white/10 text-cyan-700 dark:text-cyan-400 font-orbitron font-black text-sm flex items-center justify-center flex-shrink-0 shadow-inner">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-orbitron font-bold text-sm text-slate-900 dark:text-white mb-1 tracking-wide">
                        {round.name}
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-sm font-body leading-relaxed">
                        {round.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Register CTA */}
          <div className="pt-5 flex justify-center border-t border-slate-200/50 dark:border-slate-700/50">
            <button
              onClick={() => {
                onClose();
                window.dispatchEvent(new CustomEvent("eventSelected", { detail: event.name }));
                navigate("/register");
              }}
              className="py-3.5 px-8 sm:px-12 rounded-xl text-sm font-orbitron font-black tracking-widest text-slate-900 dark:text-white transition-all duration-300 flex items-center justify-center gap-2 group/modalbtn hover:scale-[1.02]"
              style={{
                background: `linear-gradient(to right, ${cfg.color}20, ${cfg.color}10)`,
                border: `1px solid ${cfg.color}40`,
              }}
            >
              <span>REGISTER FOR {event.name.toUpperCase()}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover/modalbtn:translate-x-1" style={{ color: cfg.color }} />
            </button>
          </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface EventCardProps {
  event: any;
  onClick: () => void;
  onRegister: () => void;
}

const EventCard = forwardRef<HTMLDivElement, EventCardProps>(
  ({ event, onClick, onRegister }, ref) => {
    const Icon = ICON_MAP[event.icon] || Code;
    const cfg = CATEGORY_CONFIG[event.category] || {
      color: "#00f2fe",
      badge: "badge-ai",
      label: event.category,
    };

    return (
      <motion.div
        ref={ref}
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative group glass glass-hover rounded-[2rem] p-6 flex flex-col justify-between overflow-hidden"
      >
        
        {/* Glowing Ambient Gradient behind card (Subtle) */}
        <div 
          className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[3rem] opacity-0 group-hover:opacity-20 transition-opacity duration-700 -z-10"
          style={{ background: cfg.color }}
        />

        <div>
          {/* Card Header: Icon + Category */}
          <div className="flex items-start justify-between mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
              style={{ 
                background: `linear-gradient(135deg, ${cfg.color}20, transparent)`, 
                border: `1px solid ${cfg.color}40`,
                boxShadow: `0 8px 32px ${cfg.color}15`
              }}
            >
              <Icon className="w-7 h-7" style={{ color: cfg.color }} />
            </div>

            <span
              className="text-[10px] font-orbitron font-bold px-3 py-1 rounded-full uppercase tracking-wider"
              style={{
                color: cfg.color,
                background: `${cfg.color}10`,
                border: `1px solid ${cfg.color}20`,
              }}
            >
              {cfg.label}
            </span>
          </div>

          {/* Title & Description */}
          <h3 className="font-orbitron font-black text-xl text-slate-900 dark:text-white mb-3 tracking-wide group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
            {event.name}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm font-body leading-relaxed mb-6 line-clamp-2">
            {event.description}
          </p>
        </div>

        {/* Footer Info & Actions */}
        <div className="pt-5 mt-auto border-t border-slate-200/50 dark:border-slate-700/50 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-space font-medium text-slate-500 dark:text-slate-400">
              <Users className="w-3.5 h-3.5" style={{ color: cfg.color }} />
              <span>
                {event.teamType === "individual"
                  ? "Solo"
                  : event.minTeam === event.maxTeam
                  ? `Team of ${event.minTeam}`
                  : `${event.minTeam}–${event.maxTeam} Members`}
              </span>
            </div>
            <div className="text-right">
              <div className="text-xs font-orbitron font-black text-slate-900 dark:text-white">Prize: {event.prize}</div>
              <div className="text-[10px] font-space text-slate-500 dark:text-slate-400">Fee: ₹{event.fee}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRegister}
              className="flex-1 py-3 px-4 rounded-xl text-xs font-orbitron font-bold tracking-wider text-slate-900 dark:text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn"
              style={{
                background: `linear-gradient(to right, ${cfg.color}20, ${cfg.color}10)`,
                border: `1px solid ${cfg.color}40`,
              }}
            >
              <span>REGISTER</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" style={{ color: cfg.color }} />
            </button>
            <button
              onClick={onClick}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="View Details"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }
);

EventCard.displayName = "EventCard";

export default function Events() {
  const ref = useRef(null);
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
          <h1 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black mb-4">
            <span className="anim-silver-royal">Battle Catalog & Competitions</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-body">
            The ultimate technical battleground. Choose your arena and prove your mettle.
          </p>
        </motion.div>

        {/* Domain Filter Bar */}
        <div className="space-y-4 max-w-4xl mx-auto relative z-20">
          {/* Mobile Dropdown */}
          <div className="md:hidden relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl glass !bg-black/10 dark:!bg-black/40 text-sm font-semibold tracking-wide shadow-sm !border-white/10 text-slate-800 dark:text-slate-200"
            >
              <span>
                {activeFilter === "all" ? `ALL (${events.length || 10})` : (CATEGORY_CONFIG[activeFilter]?.label || activeFilter).toUpperCase()}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl glass !bg-white/60 dark:!bg-black/60 backdrop-blur-3xl shadow-2xl !border-white/10 z-50 flex flex-col gap-1 max-h-[60vh] overflow-y-auto"
                >
                  {categories.map((cat) => {
                    const cfg = cat === "all" ? null : CATEGORY_CONFIG[cat];
                    const isSel = activeFilter === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveFilter(cat);
                          setIsDropdownOpen(false);
                        }}
                        className={`text-left px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-colors ${
                          isSel
                            ? "bg-black/10 dark:bg-white/15 text-slate-900 dark:text-white shadow-sm"
                            : "text-slate-800 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-slate-200"
                        }`}
                      >
                        {cat === "all" ? `ALL (${events.length || 10})` : (cfg?.label || cat).toUpperCase()}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Filter Pills */}
          <div className="hidden md:flex flex-wrap justify-center gap-2">
            {categories.map((cat) => {
              const cfg = cat === "all" ? null : CATEGORY_CONFIG[cat];
              const isSel = activeFilter === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-[13px] font-semibold tracking-wide transition-all duration-300 glass hover:scale-105 ${
                    isSel
                      ? "!bg-black/10 dark:!bg-white/15 text-slate-900 dark:text-white shadow-md !border-slate-400 dark:!border-white/30"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
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
