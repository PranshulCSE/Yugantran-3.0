import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { publicApi } from "../lib/api";
import { Linkedin, User, Users, Mail, Sparkles, ExternalLink } from "lucide-react";

function MemberCard({ member, index }: { member: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      whileHover={{ y: -6 }}
      className="glass glass-hover rounded-3xl overflow-hidden group border-cyan-500/20 hover:border-cyan-400/50 flex flex-col justify-between"
    >
      {/* Photo Container */}
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
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-950/40 to-slate-950">
            <User className="w-16 h-16 text-cyan-400/30" />
          </div>
        )}

        {/* Cyber Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 rounded-full bg-[#020617]/85 border border-cyan-400/40 text-[10px] font-orbitron font-bold text-cyan-300 backdrop-blur-md shadow-md">
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

        <p className="text-slate-400 text-xs font-mono-matrix mb-4">
          {member.department || "School of Computer Science & Engineering"}
        </p>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
          {member.linkedin && member.linkedin !== "#" && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-xs font-space font-medium text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-all duration-200"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
          )}
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title={member.email}
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Team() {
  const ref = useRef(null);
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    publicApi
      .getTeam("core")
      .then((r) => setMembers(r.data))
      .catch(() => {});
  }, []);

  return (
    <section id="team" ref={ref} className="relative py-0 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="section-tag mb-4">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>LEADERSHIP & ARCHITECTS</span>
          </div>

          <h1 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            Organizing <span className="gradient-text">Committee</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg font-body">
            The visionary student leads and coordinators driving YUGANTRAN 3.0 at the School of
            Computer Science & Engineering, Geeta University.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {members.map((m, i) => (
            <MemberCard key={m._id || m.id || i} member={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
