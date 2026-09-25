import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Sparkles } from "lucide-react";
import { publicApi } from "../lib/api";
import { NAV_ROUTES } from "../routes";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    publicApi
      .getSettings()
      .then((res) => setIsRegistrationOpen(res.data.isRegistrationOpen ?? true))
      .catch(() => {});
  }, []);

  return (
    <motion.header
      initial={{ y: -70 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#020617]/90 backdrop-blur-xl border-b border-cyan-500/25 shadow-[0_4px_30px_rgba(0,242,254,0.08)] py-2.5"
          : "bg-[#020617]/40 backdrop-blur-md border-b border-cyan-500/10 py-3.5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-12 sm:h-14">
          {/* Brand & University Badges */}
          <div className="flex items-center gap-3 lg:gap-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <span className="font-orbitron text-lg sm:text-xl tracking-wider gradient-text font-black">
                  YUGANTRAN
                </span>
                <span className="font-orbitron text-xs font-bold text-cyan-400 ml-1.5 px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,242,254,0.3)]">
                  3.0
                </span>
              </div>
            </Link>

            {/* University & Department Badges */}
            <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-slate-700/60">
              <img
                src="/images/Geeta/univ-1.jpg"
                alt="SCSE"
                title="School of Computer Science & Engineering (SCSE)"
                className="h-7 w-auto rounded bg-white p-0.5 border border-cyan-400/30 object-contain shadow-sm"
              />
              <img
                src="/images/Geeta/univ-2.jpg"
                alt="GU"
                title="Geeta University (GU)"
                className="h-7 w-auto rounded bg-white p-0.5 border border-cyan-400/30 object-contain shadow-sm"
              />
              <img
                src="/images/Geeta/univ-3.jpg"
                alt="GTH"
                title="Geeta Technical Hub (GTH)"
                className="h-7 w-auto rounded bg-white p-0.5 border border-cyan-400/30 object-contain shadow-sm"
              />
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {NAV_ROUTES.filter((item) => item.path !== "/register").map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `relative px-3 py-2 font-mono-matrix text-xs lg:text-sm tracking-wider whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "text-cyan-300 font-bold"
                      : "text-slate-400 hover:text-cyan-300"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-cyan-400 to-green-400 shadow-[0_0_8px_rgba(0,242,254,0.8)]"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isRegistrationOpen ? (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/register")}
                className="btn-primary text-xs py-2.5 px-5 shadow-cyan-500/25 flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>REGISTER NOW</span>
              </motion.button>
            ) : (
              <div className="px-4 py-2 border border-rose-500/30 rounded-xl text-rose-400 font-orbitron text-xs tracking-wider">
                REG. CLOSED
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
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
            className="md:hidden bg-[#020617]/95 backdrop-blur-2xl border-t border-cyan-500/20 overflow-hidden shadow-2xl"
          >
            <div className="container mx-auto px-4 py-5 space-y-2">
              {NAV_ROUTES.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono-matrix text-sm tracking-widest transition-all ${
                      isActive
                        ? "bg-cyan-950/60 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,242,254,0.2)]"
                        : "text-slate-300 hover:bg-slate-900/60 hover:text-cyan-300"
                    }`
                  }
                >
                  <span>&gt; {item.name.toUpperCase()}</span>
                  <span className="text-xs font-orbitron text-cyan-500/60 font-mono">0{NAV_ROUTES.indexOf(item) + 1}</span>
                </NavLink>
              ))}

              <div className="pt-2">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/register");
                  }}
                  className="btn-primary w-full py-3 text-xs justify-center shadow-cyan-500/25"
                >
                  {isRegistrationOpen ? "REGISTER FOR FEST" : "REGISTRATIONS CLOSED"}
                </button>
              </div>

              {/* Mobile Institutional Badges */}
              <div className="pt-4 mt-3 border-t border-slate-800 flex items-center justify-between px-2">
                <span className="text-[10px] font-mono-matrix text-slate-400 uppercase tracking-wider">
                  Organized By:
                </span>
                <div className="flex items-center gap-2">
                  <img
                    src="/images/Geeta/univ-1.jpg"
                    alt="SCSE"
                    title="SCSE"
                    className="h-6 w-auto rounded bg-white p-0.5 object-contain"
                  />
                  <img
                    src="/images/Geeta/univ-2.jpg"
                    alt="GU"
                    title="Geeta University"
                    className="h-6 w-auto rounded bg-white p-0.5 object-contain"
                  />
                  <img
                    src="/images/Geeta/univ-3.jpg"
                    alt="GTH"
                    title="Geeta Technical Hub"
                    className="h-6 w-auto rounded bg-white p-0.5 object-contain"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
