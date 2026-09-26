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

          <h2 className="font-orbitron text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3">
            Student <span className="gradient-text">Volunteers & Coordinators</span>
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-space">
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
              className="glass glass-hover p-4 sm:p-5 rounded-3xl text-center border-cyan-500/15 flex flex-col items-center justify-between shadow-lg"
            >
              <div className="w-full flex flex-col items-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl mx-auto mb-3.5 p-1 overflow-hidden border-2 border-cyan-400/40 bg-slate-100 dark:bg-slate-900 shadow-md">
                  <div className="w-full h-full rounded-xl overflow-hidden">
                    {m.image ? (
                      <img
                        src={m.image}
                        alt={m.name}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-cyan-950/20 text-cyan-400">
                        <User className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                </div>

                <h4 className="font-orbitron font-bold text-sm text-slate-900 dark:text-white mb-0.5 truncate max-w-full">
                  {m.name}
                </h4>
                <p className="text-xs font-space text-cyan-600 dark:text-cyan-400 font-semibold mb-2 line-clamp-1">{m.role}</p>
              </div>

              {/* Social Action Links */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/80 w-full justify-center">
                {m.linkedin && m.linkedin !== "#" && (
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                )}
                {m.email && (
                  <a
                    href={`mailto:${m.email}`}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-500 dark:hover:text-slate-950 transition-colors"
                    title={`Email ${m.email}`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
