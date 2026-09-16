import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Zap, ChevronRight, Sparkles } from "lucide-react";
import { publicApi } from "../lib/api";

const NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Events (14)", path: "/events" },
  { name: "Timeline", path: "/timeline" },
  { name: "Awards", path: "/awards" },
  { name: "Team", path: "/team" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    publicApi
      .getSettings()
      .then((res) => setIsRegistrationOpen(res.data.isRegistrationOpen ?? true))
      .catch(() => {});
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-[#030712]/90 backdrop-blur-2xl border-b border-cyan-500/20 shadow-[0_10px_35px_rgba(0,0,0,0.8)] shadow-cyan-950/20"
          : "py-5 bg-gradient-to-b from-[#030712]/80 to-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Brand Logo Link to Home */}
          <Link
            to="/"
            className="flex items-center gap-3.5 group cursor-pointer"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 group-hover:border-cyan-400 transition-all duration-300 shadow-[0_0_20px_rgba(0,242,254,0.3)]">
              <Zap className="w-6 h-6 text-cyan-400 group-hover:text-white transition-colors" />
              <div className="absolute inset-0 bg-cyan-400 rounded-xl blur-md opacity-20 group-hover:opacity-60 transition-opacity" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-orbitron text-xl font-black tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                  YUGANTRAN
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-orbitron font-bold bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 shadow-[0_0_10px_rgba(0,242,254,0.3)]">
                  3.0
                </span>
              </div>
              <p className="text-[10px] font-space tracking-widest text-slate-400 uppercase">
                SCSE • GEETA UNIVERSITY
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-2xl shadow-inner shadow-cyan-500/10">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-full text-xs font-space font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-[0_0_20px_rgba(0,242,254,0.4)]"
                      : "text-slate-300 hover:text-white hover:bg-cyan-500/10"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Live Status & Register CTA */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-[11px] font-mono-matrix text-cyan-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              <span>OCT 27-28, 2026</span>
            </div>

            {isRegistrationOpen ? (
              <Link
                to="/register"
                className="btn-primary text-xs py-2.5 px-6 shadow-cyan-500/30 flex items-center gap-2"
              >
                <span>REGISTER NOW</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="px-5 py-2 rounded-xl border border-rose-500/40 bg-rose-950/30 text-rose-400 font-orbitron text-xs font-semibold">
                REG. CLOSED
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-400 hover:text-white transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#030712]/98 backdrop-blur-2xl border-b border-cyan-500/20 shadow-2xl"
          >
            <div className="container mx-auto px-6 py-6 space-y-3">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between w-full py-3 px-4 rounded-xl font-space text-sm font-semibold tracking-wide transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md"
                        : "text-slate-300 hover:text-cyan-300 hover:bg-cyan-950/40"
                    }`
                  }
                >
                  <span>{item.name}</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </NavLink>
              ))}

              <div className="pt-4 border-t border-slate-800">
                <Link
                  to="/register"
                  className="btn-primary w-full py-3.5 text-sm justify-center flex items-center gap-2"
                >
                  <span>REGISTER FOR FESTIVAL 🚀</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}