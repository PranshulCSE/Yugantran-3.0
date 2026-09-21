import { useEffect, useState } from "react";
import { adminApi } from "../../lib/api";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, X, Save, Layers, Zap } from "lucide-react";

const CATEGORIES = [
  { value: "ai", label: "AI & Emerging Tech" },
  { value: "cybersecurity", label: "Cybersecurity CTF" },
  { value: "coding", label: "Competitive Coding" },
  { value: "swe", label: "Software Engineering" },
  { value: "iot", label: "IoT & Hardware" },
  { value: "innovation", label: "Innovation & Startup" },
  { value: "gaming", label: "Esports & Gaming Arena" },
  { value: "interactive", label: "Interactive Treasure" },
  { value: "flagship", label: "Grand Flagship" },
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

function FormField({
  label,
  value,
  onChange,
  type = "text",
  textarea = false,
}: {
  label: string;
  value: any;
  onChange: (val: any) => void;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="block font-space text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
        {label}
      </label>
      {textarea ? (
        <textarea
          rows={3}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="admin-input resize-none"
        />
      ) : (
        <input
          type={type}
          value={value !== undefined ? value : ""}
          onChange={(e) =>
            onChange(type === "number" ? (e.target.value === "" ? 0 : Number(e.target.value)) : e.target.value)
          }
          className="admin-input"
        />
      )}
    </div>
  );
}

export default function EventsManager() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [editEvent, setEditEvent] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const r = await adminApi.getAllEvents();
      setEvents(r.data);
    } catch {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const openCreate = () => {
    setEditEvent(null);
    setForm({ ...EMPTY, rounds: [{ name: "", description: "" }] });
    setShowPanel(true);
  };
  const openEdit = (ev: any) => {
    setEditEvent(ev);
    setForm({ ...ev });
    setShowPanel(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      if (editEvent) await adminApi.updateEvent(editEvent._id, form);
      else await adminApi.createEvent(form);
      setShowPanel(false);
      fetch();
    } catch (e: any) {
      alert(e.response?.data?.error || "Save operation failed.");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (ev: any) => {
    try {
      await adminApi.updateEvent(ev._id, { isActive: !ev.isActive });
      fetch();
    } catch {}
  };

  const del = async (id: string) => {
    try {
      await adminApi.deleteEvent(id);
      setDeleteId(null);
      fetch();
    } catch {}
  };

  const updateField = (field: string, val: any) => {
    setForm((p: any) => ({ ...p, [field]: val }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-orbitron font-black text-2xl sm:text-3xl text-white tracking-wider">
            COMPETITIONS & EVENTS
          </h1>
          <p className="text-slate-400 font-space text-sm mt-1">
            Create, edit rules, manage rounds, and toggle visibility for all {events.length} events.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="btn-primary text-xs py-3 px-6 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Event</span>
        </button>
      </div>

      {/* Table */}
      <div className="glass rounded-3xl overflow-x-auto border-cyan-500/20 shadow-xl">
        {loading ? (
          <div className="flex justify-center h-40 items-center">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="data-table min-w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Event Name</th>
                <th>Category</th>
                <th>Entry Fee</th>
                <th>Prize Pool</th>
                <th>Squad Size</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev, i) => (
                <tr key={ev._id}>
                  <td className="font-mono-matrix text-xs text-slate-500">{ev.order ?? i + 1}</td>
                  <td>
                    <div className="font-bold text-white">{ev.name}</div>
                    <div className="text-xs text-cyan-400 font-mono-matrix">/{ev.slug}</div>
                  </td>
                  <td>
                    <span className="px-2.5 py-1 rounded-full text-xs font-space bg-slate-800 text-slate-300 border border-slate-700">
                      {ev.category}
                    </span>
                  </td>
                  <td className="font-orbitron font-bold text-sm text-emerald-400">₹{ev.fee}</td>
                  <td className="font-semibold text-amber-400 text-sm">{ev.prize}</td>
                  <td className="font-space text-xs text-slate-300">
                    {ev.teamType === "individual" ? "Solo" : `${ev.minTeam}–${ev.maxTeam} P`}
                  </td>
                  <td>
                    <button onClick={() => toggle(ev)}>
                      {ev.isActive ? (
                        <ToggleRight className="w-7 h-7 text-cyan-400" />
                      ) : (
                        <ToggleLeft className="w-7 h-7 text-slate-600" />
                      )}
                    </button>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(ev)}
                        className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(ev._id)}
                        className="p-2 rounded-xl bg-rose-950 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="glass p-8 rounded-3xl max-w-sm w-full text-center border-rose-500/40 shadow-2xl"
            >
              <h3 className="font-orbitron font-bold text-xl text-rose-400 mb-2">
                DELETE COMPETITION?
              </h3>
              <p className="text-slate-300 text-sm font-space mb-6">
                This will permanently delete this event and its rules from the system.
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setDeleteId(null)} className="btn-outline text-xs py-2.5 px-5">
                  CANCEL
                </button>
                <button
                  onClick={() => del(deleteId)}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 text-white font-orbitron font-bold text-xs hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/30"
                >
                  CONFIRM DELETE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create / Edit Slide-in Panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28 }}
              className="w-full max-w-2xl bg-[#060e22] border-l border-cyan-500/30 h-full overflow-y-auto shadow-2xl"
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
                  <h2 className="font-orbitron font-black text-xl text-white tracking-wider flex items-center gap-2">
                    <Zap className="w-5 h-5 text-cyan-400" />
                    <span>{editEvent ? "EDIT COMPETITION INTEL" : "CREATE NEW COMPETITION"}</span>
                  </h2>

                  <button
                    onClick={() => setShowPanel(false)}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-5">
                  <FormField label="Competition Title" value={form.name} onChange={(v) => updateField("name", v)} />

                  <div>
                    <label className="block font-space text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      CATEGORY / TRACK
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm((p: any) => ({ ...p, category: e.target.value }))}
                      className="admin-input"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <FormField label="Brief Summary (Card View)" value={form.description} onChange={(v) => updateField("description", v)} textarea />
                  <FormField label="Full Rules & Specifications" value={form.longDescription} onChange={(v) => updateField("longDescription", v)} textarea />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Entry Fee (₹)" value={form.fee} onChange={(v) => updateField("fee", v)} type="number" />
                    <FormField label="Bounty / Prize" value={form.prize} onChange={(v) => updateField("prize", v)} />
                  </div>

                  <div>
                    <label className="block font-space text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      TEAM STRUCTURE
                    </label>
                    <select
                      value={form.teamType}
                      onChange={(e) => setForm((p: any) => ({ ...p, teamType: e.target.value }))}
                      className="admin-input"
                    >
                      <option value="individual">Individual / Solo</option>
                      <option value="team">Team / Squad</option>
                    </select>
                  </div>

                  {form.teamType === "team" && (
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Min Squad Size" value={form.minTeam} onChange={(v) => updateField("minTeam", v)} type="number" />
                      <FormField label="Max Squad Size" value={form.maxTeam} onChange={(v) => updateField("maxTeam", v)} type="number" />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Icon Name (Lucide)" value={form.icon} onChange={(v) => updateField("icon", v)} />
                    <FormField label="Display Sequence" value={form.order} onChange={(v) => updateField("order", v)} type="number" />
                  </div>

                  <FormField label="WhatsApp Community Link" value={form.whatsappLink} onChange={(v) => updateField("whatsappLink", v)} />

                  {/* Active Toggle */}
                  <div className="flex items-center gap-3 pt-2">
                    <span className="font-space text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      VISIBILITY STATE:
                    </span>
                    <button
                      type="button"
                      onClick={() => setForm((p: any) => ({ ...p, isActive: !p.isActive }))}
                    >
                      {form.isActive ? (
                        <ToggleRight className="w-8 h-8 text-cyan-400" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-slate-600" />
                      )}
                    </button>
                    <span className="text-xs font-mono-matrix text-slate-400">
                      {form.isActive ? "ACTIVE & VISIBLE" : "HIDDEN DRAFT"}
                    </span>
                  </div>

                  {/* Competition Rounds */}
                  <div className="pt-4 border-t border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                      <label className="font-space text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        <span>COMPETITION ROUNDS ({form.rounds?.length || 0})</span>
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((p: any) => ({
                            ...p,
                            rounds: [...(p.rounds || []), { name: "", description: "" }],
                          }))
                        }
                        className="text-xs font-orbitron font-bold text-cyan-400 hover:text-white"
                      >
                        + ADD ROUND
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(form.rounds || []).map((r: any, i: number) => (
                        <div
                          key={i}
                          className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-orbitron font-bold text-cyan-300">
                              ROUND 0{i + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setForm((p: any) => ({
                                  ...p,
                                  rounds: p.rounds.filter((_: any, j: number) => j !== i),
                                }))
                              }
                              className="text-rose-400 hover:text-rose-300 text-xs"
                            >
                              Remove ×
                            </button>
                          </div>

                          <input
                            placeholder="Round Title (e.g. Speed Coding Matrix)"
                            value={r.name}
                            onChange={(e) => {
                              const rounds = [...form.rounds];
                              rounds[i] = { ...rounds[i], name: e.target.value };
                              setForm((p: any) => ({ ...p, rounds }));
                            }}
                            className="admin-input text-xs"
                          />

                          <input
                            placeholder="Round Objectives & Rules..."
                            value={r.description}
                            onChange={(e) => {
                              const rounds = [...form.rounds];
                              rounds[i] = { ...rounds[i], description: e.target.value };
                              setForm((p: any) => ({ ...p, rounds }));
                            }}
                            className="admin-input text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-6">
                    <button
                      onClick={save}
                      disabled={saving}
                      className="btn-primary w-full py-4 text-sm justify-center shadow-cyan-500/40"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saving ? "SAVING INTEL..." : editEvent ? "UPDATE EVENT DATA" : "PUBLISH NEW EVENT"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
