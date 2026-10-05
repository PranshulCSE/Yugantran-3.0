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
              className="admin-input !pl-8 py-1 text-xs"
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

      {/* 2-Column Mailbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 min-h-[calc(100vh-230px)]">
        
        {/* Left Column (Feed) */}
        <div className="lg:col-span-5 bg-slate-900/40 rounded-xl border border-slate-800/80 overflow-hidden flex flex-col h-[calc(100vh-230px)]">
          <div className="p-3 border-b border-slate-800/60 bg-slate-950/50">
            <h2 className="text-slate-300 font-space font-semibold text-xs tracking-widest">REGISTRATION FEED</h2>
          </div>
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-700/50 p-2 space-y-2">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-7 h-7 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : registrations.length === 0 ? (
              <div className="text-center p-8 text-slate-500 text-xs font-space">
                No registrations matched your criteria.
              </div>
            ) : (
              registrations.map((r, i) => {
                const statusInfo = STATUS_CONFIG[r.status] || STATUS_CONFIG.pending;
                const isSelected = selectedReg?._id === r._id;
                return (
                  <button
                    key={r._id}
                    onClick={() => setSelectedReg(r)}
                    className={`w-full text-left p-3 rounded-lg border transition-all duration-200 block ${
                      isSelected 
                        ? "bg-cyan-950/40 border-cyan-500/50 shadow-[0_0_15px_rgba(0,242,254,0.1)]" 
                        : "bg-slate-900/50 border-slate-800/60 hover:bg-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm font-bold truncate ${isSelected ? "text-cyan-300" : "text-slate-100"}`}>
                        {r.name || "Unknown"}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`} />
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs mt-2">
                      <span className="text-slate-400 font-semibold truncate max-w-[60%]">{r.eventName || "N/A"}</span>
                      <span className="text-slate-500 font-mono-matrix text-[10px] shrink-0">
                        {r.teamType === "team" ? `Team: ${r.teamName || "Squad"}` : "Solo"}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (Inspector) */}
        <div className="lg:col-span-7 bg-[#0a1122] rounded-xl border border-slate-800/80 p-4 lg:p-6 lg:sticky lg:top-4 h-fit lg:h-[calc(100vh-230px)] flex flex-col overflow-hidden shadow-2xl">
          {!selectedReg ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 opacity-60">
              <Eye className="w-12 h-12 mb-4 text-slate-600" />
              <p className="font-space text-sm">Select a registration from the list to begin verification.</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Inspector Header */}
              <div className="flex justify-between items-start border-b border-slate-800 pb-4 mb-4 shrink-0">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedReg.name || "Unknown"}</h2>
                  <div className="flex items-center gap-2 text-sm text-slate-400 font-space">
                    <span className="text-cyan-400 font-semibold">{selectedReg.eventName}</span>
                    <span>•</span>
                    <span>{selectedReg.teamType === "team" ? `Team: ${selectedReg.teamName}` : "Solo"}</span>
                    <span>•</span>
                    <span className="font-mono-matrix text-[11px]">{selectedReg.rollNumber}</span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full border text-xs font-bold shrink-0 ${STATUS_CONFIG[selectedReg.status]?.badgeClass}`}>
                  {STATUS_CONFIG[selectedReg.status]?.label?.toUpperCase()}
                </div>
              </div>

              {/* Inspector Body (Scrollable) */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-700/50">
                
                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-lg border border-slate-800">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Transaction ID</div>
                    <div className="font-mono-matrix text-cyan-300 bg-cyan-950/30 px-2 py-1 rounded inline-block font-bold">
                      {selectedReg.transactionId || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">UPI ID / UTR</div>
                    <div className="text-slate-200 text-xs font-mono-matrix">{selectedReg.upiId || "N/A"}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Contact Number</div>
                    <div className="text-slate-200 text-sm font-mono-matrix">
                      <a href={`tel:${selectedReg.mobileNumber}`} className="hover:text-cyan-300 hover:underline">{selectedReg.mobileNumber || "N/A"}</a>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Email</div>
                    <div className="text-slate-300 text-xs font-mono-matrix truncate">
                       <a href={`mailto:${selectedReg.email}`} className="hover:text-cyan-300 hover:underline">{selectedReg.email || "N/A"}</a>
                    </div>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-800/60 mt-1">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">College / University</div>
                    <div className="text-slate-300 text-sm">{selectedReg.college || "N/A"}</div>
                  </div>
                </div>

                {/* Team Info if Team */}
                {selectedReg.teamType === "team" && selectedReg.teamMembers && selectedReg.teamMembers.length > 0 && (
                  <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-cyan-400 uppercase tracking-wider mb-2 font-bold">Squad Members</div>
                    <div className="space-y-2">
                      {selectedReg.teamMembers.map((m: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-xs bg-slate-950/50 p-2 rounded border border-slate-800/50">
                          <span className="text-slate-200 font-semibold">{m.name}</span>
                          <span className="text-slate-500 font-mono-matrix">{m.rollNumber}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment Proof Button */}
                {(selectedReg.paymentReceiptUrl || selectedReg._id) ? (
                  <a
                    href={(() => {
                      const backendBase = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5005").replace(/\/+$/, "");
                      if (selectedReg.paymentReceiptUrl && selectedReg.paymentReceiptUrl.startsWith("http") && !selectedReg.paymentReceiptUrl.includes("/uploads/") && !selectedReg.paymentReceiptUrl.includes("/api/registrations/receipt/")) {
                        return selectedReg.paymentReceiptUrl;
                      }
                      return `${backendBase}/api/registrations/receipt/${selectedReg._id}`;
                    })()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/50 hover:border-cyan-500/50 rounded-lg p-4 flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-950 p-2 rounded-lg group-hover:bg-cyan-950/30 transition-colors">
                        <FileSpreadsheet className="w-5 h-5 text-cyan-500" />
                      </div>
                      <div>
                        <div className="text-slate-200 font-bold text-sm">View Payment Proof</div>
                        <div className="text-slate-500 text-[10px] uppercase tracking-wider">Opens in new tab</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  </a>
                ) : (
                  <div className="w-full bg-slate-900/40 border border-slate-800 rounded-lg p-4 flex items-center justify-center text-slate-500 text-xs">
                    No payment proof provided
                  </div>
                )}
              </div>

              {/* Action Bar (Footer) */}
              <div className="pt-4 border-t border-slate-800 mt-2 shrink-0 grid grid-cols-2 gap-3">
                {selectedReg.status !== "confirmed" ? (
                  <button
                    onClick={() => updateStatus(selectedReg._id, "confirmed")}
                    disabled={updating === selectedReg._id}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(52,211,153,0.15)]"
                  >
                    {updating === selectedReg._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                    APPROVE & SYNC
                  </button>
                ) : (
                  <button
                    onClick={() => sendManualEmail(selectedReg._id, selectedReg.name)}
                    disabled={sendingEmailId === selectedReg._id}
                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(8,145,178,0.15)]"
                  >
                    {sendingEmailId === selectedReg._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                    RESEND EMAIL
                  </button>
                )}

                {selectedReg.status !== "rejected" ? (
                   <button
                    onClick={() => updateStatus(selectedReg._id, "rejected")}
                    disabled={updating === selectedReg._id}
                    className="w-full py-3 bg-transparent border-2 border-rose-900/80 hover:bg-rose-950 hover:border-rose-700 text-rose-500 hover:text-rose-400 font-bold rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updating === selectedReg._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <X className="w-5 h-5" />}
                    REJECT
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 bg-transparent border-2 border-slate-800 text-slate-500 font-bold rounded-lg cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    ALREADY REJECTED
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
