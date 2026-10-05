import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Zap, Sun, Moon } from "lucide-react";
import { publicApi } from "../lib/api";
import { NAV_ROUTES } from "../routes";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const headerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    publicApi
      .getSettings()
      .then((res) => setIsRegistrationOpen(res.data.isRegistrationOpen ?? true))
      .catch(() => { });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileOpen && headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  const isDark = theme === "dark";

  return (
    <motion.header
      ref={headerRef as any}
      initial={{ y: -80, x: "-50%" }}
      animate={{ y: 0, x: "-50%" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl rounded-full transition-all duration-300 ${isDark
          ? scrolled
            ? "bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl py-1 px-4 sm:px-5"
            : "bg-white/[0.02] backdrop-blur-xl border border-white/5 py-1.5 px-4 sm:px-6 shadow-xl"
          : scrolled
            ? "bg-white/70 backdrop-blur-3xl border border-white/50 shadow-xl py-1 px-4 sm:px-5"
            : "bg-white/40 backdrop-blur-2xl border border-white/30 py-1.5 px-4 sm:px-6 shadow-lg"
        }`}
    >
      <div className="w-full px-1 sm:px-2">
        <nav className="flex items-center justify-between h-11 sm:h-12 w-full relative">
          {/* Futuristic Cyber Brand Logo */}
          <div className="flex flex-1 justify-start">
            <Link to="/" className="flex items-center group pl-2">
            <div className="flex items-start leading-none">
              <span className="font-orbitron text-xl sm:text-2xl font-black tracking-wider gradient-text leading-none">
                YUGANTRAN
              </span>
              <span className="font-orbitron text-[12px] sm:text-[13px] font-extrabold text-cyan-600 dark:text-cyan-400 ml-1 tracking-widest leading-none" style={{ marginTop: '1px' }}>
                3.0
              </span>
            </div>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center justify-center gap-1 lg:gap-2 whitespace-nowrap">
            {NAV_ROUTES.filter((item) => item.path !== "/register").map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const centerX = rect.width / 2;
                  const centerY = rect.height / 2;
                  const offsetX = e.clientX - rect.left - centerX;
                  const offsetY = e.clientY - rect.top - centerY;
                  e.currentTarget.style.setProperty("--_x-motion", `${offsetX}px`);
                  e.currentTarget.style.setProperty("--_y-motion", `${offsetY}px`);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.setProperty("--_x-motion", `0px`);
                  e.currentTarget.style.setProperty("--_y-motion", `0px`);
                }}
                className={({ isActive }) =>
                  `glassy-nav-item font-body font-semibold text-xs lg:text-sm tracking-wide whitespace-nowrap transition-colors duration-200 ${isActive
                    ? "active text-cyan-950 dark:text-white font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`
                }
              >
                <span className="glassy-content px-4 py-2 flex items-center justify-center">
                  {item.name}
                </span>
              </NavLink>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex flex-1 justify-end items-center gap-3 pr-1">
            {/* Desktop Right CTA + Theme Toggle */}
            <div className="hidden md:flex items-center">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="iridescent !min-w-[36px] !w-[36px] !px-0 !rounded-[12px]"
                title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
                aria-label="Toggle theme"
              >
                <span className="drop-shadow !rounded-[12px]"></span>
                <div className="relative z-10 flex items-center justify-center">
                  <AnimatePresence mode="wait" initial={false}>
                    {isDark ? (
                      <motion.div
                        key="sun"
                        initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center"
                      >
                        <Sun className="w-4 h-4 text-slate-600 dark:text-slate-200" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center"
                      >
                        <Moon className="w-4 h-4 text-slate-600 dark:text-slate-200" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </button>
            </div>

            {/* Mobile Right Controls: Menu Hamburger */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-1 text-slate-700 dark:text-slate-200 hover:text-black dark:hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-[calc(100%+0.5rem)] right-0 w-[240px] md:hidden ${isDark ? "bg-[#020617]/95 border border-white/10" : "bg-white/95 border border-slate-200"} backdrop-blur-3xl rounded-2xl overflow-hidden shadow-2xl flex flex-col`}
          >
            <div className="flex flex-col p-2 space-y-1">
              {NAV_ROUTES.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                      ? "bg-white/40 dark:bg-white/10 text-slate-900 dark:text-white font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-white/5"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>

            <div className={`p-2 border-t flex flex-col gap-2 ${isDark ? "border-white/10" : "border-slate-200/50"}`}>
              <button
                onClick={() => {
                  toggleTheme();
                  setMobileOpen(false);
                }}
                className={`w-full py-2.5 rounded-xl border font-semibold tracking-wide text-xs shadow-sm transition-colors flex items-center justify-center gap-2 ${
                  isDark
                    ? "bg-white/5 border-white/10 text-slate-200 hover:bg-white/10"
                    : "bg-white/30 border-white/50 text-slate-700 hover:bg-white/50"
                }`}
              >
                {isDark ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-indigo-600" />}
                <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
