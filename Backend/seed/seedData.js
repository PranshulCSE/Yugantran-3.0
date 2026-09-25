/**
 * YUGANTRAN 3.0 — Seed Script
 * Populates MongoDB with actual festival data
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
import Award from "../models/Award.js";
import Domain from "../models/Domain.js";

const EVENTS = [
  {
    name: "AI WARZONE",
    slug: "ai-warzone",
    category: "ai",
    description: "Human Intelligence × Artificial Intelligence. Prompt Wars: Create a Web or Mobile Application using AI & log prompts.",
    longDescription: "Prompt Wars: Participants must create a Web Application or Mobile Application using any AI tool/LLM. They must also document and showcase the prompts used during development in an AI_Log.md file. Objective: Build a functional application by effectively using AI tools while demonstrating how well participants can design, refine and utilize prompts throughout the development process. Skills Tested: Prompt Engineering, AI Literacy, Coding, Creativity & Problem Solving.",
    icon: "Bot",
    gradient: "from-cyan-400 to-blue-600",
    fee: 100,
    prize: "₹8,000",
    teamType: "team",
    minTeam: 1,
    maxTeam: 4,
    rounds: [
      { name: "Phase 1 — Prompt Architecture & Design", description: "Design the application concept, user journey and formulate core prompts." },
      { name: "Phase 2 — AI Prototyping & AI_Log.md Documentation", description: "Build the functional application and maintain a comprehensive log of all prompts in AI_Log.md." },
      { name: "Phase 3 — Live Evaluation & Prompt Defense", description: "Demonstrate the functional application and showcase the refinement process of your prompt engineering." },
    ],
    whatsappLink: "#",
    isActive: true,
    order: 1,
  },
  {
    name: "CYBER ESCAPE",
    slug: "cyber-escape",
    category: "cybersecurity",
    description: "“Think Fast. Stay Secure.” A cybersecurity-themed Quiz Competition on digital safety and cyber threats.",
    longDescription: "“Think Fast. Stay Secure.” A cybersecurity-themed Quiz Competition designed to test participants' knowledge of cybersecurity, digital safety and emerging cyber threats. Questions include cyber attacks, ethical hacking, networking, cryptography, malware, phishing, passwords, digital forensics, web security, data privacy and cybersecurity awareness. The quiz includes MCQs, scenario-based questions, rapid-fire questions and visual identification challenges. Accuracy and speed determine the score. Skills Tested: Cybersecurity Awareness, Technical Knowledge, Logical Reasoning, Digital Safety & Quick Decision Making.",
    icon: "Shield",
    gradient: "from-red-400 to-rose-600",
    fee: 80,
    prize: "₹6,000",
    teamType: "team",
    minTeam: 1,
    maxTeam: 3,
    rounds: [
      { name: "Round 1 — Rapid-Fire & Cyber MCQ Grid", description: "Fast-paced quiz covering networking, passwords, data privacy, and ethical hacking fundamentals." },
      { name: "Round 2 — Visual Identification & Malware Clues", description: "Spot phishing patterns, analyze visual attack vectors, and inspect digital forensics samples." },
      { name: "Round 3 — Real-World Scenario Defense", description: "Time-critical scenario questions and cryptographic challenges under pressure." },
    ],
    whatsappLink: "#",
    isActive: true,
    order: 2,
  },
  {
    name: "HUMAN vs AI",
    slug: "human-vs-ai",
    category: "ai",
    description: "“Who Thinks Better — Human or Machine?” Solve challenges in two modes: without AI, then with AI.",
    longDescription: "“Who Thinks Better — Human or Machine?” Participants solve a series of logical, coding and creative challenges in two modes — first without AI assistance and then with AI assistance. Objective: Compare the participant's approach, accuracy and problem-solving process across both modes and understand how effectively they can collaborate with AI rather than simply depend on it. Skills Tested: Critical Thinking, Problem Solving, Logical Reasoning, Adaptability & Human-AI Collaboration.",
    icon: "Terminal",
    gradient: "from-purple-400 to-indigo-600",
    fee: 80,
    prize: "₹6,000",
    teamType: "team",
    minTeam: 1,
    maxTeam: 2,
    rounds: [
      { name: "Mode 1 — Pure Human Logic (No AI)", description: "Solve algorithmic, logical, and creative challenges completely unassisted." },
      { name: "Mode 2 — AI-Collaborative Problem Solving", description: "Tackle higher-complexity challenges utilizing any AI tools for enhanced productivity." },
      { name: "Evaluation — Comparative Process Review", description: "Judges assess the problem-solving approach, accuracy gain, and depth of AI synergy." },
    ],
    whatsappLink: "#",
    isActive: true,
    order: 3,
  },
  {
    name: "CODE SPRINT",
    slug: "code-sprint",
    category: "coding",
    description: "Build Under Pressure. Rapid 2-hour software development to build a working prototype.",
    longDescription: "Build Under Pressure. A rapid software development competition in which participants receive a real-world problem statement and a limited amount of time (2 hours) to build a working prototype. Example challenges include Campus Lost & Found System, Smart Complaint Management, Student Productivity Platform, Event Management System, Campus Navigation System. Skills Tested: Rapid Prototyping, Full-Stack Development, Problem Solving, UI/UX & Code Quality.",
    icon: "Code",
    gradient: "from-blue-400 to-cyan-600",
    fee: 60,
    prize: "₹5,000",
    teamType: "team",
    minTeam: 2,
    maxTeam: 3,
    rounds: [
      { name: "Problem Reveal & Architecture (15 mins)", description: "Real-world problem statement revealed — teams plan tech stack and system architecture." },
      { name: "Sprint Build (2 Hours)", description: "Intense coding sprint to implement core features, database logic, and user interface." },
      { name: "Live Prototype Demo", description: "Live demonstration and feature walkthrough to the technical jury." },
    ],
    whatsappLink: "#",
    isActive: true,
    order: 4,
  },
  {
    name: "BUG HUNT",
    slug: "bug-hunt",
    category: "swe",
    description: "Can You Find What Others Miss? AI CodeFix: Clone a bug-filled repo & fix bugs using Any Tool.",
    longDescription: "Can You Find What Others Miss? AI CodeFix: Participants will be given a Repository which will be full of bugs, they will clone it & fix the bugs using Any Tool. Participants receive intentionally defective software/web applications and identify as many bugs as possible within the given time. Possible bugs include logical errors, validation errors, UI/UX issues, API issues, authentication problems, database-related issues and functional bugs. Points are awarded based on the severity and accuracy of the bugs identified.",
    icon: "Bug",
    gradient: "from-orange-400 to-amber-600",
    fee: 50,
    prize: "₹4,000",
    teamType: "team",
    minTeam: 1,
    maxTeam: 2,
    rounds: [
      { name: "Repo Clone & Defect Triage", description: "Clone the buggy repository and identify logical, validation, UI, and security flaws." },
      { name: "AI CodeFix & Patch Submission", description: "Fix and verify all bugs using any developer tools or AI assistants, submitting clean patches." },
    ],
    whatsappLink: "#",
    isActive: true,
    order: 5,
  },
  {
    name: "TECH TREASURE 2.0",
    slug: "tech-treasure-2",
    category: "interactive",
    description: "The Next Generation of Tech Treasure Hunt. QR Codes → Websites → Encryption → Source Code → Campus.",
    longDescription: "The Next Generation of Tech Treasure Hunt. An upgraded version of the previous Tech Treasure event. Participants encounter QR Codes → Websites → Encryption → Source Code → Campus Locations → Digital Clues → Physical Challenges. Clues may be hidden inside QR codes, websites, images, HTML source code, encoded messages, digital puzzles and campus locations. Combines technology, physical exploration and logical reasoning.",
    icon: "Search",
    gradient: "from-yellow-400 to-orange-500",
    fee: 60,
    prize: "₹5,000",
    teamType: "team",
    minTeam: 2,
    maxTeam: 3,
    rounds: [
      { name: "Stage 1 — Digital Trail & Source Code Inspection", description: "Decode hidden web comments, HTTP headers, and scan concealed QR codes." },
      { name: "Stage 2 — Cryptography & Metadata Decryption", description: "Uncover hidden information inside image metadata, ciphers, and steganography." },
      { name: "Stage 3 — Physical Campus Checkpoints & Vault Unlock", description: "Navigate campus physical coordinates and combine digital keys to claim victory." },
    ],
    whatsappLink: "#",
    isActive: true,
    order: 6,
  },
  {
    name: "STARTUP IN 60",
    slug: "startup-in-60",
    category: "innovation",
    description: "Idea → Prototype → Pitch. Transform a real-world problem into a startup in 60 minutes.",
    longDescription: "Idea → Prototype → Pitch. Teams receive a real-world problem and have limited time to identify the problem, develop a solution, create a prototype, define target users, prepare a business model and pitch their idea. Judging criteria: Innovation, problem relevance, technical feasibility, business potential and presentation.",
    icon: "Rocket",
    gradient: "from-emerald-400 to-teal-600",
    fee: 80,
    prize: "₹6,000",
    teamType: "team",
    minTeam: 2,
    maxTeam: 4,
    rounds: [
      { name: "Problem Discovery & Ideation (15 mins)", description: "Analyze the problem statement, define target demographics and outline the solution." },
      { name: "Prototype & Business Model (30 mins)", description: "Create a rapid mock prototype, financial outline, and concise pitch deck." },
      { name: "60-Second Pitch & Jury Q&A (15 mins)", description: "Deliver a high-impact 60-second venture pitch followed by judge evaluation." },
    ],
    whatsappLink: "#",
    isActive: true,
    order: 7,
  },
  {
    name: "HARDWARE HACK",
    slug: "hardware-hack",
    category: "iot",
    description: "Build. Connect. Innovate. Develop a working IoT prototype using hardware components.",
    longDescription: "Build. Connect. Innovate. An IoT-based challenge where teams develop a working prototype using available hardware components. Possible themes: Smart Campus, Smart Agriculture, Smart Home, Smart Security, Smart Traffic Management and Smart Waste Management. Participants are evaluated on working prototype, innovation, implementation and presentation.",
    icon: "Cpu",
    gradient: "from-cyan-400 to-blue-600",
    fee: 100,
    prize: "₹7,000",
    teamType: "team",
    minTeam: 2,
    maxTeam: 3,
    rounds: [
      { name: "Theme Reveal & Circuit Architecture", description: "Theme selection and hardware schematic drafting with microcontrollers and sensors." },
      { name: "Hardware Assembly & Firmware Coding", description: "Connect sensors, assemble circuits, and write embedded firmware." },
      { name: "Live Hardware Demonstration", description: "Real-time hardware prototype testing and presentation to industry judges." },
    ],
    whatsappLink: "#",
    isActive: true,
    order: 8,
  },
  {
    name: "BLIND BYTE",
    slug: "blind-byte",
    category: "coding",
    description: "“One Can See the Code. The Other Can Only Hear It.” 2-member blindfolded coding challenge.",
    longDescription: "“One Can See the Code. The Other Can Only Hear It.” A 2-member team-based coding challenge where one participant is blindfolded and must write the code. The second participant, who can see the problem/code environment, will verbally communicate the logic, syntax and instructions to the blindfolded participant. The blindfolded participant must rely entirely on listening, memory and coding skills to implement the solution. No visual assistance is allowed for the blindfolded participant. The challenge focuses on how accurately and efficiently the team can communicate and convert verbal instructions into working code.",
    icon: "Code",
    gradient: "from-pink-500 to-rose-600",
    fee: 60,
    prize: "₹4,000",
    teamType: "team",
    minTeam: 2,
    maxTeam: 2,
    rounds: [
      { name: "Round 1 — Verbal Logic & Syntax Warmup", description: "Basic algorithms and syntax translation with verbal-only communication." },
      { name: "Round 2 — Blindfolded Complex Implementation", description: "Full problem solution coded by the blindfolded developer guided strictly by speech." },
    ],
    whatsappLink: "#",
    isActive: true,
    order: 9,
  },
  {
    name: "GAMING ARENA",
    slug: "gaming-arena",
    category: "gaming",
    description: "Competitive Technology Gaming. High-stakes Esports tournament featuring BGMI and Free Fire.",
    longDescription: "Competitive Technology Gaming. Gaming events from YUGANTRAN 2.0 continuing with an upgraded competitive structure. Proposed games: BGMI, Free Fire based on student interest. Gaming remains a supporting category while the primary identity of YUGANTRAN 3.0 remains technology and innovation.",
    icon: "Gamepad2",
    gradient: "from-rose-500 to-purple-600",
    fee: 100,
    prize: "₹5,000",
    teamType: "team",
    minTeam: 4,
    maxTeam: 4,
    rounds: [
      { name: "Group Stage Qualifiers", description: "Battle Royale qualifier matches for BGMI and Free Fire squads." },
      { name: "Semi-Final Showdown", description: "Top surviving squads clash in high-tier tactical matches." },
      { name: "Grand Finals", description: "Championship lobby to determine the tournament champions." },
    ],
    whatsappLink: "#",
    isActive: true,
    order: 10,
  },
];

const TEAM = [
  // Student Core Team
  {
    name: "Pranshul",
    role: "Event Director",
    department: "School of Computer Science & Engineering",
    image: "/images/team/pranshul.jpg",
    linkedin: "#",
    category: "core",
    order: 1,
  },
  {
    name: "Garima",
    role: "Co-Director",
    department: "School of Computer Science & Engineering",
    image: "/images/team/garima.jpg",
    linkedin: "#",
    category: "core",
    order: 2,
  },
  {
    name: "Urmika",
    role: "Support & Documentation Head",
    department: "School of Computer Science & Engineering",
    image: "/images/team/urmika.jpg",
    linkedin: "#",
    category: "core",
    order: 3,
  },
  {
    name: "Hemank",
    role: "Registration & Participant Head",
    department: "School of Computer Science & Engineering",
    image: "/images/team/hemank.jpg",
    linkedin: "#",
    category: "core",
    order: 4,
  },
  {
    name: "Ashish",
    role: "Social Media & Outreach Head",
    department: "School of Computer Science & Engineering",
    image: "/images/team/ashish.jpg",
    linkedin: "#",
    category: "core",
    order: 5,
  },
  {
    name: "Sidharth",
    role: "Technical Lead",
    department: "School of Computer Science & Engineering",
    image: "/images/team/sidharth.jpg",
    linkedin: "#",
    category: "core",
    order: 6,
  },
  {
    name: "Sanya",
    role: "Design & Creativity Head",
    department: "School of Computer Science & Engineering",
    image: "/images/team/sanya.jpg",
    linkedin: "#",
    category: "core",
    order: 7,
  },
  {
    name: "Sneha",
    role: "Discipline & Event Manager",
    department: "School of Computer Science & Engineering",
    image: "/images/team/sneha.jpg",
    linkedin: "#",
    category: "core",
    order: 8,
  },
];

const AWARDS = [
  {
    icon: "Trophy",
    title: "Event Winners & Trophies",
    subtitle: "Championship Honors",
    desc: "Official Winner Trophies, cash bounties, and Merit Certificates awarded to champions across all 10 technical events.",
    color: "#fbbf24",
    prize: "Cash Bounties + Official Trophies",
    order: 1,
  },
  {
    icon: "Award",
    title: "Merit & Runners-Up Certificates",
    subtitle: "Podium Finishers",
    desc: "Official Certificates of Merit presented to 1st and 2nd runners-up in each competition track.",
    color: "#00f2fe",
    prize: "Merit Certificates + Citations",
    order: 2,
  },
  {
    icon: "CheckCircle2",
    title: "Participation Certificates",
    subtitle: "All Registered Participants",
    desc: "Accredited Certificate of Participation issued by the School of Computer Science & Engineering, Geeta University for all attendees.",
    color: "#00ff41",
    prize: "Official Participation Certificate",
    order: 3,
  },
];

const DOMAINS = [
  {
    icon: "Bot",
    title: "AI & Prompt Engineering",
    desc: "AI Warzone, Human vs AI, prompt architecture, and intelligent application building.",
    color: "#00f2fe",
    badge: "TRACK 01",
    order: 1,
  },
  {
    icon: "Shield",
    title: "Cybersecurity & Safety",
    desc: "Cyber Escape, digital forensics, threat response, and security knowledge quizzes.",
    color: "#f43f5e",
    badge: "TRACK 02",
    order: 2,
  },
  {
    icon: "Code",
    title: "Competitive Development",
    desc: "Code Sprint, Blind Byte, rapid prototyping, and extreme pair programming under pressure.",
    color: "#38bdf8",
    badge: "TRACK 03",
    order: 3,
  },
  {
    icon: "Bug",
    title: "Software Engineering & Fixes",
    desc: "Bug Hunt, AI CodeFix, repository debugging, and triage of broken applications.",
    color: "#fb923c",
    badge: "TRACK 04",
    order: 4,
  },
  {
    icon: "Cpu",
    title: "IoT & Hardware Hack",
    desc: "Microcontrollers, embedded sensors, hardware innovation, and smart automation.",
    color: "#2dd4bf",
    badge: "TRACK 05",
    order: 5,
  },
  {
    icon: "Rocket",
    title: "Innovation & Esports",
    desc: "Startup in 60 venture pitching, Tech Treasure 2.0 interactive hunt, and Gaming Arena.",
    color: "#a855f7",
    badge: "TRACK 06",
    order: 6,
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
      Award.deleteMany({}),
      Domain.deleteMany({}),
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
      theme: "INNOVATE • BUILD • COMPETE • TRANSFORM",
      eventDateStart: new Date("2026-10-27T09:00:00+05:30"),
      eventDateEnd: new Date("2026-10-28T17:00:00+05:30"),
      registrationDeadline: new Date("2026-10-25T23:59:00+05:30"),
      isRegistrationOpen: true,
      venue: "Geeta University, Panipat-Delhi NCR, Haryana",
      totalPrizePool: "₹54,000+",
      upiId: "yugantran@upi",
      contactEmail: "yugantran@geetauniversity.edu.in",
      contactPhone: ["+91 99925 60407", "+91 92110 67540"],
      instagram: "https://www.instagram.com/geetauniversitypanipat/",
      linkedin: "https://www.linkedin.com/in/geetauniversitypanipat/",
    });
    console.log("✅ Settings created");

    // ─── Create Awards ──────────────────────────────
    console.log("🏆 Seeding awards...");
    await Award.insertMany(AWARDS);
    console.log(`✅ ${AWARDS.length} awards created`);

    // ─── Create Domains ─────────────────────────────
    console.log("🧭 Seeding domains...");
    await Domain.insertMany(DOMAINS);
    console.log(`✅ ${DOMAINS.length} domains created`);

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
