import { motion } from "motion/react";
import { Link } from "react-router-dom";
import Awards from "../components/Awards";
import { Trophy, Sparkles, Award, ArrowRight } from "lucide-react";

export default function AwardsPage() {
  return (
    <div className="pt-28 pb-20 space-y-16">
      {/* 1. Header */}
      <section className="container mx-auto px-4 lg:px-8 text-center max-w-3xl">
        <div className="section-tag mb-4">
          <Trophy className="w-3.5 h-3.5" />
          <span>BOUNTIES & PRIZE POOL</span>
        </div>

        <h1 className="font-orbitron font-black text-4xl sm:text-6xl text-white mb-4">
          Awards & <span className="gradient-text">Recognition</span>
        </h1>

        <p className="text-slate-300 text-lg font-body leading-relaxed">
          ₹73,000+ total prize cash, champion trophies, sponsor goodies, and verified certificates.
        </p>
      </section>

      {/* 2. Awards Showcase */}
      <Awards />

      {/* 3. Certificate Guarantee Card */}
      <section className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div className="glass p-8 sm:p-12 rounded-3xl border-cyan-500/25 text-center space-y-4">
          <Award className="w-12 h-12 text-cyan-400 mx-auto" />
          <h3 className="font-orbitron font-black text-2xl sm:text-3xl text-white">
            Official Certificates For All Participants
          </h3>
          <p className="text-slate-300 text-sm font-space max-w-xl mx-auto">
            Every registered student attending YUGANTRAN 3.0 receives an official University Certificate
            of Participation, verified by SCSE, Geeta University.
          </p>
          <div className="pt-2">
            <Link to="/register" className="btn-primary text-xs py-3.5 px-8 inline-flex items-center gap-2">
              <span>REGISTER NOW TO PARTICIPATE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
