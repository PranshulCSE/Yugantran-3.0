import { useEffect, useState } from "react";
import { adminApi } from "../../lib/api";
import { Download, Eye, Check, X, RefreshCw, Search, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  pending: { label: "Pending", class: "status-pending" },
  confirmed: { label: "Confirmed", class: "status-confirmed" },
  rejected: { label: "Rejected", class: "status-rejected" },
};

export default function RegistrationsManager() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ event: "", status: "" });
  const [updating, setUpdating] = useState<string | null>(null);
  const [syncingAll, setSyncingAll] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

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
      setRegistrations(res.data.registrations);
      setTotal(res.data.total);
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

      if (status === "confirmed") {
        if (updatedData?.sheetResult?.success) {
          showNotification(`Registration confirmed! Record appended to Google Sheet "${updatedData.sheetResult.sheetTitle}" & email sent.`, "success");
        } else if (updatedData?.sheetResult?.error) {
          showNotification(`Confirmed, but Google Sheet sync failed: ${updatedData.sheetResult.error}`, "error");
        } else {
          showNotification("Registration confirmed successfully!", "success");
        }
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

  const syncSingleToSheet = async (id: string) => {
    setSyncingId(id);
    try {
      const res = await adminApi.syncRegistrationToSheet(id);
      showNotification(res.data.message || "Synced to Google Sheet successfully!", "success");
      setRegistrations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, sheetSyncedAt: new Date().toISOString() } : r))
      );
    } catch (e: any) {
      console.error(e);
      showNotification(e.response?.data?.error || "Failed to sync to Google Sheet.", "error");
    } finally {
      setSyncingId(null);
    }
  };

  const syncAllConfirmedToSheets = async () => {
    if (!window.confirm("Do you want to sync all confirmed registrations to Google Sheets now?")) return;
    setSyncingAll(true);
    try {
      const res = await adminApi.syncAllToSheets();
      showNotification(res.data.message || "All confirmed registrations synced to Google Sheets!", "success");
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-orbitron font-black text-2xl sm:text-3xl text-white tracking-wider">
            REGISTRATIONS & AUDIT
          </h1>
          <p className="text-slate-400 font-space text-sm mt-1">
            {total} total participant records logged across all competitions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchData}
            className="btn-outline text-xs py-2.5 px-4 flex items-center gap-2"
            title="Reload registration list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={syncAllConfirmedToSheets}
            disabled={syncingAll}
            className="px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50"
            title="Push all confirmed registrations to their respective event Google Sheet tabs"
          >
            {syncingAll ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-4 h-4" />
            )}
            <span>{syncingAll ? "Syncing G Sheets..." : "Sync All to G Sheets"}</span>
          </button>

          <button
            onClick={exportCSV}
            className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2 shadow-cyan-500/30"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
            notification.type === "success"
              ? "bg-emerald-950/70 border-emerald-500/50 text-emerald-200"
              : notification.type === "error"
              ? "bg-rose-950/70 border-rose-500/50 text-rose-200"
              : "bg-cyan-950/70 border-cyan-500/50 text-cyan-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          <div className="text-xs sm:text-sm font-space">{notification.message}</div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="admin-input pl-11 text-xs"
            placeholder="Search by event title..."
            value={filter.event}
            onChange={(e) => setFilter((f) => ({ ...f, event: e.target.value }))}
          />
        </div>

        <div className="w-48">
          <select
            className="admin-input text-xs"
            value={filter.status}
            onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
          >
            <option value="">All Verification Status</option>
            <option value="pending">Pending Verification</option>
            <option value="confirmed">Confirmed & Verified</option>
            <option value="rejected">Rejected Submissions</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-3xl overflow-x-auto border-cyan-500/20 shadow-xl">
        {loading ? (
          <div className="flex items-center justify-center h-44">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="data-table min-w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Candidate Intel</th>
                <th>Target Event</th>
                <th>University / College</th>
                <th>Contact</th>
                <th>Txn ID</th>
                <th>Status</th>
                <th>G Sheets</th>
                <th>Drive Proof</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r, i) => (
                <tr key={r._id}>
                  <td className="font-mono-matrix text-xs text-slate-500">{i + 1}</td>
                  <td>
                    <div className="font-bold text-white">{r.name}</div>
                    <div className="text-xs text-cyan-400 font-mono-matrix">{r.rollNumber}</div>
                  </td>
                  <td>
                    <div className="font-semibold text-slate-200 text-sm">{r.eventName}</div>
                    <div className="text-xs text-slate-400 font-space">{r.teamType}</div>
                  </td>
                  <td className="text-xs text-slate-300 max-w-[130px] truncate">{r.college}</td>
                  <td className="font-mono-matrix text-xs text-slate-300">{r.mobileNumber}</td>
                  <td className="font-mono-matrix text-xs text-slate-400 max-w-[100px] truncate">
                    {r.transactionId}
                  </td>
                  <td>
                    <span
                      className={`text-xs font-orbitron font-bold ${
                        STATUS_CONFIG[r.status]?.class || "status-pending"
                      }`}
                    >
                      {r.status?.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {r.sheetSyncedAt ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono-matrix text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30" title={`Synced at ${new Date(r.sheetSyncedAt).toLocaleString()}`}>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Synced</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono-matrix text-slate-500">
                        {r.status === "confirmed" ? "Not synced" : "—"}
                      </span>
                    )}
                  </td>
                  <td>
                    {r.paymentReceiptUrl || r._id ? (
                      <a
                        href={(() => {
                          const backendBase = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5005").replace(/\/+$/, "");
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
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 text-xs font-space transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </a>
                    ) : (
                      <span className="text-slate-600 text-xs">—</span>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {r.status !== "confirmed" && (
                        <button
                          onClick={() => updateStatus(r._id, "confirmed")}
                          disabled={updating === r._id}
                          title="Confirm Registration & Sync to Google Sheet"
                          className="p-2 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-colors disabled:opacity-50"
                        >
                          {updating === r._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        </button>
                      )}
                      {r.status === "confirmed" && (
                        <button
                          onClick={() => syncSingleToSheet(r._id)}
                          disabled={syncingId === r._id}
                          title="Force Push / Re-sync to Google Sheet"
                          className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-colors disabled:opacity-50"
                        >
                          {syncingId === r._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileSpreadsheet className="w-3.5 h-3.5" />}
                        </button>
                      )}
                      {r.status !== "rejected" && (
                        <button
                          onClick={() => updateStatus(r._id, "rejected")}
                          disabled={updating === r._id}
                          title="Reject Registration"
                          className="p-2 rounded-xl bg-rose-950 border border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors disabled:opacity-50"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!registrations.length && !loading && (
                <tr>
                  <td colSpan={10} className="text-center text-slate-500 py-10">
                    No registrations matched your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
