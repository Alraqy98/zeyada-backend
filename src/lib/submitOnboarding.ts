import express from "express";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // use service role key for admin ops
);

router.post("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, error: "Missing Authorization header" });
    }

    const token = authHeader.split(" ")[1];
    const { data: userData, error: userError } = await supabase.auth.getUser(token);

    if (userError || !userData?.user) {
      console.error("Token verification failed:", userError);
      return res.status(401).json({ success: false, error: "Invalid or expired token" });
    }

    const user = userData.user;

    console.log("Authenticated user:", user.email);

    const { data, error } = await supabase
      .from("onboarding")
      .insert([
        {
          user_id: user.id,
          business_name: req.body.businessName,
          website: req.body.website,
          country: req.body.country,
          city: req.body.city,
          languages: req.body.languages,
          channels: req.body.channels,
          working_days: req.body.workingDays,
          hours: req.body.hours,
          business_activity: req.body.businessActivity,
          description: req.body.description,
          pain_point: req.body.painPoint,
          automation_goal: req.body.automationGoal,
        },
      ]);

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("Onboarding route crashed:", err);
    return res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : "Unexpected error",
    });
  }
});

export default router;
