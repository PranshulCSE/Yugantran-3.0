import { useLocation } from "react-router-dom";
import { Zap } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard Overview",
  "/admin/events": "Events & Competitions Manager",
  "/admin/registrations": "Registrations & Payment Logs",
  "/admin/team": "Team & Volunteer Management",
  "/admin/settings": "Global Festival Settings",
};

export default function AdminHeader() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Administration Terminal";

  return (
    <header className="h-16 border-b border-cyan-500/15 bg-[#030712]/80 backdrop-blur-xl flex items-center justify-between px-8 flex-shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-slate-500 font-space text-xs font-semibold uppercase tracking-wider">
          YUGANTRAN 3.0 //
        </span>
        <span className="text-cyan-400 font-orbitron text-xs font-bold tracking-wider uppercase">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-[11px] font-mono-matrix text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.2)]">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>SYSTEM OPERATIONAL</span>
        </div>
      </div>
    </header>
  );
}
