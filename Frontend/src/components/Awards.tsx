import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Trophy, Award, CheckCircle2, ShieldCheck, Zap, ArrowRight } from "lucide-react";
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

  const totalPrizePool = settings?.totalPrizePool || "₹21,000+";

  const recognitionTiers = [
    {
      title: "The Champions",
      subtitle: "1st Position",
      desc: "Claim the ultimate prize: exclusive trophies, cash bounties, and champion certificates.",
      icon: Trophy,
      color: "#fbbf24",
      highlight: "Trophy + Cash Bounty",
    },
    {
      title: "Podium Finishers",
      subtitle: "2nd & 3rd Position",
      desc: "Official Certificates of Merit recognizing your exceptional technical prowess.",
      icon: Award,
      color: "#00f2fe",
      highlight: "Merit Certificate",
    },
    {
      title: "Every Challenger",
      subtitle: "All Participants",
      desc: "Accredited participation certificates from SCSE, Geeta University for stepping into the arena.",
      icon: CheckCircle2,
      color: "#00ff41",
      highlight: "Participation Certificate",
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

          <h1 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black mb-4">
            <span className="anim-silver-royal">Winners & Certificates</span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base md:text-lg font-body">
            Honoring technical brilliance with cash bounties, exclusive trophies, and accredited certificates.
          </p>
        </motion.div>

        {/* Prize Pool Showcase Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="max-w-4xl mx-auto glass p-6 sm:p-10 text-center relative overflow-visible electric-card-container shadow-[0_0_50px_rgba(251,191,36,0.15)]"
        >
          <svg className="absolute w-0 h-0 pointer-events-none">
            <defs>
              <filter id="turbulent-displace" colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="3" result="noise1" seed="1" />
                <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
                  <animate attributeName="dy" values="700; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
                </feOffset>
                <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="3" result="noise2" seed="1" />
                <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
                  <animate attributeName="dy" values="0; -700" dur="6s" repeatCount="indefinite" calcMode="linear" />
                </feOffset>
                <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="3" result="noise1" seed="2" />
                <feOffset in="noise1" dx="0" dy="0" result="offsetNoise3">
                  <animate attributeName="dx" values="490; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
                </feOffset>
                <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="3" result="noise2" seed="2" />
                <feOffset in="noise2" dx="0" dy="0" result="offsetNoise4">
                  <animate attributeName="dx" values="0; -490" dur="6s" repeatCount="indefinite" calcMode="linear" />
                </feOffset>
                <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
                <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
                <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />
                <feDisplacementMap in="SourceGraphic" in2="combinedNoise" scale="12" xChannelSelector="R" yChannelSelector="B" />
              </filter>
            </defs>
          </svg>
          <div className="electric-inner-container">
            <div className="electric-border-outer"></div>
            <div className="electric-main-card"></div>
            <div className="electric-glow-layer-1"></div>
            <div className="electric-glow-layer-2"></div>
          </div>
          <div className="max-w-2xl mx-auto space-y-4 relative z-10 flex flex-col items-center justify-center">
            <div className="font-orbitron font-black text-5xl sm:text-7xl text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_0_25px_rgba(251,191,36,0.6)]">
              {totalPrizePool}
            </div>
            <div className="font-orbitron font-bold text-xl sm:text-3xl text-slate-900 dark:text-white tracking-[0.2em] uppercase">
              Total Prize Pool
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-space mt-2">
              Honoring technical brilliance with cash bounties, exclusive trophies, and accredited certificates.
            </p>
          </div>
        </motion.div>

        {/* Recognition Tiers Flowchart */}
        <div className="relative mt-8 sm:mt-16 max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-stretch justify-between gap-12 md:gap-6">
          
          {/* Glowing Track Line (Desktop) */}
          <div className="absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent -translate-y-1/2 hidden md:block z-0" />
          
          {/* Glowing Track Line (Mobile) */}
          <div className="absolute left-1/2 top-[5%] bottom-[5%] w-[2px] bg-gradient-to-b from-transparent via-cyan-500/40 to-transparent -translate-x-1/2 block md:hidden z-0" />

          {recognitionTiers.map((tier, i) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                className="relative z-10 flex flex-col items-center text-center group w-full md:w-1/3"
              >
                <div 
                  className="glass p-6 sm:p-8 rounded-[2rem] w-full max-w-[320px] flex flex-col items-center hover:bg-white/10 transition-all duration-300 relative z-10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] h-full"
                  style={{
                    border: `1px solid ${tier.color}30`
                  }}
                >
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                    style={{
                      background: `${tier.color}15`,
                      border: `1px solid ${tier.color}40`,
                    }}
                  >
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: tier.color }} />
                  </div>

                  <span
                    className="text-[9px] sm:text-[10px] font-orbitron font-bold tracking-wider px-3 py-1 rounded-full border mb-4 inline-block"
                    style={{
                      color: tier.color,
                      borderColor: `${tier.color}35`,
                      background: `${tier.color}10`,
                    }}
                  >
                    {tier.subtitle.toUpperCase()}
                  </span>

                  <h3 className="font-orbitron font-black tracking-wide text-lg sm:text-xl text-slate-900 dark:text-white mb-2" style={{ textShadow: `0 0 10px ${tier.color}30` }}>
                    {tier.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 text-[11px] sm:text-xs font-space leading-snug sm:leading-relaxed mb-6 flex-1">
                    {tier.desc}
                  </p>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 w-full">
                    <span className="text-[10px] sm:text-xs font-orbitron font-bold" style={{ color: tier.color }}>
                      {tier.highlight}
                    </span>
                  </div>
                </div>

                {/* Connecting Arrows for Desktop (except last) */}
                {i < recognitionTiers.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 translate-x-1/2 items-center text-cyan-500/50 z-0">
                    <ArrowRight className="w-5 h-5 animate-pulse" />
                  </div>
                )}
                
                {/* Connecting Arrows for Mobile (except last) */}
                {i < recognitionTiers.length - 1 && (
                  <div className="flex md:hidden absolute -bottom-8 left-1/2 -translate-x-1/2 items-center text-cyan-500/50 z-0">
                    <ArrowRight className="w-5 h-5 rotate-90 animate-pulse" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>


      </div>
    </section>
  );
}
