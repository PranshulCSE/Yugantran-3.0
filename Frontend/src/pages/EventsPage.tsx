import { motion } from "motion/react";
import { Link } from "react-router-dom";
import Events from "../components/Events";
import { Zap, Sparkles, ArrowRight, Trophy } from "lucide-react";

export default function EventsPage() {
  return (
    <div className="pt-28 pb-20 space-y-16">
      {/* 1. Header */}
      <section className="container mx-auto px-4 lg:px-8 text-center max-w-3xl">
        <div className="section-tag mb-4">
          <Zap className="w-3.5 h-3.5" />
          <span>OFFICIAL COMPETITION DIRECTORY</span>
        </div>

        <h1 className="font-orbitron font-black text-4xl sm:text-6xl text-white mb-4">
          All 14 <span className="gradient-text">Battlegrounds</span>
        </h1>

        <p className="text-slate-300 text-lg font-body leading-relaxed">
          From AI Warzones to Esports Tournaments — pick your arena, examine the rounds, and
          register your team for glory.
        </p>
      </section>

      {/* 2. Events Component with Search, Filters & Modal */}
      <Events />

      {/* 3. Bottom CTA Banner */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="glass p-8 sm:p-12 rounded-3xl border-cyan-400/40 text-center max-w-4xl mx-auto space-y-4">
          <Trophy className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="font-orbitron font-black text-2xl sm:text-3xl text-white">
            Have You Picked Your Arena?
          </h3>
          <p className="text-slate-300 text-sm font-space">
            Directly register your team members and upload payment receipt for instant confirmation.
          </p>
          <div className="pt-2">
            <Link to="/register" className="btn-primary text-xs py-3.5 px-8 inline-flex items-center gap-2">
              <span>PROCEED TO SQUAD REGISTRATION</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
