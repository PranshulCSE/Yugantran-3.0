import { useEffect, useState } from "react";
import { adminApi } from "../../lib/api";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, X, Save } from "lucide-react";

const CATEGORIES = [
  { value: "ai", label: "AI & Emerging Tech" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "coding", label: "Coding" },
  { value: "swe", label: "Software Engineering" },
  { value: "iot", label: "IoT & Hardware" },
  { value: "innovation", label: "Innovation" },
  { value: "gaming", label: "Gaming" },
  { value: "interactive", label: "Interactive" },
  { value: "flagship", label: "Flagship" },
];

const EMPTY: any = {
  name: "", category: "ai", description: "", longDescription: "",
  icon: "Code", fee: 0, prize: "", teamType: "team", minTeam: 2, maxTeam: 4,
  rounds: [{ name: "", description: "" }], whatsappLink: "#", isActive: true, order: 0,
};

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
    try { const r = await adminApi.getAllEvents(); setEvents(r.data); } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditEvent(null); setForm({ ...EMPTY, rounds: [{ name: "", description: "" }] }); setShowPanel(true); };
  const openEdit = (ev: any) => { setEditEvent(ev); setForm({ ...ev }); setShowPanel(true); };

  const save = async () => {
    setSaving(true);
    try {
      if (editEvent) await adminApi.updateEvent(editEvent._id, form);
      else await adminApi.createEvent(form);
      setShowPanel(false);
      fetch();
    } catch (e: any) { alert(e.response?.data?.error || "Save failed"); }
    finally { setSaving(false); }
  };

  const toggle = async (ev: any) => {
    try { await adminApi.updateEvent(ev._id, { isActive: !ev.isActive }); fetch(); } catch {}
  };

  const del = async (id: string) => {
    try { await adminApi.deleteEvent(id); setDeleteId(null); fetch(); } catch {}
  };

  const Field = ({ label, field, type = "text", textarea = false, half = false }: any) => (
    <div className={half ? "" : ""}>
      <label className="block font-mono-matrix text-xs text-[rgba(176,255,176,0.45)] tracking-widest mb-2">{label}</label>
      {textarea ? (
        <textarea
          rows={3}
          value={form[field] ?? ""}
          onChange={(e) => setForm((p: any) => ({ ...p, [field]: e.target.value }))}
          className="admin-input resize-none"
        />
      ) : (
        <input
          type={type}
          value={form[field] !== undefined ? form[field] : ""}
          onChange={(e) =>
            setForm((p: any) => ({ ...p, [field]: type === "number" ? Number(e.target.value) : e.target.value }))
          }
          className="admin-input"
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-orbitron text-2xl text-[#00ff41] tracking-widest">EVENTS MANAGER</h1>
          <p className="text-[rgba(176,255,176,0.35)] font-mono-matrix text-sm mt-1">{events.length} events</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 py-2 px-5">
          <Plus className="w-4 h-4" /> New Event
        </button>
      </div>

      {/* Table */}
      <div className="admin-card rounded-xl overflow-x-auto">
        {loading ? (
          <div className="flex justify-center h-32 items-center">
            <div className="w-8 h-8 border-2 border-[#00ff41] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="data-table min-w-full">
            <thead>
              <tr>
                <th>#</th><th>Name</th><th>Category</th><th>Fee</th><th>Prize</th><th>Team</th><th>Active</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev, i) => (
                <tr key={ev._id}>
                  <td className="font-mono-matrix text-xs text-[rgba(176,255,176,0.35)]">{ev.order ?? i + 1}</td>
                  <td>
                    <div className="font-medium">{ev.name}</div>
                    <div className="text-xs text-[rgba(176,255,176,0.35)] font-mono-matrix">{ev.slug}</div>
                  </td>
                  <td><span className="font-mono-matrix text-xs">{ev.category}</span></td>
                  <td className="font-orbitron text-sm text-[#00ff41]">₹{ev.fee}</td>
                  <td className="text-sm">{ev.prize}</td>
                  <td className="font-mono-matrix text-xs">
                    {ev.teamType === "individual" ? "Solo" : `${ev.minTeam}–${ev.maxTeam}`}
                  </td>
                  <td>
                    <button onClick={() => toggle(ev)}>
                      {ev.isActive
                        ? <ToggleRight className="w-6 h-6 text-[#00ff41]" />
                        : <ToggleLeft className="w-6 h-6 text-[rgba(176,255,176,0.25)]" />}
                    </button>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(ev)} className="p-1.5 rounded bg-[rgba(0,204,255,0.1)] hover:bg-[rgba(0,204,255,0.2)] text-[#00ccff] transition-colors">
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button onClick={() => setDeleteId(ev._id)} className="p-1.5 rounded bg-[rgba(255,68,68,0.1)] hover:bg-[rgba(255,68,68,0.2)] text-[#ff4444] transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass p-8 rounded-2xl max-w-sm w-full text-center">
              <h3 className="font-orbitron text-lg text-[#ff4444] mb-2">DELETE EVENT?</h3>
              <p className="text-[rgba(176,255,176,0.45)] font-mono-matrix text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setDeleteId(null)} className="btn-outline py-2 px-6 text-sm">CANCEL</button>
                <button onClick={() => del(deleteId)} className="px-6 py-2 rounded-lg bg-[rgba(255,68,68,0.12)] border border-[rgba(255,68,68,0.3)] text-[#ff4444] font-orbitron text-sm hover:bg-[rgba(255,68,68,0.22)] transition-all">
                  DELETE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28 }}
              className="w-full max-w-2xl bg-[#050f05] border-l border-[rgba(0,255,65,0.15)] h-full overflow-y-auto"
            >
              <div className="p-6">
                {/* Panel header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-orbitron text-lg text-[#00ff41] tracking-widest">
                    {editEvent ? "EDIT EVENT" : "NEW EVENT"}
                  </h2>
                  <button onClick={() => setShowPanel(false)} className="p-2 rounded-lg hover:bg-[rgba(0,255,65,0.06)] text-[rgba(176,255,176,0.45)] hover:text-[#b0ffb0] transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <Field label="Event Name" field="name" />

                  <div>
                    <label className="block font-mono-matrix text-xs text-[rgba(176,255,176,0.45)] tracking-widest mb-2">CATEGORY</label>
                    <select value={form.category} onChange={(e) => setForm((p: any) => ({ ...p, category: e.target.value }))} className="admin-input">
                      {CATEGORIES.map((c) => <option key={c.value} value={c.value} className="bg-[#050f05]">{c.label}</option>)}
                    </select>
                  </div>

                  <Field label="Short Description" field="description" textarea />
                  <Field label="Long Description / Rules" field="longDescription" textarea />

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Entry Fee (₹)" field="fee" type="number" />
                    <Field label="Prize" field="prize" />
                  </div>

                  <div>
                    <label className="block font-mono-matrix text-xs text-[rgba(176,255,176,0.45)] tracking-widest mb-2">TEAM TYPE</label>
                    <select value={form.teamType} onChange={(e) => setForm((p: any) => ({ ...p, teamType: e.target.value }))} className="admin-input">
                      <option value="individual" className="bg-[#050f05]">Individual</option>
                      <option value="team" className="bg-[#050f05]">Team</option>
                    </select>
                  </div>

                  {form.teamType === "team" && (
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Min Team Size" field="minTeam" type="number" />
                      <Field label="Max Team Size" field="maxTeam" type="number" />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Icon (Lucide name)" field="icon" />
                    <Field label="Display Order" field="order" type="number" />
                  </div>

                  <Field label="WhatsApp Link" field="whatsappLink" />

                  {/* Active toggle */}
                  <div className="flex items-center gap-3">
                    <label className="font-mono-matrix text-xs text-[rgba(176,255,176,0.45)] tracking-widest">ACTIVE</label>
                    <button type="button" onClick={() => setForm((p: any) => ({ ...p, isActive: !p.isActive }))}>
                      {form.isActive
                        ? <ToggleRight className="w-7 h-7 text-[#00ff41]" />
                        : <ToggleLeft className="w-7 h-7 text-[rgba(176,255,176,0.25)]" />}
                    </button>
                  </div>

                  {/* Rounds */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="font-mono-matrix text-xs text-[rgba(176,255,176,0.45)] tracking-widest">EVENT ROUNDS</label>
                      <button
                        type="button"
                        onClick={() => setForm((p: any) => ({ ...p, rounds: [...(p.rounds || []), { name: "", description: "" }] }))}
                        className="text-xs text-[#00ff41] font-mono-matrix hover:text-[#88ff88] transition-colors"
                      >
                        + Add Round
                      </button>
                    </div>
                    {(form.rounds || []).map((r: any, i: number) => (
                      <div key={i} className="mb-3 p-3 rounded-lg border border-[rgba(0,255,65,0.1)] bg-[rgba(0,255,65,0.02)]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono-matrix text-xs text-[rgba(0,255,65,0.5)]">ROUND {i + 1}</span>
                          <button type="button" onClick={() => setForm((p: any) => ({ ...p, rounds: p.rounds.filter((_: any, j: number) => j !== i) }))} className="text-[#ff6666] hover:text-[#ff8888]">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <input placeholder="Round name" value={r.name}
                          onChange={(e) => { const rounds = [...form.rounds]; rounds[i] = { ...rounds[i], name: e.target.value }; setForm((p: any) => ({ ...p, rounds })); }}
                          className="admin-input mb-2 text-sm" />
                        <input placeholder="Round description" value={r.description}
                          onChange={(e) => { const rounds = [...form.rounds]; rounds[i] = { ...rounds[i], description: e.target.value }; setForm((p: any) => ({ ...p, rounds })); }}
                          className="admin-input text-sm" />
                      </div>
                    ))}
                  </div>

                  <button onClick={save} disabled={saving} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" />
                    {saving ? "SAVING..." : editEvent ? "UPDATE EVENT" : "CREATE EVENT"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
