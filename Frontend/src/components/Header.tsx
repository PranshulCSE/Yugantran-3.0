import { useState, useEffect } from "react";
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    publicApi
      .getSettings()
      .then((res) => setIsRegistrationOpen(res.data.isRegistrationOpen ?? true))
      .catch(() => {});
  }, []);

  const isDark = theme === "dark";

  return (
    <motion.header
      initial={{ y: -80, x: "-50%" }}
      animate={{ y: 0, x: "-50%" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl rounded-full transition-all duration-300 ${
        isDark
          ? scrolled
            ? "bg-[#020617]/85 backdrop-blur-2xl border border-cyan-400/30 shadow-[0_10px_35px_rgba(0,242,254,0.15)] py-1 px-4 sm:px-5"
            : "bg-[#020617]/50 backdrop-blur-xl border border-cyan-500/20 py-1.5 px-4 sm:px-6 shadow-[0_0_20px_rgba(0,242,254,0.05)]"
          : scrolled
            ? "bg-white/85 backdrop-blur-2xl border border-slate-200/90 shadow-xl py-1 px-4 sm:px-5"
            : "bg-white/60 backdrop-blur-xl border border-slate-200/60 py-1.5 px-4 sm:px-6 shadow-lg"
      }`}
    >
      <div className="w-full px-1 sm:px-2">
        <nav className="flex items-center justify-between h-11 sm:h-12">
          {/* Futuristic Cyber Brand Logo */}
          <Link to="/" className="flex items-center group pl-2">
            <div className="flex items-center">
              <span className="font-orbitron text-lg sm:text-xl font-black tracking-wider gradient-text">
                YUGANTRAN
              </span>
              <span className="font-orbitron text-sm sm:text-base font-extrabold text-cyan-600 dark:text-cyan-400 ml-1.5 tracking-widest">
                3.0
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
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
                  `glassy-nav-item font-mono text-xs lg:text-sm tracking-wider whitespace-nowrap transition-colors duration-200 ${
                    isActive
                      ? "active text-cyan-700 dark:text-cyan-200 font-bold"
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

          {/* Desktop Right CTA + Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl border border-slate-200 dark:border-cyan-500/40 bg-slate-100/90 dark:bg-cyan-950/60 text-slate-700 dark:text-cyan-300 hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-white transition-all shadow-sm flex items-center justify-center"
              title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
              aria-label="Toggle theme"
            >
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
                    <Sun className="w-4 h-4 text-amber-400" />
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
                    <Moon className="w-4 h-4 text-indigo-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {isRegistrationOpen ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/register")}
                className="btn-primary text-xs h-9 px-6 rounded-xl shadow-cyan-500/30 flex items-center justify-center gap-2 border border-cyan-300/40 font-black tracking-widest"
              >
                <Zap className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                <span>REGISTER NOW</span>
              </motion.button>
            ) : (
              <div className="h-9 px-5 border border-rose-500/40 rounded-xl text-rose-500 dark:text-rose-400 font-orbitron text-xs tracking-wider bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center">
                REG. CLOSED
              </div>
            )}
          </div>

          {/* Mobile Right Controls: Menu Hamburger */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-full border border-slate-200 dark:border-cyan-500/40 bg-slate-100 dark:bg-cyan-950/60 text-slate-800 dark:text-cyan-300 hover:text-cyan-600 dark:hover:text-white transition-colors shadow-sm"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
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
            className={`absolute top-[calc(100%+0.5rem)] right-0 w-[240px] md:hidden backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl border flex flex-col ${
              isDark ? "bg-[#020617]/95 border-cyan-500/30" : "bg-white/95 border-slate-200"
            }`}
          >
            <div className="flex flex-col p-2 space-y-1">
              {NAV_ROUTES.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 font-semibold"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>

            <div className="p-2 border-t border-slate-200/50 dark:border-cyan-500/20 flex flex-col gap-2">
              <button
                onClick={() => {
                  toggleTheme();
                  setMobileOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-cyan-300 font-semibold tracking-wide text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                {isDark ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-indigo-600" />}
                <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/register");
                }}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold tracking-wide text-xs shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>{isRegistrationOpen ? "Register Now" : "Registrations Closed"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
