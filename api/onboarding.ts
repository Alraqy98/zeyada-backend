import express from "express";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

// ✅ Connect to Supabase using your env vars
const supabase = createClient(
  process.env.YOUR_SUPABASE_URL as string,
  process.env.YOUR_SUPABASE_SERVICE_KEY as string
);

// ✅ POST /api/onboarding
router.post("/", async (req, res) => {
  try {
    const { business_name, industry, whatsapp, email, plan, answers } = req.body;

    console.log("📝 Received onboarding data:", req.body);

    const { data, error } = await supabase
      .from("onboarding")
      .insert([{ business_name, industry, whatsapp, email, plan, answers }]);

    if (error) throw error;

    res.json({ success: true, message: "Onboarding data saved!", data });
  } catch (err: any) {
    console.error("❌ Error saving onboarding data:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
