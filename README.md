# 🗳️ DY Peoples Priorities

> A full-stack monorepo platform built for the **HackToSkill · Build with AI** hackathon — empowering communities to voice, prioritize, and track the issues that matter most to them.

---

## 📦 Monorepo Structure

This project is managed with **pnpm workspaces** and **Turborepo** for blazing-fast, parallel task execution across all apps and packages.

```
dy-peoples-priorities/
├── apps/
│   ├── backend/        # Node.js + Express REST API (TypeScript)
│   ├── next-app/       # Next.js 16 web dashboard (React 19)
│   ├── web/            # Vite + React landing / public web app
│   └── mobile/         # React Native mobile app
├── packages/
│   └── ui/             # Shared UI component library (used by next-app)
├── turbo.json          # Turborepo pipeline configuration
├── pnpm-workspace.yaml # Workspace definitions
└── package.json        # Root scripts & devDependencies
```

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Monorepo** | [pnpm](https://pnpm.io/) workspaces + [Turborepo](https://turbo.build/) |
| **Backend** | Node.js · Express 5 · TypeScript · MongoDB (Mongoose) |
| **Auth** | JWT (jsonwebtoken) · bcrypt · HTTP-only cookies |
| **API Docs** | Swagger UI (OpenAPI 3.0) via swagger-jsdoc |
| **Web Dashboard** | Next.js 16 · React 19 · Tailwind CSS v4 |
| **Web App** | Vite · React · Vanilla CSS |
| **Mobile** | React Native (bare workflow) |
| **Shared UI** | `@repo/ui` — shared component library |

---

## ⚙️ Prerequisites

Make sure you have the following installed:

- **Node.js** ≥ 18
- **pnpm** ≥ 11.9.0 (`npm i -g pnpm`)
- **MongoDB** (local instance or MongoDB Atlas URI)

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-org>/dy-peoples-priorities.git
cd dy-peoples-priorities
```

### 2. Install all dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env` file inside `apps/backend/`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/dy-peoples-priorities
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
```

### 4. Run the full monorepo in development mode

```bash
pnpm dev
```

This starts **all apps in parallel** via Turborepo:

| App | Default URL |
|---|---|
| Backend API | http://localhost:5000 |
| Swagger Docs | http://localhost:5000/api-docs |
| Next.js Dashboard | http://localhost:3000 |
| Vite Web App | http://localhost:5173 |
| Mobile (Metro) | Expo / RN Metro bundler |

### Run a specific app only

```bash
pnpm dev:next      # Next.js dashboard only
pnpm dev:web       # Vite web app only
pnpm dev:mobile    # React Native / Metro only
```

---

## 🔌 Backend API

The backend is a RESTful API built with **Express 5** and **TypeScript**, connected to **MongoDB** via Mongoose.

### Base URL

```
http://localhost:5000/api/v1
```

### Auth Endpoints — `/api/v1/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/register` | Public | Register a new user |
| `POST` | `/login` | Public | Login and receive a JWT |
| `GET` | `/me` | Private 🔒 | Get the current logged-in user |
| `POST` | `/logout` | Private 🔒 | Logout and clear cookie |

### User Endpoints — `/api/v1/users`

> All user routes require a valid Bearer token.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Private 🔒 | Get all users |
| `GET` | `/:id` | Private 🔒 | Get a single user by ID |
| `PUT` | `/:id` | Private 🔒 | Update a user's details |
| `DELETE` | `/:id` | Private 🔒 | Delete a user |

### Authentication

The API uses **JWT Bearer tokens**. Pass the token in the `Authorization` header:

```
Authorization: Bearer <your_token>
```

Tokens are also stored in an `httpOnly` cookie automatically on login/register (valid for **7 days**).

---

## 📚 API Documentation (Swagger UI)

Interactive API documentation is available at:

```
http://localhost:5000/api-docs
```

To import into **Postman** or **EchoAPI**, use the raw JSON spec:

```
http://localhost:5000/api-docs.json
```

---

## 🗂️ Backend Architecture

```
apps/backend/src/
├── config/
│   ├── db.ts           # MongoDB connection (Mongoose)
│   ├── env.ts          # Typed environment variable loader
│   └── swagger.ts      # OpenAPI 3.0 spec configuration
├── controllers/
│   ├── auth.controller.ts   # register, login, getMe, logout
│   └── user.controller.ts   # getAllUsers, getUserById, updateUser, deleteUser
├── middleware/
│   ├── auth.ts              # JWT protect middleware
│   └── errorHandler.ts      # Global error handler & asyncHandler util
├── models/
│   └── User.ts              # Mongoose User schema (bcrypt pre-save hook)
├── routes/
│   ├── auth.routes.ts       # Auth route definitions + Swagger JSDoc
│   └── user.routes.ts       # User route definitions + Swagger JSDoc
└── index.ts                 # Express app entry point
```

### User Model Schema

| Field | Type | Notes |
|---|---|---|
| `name` | `String` | Required |
| `email` | `String` | Required · Unique · Lowercase |
| `password` | `String` | Required · Min 6 chars · Excluded from queries by default |
| `role` | `"user" or "admin"` | Default: `"user"` |
| `createdAt` | `Date` | Auto-managed by Mongoose timestamps |

> Passwords are automatically **hashed with bcrypt (salt rounds: 10)** before saving, and are **never returned** in API responses.

---

## 🏗️ Build for Production

```bash
pnpm build
```

Turborepo will build all apps in dependency order, outputting to their respective `dist/` or `.next/` directories.

---

## 🧹 Code Quality

```bash
pnpm lint         # Lint all apps
```

Each app uses **ESLint** with TypeScript-aware rules (`typescript-eslint`).

---

## 📁 Packages

### `@repo/ui`
A shared React component library consumed by `next-app`. Configured as a workspace package (`packages/ui`) and referenced via `"@repo/ui": "workspace:*"`.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

ISC — see [LICENSE](./LICENSE) for details.

---

<p align="center">Built with ❤️ for <strong>HackToSkill · Build with AI</strong></p>
