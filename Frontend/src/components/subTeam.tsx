import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { publicApi } from "../lib/api";
import { User, Zap } from "lucide-react";

export default function SubTeam() {
  const ref = useRef(null);
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    publicApi
      .getTeam("subteam")
      .then((r) => setMembers(r.data))
      .catch(() => {});
  }, []);

  if (!members.length) return null;

  return (
    <section id="subteam" ref={ref} className="relative pt-6 pb-20 md:pt-8 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <div className="section-tag mb-3">
            <Zap className="w-3 h-3" />
            <span>COMMUNITY CREW</span>
          </div>

          <h2 className="font-orbitron text-3xl sm:text-4xl font-black text-white mb-3">
            Student <span className="gradient-text">Volunteers</span>
          </h2>

          <p className="text-slate-400 text-sm font-space">
            The operational force powering logistics, technical coordination, and attendee experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {members.map((m, i) => (
            <motion.div
              key={m._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass glass-hover p-4 rounded-2xl text-center border-cyan-500/15"
            >
              <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden border border-cyan-400/30 bg-slate-900 shadow-md">
                {m.image ? (
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-8 h-8 text-cyan-400/40" />
                  </div>
                )}
              </div>

              <h4 className="font-orbitron font-bold text-xs text-white mb-0.5 truncate">
                {m.name}
              </h4>
              <p className="text-[11px] font-space text-cyan-400/90 truncate">{m.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
