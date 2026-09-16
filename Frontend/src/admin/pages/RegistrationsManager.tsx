import { useEffect, useState } from "react";
import { adminApi } from "../../lib/api";
import { Download, Eye, Check, X, RefreshCw, Search, Filter } from "lucide-react";

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

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getRegistrations(filter);
      setRegistrations(res.data.registrations);
      setTotal(res.data.total);
    } catch (e) {
      console.error(e);
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
      await adminApi.updateRegistration(id, { status });
      setRegistrations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(null);
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

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="btn-outline text-xs py-2.5 px-4 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
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
                    {r.paymentReceiptUrl ? (
                      <a
                        href={r.paymentReceiptUrl}
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
                    <div className="flex gap-2">
                      {r.status !== "confirmed" && (
                        <button
                          onClick={() => updateStatus(r._id, "confirmed")}
                          disabled={updating === r._id}
                          title="Confirm Registration"
                          className="p-2 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {r.status !== "rejected" && (
                        <button
                          onClick={() => updateStatus(r._id, "rejected")}
                          disabled={updating === r._id}
                          title="Reject Registration"
                          className="p-2 rounded-xl bg-rose-950 border border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
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
                  <td colSpan={9} className="text-center text-slate-500 py-10">
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
