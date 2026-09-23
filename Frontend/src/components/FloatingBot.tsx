import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Bot, X, ChevronRight } from "lucide-react";

export default function FloatingBot() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-5 left-4 sm:bottom-6 sm:left-6 z-40 flex flex-col items-start">
      {/* Speech Bubble Popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: "spring", damping: 25 }}
            className="mb-3 w-[85vw] max-w-72 glass p-4 rounded-2xl border-cyan-400/40 shadow-[0_0_30px_rgba(0,242,254,0.25)] bg-[#050f24]/95 text-left relative"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
              className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              aria-label="Close message"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span className="font-orbitron font-bold text-xs text-white">YUGA-BOT 3.0</span>
            </div>

            <p className="text-xs font-space text-slate-300 mb-3 leading-relaxed">
              Welcome to <strong>YUGANTRAN 3.0</strong>! 14 Battles across AI, CTF, Coding & Robotics await you.
            </p>

            <div className="space-y-1.5">
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/register");
                }}
                className="w-full btn-primary text-xs py-2 px-3 justify-center shadow-cyan-500/20"
              >
                <span>REGISTER FOR FEST</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/events");
                }}
                className="w-full btn-outline text-xs py-1.5 px-3 justify-center text-slate-300"
              >
                <span>EXPLORE EVENTS</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Mascot Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="relative group p-2 rounded-full glass border-cyan-400/40 shadow-[0_0_25px_rgba(0,242,254,0.35)] bg-[#03091e]/90 flex items-center justify-center transition-all"
        title="Yugantran 3.0 Bot"
      >
        <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md group-hover:bg-cyan-400/40 transition-all" />

        {/* Animated Bot Avatar */}
        <motion.img
          animate={{ y: [-3, 3, -3] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          src="/images/bot/bot.png"
          alt="Yugantran 3.0 Mascot Bot"
          className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_0_14px_rgba(0,242,254,0.6)]"
        />

        {/* Pulse Indicator */}
        <span className="absolute top-1 left-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 border border-black" />
        </span>
      </motion.button>
    </div>
  );
}
