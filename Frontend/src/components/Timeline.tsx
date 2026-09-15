import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Clock } from "lucide-react";

const SCHEDULE = [
  { day: "Oct 27", time: "09:00 AM", event: "Registration & Check-in", desc: "Participant verification and kit distribution" },
  { day: "Oct 27", time: "10:00 AM", event: "Opening Ceremony", desc: "Inaugural session & keynote address" },
  { day: "Oct 27", time: "11:00 AM", event: "Events Begin", desc: "AI Warzone, Cyber Escape, Code Sprint, Tech Treasure 2.0" },
  { day: "Oct 27", time: "01:00 PM", event: "Lunch Break", desc: "Networking and team strategy time" },
  { day: "Oct 27", time: "02:00 PM", event: "Afternoon Events", desc: "Bug Hunt, Git Wars, Hardware Hack, Startup in 60" },
  { day: "Oct 27", time: "05:00 PM", event: "Day 1 Results", desc: "Leaderboard update and evening wrap-up" },
  { day: "Oct 28", time: "09:30 AM", event: "Day 2 Kickoff", desc: "Dead Code, Autonomous Race, Tech Olympics begin" },
  { day: "Oct 28", time: "11:00 AM", event: "Gaming Arena", desc: "BGMI, Free Fire & Tekken 7 tournaments" },
  { day: "Oct 28", time: "02:00 PM", event: "Finals & Demos", desc: "Tech Olympics finals, Hardware demonstrations" },
  { day: "Oct 28", time: "04:00 PM", event: "Closing Ceremony", desc: "Prize distribution, awards and certificates" },
];

export default function Timeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const day1 = SCHEDULE.filter((s) => s.day === "Oct 27");
  const day2 = SCHEDULE.filter((s) => s.day === "Oct 28");

  const DayTimeline = ({ label, items, delayBase }: { label: string; items: typeof SCHEDULE; delayBase: number }) => (
    <div>
      <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[rgba(0,255,65,0.25)] bg-[rgba(0,255,65,0.06)]">
        <div className="w-2 h-2 rounded-full bg-[#00ff41]" />
        <span className="font-orbitron text-xs text-[#00ff41] tracking-widest">{label}</span>
      </div>
      <div className="relative">
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-[rgba(0,255,65,0.12)]" />
        <div className="space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: delayBase + i * 0.07 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-full border border-[rgba(0,255,65,0.25)] bg-[rgba(0,255,65,0.06)] flex items-center justify-center flex-shrink-0 z-10">
                <Clock className="w-4 h-4 text-[#00ff41]" />
              </div>
              <div className="glass glass-hover p-4 rounded-xl flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-orbitron text-sm text-[#00ff41]">{item.event}</span>
                  <span className="font-mono-matrix text-xs text-[rgba(176,255,176,0.4)]">{item.time}</span>
                </div>
                <p className="text-[rgba(176,255,176,0.5)] text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section id="timeline" ref={ref} className="relative py-24 overflow-visible">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <span className="section-tag">// SCHEDULE</span>
          <h2 className="font-orbitron text-4xl md:text-5xl mt-6 mb-4">
            Event <span className="gradient-text">Timeline</span>
          </h2>
          <p className="text-[rgba(176,255,176,0.45)] font-mono-matrix text-sm tracking-wider">
            27–28 OCTOBER 2026 // GEETA UNIVERSITY, PANIPAT
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          <DayTimeline label="DAY 1 — OCT 27" items={day1} delayBase={0.1} />
          <DayTimeline label="DAY 2 — OCT 28" items={day2} delayBase={0.3} />
        </div>
      </div>
    </section>
  );
}
