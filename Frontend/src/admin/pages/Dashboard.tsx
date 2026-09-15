import { useEffect, useState } from "react";
import { adminApi } from "../../lib/api";
import { motion } from "motion/react";
import { Users, Trophy, Clock, XCircle, TrendingUp, IndianRupee, RefreshCw } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
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
      className="admin-card p-6 rounded-xl flex items-center gap-4"
    >
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}15`, border: `1px solid ${color}30` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div>
        <div className="text-[rgba(176,255,176,0.45)] font-mono-matrix text-xs tracking-widest mb-1">
          {label.toUpperCase()}
        </div>
        <div className="text-3xl font-orbitron" style={{ color }}>
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

  useEffect(() => { fetchStats(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#00ff41] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const chartData =
    stats?.perEvent
      .slice(0, 10)
      .map((e) => ({ name: e._id.length > 14 ? e._id.substring(0, 12) + "…" : e._id, count: e.count })) || [];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-orbitron text-2xl text-[#00ff41] tracking-widest">DASHBOARD</h1>
          <p className="text-[rgba(176,255,176,0.35)] font-mono-matrix text-sm mt-1 tracking-wide">
            YUGANTRAN 3.0 // Real-time Overview
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="btn-outline flex items-center gap-2 text-sm py-2 px-4"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Registrations" value={stats?.total ?? 0} icon={Users} color="#00ff41" />
        <StatCard label="Confirmed" value={stats?.confirmed ?? 0} icon={Trophy} color="#00ff41" />
        <StatCard label="Pending Review" value={stats?.pending ?? 0} icon={Clock} color="#ffd700" />
        <StatCard label="Rejected" value={stats?.rejected ?? 0} icon={XCircle} color="#ff4444" />
        <StatCard label="Events Active" value={stats?.perEvent?.length ?? 0} icon={TrendingUp} color="#00ccff" />
        <StatCard
          label="Est. Revenue"
          value={`₹${(stats?.totalRevenue ?? 0).toLocaleString("en-IN")}`}
          icon={IndianRupee}
          color="#88ff00"
        />
      </div>

      {/* Bar Chart */}
      {chartData.length > 0 && (
        <div className="admin-card p-6 rounded-xl">
          <h2 className="font-orbitron text-sm text-[#00ff41] tracking-widest mb-6">
            REGISTRATIONS PER EVENT
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} barCategoryGap="30%">
              <XAxis
                dataKey="name"
                tick={{ fill: "rgba(176,255,176,0.45)", fontSize: 11, fontFamily: "Share Tech Mono" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "rgba(176,255,176,0.45)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#050f05",
                  border: "1px solid rgba(0,255,65,0.25)",
                  borderRadius: 8,
                  color: "#b0ffb0",
                  fontFamily: "Share Tech Mono",
                  fontSize: 13,
                }}
                cursor={{ fill: "rgba(0,255,65,0.05)" }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={`rgba(0,255,65,${0.35 + (i % 4) * 0.15})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Event breakdown table */}
      <div className="admin-card rounded-xl overflow-hidden">
        <div className="p-5 border-b border-[rgba(0,255,65,0.1)]">
          <h2 className="font-orbitron text-sm text-[#00ff41] tracking-widest">EVENT-WISE BREAKDOWN</h2>
        </div>
        <table className="data-table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Event</th>
              <th>Registrations</th>
            </tr>
          </thead>
          <tbody>
            {stats?.perEvent.map((e, i) => (
              <tr key={e._id}>
                <td className="text-[rgba(176,255,176,0.35)] font-mono-matrix text-xs">{i + 1}</td>
                <td className="font-medium">{e._id}</td>
                <td>
                  <span className="px-3 py-1 rounded-full text-xs status-confirmed font-mono-matrix">
                    {e.count}
                  </span>
                </td>
              </tr>
            ))}
            {!stats?.perEvent.length && (
              <tr>
                <td colSpan={3} className="text-center text-[rgba(176,255,176,0.3)] font-mono-matrix text-sm py-8">
                  No registrations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
