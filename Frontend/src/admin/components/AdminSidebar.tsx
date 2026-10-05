import { useState } from "react";
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
  ChevronLeft,
  Shield,
  Zap,
  Trophy,
  Layers,
  ExternalLink,
} from "lucide-react";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { path: "/admin/events", label: "Events", icon: CalendarDays },
  { path: "/admin/registrations", label: "Registrations", icon: ClipboardList },
  { path: "/admin/team", label: "Team", icon: Users },
  { path: "/admin/awards", label: "Awards", icon: Trophy },
  { path: "/admin/about-tracks", label: "Tracks", icon: Layers },
  { path: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed?: boolean;
  setCollapsed?: (val: boolean | ((prev: boolean) => boolean)) => void;
}) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [localCollapsed, setLocalCollapsed] = useState(false);

  const isCollapsed = collapsed !== undefined ? collapsed : localCollapsed;
  const toggleCollapse = () => {
    if (setCollapsed) setCollapsed((prev) => !prev);
    else setLocalCollapsed((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <aside className={`admin-sidebar ${isCollapsed ? "collapsed" : ""} flex flex-col justify-between select-none`}>
      <div>
        {/* Header / Brand */}
        <div className="p-3.5 border-b border-cyan-500/15 flex items-center justify-between">
          {!isCollapsed && (
            <div className="overflow-hidden">
              <div className="font-orbitron font-black text-xs tracking-wider text-white flex items-center gap-1.5">
                <span className="text-cyan-400">⚡</span>
                <span>YUGANTRAN 3.0</span>
              </div>
              <div className="text-[9px] font-mono-matrix text-slate-400 tracking-wider">
                ADMIN CONSOLE
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="w-full flex justify-center">
              <span className="text-cyan-400 font-orbitron font-black text-sm">Y3</span>
            </div>
          )}

          <button
            onClick={toggleCollapse}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            className="p-1 rounded-md text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors hidden sm:flex items-center justify-center ml-auto"
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* User Pill */}
        {!isCollapsed ? (
          <div className="px-3.5 py-2.5 border-b border-slate-800/60 bg-slate-950/30 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-orbitron font-bold text-[11px] shrink-0">
              {admin?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="overflow-hidden min-w-0">
              <div className="text-xs font-space font-semibold text-slate-200 truncate">
                {admin?.name || "Admin"}
              </div>
              <div className="text-[9px] font-mono-matrix text-cyan-400 uppercase leading-none">
                {admin?.role || "SUPERADMIN"}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-2.5 border-b border-slate-800/60 flex justify-center">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-orbitron font-bold text-[11px]" title={admin?.name || "Admin"}>
              {admin?.name?.[0]?.toUpperCase() || "A"}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center ${isCollapsed ? "justify-center px-2 py-2" : "justify-between px-3 py-2"} rounded-lg font-space text-xs font-semibold tracking-wide transition-all duration-150 group ${
                  isActive
                    ? "bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 shadow-[0_0_12px_rgba(0,242,254,0.12)]"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/90 border border-transparent"
                }`
              }
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <item.icon className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-cyan-300 transition-colors" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </div>
              {!isCollapsed && (
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity shrink-0" />
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-2 border-t border-slate-800/60 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          title="View Public Site"
          className={`flex items-center ${isCollapsed ? "justify-center p-2" : "justify-between px-3 py-1.5"} rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-900/80 text-xs font-space transition-colors`}
        >
          {!isCollapsed && <span>Public Site</span>}
          <ExternalLink className="w-3.5 h-3.5 text-cyan-400/70" />
        </a>

        <button
          onClick={handleLogout}
          title="Exit Session"
          className={`w-full flex items-center ${isCollapsed ? "justify-center p-2" : "gap-2.5 px-3 py-1.5"} rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 text-xs font-space transition-colors`}
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
