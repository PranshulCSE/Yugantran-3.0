import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { publicApi } from "../lib/api";
import { User, Zap, Linkedin, Mail } from "lucide-react";
import "./Team.css";

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
              className="card group transition-transform duration-300 mx-auto"
            >
              <div className="card__inner">
                <div className="card__cover">
                  {m.image ? (
                    <img
                      src={m.image}
                      alt={m.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full aspect-[3/4] flex items-center justify-center bg-cyan-950/40">
                      <User className="w-12 h-12 text-cyan-500 opacity-50" />
                    </div>
                  )}
                </div>
                
                <div className="card__body">
                  <h3 className="card__header" style={{ fontSize: "1.1rem" }}>{m.name}</h3>
                  <p className="card__role" style={{ fontSize: "0.7rem" }}>
                    {m.role}
                  </p>
                  
                  <div className="chips" style={{ marginTop: "0.5rem" }}>
                    {/* LinkedIn */}
                    {m.linkedin && m.linkedin !== "#" && (
                      <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="button" style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }} title="LinkedIn">
                        <Linkedin className="icon" /> 
                      </a>
                    )}

                    {/* Email */}
                    {m.email && (
                      <a href={`mailto:${m.email}`} className="button" style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }} title="Email">
                        <Mail className="icon" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
