import { useEffect, useState } from "react";
import { adminApi } from "../../lib/api";
import { motion } from "motion/react";
import { Users, Trophy, Clock, XCircle, TrendingUp, IndianRupee, RefreshCw, Zap } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Stats {
  total: number;
  confirmed: number;
  pending: number;
  rejected: number;
  perEvent: { _id: string; count: number }[];
  totalRevenue: number;
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-3xl flex items-center gap-4 border-cyan-500/20 shadow-lg"
    >
      <div
        className="w-13 h-13 p-3 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}35`, boxShadow: `0 0 20px ${color}20` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div>
        <div className="text-slate-400 font-space text-xs font-semibold uppercase tracking-wider mb-1">
          {label}
        </div>
        <div className="text-2xl sm:text-3xl font-orbitron font-black text-white">
          {value}
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getStats();
      setStats(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const chartData =
    stats?.perEvent
      .slice(0, 10)
      .map((e) => ({
        name: e._id.length > 14 ? e._id.substring(0, 12) + "…" : e._id,
        count: e.count,
      })) || [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-orbitron font-black text-2xl sm:text-3xl text-white tracking-wider">
            ANALYTICS & INTEL
          </h1>
          <p className="text-slate-400 font-space text-sm mt-1">
            Real-time participant traffic, revenue estimates, and event breakdown.
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="btn-outline text-xs py-2.5 px-5 flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Intel</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          label="Total Registrations"
          value={stats?.total ?? 0}
          icon={Users}
          color="#00f2fe"
        />
        <StatCard
          label="Confirmed & Verified"
          value={stats?.confirmed ?? 0}
          icon={Trophy}
          color="#34d399"
        />
        <StatCard
          label="Pending Review"
          value={stats?.pending ?? 0}
          icon={Clock}
          color="#fbbf24"
        />
        <StatCard
          label="Rejected Submissions"
          value={stats?.rejected ?? 0}
          icon={XCircle}
          color="#f87171"
        />
        <StatCard
          label="Active Competitions"
          value={stats?.perEvent?.length ?? 0}
          icon={Zap}
          color="#38bdf8"
        />
        <StatCard
          label="Estimated Revenue"
          value={`₹${(stats?.totalRevenue ?? 0).toLocaleString("en-IN")}`}
          icon={IndianRupee}
          color="#a855f7"
        />
      </div>

      {/* Registration Chart */}
      {chartData.length > 0 && (
        <div className="glass p-6 sm:p-8 rounded-3xl border-cyan-500/20 shadow-xl">
          <h2 className="font-orbitron font-bold text-sm text-cyan-400 tracking-wider mb-6 uppercase">
            REGISTRATIONS DISTRIBUTION PER EVENT
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} barCategoryGap="25%">
              <XAxis
                dataKey="name"
                tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: "Space Grotesk" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#081632",
                  border: "1px solid rgba(56, 189, 248, 0.4)",
                  borderRadius: 12,
                  color: "#ffffff",
                  fontFamily: "Space Grotesk",
                  fontSize: 13,
                  boxShadow: "0 0 20px rgba(0,242,254,0.2)",
                }}
                cursor={{ fill: "rgba(0, 242, 254, 0.05)" }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={i % 2 === 0 ? "#00f2fe" : "#3b82f6"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Event Breakdown Data Table */}
      <div className="glass rounded-3xl overflow-hidden border-cyan-500/20 shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <h2 className="font-orbitron font-bold text-sm text-white tracking-wider uppercase">
            COMPETITION POPULARITY MATRIX
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table min-w-full">
            <thead>
              <tr>
                <th className="w-16">#</th>
                <th>Competition Name</th>
                <th className="text-right">Total Registrations</th>
              </tr>
            </thead>
            <tbody>
              {stats?.perEvent.map((e, i) => (
                <tr key={e._id}>
                  <td className="font-mono-matrix text-xs text-slate-500">{i + 1}</td>
                  <td className="font-semibold text-white">{e._id}</td>
                  <td className="text-right">
                    <span className="px-3 py-1 rounded-full text-xs font-orbitron font-bold bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 inline-block">
                      {e.count} REGISTRATIONS
                    </span>
                  </td>
                </tr>
              ))}
              {!stats?.perEvent.length && (
                <tr>
                  <td colSpan={3} className="text-center text-slate-500 py-8 font-space text-sm">
                    No registrations recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
