import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { publicApi } from "../lib/api";
import { NAV_ROUTES } from "../routes";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    publicApi.getSettings()
      .then((res) => setIsRegistrationOpen(res.data.isRegistrationOpen ?? true))
      .catch(() => {});
  }, []);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[rgba(0,0,0,0.85)] backdrop-blur-xl border-b border-[rgba(0,255,65,0.12)] shadow-[0_4px_30px_rgba(0,255,65,0.05)]"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <nav className="flex items-center justify-between h-20">
          {/* Brand & University Logos */}
          <div className="flex items-center gap-3 lg:gap-4">
            <motion.div whileHover={{ scale: 1.02 }}>
              <Link to="/" className="flex items-center gap-2.5 group">
                <div>
                  <span className="font-orbitron text-base md:text-lg tracking-widest gradient-text font-bold">YUGANTRAN</span>
                  <span className="font-orbitron text-[10px] md:text-xs text-[rgba(0,255,65,0.5)] ml-1">3.0</span>
                </div>
              </Link>
            </motion.div>

            {/* University & Department Logos */}
            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-[rgba(0,255,65,0.2)]">
              <img
                src="/images/Geeta/univ-1.jpg"
                alt="SCSE Logo"
                title="School of Computer Science & Engineering (SCSE)"
                className="h-7 md:h-8 w-auto rounded bg-white p-0.5 border border-cyan-400/30 object-contain shadow-sm"
              />
              <img
                src="/images/Geeta/univ-2.jpg"
                alt="GU Logo"
                title="Geeta University (GU)"
                className="h-7 md:h-8 w-auto rounded bg-white p-0.5 border border-cyan-400/30 object-contain shadow-sm"
              />
              <img
                src="/images/Geeta/univ-3.jpg"
                alt="GTH Logo"
                title="Geeta Technical Hub (GTH)"
                className="h-7 md:h-8 w-auto rounded bg-white p-0.5 border border-cyan-400/30 object-contain shadow-sm"
              />
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5 lg:gap-1.5">
            {NAV_ROUTES.filter((item) => item.path !== "/register").map((item, i) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `relative group px-2 lg:px-3 py-2 font-mono-matrix text-xs lg:text-sm tracking-wider whitespace-nowrap transition-colors duration-200 ${
                      isActive ? "text-[#00ff41]" : "text-[rgba(176,255,176,0.6)] hover:text-[#00ff41]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.name}
                      <span
                        className={`absolute -bottom-0.5 left-2 right-2 lg:left-3 lg:right-3 h-px bg-[#00ff41] transition-all duration-300 ${
                          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:block flex-shrink-0">
            {isRegistrationOpen ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/register")}
                className="btn-primary text-xs lg:text-sm py-2.5 px-4 lg:px-6 whitespace-nowrap"
              >
                REGISTER NOW
              </motion.button>
            ) : (
              <div className="px-4 lg:px-6 py-2.5 border border-[rgba(255,68,68,0.3)] rounded-lg text-[#ff6666] font-orbitron text-xs lg:text-sm tracking-wider whitespace-nowrap">
                REG. CLOSED
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[#00ff41]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[rgba(0,0,0,0.95)] backdrop-blur-xl border-t border-[rgba(0,255,65,0.1)]"
          >
            <div className="container mx-auto px-4 py-6 space-y-1">
              {NAV_ROUTES.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block w-full text-left py-2.5 font-mono-matrix text-sm tracking-widest transition-colors ${
                      isActive ? "text-[#00ff41]" : "text-[rgba(176,255,176,0.7)] hover:text-[#00ff41]"
                    }`
                  }
                >
                  &gt; {item.name}
                </NavLink>
              ))}
              <button
                onClick={() => { setMobileOpen(false); navigate("/register"); }}
                className="btn-primary w-full text-center block py-3 mt-3"
              >
                {isRegistrationOpen ? "REGISTER NOW" : "REG. CLOSED"}
              </button>

              {/* Mobile Institutional Logos */}
              <div className="pt-4 mt-4 border-t border-[rgba(0,255,65,0.1)] flex items-center justify-between px-2">
                <span className="text-[10px] font-mono-matrix text-[rgba(176,255,176,0.5)] uppercase tracking-wider">
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
