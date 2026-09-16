import { useEffect, useState } from "react";
import { adminApi } from "../../lib/api";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Edit2, Trash2, X, Save, User, ToggleLeft, ToggleRight, Sparkles } from "lucide-react";

const EMPTY = {
  name: "",
  role: "",
  department: "SCSE",
  image: "",
  linkedin: "",
  category: "core",
  order: 0,
  isActive: true,
};

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
    try {
      const r = await adminApi.getAllTeam();
      setMembers(r.data);
    } catch {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const openCreate = () => {
    setEditMember(null);
    setForm({ ...EMPTY });
    setShowPanel(true);
  };
  const openEdit = (m: any) => {
    setEditMember(m);
    setForm({ ...m });
    setShowPanel(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      if (editMember) await adminApi.updateTeamMember(editMember._id, form);
      else await adminApi.createTeamMember(form);
      setShowPanel(false);
      fetch();
    } catch (e: any) {
      alert(e.response?.data?.error || "Save operation failed.");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    try {
      await adminApi.deleteTeamMember(id);
      setDeleteId(null);
      fetch();
    } catch {}
  };

  const filtered =
    filter === "all" ? members : members.filter((m) => m.category === filter);

  const Field = ({ label, field, type = "text" }: any) => (
    <div>
      <label className="block font-space text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
        {label}
      </label>
      <input
        type={type}
        value={form[field] ?? ""}
        onChange={(e) =>
          setForm((p: any) => ({
            ...p,
            [field]: type === "number" ? Number(e.target.value) : e.target.value,
          }))
        }
        className="admin-input"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-orbitron font-black text-2xl sm:text-3xl text-white tracking-wider">
            ORGANIZING CREW & VOLUNTEERS
          </h1>
          <p className="text-slate-400 font-space text-sm mt-1">
            {members.length} leaders & crew members listed in the directory.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="btn-primary text-xs py-3 px-6 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {["all", "core", "subteam"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2.5 rounded-full font-space text-xs font-bold tracking-wider border transition-all ${
              filter === cat
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 border-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(0,242,254,0.3)]"
                : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white"
            }`}
          >
            {cat === "all" ? "ALL MEMBERS" : cat === "core" ? "CORE TEAM" : "VOLUNTEERS"}
          </button>
        ))}
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
                <th>Avatar</th>
                <th>Member Name</th>
                <th>Role / Designation</th>
                <th>Dept</th>
                <th>Squad Type</th>
                <th>Order</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m._id}>
                  <td>
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-cyan-500/30 flex items-center justify-center">
                      {m.image ? (
                        <img
                          src={m.image}
                          alt={m.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-cyan-400/40" />
                      )}
                    </div>
                  </td>
                  <td className="font-bold text-white">{m.name}</td>
                  <td className="text-sm text-cyan-300 font-space">{m.role}</td>
                  <td className="font-mono-matrix text-xs text-slate-400">{m.department}</td>
                  <td>
                    <span className="font-space text-xs px-2.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/60 text-cyan-300">
                      {m.category === "core" ? "CORE LEAD" : "VOLUNTEER"}
                    </span>
                  </td>
                  <td className="font-mono-matrix text-xs text-slate-400">{m.order}</td>
                  <td>
                    <span className={m.isActive ? "text-emerald-400" : "text-slate-600"}>
                      {m.isActive ? "● LIVE" : "○ OFF"}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(m)}
                        className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(m._id)}
                        className="p-2 rounded-xl bg-rose-950 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={8} className="text-center text-slate-500 py-10">
                    No members found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Modal */}
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
                REMOVE MEMBER?
              </h3>
              <p className="text-slate-300 text-sm font-space mb-6">
                Are you sure you want to remove this member from the website?
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setDeleteId(null)} className="btn-outline text-xs py-2.5 px-5">
                  CANCEL
                </button>
                <button
                  onClick={() => del(deleteId)}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 text-white font-orbitron font-bold text-xs hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/30"
                >
                  REMOVE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide Panel */}
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
              className="w-full max-w-lg bg-[#060e22] border-l border-cyan-500/30 h-full overflow-y-auto shadow-2xl"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
                  <h2 className="font-orbitron font-black text-xl text-white tracking-wider flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <span>{editMember ? "EDIT MEMBER INTEL" : "ADD NEW MEMBER"}</span>
                  </h2>

                  <button
                    onClick={() => setShowPanel(false)}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-5">
                  <Field label="Full Name" field="name" />
                  <Field label="Role / Title (e.g. Lead Organizer)" field="role" />
                  <Field label="Department / Batch" field="department" />
                  <Field label="Profile Image Path / URL" field="image" />
                  <Field label="LinkedIn Profile URL" field="linkedin" />

                  <div>
                    <label className="block font-space text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      SQUAD CATEGORY
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm((p: any) => ({ ...p, category: e.target.value }))}
                      className="admin-input"
                    >
                      <option value="core">Core Organizing Committee</option>
                      <option value="subteam">Student Volunteer</option>
                    </select>
                  </div>

                  <Field label="Display Sequence Order" field="order" type="number" />

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
                      {form.isActive ? "ACTIVE" : "HIDDEN"}
                    </span>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={save}
                      disabled={saving}
                      className="btn-primary w-full py-4 text-sm justify-center shadow-cyan-500/40"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saving ? "SAVING..." : editMember ? "UPDATE MEMBER" : "ADD MEMBER"}</span>
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
