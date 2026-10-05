import { useLocation } from "react-router-dom";
import { Menu, ShieldCheck, Activity } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard Overview",
  "/admin/events": "Events & Competitions",
  "/admin/registrations": "Registrations & Audit",
  "/admin/team": "Team & Volunteers",
  "/admin/awards": "Awards & Prizes",
  "/admin/about-tracks": "Tracks & Domains",
  "/admin/settings": "Global Fest Settings",
};

export default function AdminHeader({
  onToggleSidebar,
}: {
  onToggleSidebar?: () => void;
}) {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Admin Console";

  return (
    <header className="h-12 border-b border-cyan-500/15 bg-[#050c1f]/90 backdrop-blur-md flex items-center justify-between px-4 sm:px-5 flex-shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-2.5 min-w-0">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-1 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 transition-colors sm:hidden"
            title="Toggle Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-slate-500 font-mono-matrix text-[11px] hidden sm:inline">
            YUGANTRAN //
          </span>
          <h2 className="text-cyan-400 font-orbitron text-xs font-bold tracking-wider uppercase truncate">
            {title}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-mono-matrix text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">LIVE CONNECTED</span>
          <span className="sm:hidden">LIVE</span>
        </div>
      </div>
    </header>
  );
}
