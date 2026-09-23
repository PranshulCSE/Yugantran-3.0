<div align="center">

<br />

```
██╗   ██╗██╗   ██╗ ██████╗  █████╗ ███╗   ██╗████████╗██████╗  █████╗ ███╗   ██╗
╚██╗ ██╔╝██║   ██║██╔════╝ ██╔══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔══██╗████╗  ██║
 ╚████╔╝ ██║   ██║██║  ███╗███████║██╔██╗ ██║   ██║   ██████╔╝███████║██╔██╗ ██║
  ╚██╔╝  ██║   ██║██║   ██║██╔══██║██║╚██╗██║   ██║   ██╔══██╗██╔══██║██║╚██╗██║
   ██║   ╚██████╔╝╚██████╔╝██║  ██║██║ ╚████║   ██║   ██║  ██║██║  ██║██║ ╚████║
   ╚═╝    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝
                                                                        3 . 0
```

### 🟢 INNOVATE &nbsp;•&nbsp; BUILD &nbsp;•&nbsp; COMPETE &nbsp;•&nbsp; TRANSFORM

**Annual Technical Festival — School of Computer Science & Engineering**  
**Geeta University, Panipat** &nbsp;|&nbsp; **27–28 October 2026**

<br />

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-ESM-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Seed Database](#-seed-database)
- [API Reference](#-api-reference)
- [Admin Panel](#-admin-panel)
- [Deployment](#-deployment)
- [Events & Prize Pool](#-events--prize-pool)
- [Team](#-team)

---

## 🌐 Overview

YUGANTRAN 3.0 is a **full-stack web application** for the annual technical festival of SCSE, Geeta University. It provides:

- A stunning **public-facing website** with Matrix + Glass Morphism UI
- A **complete admin panel** at `/admin` to manage events, registrations, team, and settings
- **UPI-based registration** with Google Drive receipt storage
- **JWT-secured** admin authentication
- **Automated confirmation emails** via Resend API
- Fully **dynamic** — all content managed from the admin panel

---

## ✨ Features

### 🖥️ Public Website
| Section | Description |
|---------|-------------|
| **Hero** | Live countdown to event, animated Matrix rain, parallax effect |
| **About** | 8 domain cards, event philosophy, key stats |
| **Timeline** | Day-wise Oct 27–28 schedule |
| **Events** | 14 events, category filters, detailed modal with rounds |
| **Awards** | 8 special recognition categories |
| **Register** | Dynamic event selection, team support, UPI + receipt upload |
| **Team** | Core organizing committee from API |
| **Volunteers** | Sub-team section |
| **Footer** | Contact, navigation, social links |

### 🔐 Admin Panel (`/admin`)
| Page | Features |
|------|---------|
| **Dashboard** | Real-time stats, bar chart (recharts), event-wise breakdown |
| **Events Manager** | Create, Edit, Delete, Toggle active/inactive, Rounds management |
| **Registrations** | View all entries, Confirm/Reject, Filter by event/status, Export CSV |
| **Team Manager** | Manage core + sub-team, photo, LinkedIn, category |
| **Settings** | Registration open/close toggle, dates, UPI ID, QR code, contact |

---

## 🛠 Tech Stack

### Frontend
```
React 18          — UI framework
TypeScript         — Type safety
Vite 6             — Build tool (SWC compiler)
Tailwind CSS 3     — Utility-first styling
motion/react       — Animations (Framer Motion v11)
React Router v6    — Client-side routing
Axios              — HTTP client with JWT interceptor
Recharts           — Dashboard charts
Lucide React       — Icon library
Orbitron Font      — Headings (Matrix vibe)
Share Tech Mono    — Monospace / labels
```

### Backend
```
Node.js (ESM)     — Runtime
Express 5          — Web framework
MongoDB Atlas      — Database (via Mongoose)
JWT                — Admin authentication
Bcrypt             — Password hashing
Multer             — File upload (memory storage)
Google Drive API   — Receipt file storage
Resend API         — Transactional emails
```

### Infrastructure
```
Vercel   — Backend hosting
Netlify  — Frontend hosting
MongoDB Atlas — Free tier database
```

---

## 📁 Project Structure

```
Yugantran-3.0/
│
├── Backend/
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification + requireSuperAdmin
│   │   └── uploadMiddleware.js     # Multer memory storage (→ Drive)
│   ├── models/
│   │   ├── Admin.js                # Admin users schema
│   │   ├── Event.js                # Events with rounds, category, slug
│   │   ├── Registration.js         # Registrations with receipt URL
│   │   ├── Settings.js             # Global fest settings (single doc)
│   │   └── Team.js                 # Core + subteam members
│   ├── routes/
│   │   ├── auth.js                 # POST /login, GET /me
│   │   ├── events.js               # Public + Admin event CRUD
│   │   ├── registrations.js        # Register (public) + Admin management
│   │   ├── settings.js             # Public GET + Admin GET/PUT
│   │   └── team.js                 # Public GET + Admin CRUD
│   ├── seed/
│   │   └── seedData.js             # 14 events + team + admin seed script
│   ├── services/
│   │   ├── driveService.js         # Google Drive v3 buffer upload
│   │   └── emailService.js         # Resend API confirmation email
│   ├── .env.example                # ← Copy this to .env
│   ├── package.json
│   ├── server.js                   # Main server entry point
│   └── vercel.json                 # Vercel routing config
│
├── Frontend/
│   ├── src/
│   │   ├── admin/
│   │   │   ├── components/
│   │   │   │   ├── AdminHeader.tsx
│   │   │   │   ├── AdminSidebar.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── pages/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── EventsManager.tsx
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── RegistrationsManager.tsx
│   │   │   │   ├── Settings.tsx
│   │   │   │   └── TeamManager.tsx
│   │   │   └── AdminApp.tsx
│   │   ├── components/
│   │   │   ├── About.tsx
│   │   │   ├── Awards.tsx
│   │   │   ├── Events.tsx           # Includes EventDetailModal
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── MatrixRain.tsx       # Canvas rain animation
│   │   │   ├── Register.tsx         # Full dynamic form
│   │   │   ├── subTeam.tsx
│   │   │   ├── Team.tsx
│   │   │   └── Timeline.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx      # JWT auth context
│   │   ├── lib/
│   │   │   └── api.ts               # publicApi + adminApi (Axios)
│   │   ├── styles/
│   │   │   └── globals.css          # Matrix + Glass Morphism theme
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example                 # ← Copy to .env
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
└── README.md                        # ← You are here
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** v20+
- **npm** v10+
- **MongoDB Atlas** account (free tier)
- **Google Cloud** project with Drive API enabled
- **Resend** account for emails

### 1. Clone & Setup Backend

```bash
cd Backend

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# → Fill in all values (see Environment Variables section)

# Start development server
npm start
# Backend runs at http://localhost:5000
```

### 2. Setup Frontend

```bash
cd Frontend

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# → Set VITE_BACKEND_URL=http://localhost:5000

# Start development server
npm run dev
# Frontend runs at http://localhost:3000
```

### 3. Seed the Database

```bash
cd Backend
node seed/seedData.js
```

> ✅ This creates: **14 events**, **15 team members**, and the **admin account**

---

## 🔐 Environment Variables

### Backend `.env`

```env
# ── MongoDB ──────────────────────────────────────────
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/yugantran3

# ── JWT ──────────────────────────────────────────────
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# ── Resend (Email) ───────────────────────────────────
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=YUGANTRAN 3.0 <noreply@yourdomain.com>

# ── Google Drive API ──────────────────────────────────
# Service Account credentials
GOOGLE_CLIENT_EMAIL=yugantran@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key here\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID=1xxxxxxxxxxxxxxxxxxxxxxxxx

# ── Server ───────────────────────────────────────────
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env`

```env
VITE_BACKEND_URL=http://localhost:5000
# Production: VITE_BACKEND_URL=https://your-backend.vercel.app
```

---

## 🌱 Seed Database

The seed script populates the database with all initial data:

```bash
cd Backend
node seed/seedData.js
```

**Seeded data includes:**

| Type | Count | Details |
|------|-------|---------|
| Events | 14 | All categories + full rounds |
| Team Members | 15 | Core + sub-team |
| Admin Account | 1 | See credentials below |
| Settings | 1 | Fest info, dates, UPI |

> ⚠️ **Warning:** Running the seed script multiple times will NOT duplicate data — it uses `upsert` for events and checks for existing admin.

---

## 🔑 Admin Credentials

```
URL:       http://localhost:3000/admin
Username:  admin@yugantran.com
Password:  Admin@GU.edu.in
```

> 🔒 Change these in `seed/seedData.js` before going to production!

---

## 📡 API Reference

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/events` | All active events |
| `GET` | `/api/events/:slug` | Single event by slug |
| `GET` | `/api/team` | Team members (optional `?category=core\|subteam`) |
| `GET` | `/api/settings` | Fest settings (dates, UPI, status) |
| `POST` | `/api/register` | Submit registration (multipart/form-data) |

### Admin Endpoints (JWT Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Login → returns JWT token |
| `GET` | `/api/auth/me` | Verify token + get admin info |
| `GET` | `/api/events/admin/all` | All events (including inactive) |
| `POST` | `/api/events/admin` | Create new event |
| `PUT` | `/api/events/admin/:id` | Update event |
| `DELETE` | `/api/events/admin/:id` | Delete event |
| `GET` | `/api/registrations/admin` | All registrations (filter/paginate) |
| `GET` | `/api/registrations/admin/stats` | Dashboard stats |
| `GET` | `/api/registrations/admin/export` | Export CSV |
| `PUT` | `/api/registrations/admin/:id` | Update registration status |
| `GET` | `/api/team/admin` | All team members |
| `POST` | `/api/team/admin` | Add team member |
| `PUT` | `/api/team/admin/:id` | Update team member |
| `DELETE` | `/api/team/admin/:id` | Remove team member |
| `GET` | `/api/settings/admin` | Get settings |
| `PUT` | `/api/settings/admin` | Update settings |

---

## 🎛 Admin Panel

The admin panel is accessible at `/admin` (same frontend app, different route).

```
/admin            → Dashboard (stats + charts)
/admin/events     → Events Manager
/admin/registrations → Registrations Manager
/admin/team       → Team Manager
/admin/settings   → Festival Settings
```

**Key Admin Features:**
- 🔄 **Toggle registration open/close** from Settings page (instant effect on public site)
- 📊 **Dashboard stats** — total, confirmed, pending, rejected registrations + revenue estimate
- 📋 **Export CSV** — download all registrations as spreadsheet
- 👁️ **View receipt** — direct link to Google Drive receipt
- ✅ **Confirm / ❌ Reject** registrations with one click
- ➕ **Add rounds** dynamically to each event

---

## 🚀 Deployment

### Backend → Vercel

```bash
cd Backend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set all environment variables in **Vercel Dashboard → Project → Settings → Environment Variables**.

### Frontend → Netlify

```bash
cd Frontend
npm run build
# Build output is in: /build
```

**Netlify settings:**
- Build command: `npm run build`
- Publish directory: `build`
- Environment variable: `VITE_BACKEND_URL=https://your-backend.vercel.app`

**Add `_redirects` file** in `Frontend/public/`:
```
/*    /index.html   200
```
> This ensures React Router works correctly on Netlify.

---

## 🏆 Events & Prize Pool

| # | Event | Category | Fee | Prize |
|---|-------|----------|-----|-------|
| 1 | AI Warzone | AI & Emerging Tech | ₹100 | ₹8,000 |
| 2 | Cyber Escape | Cybersecurity | ₹80 | ₹6,000 |
| 3 | Code Sprint | Coding | ₹60 | ₹5,000 |
| 4 | Bug Hunt | Coding | ₹50 | ₹4,000 |
| 5 | Git Wars | Software Engg | ₹60 | ₹4,000 |
| 6 | Tech Treasure 2.0 | Interactive | ₹60 | ₹5,000 |
| 7 | Startup in 60 | Innovation | ₹80 | ₹6,000 |
| 8 | Hardware Hack | IoT & Hardware | ₹100 | ₹7,000 |
| 9 | Dead Code | Coding | ₹50 | ₹3,000 |
| 10 | Autonomous Race | IoT & Hardware | ₹100 | ₹8,000 |
| 11 | Tech Olympics | Flagship | ₹150 | ₹12,000 |
| 12 | BGMI | Gaming | ₹100 | ₹5,000 |
| 13 | Free Fire | Gaming | ₹100 | ₹3,000 |
| 14 | Tekken 7 | Gaming | ₹50 | ₹2,000 |

> 🏆 **Total Prize Pool: ₹+** (+ Certificates, Internship Opportunities & Sponsor Rewards)

---

## 👥 Team

**Submitted By:**

| Name | Role |
|------|------|
| Pranshul | Lead Developer & Event Director |
| Garima | Lead-Organizer |


**Submitted To:** Dr. Meenu Gupta, Head of School, SCSE, Geeta University, Panipat

---

## 📌 Notes

- **WhatsApp Links** — Currently set to `#` placeholder. Update from Admin → Events Manager after creating WhatsApp groups.
- **UPI QR Code** — Upload QR image URL from Admin → Settings.
- **Organizer Photos** — Add photo URLs from Admin → Team Manager.
- **Event Brochure** — Place PDF at `Frontend/public/docs/eventBrochure.pdf`.
- **Rule Book** — Place PDF at `Frontend/public/docs/ruleBook.pdf`.
- **Google Drive Setup** — Create a Service Account, share the Drive folder with the service account email, and paste the credentials in `.env`.

---

<div align="center">

**YUGANTRAN 3.0** — *The Evolution Continues*

Made with 💚 by SCSE, Geeta University

`© 2026 Geeta University, Panipat. All rights reserved.`

</div>
