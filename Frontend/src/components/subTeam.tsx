import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { publicApi } from "../lib/api";
import { User } from "lucide-react";

export default function SubTeam() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    publicApi.getTeam("subteam").then((r) => setMembers(r.data)).catch(() => {});
  }, []);

  if (!members.length) return null;

  return (
    <section id="subteam" ref={ref} className="relative py-16 overflow-visible">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="section-tag">// VOLUNTEER TEAM</span>
          <h2 className="font-orbitron text-3xl md:text-4xl mt-6 mb-3">
            Our <span className="gradient-text">Volunteers</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {members.map((m, i) => (
            <motion.div
              key={m._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="glass glass-hover p-4 rounded-xl text-center"
            >
              <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden border border-[rgba(0,255,65,0.2)] bg-[rgba(0,255,65,0.04)]">
                {m.image ? (
                  <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-8 h-8 text-[rgba(0,255,65,0.3)]" />
                  </div>
                )}
              </div>
              <p className="font-orbitron text-xs text-[#00ff41] mb-1">{m.name}</p>
              <p className="text-[rgba(176,255,176,0.4)] text-xs">{m.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
