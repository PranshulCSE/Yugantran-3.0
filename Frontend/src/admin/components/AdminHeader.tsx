import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/events": "Events Manager",
  "/admin/registrations": "Registrations",
  "/admin/team": "Team Manager",
  "/admin/settings": "Settings",
};

export default function AdminHeader() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Admin Panel";

  return (
    <header className="h-16 border-b border-[rgba(0,255,65,0.12)] bg-[#020902] flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <span className="text-[rgba(176,255,176,0.35)] font-mono-matrix text-xs tracking-widest">
          YUGANTRAN 3.0 /{" "}
        </span>
        <span className="text-[#00ff41] font-orbitron text-sm tracking-wider">
          {title.toUpperCase()}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse" />
        <span className="text-[#00ff41] font-mono-matrix text-xs tracking-widest">SYSTEM ONLINE</span>
      </div>
    </header>
  );
}
