import { useTheme } from "../context/ThemeContext";

export default function CyberBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transform-gpu">
      {/* Cyber Vignette Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/40 via-transparent to-slate-100/80 dark:from-[#020617]/50 dark:via-transparent dark:to-[#020617]/90 pointer-events-none" />
    </div>
  );
}
