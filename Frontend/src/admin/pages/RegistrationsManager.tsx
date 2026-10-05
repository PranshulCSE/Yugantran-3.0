import { useEffect, useState } from "react";
import { adminApi } from "../../lib/api";
import {
  Download,
  Eye,
  Check,
  X,
  RefreshCw,
  Search,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
  Users,
  Building2,
  Hash,
  Phone,
  Calendar,
  ExternalLink,
  ChevronRight,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string; dotColor: string }> = {
  pending: {
    label: "Pending",
    badgeClass: "bg-amber-950/70 border-amber-500/40 text-amber-300",
    dotColor: "bg-amber-400",
  },
  confirmed: {
    label: "Confirmed",
    badgeClass: "bg-emerald-950/70 border-emerald-500/40 text-emerald-300",
    dotColor: "bg-emerald-400",
  },
  rejected: {
    label: "Rejected",
    badgeClass: "bg-rose-950/70 border-rose-500/40 text-rose-300",
    dotColor: "bg-rose-400",
  },
};

export default function RegistrationsManager() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ event: "", status: "" });
  const [updating, setUpdating] = useState<string | null>(null);
  const [syncingAll, setSyncingAll] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
  const [selectedReg, setSelectedReg] = useState<any | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const showNotification = (message: string, type: "success" | "error" | "info" = "info") => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 6000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getRegistrations(filter);
      setRegistrations(res.data.registrations || []);
      setTotal(res.data.total || 0);
    } catch (e) {
      console.error(e);
      showNotification("Failed to fetch registrations.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res = await adminApi.updateRegistration(id, { status, forceSync: true });
      const updatedData = res.data;

      setRegistrations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, ...updatedData, status } : r))
      );

      if (selectedReg?._id === id) {
        setSelectedReg((prev: any) => (prev ? { ...prev, ...updatedData, status } : null));
      }

      if (status === "confirmed") {
        const sheetMsg = updatedData?.sheetResult?.success
          ? `G Sheet: Added to "${updatedData.sheetResult.sheetTitle}"`
          : updatedData?.sheetResult?.error
          ? `G Sheet Error: ${updatedData.sheetResult.error}`
          : "";
        const emailMsg = updatedData?.emailResult?.success
          ? `Email sent via ${
              updatedData.emailResult.provider === "gmail"
                ? "Gmail"
                : updatedData.emailResult.provider || "Gmail"
            }`
          : updatedData?.emailResult?.error
          ? `Email Error: ${updatedData.emailResult.error}`
          : "";

        const details = [sheetMsg, emailMsg].filter(Boolean).join(" | ");
        showNotification(`✅ Registration confirmed! ${details}`, "success");
      } else {
        showNotification(`Registration marked as ${status}.`, "info");
      }
    } catch (e: any) {
      console.error(e);
      showNotification(e.response?.data?.error || "Failed to update registration status.", "error");
    } finally {
      setUpdating(null);
    }
  };

  const sendManualEmail = async (id: string, name: string) => {
    setSendingEmailId(id);
    try {
      const res = await adminApi.sendConfirmationEmail(id);
      showNotification(res.data.message || `Confirmation email sent to ${name}!`, "success");
      const updatedTimestamp = new Date().toISOString();
      setRegistrations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, emailSentAt: updatedTimestamp } : r))
      );
      if (selectedReg?._id === id) {
        setSelectedReg((prev: any) => (prev ? { ...prev, emailSentAt: updatedTimestamp } : null));
      }
    } catch (e: any) {
      console.error(e);
      showNotification(e.response?.data?.error || "Failed to send confirmation email.", "error");
    } finally {
      setSendingEmailId(null);
    }
  };

  const syncSingleToSheet = async (id: string) => {
    setSyncingId(id);
    try {
      const res = await adminApi.syncRegistrationToSheet(id);
      showNotification(res.data.message || "Synced to Google Sheet successfully!", "success");
      const updatedTimestamp = new Date().toISOString();
      setRegistrations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, sheetSyncedAt: updatedTimestamp } : r))
      );
      if (selectedReg?._id === id) {
        setSelectedReg((prev: any) => (prev ? { ...prev, sheetSyncedAt: updatedTimestamp } : null));
      }
    } catch (e: any) {
      console.error(e);
      showNotification(e.response?.data?.error || "Failed to sync to Google Sheet.", "error");
    } finally {
      setSyncingId(null);
    }
  };

  const syncAllConfirmedToSheets = async () => {
    if (!window.confirm("Do you want to sync all confirmed registrations to Google Sheets now?"))
      return;
    setSyncingAll(true);
    try {
      const res = await adminApi.syncAllToSheets();
      showNotification(
        res.data.message || "All confirmed registrations synced to Google Sheets!",
        "success"
      );
      fetchData();
    } catch (e: any) {
      console.error(e);
      showNotification(e.response?.data?.error || "Failed to sync all registrations.", "error");
    } finally {
      setSyncingAll(false);
    }
  };

  const exportCSV = async () => {
    try {
      const res = await adminApi.exportRegistrations(filter);
      const url = URL.createObjectURL(new Blob([res.data], { type: "text/csv" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `yugantran_registrations_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      showNotification("Failed to export CSV.", "error");
    }
  };

  const statusCounts = {
    all: total,
    pending: registrations.filter((r) => r.status === "pending").length,
    confirmed: registrations.filter((r) => r.status === "confirmed").length,
    rejected: registrations.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="space-y-3 max-w-full">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-800/70">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="font-orbitron font-black text-base sm:text-lg text-white tracking-wide flex items-center gap-2">
              <span>REGISTRATIONS & AUDIT</span>
            </h1>
            <p className="text-slate-400 font-space text-[11px]">
              {total} total participant records logged across all competitions.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={fetchData}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 text-xs font-space flex items-center gap-1.5 transition-colors"
            title="Reload registration list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={syncAllConfirmedToSheets}
            disabled={syncingAll}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
            title="Push all confirmed registrations to Google Sheets"
          >
            {syncingAll ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-3.5 h-3.5" />
            )}
            <span>{syncingAll ? "Syncing..." : "Sync All G Sheets"}</span>
          </button>

          <button
            onClick={exportCSV}
            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-cyan-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-2.5 px-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-space transition-all ${
            notification.type === "success"
              ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-200"
              : notification.type === "error"
              ? "bg-rose-950/80 border-rose-500/50 text-rose-200"
              : "bg-cyan-950/80 border-cyan-500/50 text-cyan-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span className="truncate">{notification.message}</span>
        </div>
      )}

      {/* Filter and Search Bar (Unified & Compact) */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-[#071329]/80 border border-slate-800/80">
        {/* Status Chips */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
          {[
            { key: "", label: "All" },
            { key: "pending", label: "Pending" },
            { key: "confirmed", label: "Confirmed" },
            { key: "rejected", label: "Rejected" },
          ].map((tab) => {
            const isSel = filter.status === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter((f) => ({ ...f, status: tab.key }))}
                className={`px-2.5 py-1 rounded-lg text-xs font-space font-semibold tracking-wide transition-all ${
                  isSel
                    ? "bg-cyan-500/20 border border-cyan-400/40 text-cyan-300"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search & Event Filter */}
        <div className="flex items-center gap-2 flex-1 sm:flex-none justify-end">
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              className="admin-input pl-8 py-1 text-xs"
              placeholder="Filter by event..."
              value={filter.event}
              onChange={(e) => setFilter((f) => ({ ...f, event: e.target.value }))}
            />
            {filter.event && (
              <button
                onClick={() => setFilter((f) => ({ ...f, event: "" }))}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-xl overflow-hidden border border-slate-800/80 bg-[#071329]/80 shadow-lg">
        <div className="overflow-x-auto max-h-[calc(100vh-230px)]">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-7 h-7 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <table className="data-table min-w-full">
              <thead>
                <tr>
                  <th className="w-10 text-center">#</th>
                  <th>Participant</th>
                  <th>Event & Team</th>
                  <th>University / College</th>
                  <th>Contact</th>
                  <th>Txn ID</th>
                  <th>Status</th>
                  <th>G Sheets</th>
                  <th>Email</th>
                  <th>Proof</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((r, i) => (
                  <tr
                    key={r._id}
                    onClick={() => setSelectedReg(r)}
                    className="cursor-pointer group"
                  >
                    <td className="font-mono-matrix text-[11px] text-slate-500 text-center">
                      {i + 1}
                    </td>
                    <td>
                      <div className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                        {r.name}
                      </div>
                      <div className="text-[10px] text-cyan-400/80 font-mono-matrix">
                        {r.rollNumber} {r.program ? `• ${r.program}` : ""}
                      </div>
                    </td>
                    <td>
                      <div className="font-semibold text-slate-200 text-xs">{r.eventName}</div>
                      <div className="text-[10px] text-slate-400 font-space">
                        {r.teamType === "team" ? (
                          <span className="text-cyan-400">Team: {r.teamName || "Squad"}</span>
                        ) : (
                          "Solo"
                        )}
                      </div>
                    </td>
                    <td className="text-[11px] text-slate-300 max-w-[130px] truncate" title={r.college}>
                      {r.college}
                    </td>
                    <td className="font-mono-matrix text-[11px] text-slate-300">
                      {r.mobileNumber}
                    </td>
                    <td
                      className="font-mono-matrix text-[11px] text-slate-400 max-w-[110px] truncate"
                      title={r.transactionId}
                    >
                      {r.transactionId}
                    </td>
                    <td>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-orbitron font-bold px-2 py-0.5 rounded border ${
                          STATUS_CONFIG[r.status]?.badgeClass || "bg-slate-900 border-slate-700 text-slate-400"
                        }`}
                      >
                        <span
                          className={`w-1 h-1 rounded-full ${
                            STATUS_CONFIG[r.status]?.dotColor || "bg-slate-400"
                          }`}
                        />
                        {r.status?.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {r.sheetSyncedAt ? (
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-mono-matrix text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30"
                          title={`Synced at ${new Date(r.sheetSyncedAt).toLocaleString()}`}
                        >
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Synced</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono-matrix text-slate-500">
                          {r.status === "confirmed" ? "Pending" : "—"}
                        </span>
                      )}
                    </td>
                    <td>
                      {r.emailSentAt ? (
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-mono-matrix text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30"
                          title={`Email sent at ${new Date(r.emailSentAt).toLocaleString()}`}
                        >
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Sent</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono-matrix text-slate-500">
                          {r.status === "confirmed" ? "Not sent" : "—"}
                        </span>
                      )}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      {r.paymentReceiptUrl || r._id ? (
                        <a
                          href={(() => {
                            const backendBase = (
                              import.meta.env.VITE_BACKEND_URL || "http://localhost:5005"
                            ).replace(/\/+$/, "");
                            if (
                              r.paymentReceiptUrl &&
                              r.paymentReceiptUrl.startsWith("http") &&
                              !r.paymentReceiptUrl.includes("/uploads/") &&
                              !r.paymentReceiptUrl.includes("/api/registrations/receipt/")
                            ) {
                              return r.paymentReceiptUrl;
                            }
                            return `${backendBase}/api/registrations/receipt/${r._id}`;
                          })()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 text-[10px] font-space transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Proof</span>
                        </a>
                      ) : (
                        <span className="text-slate-600 text-xs">—</span>
                      )}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {r.status !== "confirmed" && (
                          <button
                            onClick={() => updateStatus(r._id, "confirmed")}
                            disabled={updating === r._id}
                            title="Confirm, Send Gmail & Sync to G Sheet"
                            className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-colors disabled:opacity-50"
                          >
                            {updating === r._id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                          </button>
                        )}
                        {r.status === "confirmed" && (
                          <>
                            <button
                              onClick={() => sendManualEmail(r._id, r.name)}
                              disabled={sendingEmailId === r._id}
                              title="Resend Confirmation Email via Gmail"
                              className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-colors disabled:opacity-50"
                            >
                              {sendingEmailId === r._id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Mail className="w-3 h-3" />
                              )}
                            </button>
                            <button
                              onClick={() => syncSingleToSheet(r._id)}
                              disabled={syncingId === r._id}
                              title="Force Push / Re-sync to Event Google Sheet"
                              className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-colors disabled:opacity-50"
                            >
                              {syncingId === r._id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <FileSpreadsheet className="w-3 h-3" />
                              )}
                            </button>
                          </>
                        )}
                        {r.status !== "rejected" && (
                          <button
                            onClick={() => updateStatus(r._id, "rejected")}
                            disabled={updating === r._id}
                            title="Reject Registration"
                            className="p-1.5 rounded-lg bg-rose-950 border border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors disabled:opacity-50"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {!registrations.length && !loading && (
                  <tr>
                    <td colSpan={11} className="text-center text-slate-500 py-8 text-xs font-space">
                      No registrations matched your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Slide-Over / Modal Detail Drawer */}
      <AnimatePresence>
        {selectedReg && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="w-full max-w-lg bg-[#060e22] border-l border-cyan-500/20 h-full flex flex-col justify-between shadow-2xl overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between sticky top-0 z-10">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-orbitron font-bold text-sm text-white truncate">
                      {selectedReg.name}
                    </h3>
                    <span
                      className={`text-[9px] font-orbitron font-bold px-1.5 py-0.5 rounded border ${
                        STATUS_CONFIG[selectedReg.status]?.badgeClass
                      }`}
                    >
                      {selectedReg.status?.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono-matrix text-cyan-400">
                    {selectedReg.rollNumber} • {selectedReg.eventName}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedReg(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-4 space-y-4 text-xs font-space flex-1">
                {/* Academic & Contact Section */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                  <div className="font-orbitron font-bold text-[10px] text-cyan-400 uppercase tracking-wider">
                    Participant Intel
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Program/Branch:</span>
                      <span className="text-slate-200 font-semibold">{selectedReg.program || "-"}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Semester:</span>
                      <span className="text-slate-200 font-semibold">{selectedReg.semester || "-"}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Phone / WhatsApp:</span>
                      <a
                        href={`tel:${selectedReg.mobileNumber}`}
                        className="text-cyan-300 font-mono-matrix hover:underline"
                      >
                        {selectedReg.mobileNumber}
                      </a>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Email:</span>
                      <a
                        href={`mailto:${selectedReg.email}`}
                        className="text-cyan-300 font-mono-matrix hover:underline truncate block"
                      >
                        {selectedReg.email}
                      </a>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 block">College / University:</span>
                      <span className="text-slate-200">{selectedReg.college}</span>
                    </div>
                  </div>
                </div>

                {/* Team Info Section */}
                {selectedReg.teamType === "team" && (
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-orbitron font-bold text-[10px] text-cyan-400 uppercase tracking-wider">
                        Squad / Team Details
                      </span>
                      <span className="text-xs text-slate-300 font-bold">
                        {selectedReg.teamName || "Team"}
                      </span>
                    </div>

                    {selectedReg.teamMembers && selectedReg.teamMembers.length > 0 ? (
                      <div className="space-y-1.5 pt-1">
                        {selectedReg.teamMembers.map((m: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 flex items-center justify-between text-[11px]"
                          >
                            <div>
                              <span className="font-semibold text-slate-200">{m.name || "N/A"}</span>
                              <span className="text-slate-500 ml-1.5 font-mono-matrix">
                                ({m.rollNumber || "-"})
                              </span>
                            </div>
                            <span className="text-cyan-400 text-[10px]">{m.program || "-"}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 text-[11px]">No additional teammates listed.</p>
                    )}
                  </div>
                )}

                {/* Payment & Proof Section */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2.5">
                  <div className="font-orbitron font-bold text-[10px] text-cyan-400 uppercase tracking-wider">
                    Payment Verification
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">UPI ID / UTR:</span>
                      <span className="text-slate-200 font-mono-matrix">{selectedReg.upiId}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Transaction ID:</span>
                      <span className="text-cyan-300 font-mono-matrix font-bold">
                        {selectedReg.transactionId}
                      </span>
                    </div>
                  </div>

                  {/* Receipt Preview */}
                  {selectedReg.paymentReceiptUrl || selectedReg._id ? (
                    <div className="mt-2 space-y-1.5">
                      <span className="text-slate-400 text-[10px] block">Uploaded Payment Receipt:</span>
                      <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 max-h-48 flex items-center justify-center">
                        <img
                          src={(() => {
                            const backendBase = (
                              import.meta.env.VITE_BACKEND_URL || "http://localhost:5005"
                            ).replace(/\/+$/, "");
                            if (
                              selectedReg.paymentReceiptUrl &&
                              selectedReg.paymentReceiptUrl.startsWith("http") &&
                              !selectedReg.paymentReceiptUrl.includes("/uploads/") &&
                              !selectedReg.paymentReceiptUrl.includes("/api/registrations/receipt/")
                            ) {
                              return selectedReg.paymentReceiptUrl;
                            }
                            return `${backendBase}/api/registrations/receipt/${selectedReg._id}`;
                          })()}
                          alt="Receipt"
                          className="max-h-48 object-contain"
                        />
                      </div>
                      <a
                        href={(() => {
                          const backendBase = (
                            import.meta.env.VITE_BACKEND_URL || "http://localhost:5005"
                          ).replace(/\/+$/, "");
                          if (
                            selectedReg.paymentReceiptUrl &&
                            selectedReg.paymentReceiptUrl.startsWith("http") &&
                            !selectedReg.paymentReceiptUrl.includes("/uploads/") &&
                            !selectedReg.paymentReceiptUrl.includes("/api/registrations/receipt/")
                          ) {
                            return selectedReg.paymentReceiptUrl;
                          }
                          return `${backendBase}/api/registrations/receipt/${selectedReg._id}`;
                        })()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> Open full receipt in new tab
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 flex items-center justify-between gap-2 sticky bottom-0">
                {selectedReg.status !== "confirmed" ? (
                  <button
                    onClick={() => updateStatus(selectedReg._id, "confirmed")}
                    disabled={updating === selectedReg._id}
                    className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    {updating === selectedReg._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>Confirm & Send Gmail</span>
                  </button>
                ) : (
                  <button
                    onClick={() => sendManualEmail(selectedReg._id, selectedReg.name)}
                    disabled={sendingEmailId === selectedReg._id}
                    className="flex-1 py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    {sendingEmailId === selectedReg._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Mail className="w-3.5 h-3.5" />
                    )}
                    <span>Resend Confirmation Email</span>
                  </button>
                )}

                {selectedReg.status !== "rejected" && (
                  <button
                    onClick={() => updateStatus(selectedReg._id, "rejected")}
                    disabled={updating === selectedReg._id}
                    className="py-2 px-3 rounded-lg bg-rose-950 border border-rose-500/40 text-rose-400 hover:bg-rose-600 hover:text-white font-semibold text-xs transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
