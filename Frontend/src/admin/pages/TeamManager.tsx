import { useEffect, useState, useMemo } from "react";
import { adminApi } from "../../lib/api";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, Edit2, Trash2, X, Save, User, ToggleLeft, ToggleRight,
  Search, Linkedin, Mail, ShieldCheck, Sparkles, Image as ImageIcon
} from "lucide-react";

const EMPTY = {
  name: "",
  role: "",
  department: "SCSE",
  image: "",
  linkedin: "",
  email: "",
  category: "core",
  order: 0,
  isActive: true,
};

const DEPARTMENTS = [
  "SCSE",
  "ECE",
  "MECH",
  "CIVIL",
  "MANAGEMENT",
  "DESIGN",
  "ORGANIZING",
  "CREATIVE",
  "TECHNICAL",
  "LOGISTICS",
  "SPONSORSHIP",
  "MEDIA",
];

export default function TeamManager() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [editMember, setEditMember] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const updateField = (field: string, val: any) => {
    setForm((p: any) => ({ ...p, [field]: val }));
  };

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const r = await adminApi.getAllTeam();
      setMembers(r.data);
    } catch (err) {
      console.error("Failed to fetch team members", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
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
    if (!form.name?.trim()) {
      alert("Please enter member's full name.");
      return;
    }
    setSaving(true);
    try {
      if (editMember) await adminApi.updateTeamMember(editMember._id, form);
      else await adminApi.createTeamMember(form);
      setShowPanel(false);
      fetchTeam();
    } catch (e: any) {
      alert(e.response?.data?.error || "Save operation failed.");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (m: any) => {
    try {
      await adminApi.updateTeamMember(m._id, { isActive: !m.isActive });
      setMembers((prev) =>
        prev.map((item) => (item._id === m._id ? { ...item, isActive: !item.isActive } : item))
      );
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  const del = async (id: string) => {
    try {
      await adminApi.deleteTeamMember(id);
      setDeleteId(null);
      fetchTeam();
    } catch (err) {
      console.error("Failed to delete member", err);
    }
  };

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesFilter = filter === "all" || m.category === filter;
      const matchesSearch =
        !searchQuery ||
        m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.department?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [members, filter, searchQuery]);

  // Summary Metrics
  const coreCount = useMemo(() => members.filter((m) => m.category === "core").length, [members]);
  const volunteerCount = useMemo(() => members.filter((m) => m.category === "subteam").length, [members]);

  return (
    <div className="space-y-4">
      {/* 1. Header & Summary Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3.5 sm:p-4 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-orbitron font-bold text-lg sm:text-xl text-white tracking-wide">
              ORGANIZING CREW & VOLUNTEERS
            </h1>
            <span className="text-[11px] font-mono-matrix px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 font-semibold">
              {members.length} CREW
            </span>
          </div>
          <p className="text-slate-400 font-space text-xs mt-0.5">
            Manage festival core leadership, domain heads, and volunteer personnel.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <div className="px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-cyan-300 text-[11px] font-mono-matrix">
              {coreCount} Core Leads
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-500/20 text-purple-300 text-[11px] font-mono-matrix">
              {volunteerCount} Volunteers
            </div>
          </div>

          <button
            onClick={openCreate}
            className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-cyan-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* 2. Compact Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, role or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/70 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5">
          {[
            { id: "all", label: `All (${members.length})` },
            { id: "core", label: `Core Team (${coreCount})` },
            { id: "subteam", label: `Volunteers (${volunteerCount})` },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-3 py-1 rounded-lg text-[11px] font-space font-semibold whitespace-nowrap transition-all ${
                filter === cat.id
                  ? "bg-cyan-500 text-slate-950 shadow-sm"
                  : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. High-Density Table */}
      <div className="glass rounded-xl overflow-hidden border border-slate-800/90 shadow-xl">
        <div className="overflow-x-auto max-h-[calc(100vh-290px)] min-h-[300px]">
          {loading ? (
            <div className="flex justify-center h-48 items-center">
              <div className="w-7 h-7 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-16 text-slate-500 font-space text-xs">
              No team members found.
            </div>
          ) : (
            <table className="data-table min-w-full">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className="w-12 text-center">#</th>
                  <th>Member Profile</th>
                  <th>Role / Designation</th>
                  <th>Department</th>
                  <th>Category</th>
                  <th>Social Contacts</th>
                  <th className="text-center">Live</th>
                  <th className="text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((m, i) => (
                  <tr key={m._id} className="hover:bg-cyan-950/15 transition-colors group">
                    <td className="text-center font-mono-matrix text-slate-500 text-[11px]">
                      {m.order ?? i + 1}
                    </td>
                    <td>
                      <div className="flex items-center gap-2.5">
                        {m.image ? (
                          <img
                            src={m.image}
                            alt={m.name}
                            className="w-8 h-8 rounded-lg object-cover border border-cyan-500/30 flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 flex-shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-white text-xs truncate max-w-[180px] group-hover:text-cyan-300 transition-colors">
                            {m.name}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                            {m.email || "No email"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="font-space text-xs font-semibold text-cyan-300">
                        {m.role || "Crew Member"}
                      </span>
                    </td>
                    <td>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono-matrix bg-slate-800/90 text-slate-300 border border-slate-700">
                        {m.department || "SCSE"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-space font-semibold ${
                          m.category === "core"
                            ? "bg-cyan-950/70 text-cyan-300 border border-cyan-500/30"
                            : "bg-purple-950/70 text-purple-300 border border-purple-500/30"
                        }`}
                      >
                        {m.category === "core" ? "Core Lead" : "Volunteer"}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        {m.linkedin && (
                          <a
                            href={m.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 rounded bg-slate-900 border border-slate-800 text-blue-400 hover:text-white transition-colors"
                            title="LinkedIn Profile"
                          >
                            <Linkedin className="w-3 h-3" />
                          </a>
                        )}
                        {m.email && (
                          <a
                            href={`mailto:${m.email}`}
                            className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                            title="Send Email"
                          >
                            <Mail className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => toggle(m)}
                        title={m.isActive ? "Click to deactivate" : "Click to activate"}
                        className="hover:scale-105 transition-transform"
                      >
                        {m.isActive ? (
                          <ToggleRight className="w-5 h-5 text-cyan-400" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-slate-600" />
                        )}
                      </button>
                    </td>
                    <td className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(m)}
                          className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-all"
                          title="Edit Member"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setDeleteId(m._id)}
                          className="p-1.5 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                          title="Delete Member"
                        >
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
                REMOVE MEMBER?
              </h3>
              <p className="text-slate-400 text-xs font-space mb-5">
                This will delete this person from the public team directory.
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
                  Confirm Remove
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
                  <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-orbitron font-bold text-sm sm:text-base text-white tracking-wide">
                      {editMember ? "EDIT CREW MEMBER" : "ADD CREW MEMBER"}
                    </h2>
                    <p className="text-[11px] text-slate-400 font-space">
                      {editMember ? `Updating: ${editMember.name}` : "Add leader or volunteer to directory"}
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
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
                  {form.image ? (
                    <img
                      src={form.image}
                      alt={form.name || "Preview"}
                      className="w-12 h-12 rounded-xl object-cover border border-cyan-500/40 shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="font-bold text-white text-xs truncate">
                      {form.name || "Member Name"}
                    </div>
                    <div className="text-[11px] text-cyan-400 font-space truncate">
                      {form.role || "Role / Designation"}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono-matrix">
                      {form.department || "SCSE"} • {form.category === "core" ? "Core Lead" : "Volunteer"}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-space font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Mercer"
                    value={form.name || ""}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="admin-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-space font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Role / Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lead Coordinator"
                      value={form.role || ""}
                      onChange={(e) => updateField("role", e.target.value)}
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-space font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Department
                    </label>
                    <select
                      value={form.department || "SCSE"}
                      onChange={(e) => updateField("department", e.target.value)}
                      className="admin-input"
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-space font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Team Category
                    </label>
                    <select
                      value={form.category || "core"}
                      onChange={(e) => updateField("category", e.target.value)}
                      className="admin-input"
                    >
                      <option value="core">Core Lead</option>
                      <option value="subteam">Volunteer / Crew</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-space font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={form.order ?? 0}
                      onChange={(e) => updateField("order", Number(e.target.value))}
                      className="admin-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-space font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Photo URL (Hosted Image Link)
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={form.image || ""}
                    onChange={(e) => updateField("image", e.target.value)}
                    className="admin-input"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-space font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    LinkedIn Profile Link
                  </label>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/in/..."
                    value={form.linkedin || ""}
                    onChange={(e) => updateField("linkedin", e.target.value)}
                    className="admin-input"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-space font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="alex@domain.com"
                    value={form.email || ""}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="admin-input"
                  />
                </div>

                {/* Active switch */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      Active In Directory
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {form.isActive ? "Shown in public team section" : "Hidden from public"}
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
                  <span>{saving ? "Saving..." : editMember ? "Update Member" : "Add Member"}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
