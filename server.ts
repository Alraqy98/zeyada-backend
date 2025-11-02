import dotenv from "dotenv";
dotenv.config(); // ✅ forces .env to load
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";

import authRoutes from "./api/auth";
import submitOnboarding from "./api/submitOnboarding";
import onboardingRoutes from "./api/onboarding";

// 🧠 Environment check for Render logs
console.log("🔍 Render ENV CHECK:", {
  YOUR_SUPABASE_URL: process.env.YOUR_SUPABASE_URL ? "✅ found" : "❌ missing",
  YOUR_SUPABASE_SERVICE_KEY: process.env.YOUR_SUPABASE_SERVICE_KEY ? "✅ found" : "❌ missing",
  LOVABLE_SUPABASE_URL: process.env.LOVABLE_SUPABASE_URL ? "✅ found" : "❌ missing",
  LOVABLE_SUPABASE_ANON_KEY: process.env.LOVABLE_SUPABASE_ANON_KEY ? "✅ found" : "❌ missing",
});

const app = express();

// 🧩 Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 🕒 Helper to convert UTC timestamps to GMT+3
function toGMT3(date: string | Date | null): string | null {
  if (!date) return null;
  const d = new Date(date);
  const gmt3 = new Date(d.getTime() + 3 * 60 * 60 * 1000);
  return gmt3.toISOString().replace("T", " ").substring(0, 19);
}

// 🌍 Global middleware to convert any date fields in JSON responses to GMT+3
app.use((req: Request, res: Response, next: NextFunction) => {
  const oldJson = res.json.bind(res);

  res.json = (data: any) => {
    function adjust(obj: any): any {
      if (Array.isArray(obj)) return obj.map(adjust);
      if (obj && typeof obj === "object") {
        for (const key in obj) {
          if (
            obj[key] instanceof Date ||
            (typeof obj[key] === "string" && obj[key].includes("T"))
          ) {
            obj[key] = toGMT3(obj[key]);
          } else if (typeof obj[key] === "object") {
            obj[key] = adjust(obj[key]);
          }
        }
      }
      return obj;
    }
    return oldJson(adjust(data));
  };

  next();
});

// 🧾 Request logger
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.url}`);
  next();
});

// 🧩 Routes
app.use("/api/auth", authRoutes);
app.use("/api/submitOnboarding", submitOnboarding);
app.use("/api/onboarding", onboardingRoutes);

// 🟢 Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.send("✅ Zeyada backend is live!");
});

// 🚀 Server start
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
