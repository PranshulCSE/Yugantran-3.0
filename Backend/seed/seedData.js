/**
 * YUGANTRAN 3.0 — Seed Script
 * Populates MongoDB with all dummy data
 * Run: node seed/seedData.js
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env") });

import Admin from "../models/Admin.js";
import Event from "../models/Event.js";
import Team from "../models/Team.js";
import Settings from "../models/Settings.js";

const EVENTS = [
  {
    name: "AI Warzone",
    slug: "ai-warzone",
    category: "ai",
    description: "Battle of Human Intelligence vs Artificial Intelligence — prompts, detection, debugging & building.",
    longDescription: "AI Warzone is the ultimate showdown between human creativity and machine intelligence. Teams compete across 4 intense rounds testing their mastery over AI tools, prompt engineering, critical thinking and rapid prototyping.",
    icon: "Bot",
    gradient: "from-green-400 to-emerald-600",
    fee: 100,
    prize: "₹8,000",
    teamType: "team",
    minTeam: 2,
    maxTeam: 4,
    rounds: [
      { name: "Round 1 — Prompt Battle", description: "Compete to generate the best AI output using effective prompts for given tasks." },
      { name: "Round 2 — AI Detective", description: "Identify hallucinations, manipulated info and flaws in AI-generated content." },
      { name: "Round 3 — AI Debugger", description: "Receive AI-generated buggy code and fix it under time pressure." },
      { name: "Round 4 — AI Build Challenge", description: "Use AI tools to build a functional prototype for a real-world problem." },
    ],
    whatsappLink: "#",
    isActive: true,
    order: 1,
  },
  {
    name: "Cyber Escape",
    slug: "cyber-escape",
    category: "cybersecurity",
    description: "The network has been breached. Decode, investigate and escape before time runs out.",
    longDescription: "A cybersecurity-themed escape room challenge. Teams solve cryptographic puzzles, web-based clues, digital forensics, metadata analysis and CTF-style challenges across multiple stages to retrieve the final security key.",
    icon: "Shield",
    gradient: "from-red-400 to-rose-600",
    fee: 80,
    prize: "₹6,000",
    teamType: "team",
    minTeam: 2,
    maxTeam: 3,
    rounds: [
      { name: "Stage 1 — Breach Point", description: "Decrypt the initial message to identify the attack vector." },
      { name: "Stage 2 — Digital Forensics", description: "Analyze metadata, hidden files and network logs for clues." },
      { name: "Stage 3 — CTF Challenge", description: "Solve Capture The Flag challenges to progress." },
      { name: "Final Stage — Security Key", description: "Combine all clues to retrieve the final security code." },
    ],
    whatsappLink: "#",
    isActive: true,
    order: 2,
  },
  {
    name: "Code Sprint",
    slug: "code-sprint",
    category: "coding",
    description: "Build a working prototype for a real-world problem in limited time. Speed, logic and execution.",
    longDescription: "A rapid software development competition. Teams receive a real-world problem statement and must build a working prototype within the time limit. Judged on functionality, code quality, UI and problem relevance.",
    icon: "Terminal",
    gradient: "from-blue-400 to-cyan-600",
    fee: 60,
    prize: "₹5,000",
    teamType: "team",
    minTeam: 2,
    maxTeam: 3,
    rounds: [
      { name: "Problem Reveal", description: "Problem statement revealed — teams plan their approach." },
      { name: "Build Phase", description: "3 hours to build the complete working prototype." },
      { name: "Demo & Evaluation", description: "Live demonstration and code walkthrough to judges." },
    ],
    whatsappLink: "#",
    isActive: true,
    order: 3,
  },
  {
    name: "Bug Hunt",
    slug: "bug-hunt",
    category: "swe",
    description: "Find what others miss. Hunt down bugs in intentionally broken software applications.",
    longDescription: "Participants receive intentionally defective software/web applications and must identify as many bugs as possible within the time limit. Points are awarded based on bug severity, accuracy and uniqueness.",
    icon: "Bug",
    gradient: "from-orange-400 to-amber-600",
    fee: 50,
    prize: "₹4,000",
    teamType: "team",
    minTeam: 1,
    maxTeam: 2,
    rounds: [
      { name: "Bug Hunt", description: "Identify and document as many bugs as possible in the given application within 90 minutes." },
    ],
    whatsappLink: "#",
    isActive: true,
    order: 4,
  },
  {
    name: "Git Wars",
    slug: "git-wars",
    category: "swe",
    description: "Real-world software engineering challenge — clone, branch, code, PR, resolve conflicts & merge.",
    longDescription: "A professional software engineering workflow challenge. Teams work with repositories containing intentional issues — merge conflicts, failed tests, bugs and incomplete features. Tests Git/GitHub mastery, collaboration and code review skills.",
    icon: "GitBranch",
    gradient: "from-purple-400 to-violet-600",
    fee: 60,
    prize: "₹4,000",
    teamType: "team",
    minTeam: 2,
    maxTeam: 3,
    rounds: [
      { name: "Clone & Setup", description: "Fork the repository and set up the development environment." },
      { name: "Feature Implementation", description: "Complete missing features and resolve existing bugs." },
      { name: "PR & Code Review", description: "Submit pull request, resolve conflicts and get it merged." },
    ],
    whatsappLink: "#",
    isActive: true,
    order: 5,
  },
  {
    name: "Tech Treasure 2.0",
    slug: "tech-treasure-2",
    category: "interactive",
    description: "QR codes → websites → encryption → source code → campus locations. The ultimate tech hunt.",
    longDescription: "An upgraded version of the original Tech Treasure. Participants follow a chain of digital and physical clues hidden inside QR codes, website source code, encrypted messages, image metadata and campus locations.",
    icon: "Search",
    gradient: "from-yellow-400 to-orange-500",
    fee: 60,
    prize: "₹5,000",
    teamType: "team",
    minTeam: 2,
    maxTeam: 3,
    rounds: [
      { name: "Digital Trail", description: "Follow QR codes and website clues to decode the next location." },
      { name: "Encryption Layer", description: "Decode encrypted messages using cryptographic techniques." },
      { name: "Campus Hunt", description: "Physical exploration of campus to find hidden clues." },
      { name: "Final Treasure", description: "Combine all codes to unlock the final treasure." },
    ],
    whatsappLink: "#",
    isActive: true,
    order: 6,
  },
  {
    name: "Startup in 60",
    slug: "startup-in-60",
    category: "innovation",
    description: "Idea → Prototype → Pitch. Transform a real-world problem into a startup in 60 minutes.",
    longDescription: "Teams receive a real-world problem and have 60 minutes to identify the problem, develop a solution, create a prototype, define target users, build a business model and pitch their idea to a panel of judges.",
    icon: "Rocket",
    gradient: "from-emerald-400 to-teal-600",
    fee: 80,
    prize: "₹6,000",
    teamType: "team",
    minTeam: 2,
    maxTeam: 4,
    rounds: [
      { name: "Ideation (15 min)", description: "Problem analysis and solution brainstorming." },
      { name: "Build (30 min)", description: "Create prototype, define business model and prepare pitch deck." },
      { name: "Pitch (15 min)", description: "Present to judges — 5 min pitch + 10 min Q&A." },
    ],
    whatsappLink: "#",
    isActive: true,
    order: 7,
  },
  {
    name: "Hardware Hack",
    slug: "hardware-hack",
    category: "iot",
    description: "Build. Connect. Innovate. Create a working IoT prototype using real hardware components.",
    longDescription: "Teams use Arduino, ESP32, sensors and other components to build a working IoT prototype around a given theme (Smart Campus, Smart Agriculture, Smart Home, etc.). Evaluated on functionality, innovation and presentation.",
    icon: "Cpu",
    gradient: "from-cyan-400 to-blue-600",
    fee: 100,
    prize: "₹7,000",
    teamType: "team",
    minTeam: 2,
    maxTeam: 3,
    rounds: [
      { name: "Theme Reveal & Planning", description: "Theme announced — teams plan their prototype architecture." },
      { name: "Build Phase", description: "3 hours to assemble and program the working prototype." },
      { name: "Demo Day", description: "Live demo and presentation to technical judges." },
    ],
    whatsappLink: "#",
    isActive: true,
    order: 8,
  },
  {
    name: "Dead Code",
    slug: "dead-code",
    category: "swe",
    description: "Can you bring a dead project back to life? Restore a broken software project under pressure.",
    longDescription: "Teams receive an incomplete or severely broken software project and must restore as much functionality as possible within the given time. Tests real-world debugging, code comprehension and problem-solving under pressure.",
    icon: "Zap",
    gradient: "from-red-500 to-orange-600",
    fee: 50,
    prize: "₹3,000",
    teamType: "team",
    minTeam: 2,
    maxTeam: 3,
    rounds: [
      { name: "Dead Code Challenge", description: "Analyze, debug and restore the broken project within 2 hours." },
    ],
    whatsappLink: "#",
    isActive: true,
    order: 9,
  },
  {
    name: "Autonomous Race",
    slug: "autonomous-race",
    category: "ai",
    description: "Program an autonomous bot to navigate a track — speed, precision and intelligence win.",
    longDescription: "Teams program an autonomous bot or simulated vehicle to navigate a predefined track. Scoring based on completion time, accuracy, collision avoidance and technical implementation. Simulation-based version available if hardware limited.",
    icon: "Car",
    gradient: "from-indigo-400 to-purple-600",
    fee: 100,
    prize: "₹8,000",
    teamType: "team",
    minTeam: 2,
    maxTeam: 4,
    rounds: [
      { name: "Track Preview", description: "Teams get 15 minutes to analyze the track and plan their bot logic." },
      { name: "Qualification Run", description: "First run to qualify for finals. Top 8 teams advance." },
      { name: "Finals", description: "Championship run — fastest and most accurate bot wins." },
    ],
    whatsappLink: "#",
    isActive: true,
    order: 10,
  },
  {
    name: "Tech Olympics",
    slug: "tech-olympics",
    category: "flagship",
    description: "The ultimate multi-domain flagship challenge. Compete across AI, Cyber, Coding, UI and Innovation.",
    longDescription: "YUGANTRAN 3.0's flagship event. Teams of 4 compete across 6 domains in sequence — Speed Coding, Bug Hunt, AI Challenge, Cyber Puzzle, UI Design and Innovation Pitch. Total scores determine the YUGANTRAN TECH OLYMPION.",
    icon: "Trophy",
    gradient: "from-yellow-400 to-amber-600",
    fee: 150,
    prize: "₹12,000",
    teamType: "team",
    minTeam: 4,
    maxTeam: 4,
    rounds: [
      { name: "Round 1 — Speed Coding", description: "Solve algorithmic challenges as fast as possible." },
      { name: "Round 2 — Bug Hunt", description: "Identify bugs in a given application." },
      { name: "Round 3 — AI Challenge", description: "Prompt engineering and AI reasoning tasks." },
      { name: "Round 4 — Cyber Puzzle", description: "Decode and solve a cybersecurity challenge." },
      { name: "Round 5 — UI Design", description: "Design a responsive UI in limited time." },
      { name: "Round 6 — Innovation Pitch", description: "Pitch a tech solution to solve a given problem." },
    ],
    whatsappLink: "#",
    isActive: true,
    order: 11,
  },
  // ─── GAMING ARENA ─────────────────────────────────
  {
    name: "BGMI",
    slug: "bgmi",
    category: "gaming",
    description: "Battle it out in Battlegrounds Mobile India. Squad up and dominate the battleground.",
    longDescription: "BGMI Squad Tournament — Teams of 4 compete in a knockout format. Multiple rounds with increasing difficulty. Top squads compete in the grand finals.",
    icon: "Gamepad2",
    gradient: "from-pink-400 to-rose-600",
    fee: 100,
    prize: "₹5,000",
    teamType: "team",
    minTeam: 4,
    maxTeam: 4,
    rounds: [
      { name: "Qualifier Matches", description: "Round-robin qualifying matches." },
      { name: "Semi Finals", description: "Top 8 squads compete." },
      { name: "Grand Finals", description: "Top 4 squads battle for the championship." },
    ],
    whatsappLink: "#",
    isActive: true,
    order: 12,
  },
  {
    name: "Free Fire",
    slug: "free-fire",
    category: "gaming",
    description: "Squad up for intense Free Fire combat. Prove your squad is the last one standing.",
    longDescription: "Free Fire Squad Tournament — Teams of 4 in a knockout format. Qualifier rounds followed by grand finals with top squads.",
    icon: "Gamepad2",
    gradient: "from-orange-400 to-red-600",
    fee: 100,
    prize: "₹3,000",
    teamType: "team",
    minTeam: 4,
    maxTeam: 4,
    rounds: [
      { name: "Qualifier Matches", description: "Group stage qualifier rounds." },
      { name: "Grand Finals", description: "Top squads compete for the championship." },
    ],
    whatsappLink: "#",
    isActive: true,
    order: 13,
  },
  {
    name: "Tekken 7",
    slug: "tekken-7",
    category: "gaming",
    description: "1v1 fighting tournament. Show your moves and dominate the Iron Fist Tournament.",
    longDescription: "Tekken 7 individual knockout tournament. 1v1 matches in a bracket format. Top 16 players compete in the knockout rounds leading to the grand finals.",
    icon: "Swords",
    gradient: "from-violet-400 to-purple-600",
    fee: 50,
    prize: "₹2,000",
    teamType: "individual",
    minTeam: 1,
    maxTeam: 1,
    rounds: [
      { name: "Registration Check", description: "Player check-in and seeding." },
      { name: "Knockout Rounds", description: "Single elimination bracket matches." },
      { name: "Grand Finals", description: "Best of 3 sets championship match." },
    ],
    whatsappLink: "#",
    isActive: true,
    order: 14,
  },
];

const TEAM = [
  // Core Team
  {
    name: "Pranshul",
    role: "Event Director",
    department: "MCA Final Year",
    image: "/images/team/pranshul.jpg",
    linkedin: "#",
    category: "core",
    order: 1,
  },
  {
    name: "Garima",
    role: "Co-Director",
    department: "MCA Final Year",
    image: "/images/team/garima.jpg",
    linkedin: "#",
    category: "core",
    order: 2,
  },
  {
    name: "Khushi Saini",
    role: "Technical Lead",
    department: "MCA Final Year",
    image: "/images/team/khushi.jpg",
    linkedin: "#",
    category: "core",
    order: 3,
  },
  {
    name: "Kunal Khandelwal",
    role: "Web Developer",
    department: "SCSE",
    image: "/images/team/kunal.jpg",
    linkedin: "#",
    category: "core",
    order: 4,
  },
  {
    name: "Tejasvi",
    role: "Design Lead",
    department: "SCSE",
    image: "/images/team/tejasvi.webp",
    linkedin: "#",
    category: "core",
    order: 5,
  },
  {
    name: "Himanshu",
    role: "Marketing Head",
    department: "SCSE",
    image: "/images/team/himanshu.jpg",
    linkedin: "#",
    category: "core",
    order: 6,
  },
  // Sub Team
  {
    name: "Anjali",
    role: "Event Coordinator",
    department: "SCSE",
    image: "/images/team/anjali.jpg",
    linkedin: "#",
    category: "subteam",
    order: 1,
  },
  {
    name: "Muskan",
    role: "Registration Team",
    department: "SCSE",
    image: "/images/team/muskan.jpg",
    linkedin: "#",
    category: "subteam",
    order: 2,
  },
  {
    name: "Palak",
    role: "Media & Promotions",
    department: "SCSE",
    image: "/images/team/palak.jpg",
    linkedin: "#",
    category: "subteam",
    order: 3,
  },
  {
    name: "Meet",
    role: "Technical Volunteer",
    department: "SCSE",
    image: "/images/team/meet.jpg",
    linkedin: "#",
    category: "subteam",
    order: 4,
  },
  {
    name: "Sahil",
    role: "IT Infrastructure",
    department: "SCSE",
    image: "/images/team/sahil.jpg",
    linkedin: "#",
    category: "subteam",
    order: 5,
  },
  {
    name: "Naveenta",
    role: "Hospitality Team",
    department: "SCSE",
    image: "/images/team/naveenta.jpg",
    linkedin: "#",
    category: "subteam",
    order: 6,
  },
  {
    name: "Sejal",
    role: "Event Coordinator",
    department: "SCSE",
    image: "/images/team/sejal.jpg",
    linkedin: "#",
    category: "subteam",
    order: 7,
  },
  {
    name: "Shaina",
    role: "Registration Team",
    department: "SCSE",
    image: "/images/team/shaina.jpg",
    linkedin: "#",
    category: "subteam",
    order: 8,
  },
  {
    name: "Suryansh",
    role: "Technical Volunteer",
    department: "SCSE",
    image: "/images/team/suryansh.jpg",
    linkedin: "#",
    category: "subteam",
    order: 9,
  },
];

async function seed() {
  try {
    console.log("🌱 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected!");

    // ─── Clear existing data ───────────────────────
    console.log("🧹 Clearing existing data...");
    await Promise.all([
      Admin.deleteMany({}),
      Event.deleteMany({}),
      Team.deleteMany({}),
      Settings.deleteMany({}),
    ]);

    // ─── Create Admin ───────────────────────────────
    console.log("👤 Creating admin...");
    const hashedPwd = await bcrypt.hash("Admin@GU.edu.in", 12);
    await Admin.create({
      username: "admin@yugantran.com",
      password: hashedPwd,
      name: "YUGANTRAN Admin",
      role: "superadmin",
    });
    console.log("✅ Admin created: admin@yugantran.com / Admin@GU.edu.in");

    // ─── Create Events ──────────────────────────────
    console.log("🎮 Seeding events...");
    await Event.insertMany(EVENTS);
    console.log(`✅ ${EVENTS.length} events created`);

    // ─── Create Team ────────────────────────────────
    console.log("👥 Seeding team...");
    await Team.insertMany(TEAM);
    console.log(`✅ ${TEAM.length} team members created`);

    // ─── Create Settings ────────────────────────────
    console.log("⚙️ Seeding settings...");
    await Settings.create({
      festName: "YUGANTRAN 3.0",
      theme: "Innovate. Build. Compete. Transform.",
      eventDateStart: new Date("2026-10-27T09:00:00+05:30"),
      eventDateEnd: new Date("2026-10-28T17:00:00+05:30"),
      registrationDeadline: new Date("2026-10-25T23:59:00+05:30"),
      isRegistrationOpen: true,
      venue: "Geeta University, Panipat-Delhi NCR, Haryana",
      totalPrizePool: "₹73,000+",
      upiId: "yugantran@upi",
      contactEmail: "yugantran@geetauniversity.edu.in",
      contactPhone: ["+91 92110 67540", "+91 90537 09750"],
      instagram: "https://www.instagram.com/geetauniversitypanipat/",
      linkedin: "https://www.linkedin.com/school/geeta-university-official/",
    });
    console.log("✅ Settings created");

    console.log("\n🎉 Database seeded successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Admin Login: admin@yugantran.com`);
    console.log(`Password:    Admin@GU.edu.in`);
    console.log(`Events:      ${EVENTS.length}`);
    console.log(`Team:        ${TEAM.length}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seed();
