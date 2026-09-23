import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import registrationRoutes from "./routes/registrations.js";
import teamRoutes from "./routes/team.js";
import settingsRoutes from "./routes/settings.js";
import awardRoutes from "./routes/awards.js";
import domainRoutes from "./routes/domains.js";

const app = express();

// ─── CORS ─────────────────────────────────────────
const allowedOrigins = [
  "https://yugantran.netlify.app",
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin ${origin} not allowed.`));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// ─── MongoDB ────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

// ─── Routes ─────────────────────────────────────────
app.get("/", (req, res) => res.json({ message: "YUGANTRAN 3.0 Backend — Running ✓" }));
app.get("/health", (req, res) => res.json({ status: "ok", version: "3.0.0" }));

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/register", registrationRoutes);
app.use("/api/registrations", registrationRoutes);  // alias for admin
app.use("/api/team", teamRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/awards", awardRoutes);
app.use("/api/domains", domainRoutes);

// ─── 404 ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

// ─── Error Handler ──────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ error: err.message || "Internal server error." });
});

// ─── Start ──────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 YUGANTRAN 3.0 Backend running on port ${PORT}`);
});

export default app;
