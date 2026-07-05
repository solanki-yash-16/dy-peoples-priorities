import express from "express";
import cors from "cors";
import path from "path";
import { connectDB } from "./config/db.js";
import env from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import locationRoutes from "./routes/location.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ── Middleware ─────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for local uploads
app.use("/uploads", express.static(path.join(__dirname, "../../public/uploads")));

// ── Root ───────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "Backend is up and running! ✅",
    docs: "/api-docs",
  });
});

// ── Swagger API Documentation ──────────────────────────────
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Provide raw JSON for EchoAPI / Postman imports
app.get("/api-docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// ── Routes ─────────────────────────────────────────────────
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/complaints", complaintRoutes);
app.use("/api/v1/uploads", uploadRoutes);
app.use("/api/v1/location", locationRoutes);

// ── Global Error Handler ───────────────────────────────────
app.use(errorHandler);

// ── Start ──────────────────────────────────────────────────
const start = async () => {
  await connectDB();
  app.listen(Number(env.PORT), () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT} [${env.NODE_ENV}]`);
  });
};

start();
