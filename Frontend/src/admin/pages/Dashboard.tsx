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

function StatCard({ label, value, icon: Icon, color, subtext }: { label: string; value: string | number; icon: any; color: string; subtext?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3.5 rounded-xl bg-[#071329]/80 border border-slate-800/80 hover:border-cyan-500/30 transition-all flex items-center justify-between gap-3 shadow-md"
    >
      <div className="min-w-0">
        <div className="text-slate-400 font-space text-[10px] font-semibold uppercase tracking-wider truncate mb-0.5">
          {label}
        </div>
        <div className="text-lg sm:text-xl font-orbitron font-black text-white tracking-wide">
          {value}
        </div>
        {subtext && (
          <div className="text-[10px] font-space text-slate-500 truncate mt-0.5">
            {subtext}
          </div>
        )}
      </div>

      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${color}15`, border: `1px solid ${color}30`, boxShadow: `0 0 12px ${color}15` }}
      >
        <Icon className="w-4 h-4" style={{ color }} />
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
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const chartData =
    stats?.perEvent
      .slice(0, 8)
      .map((e) => ({
        name: e._id.length > 12 ? e._id.substring(0, 10) + "…" : e._id,
        fullName: e._id,
        count: e.count,
      })) || [];

  return (
    <div className="space-y-4 max-w-7xl">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 pb-1 border-b border-slate-800/60">
        <div>
          <h1 className="font-orbitron font-black text-lg sm:text-xl text-white tracking-wider flex items-center gap-2">
            <span>ANALYTICS & OVERVIEW</span>
          </h1>
          <p className="text-slate-400 font-space text-xs mt-0.5">
            Real-time participant logs, revenue estimate, and event distribution.
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5"
          title="Reload metrics"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Metric Cards Grid (High Density) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <StatCard
          label="Total Regs"
          value={stats?.total ?? 0}
          icon={Users}
          color="#00f2fe"
          subtext="Logged entries"
        />
        <StatCard
          label="Confirmed"
          value={stats?.confirmed ?? 0}
          icon={Trophy}
          color="#34d399"
          subtext={`${stats?.total ? Math.round(((stats.confirmed || 0) / stats.total) * 100) : 0}% verified`}
        />
        <StatCard
          label="Pending"
          value={stats?.pending ?? 0}
          icon={Clock}
          color="#fbbf24"
          subtext="Need review"
        />
        <StatCard
          label="Rejected"
          value={stats?.rejected ?? 0}
          icon={XCircle}
          color="#f87171"
          subtext="Declined"
        />
        <StatCard
          label="Events Active"
          value={stats?.perEvent?.length ?? 0}
          icon={Zap}
          color="#38bdf8"
          subtext="Live tracks"
        />
        <StatCard
          label="Est. Revenue"
          value={`₹${(stats?.totalRevenue ?? 0).toLocaleString("en-IN")}`}
          icon={IndianRupee}
          color="#a855f7"
          subtext="Calculated"
        />
      </div>

      {/* 2-Column Analytics Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Chart */}
        <div className="lg:col-span-7 p-4 rounded-2xl bg-[#071329]/80 border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-orbitron font-bold text-xs text-cyan-400 tracking-wider uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              REGISTRATION DISTRIBUTION PER EVENT
            </h2>
            <span className="text-[10px] font-mono-matrix text-slate-500">TOP {chartData.length} EVENTS</span>
          </div>

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={chartData} barCategoryGap="20%">
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "Space Grotesk" }}
                  axisLine={{ stroke: "rgba(56, 189, 248, 0.15)" }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  axisLine={{ stroke: "rgba(56, 189, 248, 0.15)" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#081632",
                    border: "1px solid rgba(56, 189, 248, 0.4)",
                    borderRadius: 8,
                    color: "#ffffff",
                    fontFamily: "Space Grotesk",
                    fontSize: 11,
                    padding: "6px 10px",
                  }}
                  formatter={(val: number, name: string, item: any) => [`${val} Registrations`, item.payload.fullName]}
                  cursor={{ fill: "rgba(0, 242, 254, 0.05)" }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i % 2 === 0 ? "#00f2fe" : "#3b82f6"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-44 flex items-center justify-center text-slate-500 text-xs">
              No registration traffic logged yet.
            </div>
          )}
        </div>

        {/* Right: Popularity Matrix */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-[#071329]/80 border border-slate-800/80 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-orbitron font-bold text-xs text-slate-200 tracking-wider uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                EVENT POPULARITY RANKING
              </h2>
              <span className="text-[10px] font-mono-matrix text-emerald-400">LIVE</span>
            </div>

            <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
              {stats?.perEvent?.map((e, i) => (
                <div
                  key={e._id}
                  className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded flex items-center justify-center bg-cyan-950 text-cyan-300 font-mono-matrix text-[10px] font-bold shrink-0">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-slate-200 truncate">{e._id}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-mono-matrix text-[11px] font-bold shrink-0">
                    {e.count} entries
                  </span>
                </div>
              ))}

              {!stats?.perEvent?.length && (
                <div className="text-center text-slate-500 py-8 text-xs font-space">
                  No registrations recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
