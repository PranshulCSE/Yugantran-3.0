import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { publicApi } from "../lib/api";
import { Linkedin, User, Users, Mail, Check, Copy } from "lucide-react";
import "./Team.css";

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
