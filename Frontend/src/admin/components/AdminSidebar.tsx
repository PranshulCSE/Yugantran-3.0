import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard, CalendarDays, ClipboardList,
  Users, Settings, LogOut, Sparkles, ChevronRight,
} from "lucide-react";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { path: "/admin/events", label: "Events", icon: CalendarDays },
  { path: "/admin/registrations", label: "Registrations", icon: ClipboardList },
  { path: "/admin/team", label: "Team", icon: Users },
  { path: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <aside className="admin-sidebar flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[rgba(0,255,65,0.15)]">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-[#00ff41]" />
          <div>
            <div className="text-[#00ff41] font-orbitron text-sm font-bold tracking-widest">YUGANTRAN</div>
            <div className="text-[#00ff41] font-orbitron text-xs opacity-60 tracking-widest">3.0 // ADMIN</div>
          </div>
        </div>
      </div>

      {/* Admin info */}
      <div className="px-6 py-4 border-b border-[rgba(0,255,65,0.1)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[rgba(0,255,65,0.12)] border border-[rgba(0,255,65,0.3)] flex items-center justify-center">
            <span className="text-[#00ff41] font-orbitron text-sm font-bold">
              {admin?.name?.[0]?.toUpperCase() || "A"}
            </span>
          </div>
          <div>
            <div className="text-[#b0ffb0] text-sm font-medium truncate max-w-[140px]">{admin?.name}</div>
            <div className="text-[rgba(176,255,176,0.4)] text-xs font-mono-matrix">{admin?.role}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-[rgba(0,255,65,0.1)] border border-[rgba(0,255,65,0.25)] text-[#00ff41]"
                  : "text-[rgba(176,255,176,0.55)] hover:bg-[rgba(0,255,65,0.05)] hover:text-[#b0ffb0] border border-transparent"
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wide">{item.label}</span>
            </div>
            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[rgba(0,255,65,0.1)]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[rgba(255,100,100,0.65)] hover:text-[#ff7777] hover:bg-[rgba(255,68,68,0.05)] transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
