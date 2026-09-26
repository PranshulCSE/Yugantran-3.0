import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { publicApi } from "../lib/api";
import { Linkedin, User, Users, Mail, Check, Copy } from "lucide-react";

function MemberCard({ member, index }: { member: any; index: number }) {
  const [imgSrc, setImgSrc] = useState(member.image || "");
  const [copied, setCopied] = useState(false);

  // Fallback image handling
  const handleImageError = () => {
    // If it was .jpg, try .jpeg or .png fallback
    if (imgSrc.endsWith(".jpg")) {
      setImgSrc(imgSrc.replace(".jpg", ".jpeg"));
    } else if (imgSrc.endsWith(".jpeg")) {
      setImgSrc(imgSrc.replace(".jpeg", ".png"));
    } else {
      setImgSrc("");
    }
  };

  const copyEmail = (e: React.MouseEvent) => {
    if (!member.email) return;
    navigator.clipboard.writeText(member.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      whileHover={{ y: -6 }}
      className="glass glass-hover p-4 rounded-3xl overflow-hidden group flex flex-col justify-between border-cyan-500/20 hover:border-cyan-400/50 shadow-xl transition-all duration-300"
    >
      <div>
        {/* Photo Container with Elegant Padding & Cyber Frame */}
        <div className="relative w-full aspect-[4/4.6] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-cyan-500/20 dark:border-cyan-500/30 shadow-inner group/photo">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={member.name}
              className="w-full h-full object-cover object-top group-hover/photo:scale-105 transition-transform duration-500 ease-out"
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-cyan-950/20 to-slate-900/60 dark:from-cyan-950/40 dark:to-slate-950 p-4">
              <div className="w-16 h-16 rounded-full bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400 font-orbitron font-black text-xl mb-2">
                {member.name ? member.name.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
              </div>
              <span className="font-orbitron text-xs font-bold text-cyan-300 tracking-wider">
                {member.name}
              </span>
            </div>
          )}

          {/* Clean Subtle Gradient at Bottom of Photo */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none opacity-80 group-hover:opacity-60 transition-opacity" />

          {/* Category Tag Badge */}
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-1 rounded-full bg-slate-950/85 border border-cyan-400/40 text-[10px] font-orbitron font-bold text-cyan-300 backdrop-blur-md shadow-md">
              CORE LEAD
            </span>
          </div>

          {/* Subtle Cyber Corner Marks */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/50 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400/50 pointer-events-none" />
        </div>

        {/* Member Intel / Info */}
        <div className="pt-4 pb-2 px-1">
          <h3 className="font-orbitron font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-cyan-500 dark:group-hover:text-cyan-300 transition-colors">
            {member.name}
          </h3>

          <p className="text-cyan-600 dark:text-cyan-400 text-xs font-space font-semibold mb-1">
            {member.role}
          </p>

          <p className="text-slate-500 dark:text-slate-400 text-xs font-mono-matrix line-clamp-1">
            {member.department || "School of Computer Science & Engineering"}
          </p>
        </div>
      </div>

      {/* Social & Contact Actions (LinkedIn + Email) */}
      <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800/80">
        <div className="grid grid-cols-2 gap-2">
          {/* LinkedIn Button */}
          {member.linkedin && member.linkedin !== "#" ? (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-500/30 text-xs font-space font-semibold text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-400 transition-all duration-200 shadow-sm"
              title={`${member.name}'s LinkedIn`}
            >
              <Linkedin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>LinkedIn</span>
            </a>
          ) : (
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-500/30 text-xs font-space font-semibold text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-400 transition-all duration-200 shadow-sm"
              title={`${member.name}'s LinkedIn`}
            >
              <Linkedin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>LinkedIn</span>
            </a>
          )}

          {/* Email Option Button */}
          {member.email ? (
            <a
              href={`mailto:${member.email}`}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-space font-semibold text-slate-700 dark:text-slate-300 hover:bg-purple-600 hover:text-white hover:border-purple-500 dark:hover:bg-purple-500 dark:hover:text-slate-950 transition-all duration-200 shadow-sm"
              title={`Email: ${member.email}`}
            >
              <Mail className="w-3.5 h-3.5 flex-shrink-0 text-purple-600 dark:text-purple-400 group-hover:text-inherit" />
              <span>Email</span>
            </a>
          ) : (
            <a
              href={`mailto:${member.name.toLowerCase()}@geetauniversity.edu.in`}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-space font-semibold text-slate-700 dark:text-slate-300 hover:bg-purple-600 hover:text-white hover:border-purple-500 dark:hover:bg-purple-500 dark:hover:text-slate-950 transition-all duration-200 shadow-sm"
              title={`Email ${member.name}`}
            >
              <Mail className="w-3.5 h-3.5 flex-shrink-0 text-purple-600 dark:text-purple-400 group-hover:text-inherit" />
              <span>Email</span>
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

          <h1 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Organizing <span className="gradient-text">Committee</span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg font-body">
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
