import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { Moon, Sun, X } from "lucide-react";

export default function ThemePrompt() {
  const { theme, setTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already set a preference
    const saved = localStorage.getItem("yugantran_theme");
    if (!saved) {
      // Show prompt after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSelect = (selectedTheme: "dark" | "light") => {
    setTheme(selectedTheme);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    // Save current theme to avoid prompting again if dismissed
    localStorage.setItem("yugantran_theme", theme);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-[320px] sm:max-w-sm bg-gray-900 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(6,182,212,0.15)] transform transition-all scale-100 animate-in zoom-in-95 duration-300">
        
        <button 
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6 sm:mb-8 mt-2">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 font-rajdhani tracking-wide">Select Color Mode</h3>
          <p className="text-sm sm:text-base text-gray-400">Choose your preferred experience for the portal.</p>
        </div>

        <div className="flex gap-4 sm:gap-6">
          <button
            onClick={() => handleSelect("dark")}
            className={`flex-1 flex flex-col items-center justify-center gap-3 p-4 sm:p-6 rounded-xl border transition-all group ${
              theme === "dark" 
                ? "border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]" 
                : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500 hover:bg-gray-700/50"
            }`}
          >
            <Moon className={`w-8 h-8 sm:w-10 sm:h-10 transition-transform ${theme !== "dark" && "group-hover:scale-110"}`} />
            <span className="font-semibold font-rajdhani tracking-wider text-sm sm:text-base">DARK</span>
          </button>
          
          <button
            onClick={() => handleSelect("light")}
            className={`flex-1 flex flex-col items-center justify-center gap-3 p-4 sm:p-6 rounded-xl border transition-all group ${
              theme === "light" 
                ? "border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]" 
                : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500 hover:bg-gray-700/50"
            }`}
          >
            <Sun className={`w-8 h-8 sm:w-10 sm:h-10 transition-transform ${theme !== "light" && "group-hover:scale-110"}`} />
            <span className="font-semibold font-rajdhani tracking-wider text-sm sm:text-base">LIGHT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
