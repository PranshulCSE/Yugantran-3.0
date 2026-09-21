import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  Shield,
  Zap,
} from "lucide-react";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { path: "/admin/events", label: "Events Manager", icon: CalendarDays },
  { path: "/admin/registrations", label: "Registrations", icon: ClipboardList },
  { path: "/admin/team", label: "Team Manager", icon: Users },
  { path: "/admin/settings", label: "Fest Settings", icon: Settings },
];

export default function AdminSidebar() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <aside className="admin-sidebar flex flex-col justify-between">
      <div>
        {/* Logo */}
        <div className="p-6 border-b border-cyan-500/15">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.3)]">
              <Zap className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="font-orbitron font-black text-sm text-white tracking-wider">
                YUGANTRAN 3.0
              </div>
              <div className="text-[10px] font-space text-cyan-400 font-semibold tracking-widest uppercase">
                ADMIN TERMINAL
              </div>
            </div>
          </div>
        </div>

        {/* Admin info pill */}
        <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-orbitron font-bold text-xs">
              {admin?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-space font-semibold text-white truncate">
                {admin?.name || "Admin"}
              </div>
              <div className="text-[10px] font-mono-matrix text-cyan-400 uppercase">
                {admin?.role || "SUPERADMIN"}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl font-space text-xs font-semibold tracking-wide transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.15)]"
                    : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-800/80 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-4 py-2.5 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-900 text-xs font-space transition-colors"
        >
          <span>View Public Site</span>
          <span className="text-cyan-400">↗</span>
        </a>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 text-xs font-space transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Session</span>
        </button>
      </div>
    </aside>
  );
}
