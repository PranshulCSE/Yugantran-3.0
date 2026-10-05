import { useEffect, useState, useMemo } from "react";
import { adminApi } from "../../lib/api";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, Edit2, Trash2, ToggleLeft, ToggleRight, X, Save,
  Layers, Zap, Search, Trophy, Users, CheckCircle2,
  Sparkles, ExternalLink
} from "lucide-react";

const CATEGORIES = [
  { value: "ai", label: "AI & Emerging Tech", color: "from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/30" },
  { value: "cybersecurity", label: "Cybersecurity CTF", color: "from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30" },
  { value: "coding", label: "Competitive Coding", color: "from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30" },
  { value: "swe", label: "Software Engineering", color: "from-indigo-500/20 to-purple-500/20 text-indigo-300 border-indigo-500/30" },
  { value: "iot", label: "IoT & Hardware", color: "from-rose-500/20 to-pink-500/20 text-rose-300 border-rose-500/30" },
  { value: "design", label: "Design & Creativity", color: "from-pink-500/20 to-rose-500/20 text-pink-300 border-pink-500/30" },
  { value: "innovation", label: "Innovation & Startup", color: "from-yellow-500/20 to-amber-500/20 text-yellow-300 border-yellow-500/30" },
  { value: "gaming", label: "Esports & Gaming", color: "from-fuchsia-500/20 to-purple-500/20 text-fuchsia-300 border-fuchsia-500/30" },
  { value: "interactive", label: "Treasure Hunt", color: "from-teal-500/20 to-cyan-500/20 text-teal-300 border-teal-500/30" },
  { value: "flagship", label: "Grand Flagship", color: "from-amber-500/30 to-rose-500/30 text-amber-200 border-amber-400/40" },
];

const EMPTY: any = {
  name: "",
  category: "ai",
  description: "",
  longDescription: "",
  icon: "Code",
  fee: 0,
  prize: "",
  teamType: "team",
  minTeam: 2,
  maxTeam: 4,
  rounds: [{ name: "", description: "" }],
  whatsappLink: "#",
  isActive: true,
  order: 0,
};

