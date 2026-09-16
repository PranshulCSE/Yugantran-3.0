import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { publicApi } from "../lib/api";
import { Linkedin, User, Users, Sparkles, Shield, Award } from "lucide-react";

function MemberCard({ member, index }: { member: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="glass glass-hover rounded-3xl overflow-hidden group border-cyan-500/20 hover:border-cyan-400/60 flex flex-col justify-between"
    >
      {/* Photo Container with Holographic Overlay */}
      <div className="relative h-64 bg-slate-900 overflow-hidden">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-950/30 to-blue-950/40">
            <User className="w-20 h-20 text-cyan-400/30" />
          </div>
        )}

        {/* Gradient Cyber Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/30 to-transparent" />

        {/* Floating Category Pill */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 rounded-full bg-slate-950/80 border border-cyan-400/30 text-[10px] font-orbitron font-bold text-cyan-300 backdrop-blur-md">
            CORE LEAD
          </span>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-6 pt-2">
        <h3 className="font-orbitron font-bold text-lg text-white mb-1 group-hover:text-cyan-300 transition-colors">
          {member.name}
        </h3>

        <p className="text-cyan-400 text-xs font-space font-semibold mb-1">{member.role}</p>

        <p className="text-slate-400 text-xs font-mono-matrix mb-4">{member.department}</p>

        {member.linkedin && member.linkedin !== "#" && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-xs font-space font-medium text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-all duration-200"
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span>Connect on LinkedIn</span>
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function Team() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    publicApi
      .getTeam("core")
      .then((r) => setMembers(r.data))
      .catch(() => {});
  }, []);

  return (
    <section id="team" ref={ref} className="relative py-28 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="section-tag mb-4">
            <Users className="w-3.5 h-3.5" />
            <span>LEADERSHIP & ARCHITECTS</span>
          </div>

          <h2 className="font-orbitron text-4xl sm:text-5xl font-black text-white mb-4">
            Organizing <span className="gradient-text">Committee</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg font-body">
            The visionary faculty leads and MCA final-year organizers driving YUGANTRAN 3.0 at Geeta University.
          </p>
        </motion.div>

        {members.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {members.map((m, i) => (
              <MemberCard key={m._id} member={m} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500 font-mono-matrix">
            Loading team intel...
          </div>
        )}
      </div>
    </section>
  );
}
