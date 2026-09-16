import { motion } from "motion/react";
import { Link } from "react-router-dom";
import Timeline from "../components/Timeline";
import { Zap, Calendar, ArrowRight, MapPin } from "lucide-react";

export default function TimelinePage() {
  return (
    <div className="pt-28 pb-20 space-y-16">
      {/* 1. Header */}
      <section className="container mx-auto px-4 lg:px-8 text-center max-w-3xl">
        <div className="section-tag mb-4">
          <Calendar className="w-3.5 h-3.5" />
          <span>OFFICIAL EVENT ITINERARY</span>
        </div>

        <h1 className="font-orbitron font-black text-4xl sm:text-6xl text-white mb-4">
          Festival <span className="gradient-text">Timeline</span>
        </h1>

        <p className="text-slate-300 text-lg font-body leading-relaxed">
          Detailed hour-by-hour operational breakdown for October 27 & 28, 2026 at Geeta University.
        </p>
      </section>

      {/* 2. Timeline Component */}
      <Timeline />

      {/* 3. Venue & Reporting Notice */}
      <section className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div className="glass p-8 rounded-3xl border-cyan-500/25 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="font-orbitron font-bold text-lg text-white">
              Participant Reporting Time
            </h3>
            <p className="text-slate-300 text-sm font-space">
              All registered teams must report to the Reception Desk by 09:00 AM on Day 1 (Oct 27).
            </p>
          </div>

          <Link to="/register" className="btn-primary text-xs py-3 px-6 whitespace-nowrap">
            <span>REGISTER SQUAD</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
