import { useEffect, useState } from "react";
import { adminApi } from "../../lib/api";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Edit2, Trash2, X, Save, User, ToggleLeft, ToggleRight } from "lucide-react";

const EMPTY = { name: "", role: "", department: "SCSE", image: "", linkedin: "", category: "core", order: 0, isActive: true };

export default function TeamManager() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [editMember, setEditMember] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  const fetch = async () => {
    setLoading(true);
    try { const r = await adminApi.getAllTeam(); setMembers(r.data); } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditMember(null); setForm({ ...EMPTY }); setShowPanel(true); };
  const openEdit = (m: any) => { setEditMember(m); setForm({ ...m }); setShowPanel(true); };

  const save = async () => {
    setSaving(true);
    try {
      if (editMember) await adminApi.updateTeamMember(editMember._id, form);
      else await adminApi.createTeamMember(form);
      setShowPanel(false);
      fetch();
    } catch (e: any) { alert(e.response?.data?.error || "Save failed"); }
    finally { setSaving(false); }
  };

  const del = async (id: string) => {
    try { await adminApi.deleteTeamMember(id); setDeleteId(null); fetch(); } catch {}
  };

  const filtered = filter === "all" ? members : members.filter((m) => m.category === filter);

  const Field = ({ label, field, type = "text" }: any) => (
    <div>
      <label className="block font-mono-matrix text-xs text-[rgba(176,255,176,0.45)] tracking-widest mb-2">{label}</label>
      <input
        type={type}
        value={form[field] ?? ""}
        onChange={(e) => setForm((p: any) => ({ ...p, [field]: type === "number" ? Number(e.target.value) : e.target.value }))}
        className="admin-input"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-orbitron text-2xl text-[#00ff41] tracking-widest">TEAM MANAGER</h1>
          <p className="text-[rgba(176,255,176,0.35)] font-mono-matrix text-sm mt-1">{members.length} members</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 py-2 px-5">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-3">
        {["all", "core", "subteam"].map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full font-mono-matrix text-xs tracking-widest border transition-all ${
              filter === cat
                ? "border-[rgba(0,255,65,0.5)] bg-[rgba(0,255,65,0.1)] text-[#00ff41]"
                : "border-[rgba(0,255,65,0.15)] text-[rgba(176,255,176,0.45)] hover:border-[rgba(0,255,65,0.3)]"
            }`}>
            {cat.toUpperCase()}
          </button>
        ))}
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
              <tr><th>Photo</th><th>Name</th><th>Role</th><th>Dept</th><th>Type</th><th>Order</th><th>Active</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m._id}>
                  <td>
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-[rgba(0,255,65,0.08)] border border-[rgba(0,255,65,0.18)] flex items-center justify-center">
                      {m.image ? <img src={m.image} alt={m.name} className="w-full h-full object-cover" /> : <User className="w-4 h-4 text-[rgba(0,255,65,0.35)]" />}
                    </div>
                  </td>
                  <td className="font-medium">{m.name}</td>
                  <td className="text-sm text-[rgba(176,255,176,0.6)]">{m.role}</td>
                  <td className="font-mono-matrix text-xs">{m.department}</td>
                  <td><span className="font-mono-matrix text-xs px-2 py-0.5 rounded border border-[rgba(0,255,65,0.18)] text-[rgba(0,255,65,0.65)]">{m.category}</span></td>
                  <td className="font-mono-matrix text-xs">{m.order}</td>
                  <td><span className={m.isActive ? "text-[#00ff41]" : "text-[rgba(176,255,176,0.25)]"}>{m.isActive ? "●" : "○"}</span></td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(m)} className="p-1.5 rounded bg-[rgba(0,204,255,0.1)] hover:bg-[rgba(0,204,255,0.2)] text-[#00ccff] transition-colors"><Edit2 className="w-3 h-3" /></button>
                      <button onClick={() => setDeleteId(m._id)} className="p-1.5 rounded bg-[rgba(255,68,68,0.1)] hover:bg-[rgba(255,68,68,0.2)] text-[#ff4444] transition-colors"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr><td colSpan={8} className="text-center text-[rgba(176,255,176,0.3)] font-mono-matrix text-sm py-8">No members found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass p-8 rounded-2xl max-w-sm w-full text-center">
              <h3 className="font-orbitron text-lg text-[#ff4444] mb-2">REMOVE MEMBER?</h3>
              <div className="flex gap-3 justify-center mt-6">
                <button onClick={() => setDeleteId(null)} className="btn-outline py-2 px-6 text-sm">CANCEL</button>
                <button onClick={() => del(deleteId)} className="px-6 py-2 rounded-lg bg-[rgba(255,68,68,0.12)] border border-[rgba(255,68,68,0.3)] text-[#ff4444] font-orbitron text-sm hover:bg-[rgba(255,68,68,0.22)] transition-all">REMOVE</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28 }}
              className="w-full max-w-lg bg-[#050f05] border-l border-[rgba(0,255,65,0.15)] h-full overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-orbitron text-lg text-[#00ff41] tracking-widest">{editMember ? "EDIT MEMBER" : "ADD MEMBER"}</h2>
                  <button onClick={() => setShowPanel(false)} className="p-2 rounded-lg hover:bg-[rgba(0,255,65,0.06)] text-[rgba(176,255,176,0.45)] hover:text-[#b0ffb0] transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-4">
                  <Field label="Full Name" field="name" />
                  <Field label="Role / Position" field="role" />
                  <Field label="Department" field="department" />
                  <Field label="Profile Image URL" field="image" />
                  <Field label="LinkedIn URL" field="linkedin" />
                  <div>
                    <label className="block font-mono-matrix text-xs text-[rgba(176,255,176,0.45)] tracking-widest mb-2">CATEGORY</label>
                    <select value={form.category} onChange={(e) => setForm((p: any) => ({ ...p, category: e.target.value }))} className="admin-input">
                      <option value="core" className="bg-[#050f05]">Core Team</option>
                      <option value="subteam" className="bg-[#050f05]">Sub Team / Volunteers</option>
                    </select>
                  </div>
                  <Field label="Display Order" field="order" type="number" />
                  <div className="flex items-center gap-3">
                    <label className="font-mono-matrix text-xs text-[rgba(176,255,176,0.45)] tracking-widest">ACTIVE</label>
                    <button type="button" onClick={() => setForm((p: any) => ({ ...p, isActive: !p.isActive }))}>
                      {form.isActive ? <ToggleRight className="w-7 h-7 text-[#00ff41]" /> : <ToggleLeft className="w-7 h-7 text-[rgba(176,255,176,0.25)]" />}
                    </button>
                  </div>
                  <button onClick={save} disabled={saving} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" /> {saving ? "SAVING..." : editMember ? "UPDATE" : "ADD MEMBER"}
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
