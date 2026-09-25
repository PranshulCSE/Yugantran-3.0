import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { publicApi } from "../lib/api";
import { User, Zap, Linkedin, Mail } from "lucide-react";

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
    <section id="subteam" ref={ref} className="relative pt-14 pb-0 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="section-tag mb-3">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>COMMUNITY CREW</span>
          </div>

          <h2 className="font-orbitron text-2xl sm:text-3xl font-black text-white mb-3">
            Student <span className="gradient-text">Volunteers & Coordinators</span>
          </h2>

          <p className="text-slate-400 text-xs sm:text-sm font-space">
            The operational team powering event management, marketing, discipline, and technical logistics.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5">
          {members.map((m, i) => (
            <motion.div
              key={m._id || m.id || i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass glass-hover p-5 rounded-3xl text-center border-cyan-500/15 flex flex-col items-center justify-between"
            >
              <div>
                <div className="w-20 h-20 rounded-full mx-auto mb-3.5 overflow-hidden border-2 border-cyan-400/40 bg-slate-900 shadow-md">
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

                <h4 className="font-orbitron font-bold text-sm text-white mb-0.5 truncate">
                  {m.name}
                </h4>
                <p className="text-xs font-space text-cyan-400 font-semibold mb-2">{m.role}</p>
              </div>

              {m.linkedin && m.linkedin !== "#" && (
                <a
                  href={m.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-space text-slate-400 hover:text-cyan-300 transition-colors"
                >
                  <Linkedin className="w-3 h-3" />
                  <span>LinkedIn</span>
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
