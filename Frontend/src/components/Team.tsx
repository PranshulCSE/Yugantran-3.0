import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { publicApi } from "../lib/api";
import { Linkedin, User } from "lucide-react";

function MemberCard({ member, index }: { member: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ y: -8 }}
      className="glass glass-hover rounded-xl overflow-hidden group"
    >
      {/* Photo */}
      <div className="relative h-56 bg-[rgba(0,255,65,0.04)]">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-16 h-16 text-[rgba(0,255,65,0.2)]" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[rgba(0,0,0,0.1)] to-transparent" />
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-orbitron text-sm text-[#00ff41] mb-1 tracking-wide">{member.name}</h3>
        <p className="text-[rgba(176,255,176,0.6)] text-sm mb-1">{member.role}</p>
        <p className="font-mono-matrix text-xs text-[rgba(176,255,176,0.3)] mb-3">{member.department}</p>
        {member.linkedin && member.linkedin !== "#" && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#00ccff] hover:text-[#44ddff] text-xs transition-colors"
          >
            <Linkedin className="w-3 h-3" /> LinkedIn
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
    publicApi.getTeam("core")
      .then((r) => setMembers(r.data))
      .catch(() => {});
  }, []);

  return (
    <section id="team" ref={ref} className="relative py-24 overflow-visible">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <span className="section-tag">// ORGANIZING COMMITTEE</span>
          <h2 className="font-orbitron text-4xl md:text-5xl mt-6 mb-4">
            Meet the <span className="gradient-text">Team</span>
          </h2>
          <p className="text-[rgba(176,255,176,0.5)] text-lg max-w-2xl mx-auto">
            The people behind YUGANTRAN 3.0 — dedicated and passionate individuals working to make this unforgettable.
          </p>
        </motion.div>

        {members.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {members.map((m, i) => <MemberCard key={m._id} member={m} index={i} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-[rgba(176,255,176,0.3)] font-mono-matrix">
            Loading team...
          </div>
        )}
      </div>
    </section>
  );
}