export default function EventsManager() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [editEvent, setEditEvent] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeDrawerTab, setActiveDrawerTab] = useState<"general" | "rules" | "rounds">("general");

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const r = await adminApi.getAllEvents();
      setEvents(r.data);
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openCreate = () => {
    setEditEvent(null);
    setForm({ ...EMPTY, rounds: [{ name: "", description: "" }] });
    setActiveDrawerTab("general");
    setShowPanel(true);
  };

  const openEdit = (ev: any) => {
    setEditEvent(ev);
    setForm({ ...ev, rounds: ev.rounds?.length ? ev.rounds : [{ name: "", description: "" }] });
    setActiveDrawerTab("general");
    setShowPanel(true);
  };

  const save = async () => {
    if (!form.name?.trim()) {
      alert("Please enter a competition title.");
      return;
    }
    setSaving(true);
    try {
      if (editEvent) await adminApi.updateEvent(editEvent._id, form);
      else await adminApi.createEvent(form);
      setShowPanel(false);
      fetchEvents();
    } catch (e: any) {
      alert(e.response?.data?.error || "Save operation failed.");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (ev: any) => {
    try {
      await adminApi.updateEvent(ev._id, { isActive: !ev.isActive });
      setEvents((prev) =>
        prev.map((item) => (item._id === ev._id ? { ...item, isActive: !item.isActive } : item))
      );
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  const del = async (id: string) => {
    try {
      await adminApi.deleteEvent(id);
      setDeleteId(null);
      fetchEvents();
    } catch (err) {
      console.error("Failed to delete event", err);
    }
  };

  const updateField = (field: string, val: any) => {
    setForm((p: any) => ({ ...p, [field]: val }));
  };

  // Filtered & Searched Events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchesCategory = selectedCategory === "all" || ev.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        ev.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [events, selectedCategory, searchQuery]);

  // Quick stats
  const activeCount = useMemo(() => events.filter((e) => e.isActive).length, [events]);
  const soloCount = useMemo(() => events.filter((e) => e.teamType === "individual").length, [events]);
  const teamCount = useMemo(() => events.filter((e) => e.teamType === "team").length, [events]);

  return (
    <div className="space-y-4">
      {/* 1. Header & Summary Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3.5 sm:p-4 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-orbitron font-bold text-lg sm:text-xl text-white tracking-wide">
              COMPETITIONS & EVENTS
            </h1>
            <span className="text-[11px] font-mono-matrix px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 font-semibold">
              {events.length} TOTAL
            </span>
          </div>
          <p className="text-slate-400 font-space text-xs mt-0.5">
            Configure rules, rounds, squad sizes, and live visibility.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Quick Metrics */}
          <div className="hidden md:flex items-center gap-2 mr-2">
            <div className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono-matrix flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{activeCount} Live</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-blue-950/40 border border-blue-500/20 text-blue-400 text-[11px] font-mono-matrix">
              {soloCount} Solo / {teamCount} Squad
            </div>
          </div>

          <button
            onClick={openCreate}
            className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-cyan-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Event</span>
          </button>
        </div>
      </div>



      {/* 3. High-Density Compact Table */}
      <div className="bg-slate-900/50 backdrop-blur-md rounded-xl overflow-hidden border border-slate-800/90 shadow-xl">
        <div className="overflow-x-auto min-h-[300px] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-700/50">
          {loading ? (
            <div className="flex justify-center h-48 items-center">
              <div className="w-7 h-7 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-16 text-slate-500 font-space text-xs">
              No competitions found matching your search.
            </div>
          ) : (
            <table className="data-table min-w-full">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className="w-12 text-center">#</th>
                  <th>Competition Title</th>
                  <th>Track / Category</th>
                  <th>Fee</th>
                  <th>Prize Bounty</th>
                  <th>Squad Format</th>
                  <th>Rounds</th>
                  <th className="text-center">Live</th>
                  <th className="text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((ev, i) => {
                  const catMeta = CATEGORIES.find((c) => c.value === ev.category);
                  return (
                    <tr key={ev._id} className="hover:bg-cyan-950/15 transition-colors group">
                      <td className="text-center font-mono-matrix text-slate-500 text-[11px]">
                        {ev.order ?? i + 1}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                            <Zap className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-white text-xs truncate max-w-[220px] group-hover:text-cyan-300 transition-colors">
                              {ev.name}
                            </div>
                            <div className="text-[10px] text-cyan-400/80 font-mono-matrix truncate">
                              /{ev.slug || ev.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-space font-medium border bg-gradient-to-r ${catMeta?.color || "border-slate-700 text-slate-300 bg-slate-900"}`}>
                          {catMeta?.label || ev.category}
                        </span>
                      </td>
                      <td>
                        <span className="font-orbitron font-bold text-xs text-emerald-400">
                          ₹{ev.fee}
                        </span>
                      </td>
                      <td>
                        <span className="font-semibold text-amber-300 text-xs flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-amber-400 flex-shrink-0" />
                          <span className="truncate max-w-[130px]">{ev.prize || "TBA"}</span>
                        </span>
                      </td>
                      <td>
                        <span className="font-space text-[11px] text-slate-300 flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-500" />
                          {ev.teamType === "individual" ? "Solo" : `${ev.minTeam}–${ev.maxTeam} Members`}
                        </span>
                      </td>
                      <td>
                        <span className="font-mono-matrix text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {ev.rounds?.length || 1} R
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => toggle(ev)}
                          title={ev.isActive ? "Click to disable" : "Click to enable"}
                          className="hover:scale-105 transition-transform"
                        >
                          {ev.isActive ? (
                            <ToggleRight className="w-5 h-5 text-cyan-400" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-slate-600" />
                          )}
                        </button>
                      </td>
                      <td className="text-right pr-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(ev)}
                            className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-all"
                            title="Edit Event"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setDeleteId(ev._id)}
                            className="p-1.5 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                            title="Delete Event"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 4. Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-950 border border-rose-500/40 p-6 rounded-2xl max-w-sm w-full text-center shadow-2xl shadow-rose-950/50"
            >
              <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-orbitron font-bold text-base text-white mb-1">
                DELETE COMPETITION?
              </h3>
              <p className="text-slate-400 text-xs font-space mb-5">
                This will permanently delete this competition, rounds, and rules from the live site.
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 font-semibold hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => del(deleteId)}
                  className="px-4 py-2 rounded-lg bg-rose-600 text-white font-orbitron font-bold text-xs hover:bg-rose-500 transition-all shadow-md shadow-rose-600/30"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Create / Edit Slide-in Drawer */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-full max-w-xl bg-[#070e1f] border-l border-cyan-500/30 h-full flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-slate-800/90 flex items-center justify-between bg-slate-950/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-orbitron font-bold text-sm sm:text-base text-white tracking-wide">
                      {editEvent ? "EDIT EVENT INTEL" : "CREATE NEW COMPETITION"}
                    </h2>
                    <p className="text-[11px] text-slate-400 font-space">
                      {editEvent ? `Modifying: ${editEvent.name}` : "Configure registration parameters and rules"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowPanel(false)}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Tabs */}
              <div className="flex border-b border-slate-800 bg-slate-900/40 px-4">
                <button
                  onClick={() => setActiveDrawerTab("general")}
                  className={`py-2.5 px-3 text-xs font-space font-semibold border-b-2 transition-all ${
                    activeDrawerTab === "general"
                      ? "border-cyan-400 text-cyan-300"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  General & Squad
                </button>
                <button
                  onClick={() => setActiveDrawerTab("rules")}
                  className={`py-2.5 px-3 text-xs font-space font-semibold border-b-2 transition-all ${
                    activeDrawerTab === "rules"
                      ? "border-cyan-400 text-cyan-300"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Rules & Descriptions
                </button>
                <button
                  onClick={() => setActiveDrawerTab("rounds")}
                  className={`py-2.5 px-3 text-xs font-space font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                    activeDrawerTab === "rounds"
                      ? "border-cyan-400 text-cyan-300"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span>Competition Rounds</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-400 font-mono-matrix border border-cyan-500/30">
                    {form.rounds?.length || 0}
                  </span>
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {activeDrawerTab === "general" && (
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-space font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Competition Title *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Speed Code Matrix"
                        value={form.name || ""}
                        onChange={(e) => updateField("name", e.target.value)}
                        className="admin-input"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-space font-semibold text-slate-300 uppercase tracking-wider mb-1">
                          Category / Track
                        </label>
                        <select
                          value={form.category}
                          onChange={(e) => updateField("category", e.target.value)}
                          className="admin-input"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c.value} value={c.value}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-space font-semibold text-slate-300 uppercase tracking-wider mb-1">
                          Team Structure
                        </label>
                        <select
                          value={form.teamType}
                          onChange={(e) => updateField("teamType", e.target.value)}
                          className="admin-input"
                        >
                          <option value="individual">Individual / Solo</option>
                          <option value="team">Team / Squad</option>
                        </select>
                      </div>
                    </div>

                    {form.teamType === "team" && (
                      <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                        <div>
                          <label className="block text-[10px] font-space font-semibold text-slate-300 uppercase tracking-wider mb-1">
                            Min Squad Size
                          </label>
                          <input
                            type="number"
                            value={form.minTeam ?? 2}
                            onChange={(e) => updateField("minTeam", Number(e.target.value))}
                            className="admin-input"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-space font-semibold text-slate-300 uppercase tracking-wider mb-1">
                            Max Squad Size
                          </label>
                          <input
                            type="number"
                            value={form.maxTeam ?? 4}
                            onChange={(e) => updateField("maxTeam", Number(e.target.value))}
                            className="admin-input"
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-space font-semibold text-slate-300 uppercase tracking-wider mb-1">
                          Entry Fee (₹)
                        </label>
                        <input
                          type="number"
                          placeholder="0 for free"
                          value={form.fee ?? 0}
                          onChange={(e) => updateField("fee", Number(e.target.value))}
                          className="admin-input"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-space font-semibold text-slate-300 uppercase tracking-wider mb-1">
                          Prize Pool / Bounty
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. ₹15,000 + Trophy"
                          value={form.prize || ""}
                          onChange={(e) => updateField("prize", e.target.value)}
                          className="admin-input"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-space font-semibold text-slate-300 uppercase tracking-wider mb-1">
                          Display Sequence (Order)
                        </label>
                        <input
                          type="number"
                          value={form.order ?? 0}
                          onChange={(e) => updateField("order", Number(e.target.value))}
                          className="admin-input"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-space font-semibold text-slate-300 uppercase tracking-wider mb-1">
                          Lucide Icon Name
                        </label>
                        <input
                          type="text"
                          placeholder="Code, Bot, Shield..."
                          value={form.icon || "Code"}
                          onChange={(e) => updateField("icon", e.target.value)}
                          className="admin-input"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-space font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        WhatsApp Group / Channel Link
                      </label>
                      <input
                        type="text"
                        placeholder="https://chat.whatsapp.com/..."
                        value={form.whatsappLink || ""}
                        onChange={(e) => updateField("whatsappLink", e.target.value)}
                        className="admin-input"
                      />
                    </div>

                    {/* Visibility Switch */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div>
                        <span className="text-xs font-semibold text-white block">
                          Live Visibility Status
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {form.isActive ? "Published on public fest website" : "Hidden draft (admin only)"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateField("isActive", !form.isActive)}
                        className="hover:scale-105 transition-transform"
                      >
                        {form.isActive ? (
                          <ToggleRight className="w-7 h-7 text-cyan-400" />
                        ) : (
                          <ToggleLeft className="w-7 h-7 text-slate-600" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {activeDrawerTab === "rules" && (
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-space font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Card Summary (Brief Overview)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Short summary displayed on cards in the event catalog..."
                        value={form.description || ""}
                        onChange={(e) => updateField("description", e.target.value)}
                        className="admin-input resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-space font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Full Rules, Guidelines & Eligibility (Markdown Supported)
                      </label>
                      <textarea
                        rows={8}
                        placeholder="Detailed rules, eligibility criteria, submission instructions, and evaluation metrics..."
                        value={form.longDescription || ""}
                        onChange={(e) => updateField("longDescription", e.target.value)}
                        className="admin-input resize-y font-mono text-[11px]"
                      />
                    </div>
                  </div>
                )}

                {activeDrawerTab === "rounds" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300">
                        Event Rounds Setup
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateField("rounds", [
                            ...(form.rounds || []),
                            { name: "", description: "" },
                          ])
                        }
                        className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Round</span>
                      </button>
                    </div>

                    {(form.rounds || []).length === 0 ? (
                      <div className="text-center py-8 text-slate-500 text-xs">
                        No rounds configured. Click "+ Add Round" above.
                      </div>
                    ) : (
                      (form.rounds || []).map((r: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-orbitron font-bold text-cyan-400">
                              ROUND 0{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateField(
                                  "rounds",
                                  form.rounds.filter((_: any, j: number) => j !== idx)
                                )
                              }
                              className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold"
                            >
                              Remove ×
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="Round Title (e.g. Preliminary Speed Round)"
                            value={r.name || ""}
                            onChange={(e) => {
                              const rounds = [...form.rounds];
                              rounds[idx] = { ...rounds[idx], name: e.target.value };
                              updateField("rounds", rounds);
                            }}
                            className="admin-input text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Round format, duration & criteria..."
                            value={r.description || ""}
                            onChange={(e) => {
                              const rounds = [...form.rounds];
                              rounds[idx] = { ...rounds[idx], description: e.target.value };
                              updateField("rounds", rounds);
                            }}
                            className="admin-input text-xs"
                          />
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Drawer Footer with Actions */}
              <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowPanel(false)}
                  className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={save}
                  disabled={saving}
                  className="btn-primary text-xs py-2 px-5 flex items-center gap-2 shadow-cyan-500/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving Intel..." : editEvent ? "Update Competition" : "Publish Competition"}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
