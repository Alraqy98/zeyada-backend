import express from "express";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

// 🔹 Lovable Supabase (used to verify JWT)
const lovableSupabase = createClient(
  process.env.LOVABLE_SUPABASE_URL as string,
  process.env.LOVABLE_SUPABASE_ANON_KEY as string
);

// 🔹 Your Supabase (used to store data)
const yourSupabase = createClient(
  process.env.YOUR_SUPABASE_URL as string,
  process.env.YOUR_SUPABASE_SERVICE_KEY as string
);

// 🧩 POST /api/submitOnboarding
router.post("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.error("❌ Missing Authorization header");
      return res.status(401).json({ error: "Missing Authorization header" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token with Lovable's Supabase
    const { data: { user }, error: authError } = await lovableSupabase.auth.getUser(token);

    if (authError || !user) {
      console.error("❌ Invalid or expired token:", authError?.message);
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    console.log("✅ Authenticated Lovable user:", user.email);

    const formData = req.body;
    console.log("🧠 Received data:", formData);

    // Insert into your own Supabase (data storage)
    const { error: insertError } = await yourSupabase
      .from("onboarding")
      .insert([{ user_id: user.id, ...formData }]);

    if (insertError) {
      console.error("❌ Supabase insert error:", insertError.message);
      return res.status(400).json({ error: insertError.message });
    }

    console.log("✅ Data inserted successfully into your Supabase");
    return res.json({ success: true, message: "Onboarding data saved successfully" });
  } catch (error) {
    console.error("💥 Server error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown server error",
    });
  }
});

export default router;
