import { motion } from "motion/react";
import { useRef, useState } from "react";
import { Clock, Calendar, Zap, MapPin, CheckCircle } from "lucide-react";

const SCHEDULE_DAY1 = [
  {
    time: "09:00 AM",
    title: "Participant Check-in & Intel Verification",
    category: "REGISTRATION",
    desc: "Badge verification, welcome kit distribution, team registration desk.",
    location: "Main Reception",
  },
  {
    time: "10:00 AM",
    title: "Grand Inaugural & Keynote Address",
    category: "CEREMONY",
    desc: "Welcome address by Dr. Meenu Gupta (HoS SCSE), dignitary address, and fest inauguration.",
    location: "Auditorium",
  },
  {
    time: "11:00 AM",
    title: "AI Warzone & Cyber Escape CTF (Round 1)",
    category: "FLAGSHIP",
    desc: "AI prompt battles and Capture The Flag security challenge kickoff.",
    location: "Lab Complex A & B",
  },
  {
    time: "01:00 PM",
    title: "Power Lunch & Hacker Networking",
    category: "BREAK",
    desc: "Refuel and network with mentors, judges, and fellow developers.",
    location: "Food Court",
  },
  {
    time: "02:00 PM",
    title: "Code Sprint, Git Wars & Hardware Hack",
    category: "TECH TRACKS",
    desc: "Speed coding, Git conflict resolution, and microcontroller robotics build.",
    location: "Computer Labs 3 & 4",
  },
  {
    time: "04:30 PM",
    title: "Startup in 60 Pitching Arena",
    category: "INNOVATION",
    desc: "60-second lightning pitches before investor & faculty judges.",
    location: "Seminar Hall",
  },
  {
    time: "06:00 PM",
    title: "Day 1 Leaderboard Update & Wrap-up",
    category: "LEADERBOARD",
    desc: "Announcement of Day 1 qualifiers and evening showcase.",
    location: "Main Stage",
  },
];

const SCHEDULE_DAY2 = [
  {
    time: "09:30 AM",
    title: "Day 2 Kickoff & Briefing",
    category: "INDUCTION",
    desc: "Overview of final rounds, esports brackets, and Tech Olympics schedule.",
    location: "Main Stage",
  },
  {
    time: "10:30 AM",
    title: "Autonomous Bot Racing & Dead Code Challenge",
    category: "HARDWARE & DEV",
    desc: "Obstacle track race for autonomous line followers and legacy code debugging.",
    location: "Tech Arena",
  },
  {
    time: "11:30 AM",
    title: "Esports Arena (BGMI, Free Fire, Tekken 7)",
    category: "GAMING",
    desc: "High-octane tournament brackets on big screens with live shoutcasting.",
    location: "Gaming Lounge",
  },
  {
    time: "01:00 PM",
    title: "Lunch & Live Tech Exhibitions",
    category: "EXHIBITION",
    desc: "Live project displays and sponsor booth interactions.",
    location: "Exhibition Hall",
  },
  {
    time: "02:30 PM",
    title: "Tech Olympics Grand Finale",
    category: "FINALS",
    desc: "Top multidisciplinary teams clash across all domains for the ultimate championship.",
    location: "Auditorium",
  },
  {
    time: "04:30 PM",
    title: "Grand Valedictory & Prize Distribution",
    category: "AWARDS",
    desc: "Distribution of ₹73,000+ prizes, trophies, certificates, and closing ceremony.",
    location: "Auditorium",
  },
];

export default function Timeline() {
  const ref = useRef(null);
  const [activeDay, setActiveDay] = useState<1 | 2>(1);

  const currentSchedule = activeDay === 1 ? SCHEDULE_DAY1 : SCHEDULE_DAY2;

  return (
    <section id="timeline" ref={ref} className="relative py-0 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="section-tag mb-4">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>EVENT SCHEDULE</span>
          </div>

          <h1 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Festival <span className="gradient-text">Timeline</span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 font-space text-sm sm:text-base">
            2 Days of Pure Innovation • October 27–28, 2026 • Geeta University, Panipat
          </p>
        </motion.div>

        {/* Day Toggle Selector */}
        <div className="flex justify-center">
          <div className="p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/60 backdrop-blur-xl flex items-center gap-2 shadow-lg">
            <button
              onClick={() => setActiveDay(1)}
              className={`px-6 py-3 rounded-xl font-orbitron font-bold text-xs tracking-wider transition-all duration-300 flex items-center gap-2.5 ${
                activeDay === 1
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_20px_rgba(0,242,254,0.4)]"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>DAY 1 — OCT 27</span>
            </button>

            <button
              onClick={() => setActiveDay(2)}
              className={`px-6 py-3 rounded-xl font-orbitron font-bold text-xs tracking-wider transition-all duration-300 flex items-center gap-2.5 ${
                activeDay === 2
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_20px_rgba(0,242,254,0.4)]"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>DAY 2 — OCT 28</span>
            </button>
          </div>
        </div>

        {/* Timeline Items in Circuit Style */}
        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Glowing Circuit Line */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 -translate-x-1/2 w-0.5 bg-gradient-to-b from-cyan-400 via-blue-500 to-emerald-400 opacity-40" />

          <div className="space-y-8">
            {currentSchedule.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={`${activeDay}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className={`relative flex flex-col sm:flex-row items-start ${
                    isEven ? "sm:flex-row-reverse" : ""
                  } gap-6 sm:gap-12`}
                >
                  {/* Central Node Indicator */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-100 dark:bg-[#020617] border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.6)] z-20">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  </div>

                  {/* Content Card */}
                  <div className={`w-full sm:w-1/2 pl-12 sm:pl-0 ${isEven ? "sm:text-right" : ""}`}>
                    <div className="glass glass-hover p-6 rounded-3xl border-cyan-500/20 shadow-lg">
                      <div
                        className={`flex flex-wrap items-center gap-2.5 mb-3 ${
                          isEven ? "sm:justify-end" : "justify-start"
                        }`}
                      >
                        <span className="px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-500/15 border border-cyan-300 dark:border-cyan-400/30 text-cyan-800 dark:text-cyan-300 font-mono-matrix text-xs font-bold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {item.time}
                        </span>

                        <span className="px-2.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-space text-[10px] font-semibold tracking-wider">
                          {item.category}
                        </span>
                      </div>

                      <h3 className="font-orbitron font-bold text-base sm:text-lg text-slate-900 dark:text-white mb-2">
                        {item.title}
                      </h3>

                      <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-body mb-3">{item.desc}</p>

                      <div
                        className={`flex items-center gap-1.5 text-xs font-mono-matrix text-slate-500 dark:text-slate-400 ${
                          isEven ? "sm:justify-end" : "justify-start"
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
