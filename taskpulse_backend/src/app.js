import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";

dotenv.config();

const app = express();

/* ---------- CORS CONFIG ---------- */
app.use(cors({
  origin: (origin, cb) => {
    const raw = process.env.CORS_ORIGIN || "";
    const allow = raw.split(",").map(s => s.trim()).filter(Boolean);

    if (!origin) return cb(null, true);          // curl/postman
    if (allow.length === 0) return cb(null, true);

    const ok = allow.some((rule) => {
      if (rule === origin) return true;

      // wildcard: https://*.vercel.app
      if (rule.includes("*")) {
        const escaped = rule
          .replace(/[-/\^$+?.()|[\]{}]/g, "\$&")
          .replace(/\*/g, ".*");
        const re = new RegExp("^" + escaped + "$");
        return re.test(origin);
      }
      return false;
    });

    if (ok) return cb(null, true);
    return cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

/* ---------- MIDDLEWARES ---------- */
app.use(express.json());

/* ---------- HEALTH CHECK ---------- */
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "TaskPulse API online",
    env: process.env.NODE_ENV || "development",
  });
});

/* ---------- ROUTES ---------- */
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

/* ---------- SERVER ---------- */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not defined");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 TaskPulse backend running on ${PORT}`)
    );
  })
  .catch(err => {
    console.error("❌ Mongo error:", err);
    process.exit(1);
  });

export default app;
