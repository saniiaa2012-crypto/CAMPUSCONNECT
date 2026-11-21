# 🎓 CampusConnect — Full-Stack Operating System for Indian Higher Education

CampusConnect is a production-ready, full-stack campus platform designed to unify **student career discovery** (micro-internships, gigs, research fellowships with verified INR stipends), **accountable civic problem reporting & 5-phase SLA tracking** (*CampusFix*), **hyper-local campus services & student discounts**, and **inter-campus hackathons & events** into a single cohesive ecosystem.

---

## 🚀 Key Highlights & Features

### 1. 💼 Opportunity & Career Engine (`/opportunities.html`)
- **Verified Opportunities**: Filterable catalog of software engineering, AI/Data research, design, and campus ambassador roles.
- **Transparent INR Stipends**: Direct stipend disclosure (e.g., ₹18,000/mo, ₹22,000/mo) with duration and weekly hour commitments.
- **Smart Filters & Instant Search**: Filter by location (Delhi-NCR, Bengaluru, Pune), work mode (Remote, Hybrid, On-site), category, and minimum stipend slider.
- **Fast 1-Click Application**: Pre-populates student credentials from their verified profile with portfolio link and cover note.
- **Recruiter Job Posting**: Recruiters and faculty can publish new listings directly from the portal.

### 2. 🛠️ CampusFix: Civic Problem Solver & 5-Phase SLA Tracker (`/campusfix.html`)
- **No More Forgotten Registers**: Replace slow physical logbooks with transparent digital incident tracking.
- **5-Phase SLA Resolution Pipeline**:
  $$\text{Reported} \longrightarrow \text{Under Review} \longrightarrow \text{Assigned} \longrightarrow \text{In Progress} \longrightarrow \text{Resolved}$$
- **Crowdsourced Upvoting**: Students upvote critical issues (e.g., hostel Wi-Fi downtime, water cooler leaks) to escalate priority to university administration.
- **Incident Reporting**: Submit geo-located reports with campus block/hall, category, priority (Low, Medium, High, Urgent), and optional anonymous toggle.
- **Faculty / Facilities SLA Administration**: Dean of Student Welfare and maintenance teams can assign contractors, post ETAs, and sign off resolution proof.

### 3. 📊 Role-Based Command Dashboard (`/dashboard.html`)
- **Student Command Center (Aryan Sharma)**: Application pipeline tracking (*Applied → Viewed → Shortlisted → Interview → Offer*), active CampusFix reports, upcoming registered hackathons, and dynamic Profile Strength meter.
- **Faculty & Facilities Desk (Prof. Ananya Iyer)**: Centralized triage board, SLA compliance metrics (94%), and work order assignments.
- **Recruiter / Business Dashboard (Rohan Mehta)**: Active job postings manager, incoming applicant pipeline, and candidate status updates.
- **⚡ 1-Click Demo Persona Switcher**: Instantly switch between Student, Faculty, and Recruiter roles from the top bar to inspect each perspective.

### 4. 🏪 Campus Services & Student Discounts (`/services.html`)
- Local directory for thesis printing & binding, hostel tiffin mess, laptop repair, and PG accommodation.
- Walking distance from campus gates, verified student ID discounts (e.g., 20% off thesis binding), and 1-click WhatsApp and phone call triggers.

### 5. 🏆 Events & Hackathons Hub (`/events.html`)
- National campus sprints (e.g., DTU Sprint 2026, ₹1.5L prize pool), placement interview masterclasses, and startup pitch fests.
- Real-time team registration counter and instant 1-click entry pass confirmation.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Backend** | Node.js (v20+), Express.js 5, JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `multer`, `cors`, `morgan` |
| **Database** | Persistent, atomic, zero-config JSON Document Store (`server/db/database.js`) — self-contained, no external database server setup required |
| **Frontend** | Semantic HTML5, Tailwind CSS, Google Material Symbols, Plus Jakarta Sans & Inter typography, Vanilla ES6+ Modules |
| **Design Tokens** | Indigo Modern Brand System (`#5341cd` primary, `#6c5ce7` accent, `#00b894` success, `#fbf8ff` background) |

---

## 📁 Directory Structure

