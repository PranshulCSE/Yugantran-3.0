import { motion } from "motion/react";
import React, { useRef, useState } from "react";
import { Clock, Zap, MapPin, CalendarDays } from "lucide-react";
import "./Timeline.css";

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
    title: "Pixelverse, Git Wars & Hardware Hack",
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

const TimelineItem = ({ item, globalIdx, handleMouseMove }: { item: any; globalIdx: number; handleMouseMove: any }) => {
  const isEven = globalIdx % 2 === 0;
  const [isCenter, setIsCenter] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      className={`relative flex flex-col sm:flex-row items-start ${
        isEven ? "sm:flex-row-reverse" : ""
      } gap-6 sm:gap-12 w-full`}
    >
      {/* Central Glowing Dot */}
      <div className={`timeline-dot mt-6 sm:mt-8 ${isCenter ? 'active-center' : ''}`} />

      {/* Content Card */}
      <motion.div 
        className={`w-full sm:w-1/2 pl-10 sm:pl-0 ${isEven ? "sm:text-right" : ""}`}
        onViewportEnter={() => setIsCenter(true)}
        onViewportLeave={() => setIsCenter(false)}
        viewport={{ margin: "-35% 0px -35% 0px" }}
      >
        <div 
          className={`timeline-card group ${isCenter ? 'active-center' : ''}`} 
          onMouseMove={handleMouseMove}
        >
          <div
            className={`flex flex-wrap items-center gap-3 mb-4 ${
              isEven ? "sm:justify-end" : "justify-start"
            }`}
          >
            <span className="px-3 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-950/40 border border-cyan-300 dark:border-cyan-400/30 text-cyan-800 dark:text-cyan-300 font-space text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,242,254,0.2)]">
              <Clock className="w-4 h-4" />
              {item.time}
            </span>

            <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 font-inter text-[10px] sm:text-xs font-bold tracking-[0.1em] uppercase">
              {item.category}
            </span>
          </div>

          <h3 className={`font-space font-bold text-lg sm:text-2xl mb-2 tracking-tight transition-colors ${isCenter ? 'text-cyan-600 dark:text-cyan-300' : 'text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-300'}`}>
            {item.title}
          </h3>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-inter leading-relaxed mb-4">
            {item.desc}
          </p>

          <div
            className={`flex items-center gap-2 text-xs sm:text-sm font-space ${
              isEven ? "sm:justify-end" : "justify-start"
            } ${isCenter ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400'}`}
          >
            <MapPin className="w-4 h-4 text-cyan-500" />
            <span className="uppercase tracking-widest">{item.location}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Timeline() {
  const ref = useRef(null);
  const [activeDay, setActiveDay] = useState<1 | 2>(1);
  const currentSchedule = activeDay === 1 ? SCHEDULE_DAY1 : SCHEDULE_DAY2;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  const renderSchedule = (schedule: typeof SCHEDULE_DAY1, startIndex: number) => {
    return schedule.map((item, index) => (
      <TimelineItem 
        key={startIndex + index} 
        item={item} 
        globalIdx={startIndex + index} 
        handleMouseMove={handleMouseMove} 
      />
    ));
  };

  return (
    <section id="timeline" ref={ref} className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="font-orbitron text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            Festival <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-green-500 dark:from-cyan-400 dark:to-green-400 drop-shadow-[0_0_15px_rgba(0,242,254,0.4)]">Timeline</span>
          </h1>

          <p className="text-slate-600 dark:text-slate-400 font-inter text-sm sm:text-base leading-relaxed">
            Unveiling 2 Days of Pure Innovation • October 27–28, 2026 • Geeta University
          </p>
        </motion.div>

        {/* Day Toggle Buttons */}
        <div className="flex justify-center items-center gap-4 sm:gap-8 mt-2 relative z-20">
          <button 
            className={`iridescent ${activeDay === 1 ? 'active' : ''}`}
            onClick={() => setActiveDay(1)}
          >
            <CalendarDays className="w-5 h-5" /> DAY 1
            <span className="drop-shadow"></span>
          </button>
          
          <button 
            className={`iridescent ${activeDay === 2 ? 'active' : ''}`}
            onClick={() => setActiveDay(2)}
          >
            <CalendarDays className="w-5 h-5" /> DAY 2
            <span className="drop-shadow"></span>
          </button>
        </div>

        {/* Timeline Container */}
        <div className="max-w-5xl mx-auto relative pt-8 pb-16">
          {/* Vertical Glowing Neon Line */}
          <div className="timeline-line" />

          <div className="space-y-16 sm:space-y-24">
            {/* Active Day Items */}
            {renderSchedule(currentSchedule, 0)}
          </div>
        </div>
      </div>
    </section>
  );
}
