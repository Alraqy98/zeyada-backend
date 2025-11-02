import dotenv from "dotenv";
dotenv.config(); // ✅ ensures .env loads even before server.ts

import { createClient } from "@supabase/supabase-js";

// ✅ Validate environment variables
if (!process.env.YOUR_SUPABASE_URL || !process.env.YOUR_SUPABASE_SERVICE_KEY) {
  console.error("❌ Missing Supabase environment variables in .env");
  throw new Error("Missing Supabase environment variables");
}

// ✅ Export your main Supabase client
export const supabase = createClient(
  process.env.YOUR_SUPABASE_URL!,
  process.env.YOUR_SUPABASE_SERVICE_KEY!
);
