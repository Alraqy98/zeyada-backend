import dotenv from "dotenv";
dotenv.config(); // ✅ forces .env to load
import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import authRoutes from "./api/auth";
import submitOnboarding from "./api/submitOnboarding";
import onboardingRoutes from "./api/onboarding";

console.log("🔍 Render ENV CHECK:", {
  YOUR_SUPABASE_URL: process.env.YOUR_SUPABASE_URL ? "✅ found" : "❌ missing",
  YOUR_SUPABASE_SERVICE_KEY: process.env.YOUR_SUPABASE_SERVICE_KEY ? "✅ found" : "❌ missing",
  LOVABLE_SUPABASE_URL: process.env.LOVABLE_SUPABASE_URL ? "✅ found" : "❌ missing",
  LOVABLE_SUPABASE_ANON_KEY: process.env.LOVABLE_SUPABASE_ANON_KEY ? "✅ found" : "❌ missing",
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/submitOnboarding", submitOnboarding);
app.use("/api/onboarding", onboardingRoutes);

// Server start
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
app.get("/", (req, res) => {
  res.send("✅ Zeyada backend is live!");
});
