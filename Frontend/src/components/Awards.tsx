import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Trophy, Award, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { publicApi } from "../lib/api";

export default function Awards() {
  const ref = useRef(null);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    publicApi
      .getSettings()
      .then((r) => setSettings(r.data))
      .catch(() => {});
  }, []);

  const totalPrizePool = settings?.totalPrizePool || "₹54,000+";

  const recognitionTiers = [
    {
      title: "Event Winners & Trophies",
      subtitle: "1st Position Champions",
      desc: "Official YUGANTRAN 3.0 Winner Trophies, cash bounties, and Merit Certificates awarded to champions across all 10 technical events.",
      icon: Trophy,
      color: "#fbbf24",
      highlight: "Winner Trophy + Cash Bounty",
    },
    {
      title: "Runners-Up & Merit Recognition",
      subtitle: "Podium Finishers",
      desc: "Official Certificates of Merit presented to 1st & 2nd runners-up across every competition category.",
      icon: Award,
      color: "#00f2fe",
      highlight: "Merit Certificate of Excellence",
    },
    {
      title: "Participation Certificates",
      subtitle: "Every Registered Participant",
      desc: "Accredited Certificate of Participation issued by the School of Computer Science & Engineering (SCSE), Geeta University for all participants.",
      icon: CheckCircle2,
      color: "#00ff41",
      highlight: "Official Participation Certificate",
    },
  ];

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
            Winners & <span className="gradient-text">Certificates</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg font-body">
            Rewarding technical excellence across all 10 competitions with cash bounties, official winner trophies,
            and accredited certificates for all participants.
          </p>
        </motion.div>

        {/* Prize Pool Showcase Banner */}
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

        {/* Recognition Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recognitionTiers.map((tier, i) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                className="glass glass-hover p-7 rounded-3xl text-center flex flex-col justify-between group border-cyan-500/20 hover:border-cyan-400/50"
              >
                <div>
                  <div
                    className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      background: `${tier.color}15`,
                      border: `1px solid ${tier.color}35`,
                      boxShadow: `0 0 25px ${tier.color}20`,
                    }}
                  >
                    <Icon className="w-8 h-8" style={{ color: tier.color }} />
                  </div>

                  <span
                    className="text-[10px] font-orbitron font-bold tracking-wider px-3 py-1 rounded-full border mb-3 inline-block"
                    style={{
                      color: tier.color,
                      borderColor: `${tier.color}35`,
                      background: `${tier.color}10`,
                    }}
                  >
                    {tier.subtitle.toUpperCase()}
                  </span>

                  <h3 className="font-orbitron font-bold text-lg sm:text-xl text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {tier.title}
                  </h3>

                  <p className="text-slate-300 text-xs sm:text-sm font-body leading-relaxed mb-6">
                    {tier.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <span className="text-xs font-orbitron font-bold" style={{ color: tier.color }}>
                    {tier.highlight}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Certificate Assurance */}
        <div className="glass p-6 sm:p-8 rounded-3xl border-cyan-500/20">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center flex-shrink-0 text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-orbitron font-bold text-sm sm:text-base text-white mb-1">
                Verified Accreditation & Certificates
              </h4>
              <p className="text-slate-300 text-xs sm:text-sm font-body leading-relaxed">
                Every student registered for any of the 10 competitions receives an accredited Certificate of Participation
                endorsed by the School of Computer Science & Engineering, Geeta University.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
