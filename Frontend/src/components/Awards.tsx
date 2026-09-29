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

          <h1 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Winners & <span className="gradient-text">Certificates</span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base md:text-lg font-body">
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
          <div className="max-w-2xl mx-auto space-y-4 relative z-10 flex flex-col items-center justify-center">
            <div className="font-orbitron font-black text-5xl sm:text-7xl text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_0_25px_rgba(251,191,36,0.6)]">
              {totalPrizePool}
            </div>
            <div className="font-orbitron font-bold text-xl sm:text-3xl text-slate-900 dark:text-white tracking-[0.2em] uppercase">
              Total Prize Pool
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-space mt-2">
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

                  <h3 className="font-orbitron font-bold text-lg sm:text-xl text-slate-900 dark:text-white mb-2 group-hover:text-cyan-500 dark:group-hover:text-cyan-300 transition-colors">
                    {tier.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-body leading-relaxed mb-6">
                    {tier.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80">
                  <span className="text-xs font-orbitron font-bold" style={{ color: tier.color }}>
                    {tier.highlight}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>


      </div>
    </section>
  );
}
