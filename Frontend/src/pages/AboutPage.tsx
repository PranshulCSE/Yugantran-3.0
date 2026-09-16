import { motion } from "motion/react";
import { Link } from "react-router-dom";
import About from "../components/About";
import {
  Sparkles,
  Building2,
  GraduationCap,
  MapPin,
  FileText,
  Download,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20 space-y-24">
      {/* 1. Page Header */}
      <section className="container mx-auto px-4 lg:px-8 text-center max-w-3xl">
        <div className="section-tag mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FESTIVAL INTEL & VISION</span>
        </div>

        <h1 className="font-orbitron font-black text-4xl sm:text-6xl text-white mb-6">
          About <span className="gradient-text">YUGANTRAN 3.0</span>
        </h1>

        <p className="text-slate-300 text-lg font-body leading-relaxed">
          The official proposal & annual technical festival organized by the{" "}
          <strong className="text-cyan-400">School of Computer Science & Engineering (SCSE)</strong>,{" "}
          <strong className="text-white">Geeta University, Panipat</strong>.
        </p>

        {/* Geeta University 3 Parallel Logos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center justify-items-center max-w-4xl mx-auto pt-8">
          <div className="p-3 rounded-2xl bg-white/95 border border-cyan-500/30 shadow-[0_0_20px_rgba(0,242,254,0.15)] flex items-center justify-center w-full max-w-[260px] h-24 hover:scale-105 transition-transform duration-300">
            <img
              src="/images/Geeta/univ-1.jpg"
              alt="Geeta University Logo 1"
              className="max-h-16 w-auto object-contain"
            />
          </div>

          <div className="p-3 rounded-2xl bg-white/95 border border-cyan-500/30 shadow-[0_0_20px_rgba(0,242,254,0.15)] flex items-center justify-center w-full max-w-[260px] h-24 hover:scale-105 transition-transform duration-300">
            <img
              src="/images/Geeta/univ-2.jpg"
              alt="Geeta University Logo 2"
              className="max-h-16 w-auto object-contain"
            />
          </div>

          <div className="p-3 rounded-2xl bg-white/95 border border-cyan-500/30 shadow-[0_0_20px_rgba(0,242,254,0.15)] flex items-center justify-center w-full max-w-[260px] h-24 hover:scale-105 transition-transform duration-300">
            <img
              src="/images/Geeta/univ-3.jpg"
              alt="Geeta University Logo 3"
              className="max-h-16 w-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* 2. Core About Section Component (Tracks, Downloads, Evolution) */}
      <About />

      {/* 3. Leadership & Academic Patronage */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="glass p-8 sm:p-12 rounded-3xl border-cyan-500/25 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 text-center sm:text-left">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-5 shadow-[0_0_25px_rgba(0,242,254,0.4)]">
                <GraduationCap className="w-10 h-10 text-slate-950" />
              </div>

              <span className="text-xs font-orbitron font-bold text-cyan-400 tracking-wider uppercase">
                ACADEMIC PATRONAGE
              </span>

              <h3 className="font-orbitron font-black text-2xl text-white mt-1">
                Dr. Meenu Gupta
              </h3>

              <p className="text-slate-400 text-sm font-space">
                Head of School (HoS)<br />
                School of Computer Science & Engineering<br />
                Geeta University, Panipat
              </p>
            </div>

            <div className="lg:col-span-8 space-y-4 border-t lg:border-t-0 lg:border-l border-slate-800 pt-6 lg:pt-0 lg:pl-8">
              <h4 className="font-orbitron font-bold text-lg text-white">
                Message From The Head of School
              </h4>

              <p className="text-slate-300 text-sm sm:text-base font-body leading-relaxed">
                "YUGANTRAN represents the pinnacle of experiential technical learning at Geeta University.
                With edition 3.0, we are thrilled to welcome bright minds, coders, and innovators from
                institutions nationwide to push the boundaries of Artificial Intelligence, Cybersecurity,
                and Disruptive Engineering."
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-space text-slate-300">
                  ⚡ 500+ National Participants
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-space text-slate-300">
                  🏆 ₹73,000+ Prize Bounty
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-space text-slate-300">
                  🗓️ October 27–28, 2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Campus Infrastructure & Venue */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="glass p-8 sm:p-12 rounded-3xl border-cyan-500/25">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="section-tag mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>VENUE INTEL</span>
              </div>

              <h3 className="font-orbitron font-black text-2xl sm:text-3xl text-white">
                State-of-the-Art Campus Facilities
              </h3>

              <p className="text-slate-300 text-sm sm:text-base font-body leading-relaxed">
                Geeta University provides world-class high-performance computing labs, dedicated
                esports arenas, autonomous drone/robotics tracks, and modern auditorium facilities
                to deliver a seamless hackathon experience.
              </p>

              <div className="space-y-2 pt-2 text-sm font-space text-slate-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Gigabit High-Speed LAN & WiFi across all labs</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>24/7 Power Backup & Technical Command Center</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Canteen & Refreshment Desks for attendees</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <h4 className="font-orbitron font-bold text-sm text-white">LOCATION DETAILS</h4>
              <p className="text-slate-300 text-sm font-space">
                Geeta University Campus, NH-44, GT Road, Naultha, Panipat-Delhi NCR, Haryana 132145
              </p>

              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=Geeta+University+Panipat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-xs py-3 px-6 flex items-center justify-center gap-2 w-full"
                >
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>OPEN IN GOOGLE MAPS</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bottom Navigation Bar */}
      <section className="container mx-auto px-4 lg:px-8 text-center">
        <div className="flex flex-wrap justify-center items-center gap-4">
          <Link to="/events" className="btn-primary text-xs py-3.5 px-8">
            <span>EXPLORE ALL 14 EVENTS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/register" className="btn-outline text-xs py-3.5 px-8">
            <span>REGISTER NOW</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
