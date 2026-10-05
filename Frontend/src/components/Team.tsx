import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { publicApi } from "../lib/api";
import { Linkedin, User, Users, Mail, Check, Copy } from "lucide-react";
import "./Team.css";

import { TeamMember } from "../types";

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
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
      className="card group transition-transform duration-300 mx-auto"
    >
      <div className="card__inner">
        <div className="card__cover">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={member.name}
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full aspect-[3/4] flex flex-col items-center justify-center bg-cyan-950/40">
              <User className="w-16 h-16 text-cyan-500 opacity-50" />
            </div>
          )}
        </div>
        
        <div className="card__body">
          <h3 className="card__header">{member.name}</h3>
          <p className="card__role">
            {member.role}
          </p>
          <p className="card__dept line-clamp-1">
            {member.department || "School of Computer Science & Engineering"}
          </p>
          
          <div className="chips">
            {/* LinkedIn */}
            {member.linkedin && member.linkedin !== "#" ? (
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="button" title="LinkedIn">
                <Linkedin className="icon" /> LinkedIn
              </a>
            ) : (
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="button" title="LinkedIn">
                <Linkedin className="icon" /> LinkedIn
              </a>
            )}

            {/* Email */}
            <a 
              href={`mailto:${member.email || `${member.name.toLowerCase().replace(/\s+/g, '')}@geetauniversity.edu.in`}`} 
              className="button"
            >
              <Mail className="icon" /> Email
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Team() {
  const ref = useRef(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [activeTab, setActiveTab] = useState<"core" | "volunteer">("core");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    publicApi
      .getTeam(activeTab)
      .then((r) => setMembers(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeTab]);

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
          <h1 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black mb-4">
            <span className="anim-silver-royal">Organizing Committee</span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg font-body">
            The driving force behind YUGANTRAN 3.0 at Geeta University.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center items-center gap-4 mt-4 mb-8">
          <button
            onClick={() => setActiveTab("core")}
            className={`px-8 py-3 rounded-full font-orbitron text-xs sm:text-sm font-bold tracking-widest transition-all border ${
              activeTab === "core"
                ? "anim-silver-bg shadow-[0_0_15px_rgba(209,213,219,0.5)]"
                : "glass border-transparent hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400"
            }`}
          >
            <span>CORE TEAM</span>
          </button>
          <button
            onClick={() => setActiveTab("volunteer")}
            className={`px-8 py-3 rounded-full font-orbitron text-xs sm:text-sm font-bold tracking-widest transition-all border ${
              activeTab === "volunteer"
                ? "anim-silver-bg shadow-[0_0_15px_rgba(209,213,219,0.5)]"
                : "glass border-transparent hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400"
            }`}
          >
            <span>VOLUNTEERS</span>
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20 min-h-[300px]">
            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center flex flex-col items-center justify-center py-20 min-h-[300px] text-slate-500 dark:text-slate-400 font-space">
            {activeTab === "volunteer" ? (
              <div className="space-y-3">
                <div className="text-4xl">✨</div>
                <p className="text-lg">Plot twist: We are all the Core Team!</p>
                <p className="text-sm opacity-70">Volunteer applications will open closer to the event.</p>
              </div>
            ) : (
              <p>No team members found for this category.</p>
            )}
          </div>
        ) : (
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
          >
            {members.map((m, i) => (
              // @ts-ignore
              <MemberCard key={m._id || m.id || i} member={m} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
