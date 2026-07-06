import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";

dotenv.config();

const app = express();
app.disable("x-powered-by");

const isProduction = process.env.NODE_ENV === "production";

/* ---------- CORS CONFIG ---------- */
app.use(cors({
  origin: (origin, cb) => {
    const raw = process.env.CORS_ORIGIN || "";
    const allow = raw.split(",").map(s => s.trim()).filter(Boolean);

    if (!origin) return cb(null, true);          // curl/postman
    if (allow.length === 0) return cb(null, !isProduction);

    const ok = allow.some((rule) => {
      if (rule === origin) return true;

      // wildcard support for scoped rules such as https://*.vercel.app
      if (rule.includes("*") && rule !== "*") {
        const escaped = rule
          .replace(/[-/\\^$+?.()|[\]{}]/g, "\\$&")
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
app.use(helmet());
app.use(express.json({ limit: "32kb" }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication attempts" },
});

/* ---------- HEALTH CHECK ---------- */
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "TaskPulse API online",
    env: process.env.NODE_ENV || "development",
  });
});

/* ---------- ROUTES ---------- */
app.use("/auth", authLimiter, authRoutes);
app.use("/tasks", taskRoutes);

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  return res.status(500).json({ error: "Internal server error" });
});

/* ---------- SERVER ---------- */
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not defined");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
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
