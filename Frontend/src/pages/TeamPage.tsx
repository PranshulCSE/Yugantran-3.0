import { motion } from "motion/react";
import Team from "../components/Team";
import SubTeam from "../components/subTeam";
import { Users, Sparkles, GraduationCap } from "lucide-react";

export default function TeamPage() {
  return (
    <div className="pt-28 pb-20 space-y-16">
      {/* 1. Header */}
      <section className="container mx-auto px-4 lg:px-8 text-center max-w-3xl">
        <div className="section-tag mb-4">
          <Users className="w-3.5 h-3.5" />
          <span>FESTIVAL CREW & ORGANIZERS</span>
        </div>

        <h1 className="font-orbitron font-black text-4xl sm:text-6xl text-white mb-4">
          Organizing <span className="gradient-text">Committee</span>
        </h1>

        <p className="text-slate-300 text-lg font-body leading-relaxed">
          The faculty leaders, MCA final-year student organizers, and volunteer crew behind YUGANTRAN 3.0.
        </p>
      </section>

      {/* 2. Proposal Submitters Card */}
      <section className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div className="glass p-8 rounded-3xl border-cyan-500/30 text-center space-y-3">
          <span className="text-xs font-orbitron font-bold text-cyan-400 tracking-wider uppercase">
            CORE STUDENT ORGANIZERS (MCA FINAL YEAR)
          </span>
          <h3 className="font-orbitron font-black text-2xl text-white">
            Pranshul • Garima • Khushi Saini
          </h3>
          <p className="text-slate-400 text-xs font-space">
            School of Computer Science & Engineering • Geeta University, Panipat
          </p>
        </div>
      </section>

      {/* 3. Core Team Grid */}
      <Team />

      {/* 4. Sub-team / Volunteers Grid */}
      <SubTeam />
    </div>
  );
}
