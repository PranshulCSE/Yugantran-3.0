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
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isDark
          ? scrolled
            ? "bg-[#020617]/95 backdrop-blur-2xl border-b border-cyan-400/30 shadow-[0_10px_35px_rgba(0,242,254,0.12)] py-2.5"
            : "bg-[#020617]/70 backdrop-blur-xl border-b border-cyan-500/15 py-3.5"
          : scrolled
            ? "bg-white/95 backdrop-blur-2xl border-b border-slate-200/90 shadow-md py-2.5"
            : "bg-white/80 backdrop-blur-xl border-b border-slate-200/60 py-3.5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-12 sm:h-14">
          {/* Futuristic Cyber Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-green-400 p-[1.5px] shadow-[0_0_15px_rgba(0,242,254,0.4)] group-hover:shadow-[0_0_25px_rgba(0,242,254,0.7)] transition-all">
                <div className="w-full h-full bg-slate-900 dark:bg-[#020617] rounded-[10px] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>

              <div className="flex items-center">
                <span className="font-orbitron text-lg sm:text-xl font-black tracking-wider gradient-text">
                  YUGANTRAN
                </span>
                <span className="font-orbitron text-[10px] font-extrabold text-cyan-700 dark:text-cyan-300 ml-1.5 px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/90 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,242,254,0.25)] dark:shadow-[0_0_12px_rgba(0,242,254,0.4)] tracking-widest">
                  3.0
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2 px-3 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-cyan-500/20 backdrop-blur-md shadow-inner">
            {NAV_ROUTES.filter((item) => item.path !== "/register").map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `relative px-3.5 py-1.5 rounded-full font-mono-matrix text-xs lg:text-sm tracking-wider whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "text-cyan-900 dark:text-cyan-200 font-bold bg-cyan-100/90 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-400/40 shadow-[0_0_12px_rgba(0,242,254,0.2)]"
                      : "text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                  }`
                }
              >
                <span>{item.name}</span>
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
              className="p-2.5 rounded-xl border border-slate-200 dark:border-cyan-500/40 bg-slate-100/90 dark:bg-cyan-950/60 text-slate-700 dark:text-cyan-300 hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-white transition-all shadow-sm flex items-center justify-center"
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
                className="btn-primary text-xs py-2.5 px-6 shadow-cyan-500/30 flex items-center gap-2 border border-cyan-300/40 font-black tracking-widest"
              >
                <Zap className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                <span>REGISTER NOW</span>
              </motion.button>
            ) : (
              <div className="px-4 py-2 border border-rose-500/40 rounded-xl text-rose-500 dark:text-rose-400 font-orbitron text-xs tracking-wider bg-rose-50 dark:bg-rose-950/30">
                REG. CLOSED
              </div>
            )}
          </div>

          {/* Mobile Right Controls: Theme Toggle + Menu Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-cyan-500/40 bg-slate-100 dark:bg-cyan-950/60 text-slate-700 dark:text-cyan-300 hover:text-cyan-600 dark:hover:text-white transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-cyan-500/40 bg-slate-100 dark:bg-cyan-950/60 text-slate-800 dark:text-cyan-300 hover:text-cyan-600 dark:hover:text-white transition-colors shadow-sm"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className={`md:hidden backdrop-blur-2xl border-t overflow-hidden shadow-2xl ${
              isDark ? "bg-[#020617]/98 border-cyan-500/25" : "bg-white/98 border-slate-200"
            }`}
          >
            <div className="container mx-auto px-4 py-5 space-y-2">
              {NAV_ROUTES.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-xl font-mono-matrix text-sm tracking-widest transition-all ${
                      isActive
                        ? "bg-cyan-100 dark:bg-cyan-950/80 text-cyan-900 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-400/50 shadow-sm font-bold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/80 hover:text-cyan-600 dark:hover:text-cyan-300"
                    }`
                  }
                >
                  <span>&gt; {item.name.toUpperCase()}</span>
                  <span className="text-xs font-orbitron text-cyan-600 dark:text-cyan-400/80 font-mono">0{NAV_ROUTES.indexOf(item) + 1}</span>
                </NavLink>
              ))}

              <div className="pt-3">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/register");
                  }}
                  className="btn-primary w-full py-3.5 text-xs justify-center shadow-cyan-500/30 flex items-center gap-2 font-black"
                >
                  <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
                  <span>{isRegistrationOpen ? "REGISTER FOR FEST" : "REGISTRATIONS CLOSED"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
