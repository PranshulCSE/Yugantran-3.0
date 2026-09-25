import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Trophy, Bot, Shield, Code, Palette, Rocket, Star, Medal, Award, CheckCircle2, Sparkles } from "lucide-react";
import { publicApi } from "../lib/api";

const ICON_MAP: Record<string, any> = {
  Trophy, Bot, Shield, Code, Palette, Rocket, Star, Medal, Award,
};

export default function Awards() {
  const ref = useRef(null);
  const [awards, setAwards] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    publicApi
      .getAwards()
      .then((r) => setAwards(r.data))
      .catch(() => {});
    publicApi
      .getSettings()
      .then((r) => setSettings(r.data))
      .catch(() => {});
  }, []);

  const totalPrizePool = settings?.totalPrizePool || "₹73,000+";

  return (
    <section id="awards" ref={ref} className="relative py-0 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="section-tag mb-4">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            <span>HONORS & RECOGNITION</span>
          </div>

          <h1 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            Bounties & <span className="gradient-text">Special Awards</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg font-body">
            Recognition that goes beyond trophies — celebrating engineering mastery, algorithmic speed,
            innovation, and teamwork.
          </p>
        </motion.div>

        {/* Mega Prize Pool Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="glass p-6 sm:p-10 rounded-3xl border-amber-400/40 shadow-[0_0_50px_rgba(251,191,36,0.15)] text-center relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/15 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.3)]">
              <Trophy className="w-8 h-8" />
            </div>
            <div className="font-orbitron font-black text-3xl sm:text-5xl text-white">
              {totalPrizePool} <span className="text-amber-400">TOTAL PRIZE POOL</span>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm font-space">
              Direct cash prizes + Official Winner Trophies + Merit & Participation Certificates for all registered students.
            </p>
          </div>
        </motion.div>

        {/* Award Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {awards.map((award, i) => {
            const Icon = ICON_MAP[award.icon] || Trophy;
            return (
              <motion.div
                key={award._id || award.title || i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: Math.min(i * 0.04, 0.32), duration: 0.3 }}
                className="glass glass-hover p-6 rounded-3xl text-center flex flex-col justify-between group border-cyan-500/20 hover:border-cyan-400/50"
              >
                <div>
                  <div
                    className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      background: `${award.color}15`,
                      border: `1px solid ${award.color}35`,
                      boxShadow: `0 0 25px ${award.color}20`,
                    }}
                  >
                    <Icon className="w-7 h-7" style={{ color: award.color }} />
                  </div>

                  <span
                    className="text-[10px] font-orbitron font-bold tracking-wider px-2.5 py-0.5 rounded-full border mb-2 inline-block"
                    style={{
                      color: award.color,
                      borderColor: `${award.color}35`,
                      background: `${award.color}10`,
                    }}
                  >
                    {award.subtitle?.toUpperCase()}
                  </span>

                  <h3 className="font-orbitron font-bold text-base sm:text-lg text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {award.title}
                  </h3>

                  <p className="text-slate-300 text-xs font-body leading-relaxed mb-4">
                    {award.desc}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-slate-800/80">
                  <span className="text-xs font-orbitron font-bold" style={{ color: award.color }}>
                    {award.prize}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Participation Perks Section */}
        <div className="glass p-6 sm:p-8 rounded-3xl border-cyan-500/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            {[
              {
                title: "Official Certificates",
                desc: "Verified digital and physical certificates accredited by School of Computer Science & Engineering, Geeta University.",
                icon: CheckCircle2,
              },
              {
                title: "Industry Mentorship",
                desc: "Direct networking with startup mentors, hackathon judges, and industry professionals.",
                icon: Sparkles,
              },
              {
                title: "Grand Trophies & Swag",
                desc: "Custom engraved YUGANTRAN 3.0 championship trophies, medals, and hacker swag kits.",
                icon: Trophy,
              },
            ].map((perk, idx) => (
              <div key={idx} className="flex flex-col md:flex-row items-center md:items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center flex-shrink-0 text-cyan-400">
                  <perk.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-orbitron font-bold text-sm text-white mb-1">{perk.title}</h4>
                  <p className="text-slate-400 text-xs font-body leading-relaxed">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
