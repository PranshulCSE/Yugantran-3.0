import { useEffect, useState } from "react";
import { adminApi } from "../../lib/api";
import { Download, Eye, Check, X, RefreshCw } from "lucide-react";

const STATUS_CLASS: Record<string, string> = {
  pending: "status-pending",
  confirmed: "status-confirmed",
  rejected: "status-rejected",
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
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await adminApi.updateRegistration(id, { status });
      setRegistrations((prev) => prev.map((r) => r._id === id ? { ...r, status } : r));
    } catch (e) { console.error(e); }
    finally { setUpdating(null); }
  };

  const exportCSV = async () => {
    try {
      const res = await adminApi.exportRegistrations(filter);
      const url = URL.createObjectURL(new Blob([res.data], { type: "text/csv" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `registrations_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-orbitron text-2xl text-[#00ff41] tracking-widest">REGISTRATIONS</h1>
          <p className="text-[rgba(176,255,176,0.35)] font-mono-matrix text-sm mt-1">{total} total records</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} className="btn-outline flex items-center gap-2 text-sm py-2 px-4">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={exportCSV} className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <input
          className="admin-input w-52"
          placeholder="Filter by event name..."
          value={filter.event}
          onChange={(e) => setFilter((f) => ({ ...f, event: e.target.value }))}
        />
        <select
          className="admin-input w-44"
          value={filter.status}
          onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="admin-card rounded-xl overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-2 border-[#00ff41] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="data-table min-w-full">
            <thead>
              <tr>
                <th>#</th><th>Participant</th><th>Event</th><th>College</th>
                <th>Mobile</th><th>Txn ID</th><th>Status</th><th>Receipt</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r, i) => (
                <tr key={r._id}>
                  <td className="font-mono-matrix text-xs text-[rgba(176,255,176,0.35)]">{i + 1}</td>
                  <td>
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-[rgba(176,255,176,0.35)] font-mono-matrix">{r.rollNumber}</div>
                  </td>
                  <td>
                    <div className="text-sm">{r.eventName}</div>
                    <div className="text-xs text-[rgba(176,255,176,0.35)] font-mono-matrix">{r.teamType}</div>
                  </td>
                  <td className="text-sm max-w-[120px] truncate">{r.college}</td>
                  <td className="font-mono-matrix text-sm">{r.mobileNumber}</td>
                  <td className="font-mono-matrix text-xs text-[rgba(176,255,176,0.5)] max-w-[100px] truncate">{r.transactionId}</td>
                  <td>
                    <span className={`px-2 py-1 rounded text-xs font-mono-matrix ${STATUS_CLASS[r.status] || ""}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    {r.paymentReceiptUrl ? (
                      <a href={r.paymentReceiptUrl} target="_blank" rel="noopener noreferrer"
                        className="text-[#00ccff] hover:text-[#44ddff] text-xs flex items-center gap-1 transition-colors">
                        <Eye className="w-3 h-3" /> View
                      </a>
                    ) : (
                      <span className="text-[rgba(176,255,176,0.25)] text-xs">—</span>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      {r.status !== "confirmed" && (
                        <button
                          onClick={() => updateStatus(r._id, "confirmed")}
                          disabled={updating === r._id}
                          title="Confirm"
                          className="p-1.5 rounded bg-[rgba(0,255,65,0.1)] hover:bg-[rgba(0,255,65,0.2)] text-[#00ff41] transition-colors disabled:opacity-40"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      )}
                      {r.status !== "rejected" && (
                        <button
                          onClick={() => updateStatus(r._id, "rejected")}
                          disabled={updating === r._id}
                          title="Reject"
                          className="p-1.5 rounded bg-[rgba(255,68,68,0.1)] hover:bg-[rgba(255,68,68,0.2)] text-[#ff4444] transition-colors disabled:opacity-40"
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
                  <td colSpan={9} className="text-center text-[rgba(176,255,176,0.3)] font-mono-matrix text-sm py-10">
                    No registrations found.
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
