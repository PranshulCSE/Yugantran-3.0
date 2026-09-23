import { useEffect, useState } from "react";
import { adminApi } from "../../lib/api";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, Edit2, Trash2, X, Save, ToggleLeft, ToggleRight, Zap,
  Trophy, Bot, Shield, Code, Palette, Rocket, Star, Medal, Award,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Trophy, Bot, Shield, Code, Palette, Rocket, Star, Medal, Award,
};
const ICON_NAMES = Object.keys(ICON_MAP);

const EMPTY = {
  icon: "Trophy",
  title: "",
  subtitle: "",
  desc: "",
  color: "#00f2fe",
  prize: "",
  order: 0,
  isActive: true,
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
          value={value !== undefined ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="admin-input"
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

export default function AwardsManager() {
  const [awards, setAwards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [editAward, setEditAward] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const updateField = (field: string, val: any) => {
    setForm((p: any) => ({ ...p, [field]: val }));
  };

  const fetchAwards = async () => {
    setLoading(true);
    try {
      const r = await adminApi.getAllAwards();
      setAwards(r.data);
    } catch {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAwards();
  }, []);

  const openCreate = () => {
    setEditAward(null);
    setForm({ ...EMPTY });
    setShowPanel(true);
  };
  const openEdit = (a: any) => {
    setEditAward(a);
    setForm({ ...a });
    setShowPanel(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      if (editAward) await adminApi.updateAward(editAward._id, form);
      else await adminApi.createAward(form);
      setShowPanel(false);
      fetchAwards();
    } catch (e: any) {
      alert(e.response?.data?.error || "Save operation failed.");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    try {
      await adminApi.deleteAward(id);
      setDeleteId(null);
      fetchAwards();
    } catch {}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-orbitron font-black text-2xl sm:text-3xl text-white tracking-wider">
            AWARDS & PRIZES
          </h1>
          <p className="text-slate-400 font-space text-sm mt-1">
            {awards.length} awards live on the public Awards section.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="btn-primary text-xs py-3 px-6 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Award</span>
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
                <th>Icon</th>
                <th>Title</th>
                <th>Subtitle</th>
                <th>Prize</th>
                <th>Order</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {awards.map((a) => {
                const Icon = ICON_MAP[a.icon] || Trophy;
                return (
                  <tr key={a._id}>
                    <td>
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center border"
                        style={{ background: `${a.color}15`, borderColor: `${a.color}35` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: a.color }} />
                      </div>
                    </td>
                    <td className="font-bold text-white">{a.title}</td>
                    <td className="text-sm text-cyan-300 font-space">{a.subtitle}</td>
                    <td className="font-mono-matrix text-xs text-slate-400">{a.prize}</td>
                    <td className="font-mono-matrix text-xs text-slate-400">{a.order}</td>
                    <td>
                      <span className={a.isActive ? "text-emerald-400" : "text-slate-600"}>
                        {a.isActive ? "● LIVE" : "○ OFF"}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(a)}
                          className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(a._id)}
                          className="p-2 rounded-xl bg-rose-950 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!awards.length && (
                <tr>
                  <td colSpan={7} className="text-center text-slate-500 py-10">
                    No awards added yet — click "Add Award" to create one.
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
                REMOVE AWARD?
              </h3>
              <p className="text-slate-300 text-sm font-space mb-6">
                This will remove it from the public Awards section immediately.
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
                    <Zap className="w-5 h-5 text-cyan-400" />
                    <span>{editAward ? "EDIT AWARD" : "ADD NEW AWARD"}</span>
                  </h2>

                  <button
                    onClick={() => setShowPanel(false)}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block font-space text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      ICON
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {ICON_NAMES.map((name) => {
                        const IconComp = ICON_MAP[name];
                        const active = form.icon === name;
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => updateField("icon", name)}
                            title={name}
                            className={`p-3 rounded-xl border flex items-center justify-center transition-all ${
                              active
                                ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                            }`}
                          >
                            <IconComp className="w-5 h-5" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <FormField label="Award Title" value={form.title} onChange={(v) => updateField("title", v)} />
                  <FormField label="Subtitle / Track" value={form.subtitle} onChange={(v) => updateField("subtitle", v)} />
                  <FormField label="Description" value={form.desc} onChange={(v) => updateField("desc", v)} textarea />
                  <FormField label="Prize (e.g. ₹8,000 + Trophy)" value={form.prize} onChange={(v) => updateField("prize", v)} />

                  <div>
                    <label className="block font-space text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      ACCENT COLOR
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={form.color || "#00f2fe"}
                        onChange={(e) => updateField("color", e.target.value)}
                        className="w-12 h-10 rounded-lg bg-transparent border border-slate-800 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={form.color || ""}
                        onChange={(e) => updateField("color", e.target.value)}
                        className="admin-input flex-1"
                      />
                    </div>
                  </div>

                  <FormField label="Display Sequence Order" value={form.order} onChange={(v) => updateField("order", v)} type="number" />

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
                      <span>{saving ? "SAVING..." : editAward ? "UPDATE AWARD" : "ADD AWARD"}</span>
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
