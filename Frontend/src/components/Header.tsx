import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Sparkles } from "lucide-react";
import { publicApi } from "../lib/api";

const NAV_ITEMS = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Timeline", href: "#timeline" },
  { name: "Events", href: "#events" },
  { name: "Awards", href: "#awards" },
  { name: "Team", href: "#team" },
  { name: "Register", href: "#register" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);

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

  const scrollTo = (href: string) => {
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }
      setMobileOpen(false);
    }
  };

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
          {/* Logo */}
          <motion.a
            href="#home"
            onClick={(e) => { e.preventDefault(); scrollTo("#home"); }}
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.03 }}
          >
            <div className="relative">
              <Sparkles className="w-6 h-6 text-[#00ff41] group-hover:rotate-180 transition-transform duration-500" />
              <div className="absolute inset-0 bg-[#00ff41] rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity" />
            </div>
            <div>
              <span className="font-orbitron text-lg tracking-widest gradient-text font-bold">YUGANTRAN</span>
              <span className="font-orbitron text-xs text-[rgba(0,255,65,0.5)] ml-1">3.0</span>
            </div>
          </motion.a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item, i) => (
              <motion.a
                key={item.name}
                href={item.href}
                onClick={(e) => { e.preventDefault(); scrollTo(item.href); }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative group text-[rgba(176,255,176,0.6)] hover:text-[#00ff41] font-mono-matrix text-sm tracking-wider transition-colors duration-200"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#00ff41] group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            {isRegistrationOpen ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollTo("#register")}
                className="btn-primary text-sm py-2.5 px-6"
              >
                REGISTER NOW
              </motion.button>
            ) : (
              <div className="px-6 py-2.5 border border-[rgba(255,68,68,0.3)] rounded-lg text-[#ff6666] font-orbitron text-sm tracking-wider">
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
            <div className="container mx-auto px-4 py-6 space-y-4">
              {NAV_ITEMS.map((item) => (
                <motion.button
                  key={item.name}
                  whileHover={{ x: 8 }}
                  onClick={() => scrollTo(item.href)}
                  className="block w-full text-left py-2 text-[rgba(176,255,176,0.7)] hover:text-[#00ff41] font-mono-matrix text-sm tracking-widest transition-colors"
                >
                  &gt; {item.name}
                </motion.button>
              ))}
              <button
                onClick={() => scrollTo("#register")}
                className="btn-primary w-full text-center block py-3 mt-2"
              >
                {isRegistrationOpen ? "REGISTER NOW" : "REG. CLOSED"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}