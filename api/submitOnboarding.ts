import express from "express";
import { supabase } from "../src/integrations/supabase/client.js"; // keep relative to your folder

const router = express.Router();

// 🔹 Health-check
router.get("/ping", (req, res) => {
  console.log("✅ Ping received");
  res.json({ message: "Onboarding route is alive!" });
});

// 🔹 Main onboarding route
router.post("/", async (req, res) => {
  console.log("📩 [Onboarding] Endpoint hit.");

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log("❌ Missing Authorization header");
      return res.status(401).json({ success: false, error: "Missing Authorization header" });
    }

    const token = authHeader.split(" ")[1];
    const { data: userData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !userData?.user) {
      console.log("❌ Invalid token:", authError?.message);
      return res.status(401).json({ success: false, error: "Invalid or expired token" });
    }

    console.log("✅ Authenticated user:", userData.user.email);

    const formData = req.body;
    console.log("🧠 Received data:", formData);

    const { error: insertError } = await supabase
      .from("onboarding")
      .insert([{ user_id: userData.user.id, ...formData }]);

    if (insertError) {
      console.error("❌ Supabase insert error:", insertError.message);
      return res.status(400).json({ success: false, error: insertError.message });
    }

    console.log("✅ Data inserted successfully");
    return res.json({ success: true, message: "Onboarding data saved successfully" });
  } catch (error) {
    console.error("💥 Server error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown server error",
    });
  }
});

export default router;
