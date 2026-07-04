import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import env from "./config/env.js";

const app = express();

// ── Middleware ─────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ───────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "Backend is up and running! ✅" });
});

// ── Start ──────────────────────────────────────────────────
const start = async () => {
  await connectDB();
  app.listen(Number(env.PORT), () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT} [${env.NODE_ENV}]`);
  });
};

start();
