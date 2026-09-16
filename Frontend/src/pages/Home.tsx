import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import { publicApi } from "../lib/api";
import {
  Zap,
  ArrowRight,
  Sparkles,
  Trophy,
  Bot,
  Shield,
  Code2,
  Cpu,
  Rocket,
  Gamepad2,
  Calendar,
  CheckCircle2,
  Users,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);

  useEffect(() => {
    publicApi
      .getEvents()
      .then((res) => {
        setFeaturedEvents(res.data.slice(0, 6));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-28">
      {/* 1. Main NextGen Hero Section */}
      <Hero />

      {/* 2. Featured Battles Spotlight */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="section-tag mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>FLAGSHIP COMPETITIONS</span>
            </div>
            <h2 className="font-orbitron font-black text-3xl sm:text-4xl text-white">
              Featured <span className="gradient-text">Battlegrounds</span>
            </h2>
          </div>

          <Link
            to="/events"
            className="btn-outline text-xs py-3 px-6 flex items-center gap-2 self-start sm:self-auto"
          >
            <span>VIEW ALL 14 EVENTS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map((event) => (
            <Link
              key={event._id}
              to={`/events/${event.slug}`}
              className="glass glass-hover p-6 rounded-3xl border-cyan-500/20 hover:border-cyan-400/60 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-orbitron font-bold px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300">
                    {event.category?.toUpperCase()}
                  </span>
                  <span className="font-orbitron font-bold text-sm text-amber-400">
                    {event.prize}
                  </span>
                </div>

                <h3 className="font-orbitron font-bold text-xl text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {event.name}
                </h3>

                <p className="text-slate-300 text-sm font-body line-clamp-2 mb-6">
                  {event.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-mono-matrix text-slate-400">Entry: ₹{event.fee}</span>
                <span className="text-xs font-space font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Explore Intel</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. 6 Core Tracks Banner */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="glass p-8 sm:p-12 rounded-3xl border-cyan-500/30 shadow-2xl relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-orbitron font-bold text-cyan-400 tracking-widest uppercase">
              DOMAINS & SPECIALIZATIONS
            </span>
            <h2 className="font-orbitron font-black text-3xl sm:text-4xl text-white mt-2">
              Engineered For Modern Devs
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: Bot, name: "GenAI & LLMs", color: "#00f2fe" },
              { icon: Shield, name: "Cyber CTF", color: "#f43f5e" },
              { icon: Code2, name: "Sprint Code", color: "#38bdf8" },
              { icon: Cpu, name: "IoT & Robotics", color: "#2dd4bf" },
              { icon: Rocket, name: "Startup 60s", color: "#a855f7" },
              { icon: Gamepad2, name: "Esports Arena", color: "#ec4899" },
            ].map((track, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center hover:border-cyan-400/40 transition-all flex flex-col items-center justify-center gap-3"
              >
                <track.icon className="w-8 h-8" style={{ color: track.color }} />
                <span className="font-space font-semibold text-xs text-slate-200">
                  {track.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Ready to Compete Call To Action */}
      <section className="container mx-auto px-4 lg:px-8 pb-12">
        <div className="glass p-10 sm:p-14 rounded-3xl border-cyan-400/40 text-center relative overflow-hidden shadow-[0_0_60px_rgba(0,242,254,0.15)]">
          <div className="max-w-2xl mx-auto space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,242,254,0.5)]">
              <Trophy className="w-8 h-8 text-slate-950" />
            </div>

            <h2 className="font-orbitron font-black text-3xl sm:text-5xl text-white">
              Ready to Claim the <span className="gradient-text">₹73,000+ Bounty</span>?
            </h2>

            <p className="text-slate-300 text-base font-body leading-relaxed">
              Registrations are active for all university students. Form your squad, choose your
              tracks, and compete at Geeta University on October 27–28, 2026.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
              <Link to="/register" className="btn-primary text-sm py-4 px-8 shadow-cyan-500/40">
                <span>REGISTER YOUR SQUAD NOW</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link to="/about" className="btn-outline text-sm py-4 px-8">
                <span>LEARN ABOUT FEST</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
