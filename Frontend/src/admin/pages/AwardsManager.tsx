import { useEffect, useState, useMemo } from "react";
import { adminApi } from "../../lib/api";
import { toast } from "sonner";
import { Award } from "../../types";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, Edit2, Trash2, X, Save, ToggleLeft, ToggleRight,
  Trophy, Bot, Shield, Code, Palette, Rocket, Star, Medal, Award as AwardIcon,
  Search, Sparkles, Check
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Trophy, Bot, Shield, Code, Palette, Rocket, Star, Medal, Award: AwardIcon,
};
const ICON_NAMES = Object.keys(ICON_MAP);

const COLOR_PRESETS = [
  { name: "Cyan Matrix", value: "#00f2fe" },
  { name: "Neon Emerald", value: "#10b981" },
  { name: "Amber Gold", value: "#f59e0b" },
  { name: "Electric Purple", value: "#a855f7" },
  { name: "Rose Neon", value: "#f43f5e" },
  { name: "Cyber Blue", value: "#3b82f6" },
];

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

export default function AwardsManager() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [editAward, setEditAward] = useState<Partial<Award> | null>(null);
  const [form, setForm] = useState<Partial<Award>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const updateField = (field: keyof Award, val: unknown) => {
    setForm((p) => ({ ...p, [field]: val }));
  };

  const fetchAwards = async () => {
    setLoading(true);
    try {
      const r = await adminApi.getAllAwards();
      setAwards(r.data);
    } catch (err) {
      toast.error("Failed to fetch awards");
    } finally {
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

  const openEdit = (a: Award) => {
    setEditAward(a);
    setForm({ ...a });
    setShowPanel(true);
  };

  const save = async () => {
    if (!form.title?.trim()) {
      toast.error("Please enter an award title.");
      return;
    }
    setSaving(true);
    try {
      if (editAward?._id) await adminApi.updateAward(editAward._id, form);
      else await adminApi.createAward(form);
      setShowPanel(false);
      fetchAwards();
      toast.success("Award saved successfully");
    } catch (e: unknown) {
      toast.error(e.response?.data?.error || "Save operation failed.");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (a: Award) => {
    try {
      await adminApi.updateAward(a._id, { isActive: !a.isActive });
      setAwards((prev) =>
        prev.map((item) => (item._id === a._id ? { ...item, isActive: !item.isActive } : item))
      );
      toast.success("Award status updated");
    } catch (err) {
      toast.error("Failed to toggle status");
    }
  };

  const del = async (id: string) => {
    try {
      await adminApi.deleteAward(id);
      setDeleteId(null);
      fetchAwards();
      toast.success("Award deleted");
    } catch (err) {
      toast.error("Failed to delete award");
    }
  };

  const filteredAwards = useMemo(() => {
    return awards.filter((a) => {
      return (
        !searchQuery ||
        a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.prize?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [awards, searchQuery]);

  // @ts-ignore
  const SelectedIcon = ICON_MAP[form.icon] || Trophy;

  return (
    <div className="space-y-4">
      {/* 1. Header & Summary Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3.5 sm:p-4 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-orbitron font-bold text-lg sm:text-xl text-white tracking-wide">
              AWARDS & PRIZE TIERS
            </h1>
            <span className="text-[11px] font-mono-matrix px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 font-semibold">
              {awards.length} AWARDS
            </span>
          </div>
          <p className="text-slate-400 font-space text-xs mt-0.5">
            Configure trophy titles, cash prizes, medal tiers, and festival honors.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={openCreate}
            className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-cyan-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Award Tier</span>
          </button>
        </div>
      </div>

      {/* 2. Compact Search */}
      <div className="flex items-center justify-between gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by award title, subtitle or bounty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/70 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>
        <div className="text-xs font-mono-matrix text-slate-400 pr-2">
          {filteredAwards.length} displayed
        </div>
      </div>

      {/* 3. High-Density Table */}
      <div className="glass rounded-xl overflow-hidden border border-slate-800/90 shadow-xl">
        <div className="overflow-x-auto max-h-[calc(100vh-290px)] min-h-[300px]">
          {loading ? (
            <div className="flex justify-center h-48 items-center">
              <div className="w-7 h-7 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredAwards.length === 0 ? (
            <div className="text-center py-16 text-slate-500 font-space text-xs">
              No awards configured yet.
            </div>
          ) : (
            <table className="data-table min-w-full">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className="w-12 text-center">#</th>
                  <th>Award Title & Subtitle</th>
                  <th>Bounty / Prize</th>
                  <th>Accent Color</th>
                  <th>Description</th>
                  <th className="text-center">Live</th>
                  <th className="text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAwards.map((a, i) => {
                  const IconComp = ICON_MAP[a.icon] || Trophy;
                  return (
                    <tr key={a._id} className="hover:bg-cyan-950/15 transition-colors group">
                      <td className="text-center font-mono-matrix text-slate-500 text-[11px]">
                        {a.order ?? i + 1}
                      </td>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: `${a.color || "#00f2fe"}15`,
                              borderColor: `${a.color || "#00f2fe"}40`,
                              borderWidth: "1px",
                              color: a.color || "#00f2fe",
                            }}
                          >
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-white text-xs truncate max-w-[200px] group-hover:text-cyan-300 transition-colors">
                              {a.title}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                              {a.subtitle || "No subtitle"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="font-orbitron font-bold text-xs text-amber-300 flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-amber-400 flex-shrink-0" />
                          <span>{a.prize || "Trophy"}</span>
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-3 h-3 rounded-full border border-white/20"
                            style={{ backgroundColor: a.color || "#00f2fe" }}
                          />
                          <span className="font-mono-matrix text-[11px] text-slate-400">
                            {a.color || "#00f2fe"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="text-[11px] text-slate-400 truncate max-w-[250px] font-space">
                          {a.desc || "—"}
                        </div>
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => toggle(a)}
                          title={a.isActive ? "Click to disable" : "Click to enable"}
                          className="hover:scale-105 transition-transform"
                        >
                          {a.isActive ? (
                            <ToggleRight className="w-5 h-5 text-cyan-400" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-slate-600" />
                          )}
                        </button>
                      </td>
                      <td className="text-right pr-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(a)}
                            className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-all"
                            title="Edit Award"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setDeleteId(a._id)}
                            className="p-1.5 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                            title="Delete Award"
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
              className="bg-slate-950 border border-rose-500/40 p-6 rounded-2xl max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-orbitron font-bold text-base text-white mb-1">
                DELETE AWARD TIER?
              </h3>
              <p className="text-slate-400 text-xs font-space mb-5">
                This will remove this award from the festival website prize showcase.
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
              className="w-full max-w-md bg-[#070e1f] border-l border-cyan-500/30 h-full flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-slate-800/90 flex items-center justify-between bg-slate-950/70">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: `${form.color || "#00f2fe"}20`,
                      borderColor: `${form.color || "#00f2fe"}50`,
                      borderWidth: "1px",
                      color: form.color || "#00f2fe",
                    }}
                  >
                    <SelectedIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-orbitron font-bold text-sm sm:text-base text-white tracking-wide">
                      {editAward ? "EDIT AWARD TIER" : "ADD NEW AWARD"}
                    </h2>
                    <p className="text-[11px] text-slate-400 font-space">
                      {editAward ? `Updating: ${editAward.title}` : "Configure trophy and bounty details"}
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

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
                {/* Live Preview Card */}
                <div
                  className="p-3.5 rounded-xl bg-slate-900/90 border flex items-center gap-3"
                  style={{ borderColor: `${form.color || "#00f2fe"}40` }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: `${form.color || "#00f2fe"}20`,
                      color: form.color || "#00f2fe",
                    }}
                  >
                    <SelectedIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-white text-xs truncate">
                      {form.title || "Award Title"}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {form.subtitle || "Award Subtitle / Category"}
                    </div>
                    <div className="text-[11px] font-orbitron font-bold text-amber-300 mt-0.5">
                      {form.prize || "₹0 + Trophy"}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-space font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Award Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GRAND CHAMPION"
                    value={form.title || ""}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="admin-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-space font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Subtitle / Category
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Overall Fest Winner"
                      value={form.subtitle || ""}
                      onChange={(e) => updateField("subtitle", e.target.value)}
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-space font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Prize Bounty / Amount
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹25,000 + Trophy"
                      value={form.prize || ""}
                      onChange={(e) => updateField("prize", e.target.value)}
                      className="admin-input"
                    />
                  </div>
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-[11px] font-space font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Select Icon
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {ICON_NAMES.map((name) => {
                      const Icon = ICON_MAP[name];
                      const isSelected = form.icon === name;
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => updateField("icon", name)}
                          className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                            isSelected
                              ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-[9px] font-mono-matrix">{name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color Palette */}
                <div>
                  <label className="block text-[11px] font-space font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => updateField("color", preset.value)}
                        className={`w-6 h-6 rounded-full border-2 transition-transform ${
                          form.color === preset.value ? "scale-110 border-white" : "border-transparent"
                        }`}
                        style={{ backgroundColor: preset.value }}
                        title={preset.name}
                      />
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="#00f2fe"
                    value={form.color || "#00f2fe"}
                    onChange={(e) => updateField("color", e.target.value)}
                    className="admin-input font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-space font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Description / Eligibility Summary
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Awarded to the top performing individual or team across all rounds..."
                    value={form.desc || ""}
                    onChange={(e) => updateField("desc", e.target.value)}
                    className="admin-input resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-space font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Display Sequence
                    </label>
                    <input
                      type="number"
                      value={form.order ?? 0}
                      onChange={(e) => updateField("order", Number(e.target.value))}
                      className="admin-input"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[11px] font-semibold text-slate-300">Live State</span>
                      <button
                        type="button"
                        onClick={() => updateField("isActive", !form.isActive)}
                      >
                        {form.isActive ? (
                          <ToggleRight className="w-6 h-6 text-cyan-400" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-slate-600" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
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
                  <span>{saving ? "Saving..." : editAward ? "Update Award" : "Add Award"}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
