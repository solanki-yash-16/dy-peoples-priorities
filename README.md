<div align="center">
  
# 🗳️ DY Peoples Priorities Platform
**HackToSkill · Build with AI Hackathon Project**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat&logo=nodedotjs)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![Turborepo](https://img.shields.io/badge/Turborepo-Monorepo-red?style=flat&logo=vercel)](https://turbo.build/)

> A powerful, full-stack civic engagement platform that empowers communities to voice, prioritize, and track the issues that matter most to them.

</div>

---

## 🌟 What is DY Peoples Priorities?

This platform bridges the gap between citizens and municipal authorities. It allows users to log civic complaints (like potholes, water supply issues, or broken streetlights) and provides city administrators with a bird's-eye view of these issues via an AI-powered dashboard.

### Key Features
- **Citizen App:** A mobile-friendly interface for citizens to upload complaints with geolocation, photos, and voice notes.
- **Admin Dashboard:** A beautiful, high-performance Next.js dashboard for city officials to track, filter, and resolve issues.
- **Data Analytics:** Heatmaps, category breakdowns, and priority charts using real-time MongoDB data.
- **AI-Ready:** Designed with placeholders and infrastructure for AI-driven sentiment analysis, automated categorization, and urgency scoring.
- **Robust Authentication:** Secure JWT-based auth flow including real email integration for secure password recovery.
- **Enterprise Standards:** Built with strict TypeScript configuration and zero ESLint warnings for a highly maintainable codebase.

---

## 🏗️ Architecture & Monorepo Structure

We use **pnpm workspaces** and **Turborepo** to manage our apps and packages seamlessly in a single repository.

```text
dy-peoples-priorities/
├── apps/
│   ├── backend/        # Express REST API (TypeScript, MongoDB)
│   ├── next-app/       # Admin Dashboard (Next.js 16, App Router, ShadCN)
│   ├── web/            # Citizen Web App (Vite, React)
│   └── mobile/         # Citizen Mobile App (React Native)
├── packages/
│   └── ui/             # Shared component library
├── turbo.json          # Turborepo task orchestrator
└── package.json        # Root dependencies
```

---

## 🚀 Technology Stack

| Layer | Technology |
|---|---|
| **Monorepo** | pnpm workspaces + Turborepo |
| **Backend API** | Node.js, Express 5, TypeScript, MongoDB (Mongoose) |
| **Admin Dashboard**| Next.js 16, React 19, Tailwind CSS, ShadCN, TanStack Query, Recharts |
| **Web / Mobile** | Vite React Web App / React Native Mobile App |
| **Authentication** | JWT, bcrypt, HTTP-only cookies |
| **API Docs** | Swagger UI (OpenAPI 3.0) |

---

## 🛠️ Quick Start Guide

Want to run the platform locally? Follow these steps:

### 1. Prerequisites
- **Node.js** v18 or higher
- **pnpm** v11+ (`npm install -g pnpm`)
- **MongoDB** running locally or a MongoDB Atlas connection string.

### 2. Installation
Clone the repository and install all dependencies across the monorepo:
```bash
git clone https://github.com/<your-org>/dy-peoples-priorities.git
cd dy-peoples-priorities
pnpm install
```

### 3. Environment Variables
You need to set up the environment variables for the backend. Create a `.env` file inside `apps/backend/`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/dy-peoples-priorities
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 4. Start the Engines!
Use Turborepo to spin up all applications in parallel:

```bash
pnpm dev
```

**Where to view the apps:**
- **Admin Dashboard:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000/api/v1](http://localhost:5000/api/v1)
- **Swagger API Docs:** [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- **Citizen Web App:** [http://localhost:5173](http://localhost:5173)

*(Need to run just one app? Use `pnpm dev:next` or `pnpm dev:backend`)*

---

## 🔌 API Ecosystem

The Express backend provides a robust, fully documented REST API. 

### Core Endpoints (`/api/v1`)
- **`/auth`**: User registration, login, and JWT session management.
- **`/users`**: Admin CRUD operations for user management.
- **`/complaints`**: Core engine. Submit complaints, fetch paginated lists, filter by district/status, and retrieve aggregate stats/heatmaps.
- **`/uploads`**: Handles multipart form data for images and audio files.
- **`/location`**: Reverse geocoding utilities.

> **💡 Pro Tip:** Visit `http://localhost:5000/api-docs` while the server is running to test all endpoints interactively via Swagger UI!

---

## 🧠 AI Integration Readiness

The platform is designed to plug directly into an AI microservice pipeline. When a complaint is submitted, the database allocates an `aiAnalysis` block:

```json
"aiAnalysis": {
  "status": "PENDING",
  "category": null,
  "urgencyScore": null,
  "sentiment": null,
  "summary": null
}
```
This allows asynchronous background workers (e.g., Python/FastAPI running LLMs) to process the citizen's text/audio, determine urgency, and populate this data without blocking the user experience.

---

## 🔄 Recent Updates

- **Data Schema Sync:** Synchronized frontend `Complaint` interfaces to accurately map properties (category, summary/title, urgency) from the backend's `aiAnalysis` engine.
- **Dashboard Enhancements:** Updated the Admin Dashboard's complaints table and live feed to dynamically display real-time AI-generated summaries and analytics.
- **Code Quality:** Enforced strict TypeScript configurations and resolved all ESLint warnings/errors across the entire monorepo (`backend`, `next-app`, `mobile`, `web`, `ui`) for a highly maintainable, warning-free codebase.

---

## 🤝 Contributing

We welcome contributions during and after the hackathon!
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<div align="center">
  <p>Built with ❤️ by the DY Peoples Priorities Team</p>
  <p><i>HackToSkill · Build with AI Hackathon</i></p>
</div>
