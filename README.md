# 🎓 CampusConnect — REST API Backend & Full-Stack Ecosystem

CampusConnect is a production-ready, full-stack campus platform designed to unify **student career discovery** (micro-internships, gigs, research fellowships with verified INR stipends), **accountable civic problem reporting & 5-phase SLA tracking** (*CampusFix*), **hyper-local campus services & student discounts**, and **inter-campus hackathons & events** into a single cohesive ecosystem.

> **Note on Architecture:** The **Backend is built for standalone deployment on Render** as a pure Node.js REST API Web Service. The frontend can be hosted independently (e.g. Vercel, Netlify, GitHub Pages) or accessed locally, connecting directly to the Render API URL.

---

## ⚡ Connecting Frontend on Cloudflare Pages to Backend on Render

This project is configured out-of-the-box to connect a **Cloudflare Pages frontend** with a **Render backend**.

### 1. Deploy the Backend on Render
1. Follow the **Deploying the Backend on Render** section above.
2. Note your live backend URL (e.g. `https://campusconnect-backend.onrender.com`).

### 2. Deploy the Frontend on Cloudflare Pages
1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. Select your repository: `https://github.com/saniiaa2012-crypto/CAMPUSCONNECT.git`.
3. Set the following build settings:
   - **Project Name:** `campusconnect` (or your choice)
   - **Production Branch:** `main`
   - **Framework Preset:** `None`
   - **Build Command:** *(Leave blank)*
   - **Build Output Directory:** `public`
   - **Root Directory:** *(Leave blank or `/`)*
4. Click **Save and Deploy**. Cloudflare will build and host your frontend immediately at `https://campusconnect.pages.dev`!

### 3. How the Frontend Communicates with Render
Two built-in options ensure seamless communication with zero CORS issues:

* **Automatic Direct Connection via `public/js/config.js`:**
  The frontend loads `public/js/config.js`, which defines:
  ```javascript
  window.CAMPUSCONNECT_CONFIG = {
    BACKEND_URL: 'https://campusconnect-backend.onrender.com'
  };
  ```
  *(If your Render service URL is different, simply update `public/js/config.js` with your exact URL!)*

* **Zero-CORS Transparent Proxy via `public/_redirects`:**
  Cloudflare Pages automatically reads `public/_redirects` to proxy `/api/*` and `/uploads/*` requests from Cloudflare to Render without CORS restrictions:
  ```text
  /api/*      https://campusconnect-backend.onrender.com/api/:splat      200
  /uploads/*  https://campusconnect-backend.onrender.com/uploads/:splat  200
  ```

* **In-App Dynamic Override:**
  You can also change the backend URL directly in the live UI anytime: click the top-right profile avatar > **Set Backend URL** and enter your Render URL.

---

## ☁️ Deploying the Backend on Render (BACKEND ONLY)

This repository includes a `render.yaml` blueprint and a pure REST API server (`server/server.js`) optimized for **Render Web Service**.

### Option 1: Automatic Blueprint (Recommended)
1. Go to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** > **Blueprint**.
3. Connect your repository: `https://github.com/saniiaa2012-crypto/CAMPUSCONNECT.git`.
4. Render will automatically detect `render.yaml` and configure the **Node Web Service**.
5. Click **Apply**. Render will install dependencies and start the backend service!

### Option 2: Manual Web Service Setup
If creating the Web Service manually on Render:
1. Click **New +** > **Web Service**.
2. Select your repository: `https://github.com/saniiaa2012-crypto/CAMPUSCONNECT.git`.
3. Configure the following settings:
   - **Name:** `campusconnect-backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
4. In the **Environment Variables** section, add:
   - `NODE_ENV` = `production`
   - `CORS_ORIGIN` = `*` (or your frontend domain URL)
   - `JWT_SECRET` = `campusconnect_super_secret_jwt_key_2026`
   - `PORT` = `10000` *(Render sets this automatically)*
5. Click **Create Web Service**.

Once deployed, your live backend URL will look like:
👉 **`https://campusconnect-backend.onrender.com`**

- Visiting `https://campusconnect-backend.onrender.com/` returns the API JSON status.
- The health check is available at: `https://campusconnect-backend.onrender.com/api/health`.

---

## 🌐 Connecting the Frontend to your Render Backend

When hosting your frontend separately (or opening `public/index.html` locally):
1. Open the frontend in any browser.
2. Click your profile avatar / menu in the top right > **Set Backend URL** (or in browser console run: `API.setBaseUrl('https://campusconnect-backend.onrender.com')`).
3. Enter your live Render URL: `https://campusconnect-backend.onrender.com/api`.
4. The frontend will now automatically direct all authentication, opportunities, CampusFix reports, and dashboard requests to your live Render backend!

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
| **Backend (Render)** | Node.js (v20+), Express.js 5, JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `multer`, `cors`, `morgan` |
| **Database** | Persistent, atomic, zero-config JSON Document Store (`server/db/database.js`) — self-contained, no external database server setup required |
| **Frontend** | Semantic HTML5, Tailwind CSS, Google Material Symbols, Plus Jakarta Sans & Inter typography, Vanilla ES6+ Modules |
| **Design Tokens** | Indigo Modern Brand System (`#5341cd` primary, `#6c5ce7` accent, `#00b894` success, `#fbf8ff` background) |

---

## 📁 Directory Structure

```text
CAMPUSCONNECT/
├── render.yaml                       # Render Blueprint deployment definition (Backend-only)
├── .env                              # Environment configuration
├── .env.example                      # Sample environment variables
├── package.json                      # Project scripts and dependencies
├── README.md                         # Full documentation
├── uploads/                          # Uploaded ticket photos & documents
├── public/                           # Standalone Frontend Client Files
│   ├── index.html                    # Landing & Home Page
│   ├── opportunities.html            # Opportunity Marketplace & Apply
│   ├── campusfix.html                # CampusFix Civic Resolution Tracker
│   ├── dashboard.html                # Role-Based Command Dashboard
│   ├── services.html                 # Local Campus Directory & Discounts
│   ├── events.html                   # Events & Hackathons Hub
│   ├── css/
│   │   └── style.css                 # Custom design tokens, glassmorphism & animations
│   ├── js/
│   │   ├── api.js                    # Centralized API fetch wrapper with configurable backend URL
│   │   ├── auth.js                   # Auth manager & 1-click Persona switcher
│   │   └── toast.js                  # Toast notification feedback system
│   └── assets/                       # Campus images, student portraits, logo
└── server/                           # Backend REST API Service (Render)
    ├── server.js                     # Express app entry point & routes (API only)
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

## 👥 Pre-seeded Demo Personas & Credentials

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
- `GET /api/opportunities` — List opportunities with optional filters (`?search=`, `?category=`, `?workMode=`, `?minStipend=`)
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

## 📜 License
MIT License. Built for the Indian Higher Education Ecosystem.