```text
stitch_campusconnect_portal (2)/
├── .env                              # Environment configuration
├── .env.example                      # Sample environment variables
├── package.json                      # Project scripts and dependencies
├── README.md                         # Full documentation
├── uploads/                          # Uploaded ticket photos & documents
├── public/                           # Frontend Client Files
│   ├── index.html                    # Landing & Home Page
│   ├── opportunities.html            # Opportunity Marketplace & Apply
│   ├── campusfix.html                # CampusFix Civic Resolution Tracker
│   ├── dashboard.html                # Role-Based Command Dashboard
│   ├── services.html                 # Local Campus Directory & Discounts
│   ├── events.html                   # Events & Hackathons Hub
│   ├── css/
│   │   └── style.css                 # Custom design tokens, glassmorphism & animations
│   ├── js/
│   │   ├── api.js                    # Centralized API fetch wrapper with JWT auth
│   │   ├── auth.js                   # Auth manager & 1-click Persona switcher
│   │   └── toast.js                  # Toast notification feedback system
│   └── assets/                       # Campus images, student portraits, logo
└── server/                           # Backend Application
    ├── server.js                     # Express app entry point & routes
    ├── db/
    │   ├── database.js               # Persistent JSON database engine with atomic writes
    │   └── seed.js                   # Initial seed data generator
    ├── middleware/
    │   └── auth.js                   # JWT token & role validation middleware
    ├── routes/
    │   ├── auth.js                   # Authentication & profile endpoints
    │   ├── opportunities.js          # Opportunities & applications
    │   ├── campusfix.js              # CampusFix tickets, upvotes & SLA status
    │   ├── services.js               # Campus local services
    │   ├── events.js                 # Events & registrations
    │   └── dashboard.js              # Role-based dashboard analytics
    └── data/                         # Persistent JSON tables (auto-generated)
        ├── users.json
        ├── opportunities.json
        ├── applications.json
        ├── tickets.json
        ├── services.json
        ├── events.json
        └── announcements.json
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ or v20+ (tested on Node.js v26.11)
- **npm** (or `npm.cmd` on Windows)

### 2. Installation
From the project root folder:
```bash
npm install
```

### 3. Environment Variables
A default `.env` file is already created. You can customize settings in `.env`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=campusconnect_jwt_secret_key_2026_super_secure
CORS_ORIGIN=*
UPLOAD_DIR=uploads
```

### 4. Start the Application
Run:
```bash
npm start
```
Or for development with automatic restart on file changes:
```bash
npm run dev
```

Open your browser at:
👉 **`http://localhost:5000`**

---

## 👥 Pre-seeded Demo Personas & Credentials

You can log in manually using these credentials, or **click the "Switch Role" button in the navigation bar** for 1-click instant access:

| Persona | Name | Role | Email | Password |
| :--- | :--- | :--- | :--- | :--- |
| **🎓 Student** | Aryan Sharma (DTU, 3rd Year CSE) | `student` | `aryan@campusconnect.edu` | `password123` |
| **🏛️ Dean / Faculty** | Prof. Ananya Iyer (Facilities & Welfare) | `faculty` | `ananya.iyer@campusconnect.edu` | `password123` |
| **💼 Recruiter** | Rohan Mehta (Gurugram Tech & Hubs) | `recruiter` | `rohan@gurugramtech.in` | `password123` |

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` — Create a new account (`name`, `email`, `password`, `role`, `college`, `department`)
- `POST /api/auth/login` — Sign in and receive JWT token (`email`, `password`)
- `GET /api/auth/me` — Retrieve current authenticated user profile (`Bearer <token>`)
- `PATCH /api/auth/profile` — Update user bio, skills, resume URL, contact phone
- `POST /api/auth/switch-demo-persona` — Fast-switch between pre-seeded personas for evaluation

### 💼 Opportunities (`/api/opportunities`)
- `GET /api/opportunities` — List opportunities with optional filters:
  - `?search=<keyword>`
  - `?category=<category>`
  - `?workMode=<Remote|Hybrid|On-site>`
  - `?minStipend=<amount>`
- `GET /api/opportunities/:id` — Get single opportunity details
- `POST /api/opportunities` — Create new listing (*Recruiter / Faculty only*)
- `POST /api/opportunities/:id/apply` — Apply for role (`coverNote`, `portfolioUrl`)
- `GET /api/opportunities/applications/my` — Get logged-in student's applications
- `PATCH /api/opportunities/applications/:appId/status` — Update application stage (*Applied, Viewed, Shortlisted, Interview, Offer, Rejected*)

### 🛠️ CampusFix (`/api/campusfix`)
- `GET /api/campusfix` — List tickets with optional filters (`?category=`, `?status=`, `?search=`, `?block=`)
- `GET /api/campusfix/:id` — Get ticket details & full 5-stage SLA audit timeline
- `POST /api/campusfix` — Submit new ticket (`title`, `category`, `block`, `priority`, `description`, `isAnonymous`, `photo`)
- `POST /api/campusfix/:id/upvote` — Upvote / toggle upvote on a ticket to escalate urgency
- `PATCH /api/campusfix/:id/status` — Update ticket stage (*Reported → Under Review → Assigned → In Progress → Resolved*) with technician remarks (*Faculty/Admin only*)

### 🏪 Campus Services (`/api/services`)
- `GET /api/services` — List local merchants with ratings, distance from gate, and student discounts (`?category=`, `?search=`)

### 🏆 Events & Hackathons (`/api/events`)
- `GET /api/events` — List campus events & hackathons
- `POST /api/events/:id/register` — Register for event

### 📊 Dashboard (`/api/dashboard`)
- `GET /api/dashboard/stats` — Personalized metrics and feeds based on authenticated user role

---

## 🧪 Verification & Health Check

1. **Server Health Check**:
   Visit `http://localhost:5000/api/health`
   Returns: `{"status": "ok", "platform": "CampusConnect", "time": "..."}`

2. **Database Re-seed (Optional)**:
   If you ever want to reset the mock database back to initial state:
   ```bash
   npm run seed
   ```

---

## 📜 License
MIT License. Built for the Indian Higher Education Ecosystem.
