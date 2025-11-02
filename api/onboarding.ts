import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import * as Resend from "resend";

dotenv.config();
const router = express.Router();

// ✅ Initialize Supabase
const supabase = createClient(
  process.env.YOUR_SUPABASE_URL as string,
  process.env.YOUR_SUPABASE_SERVICE_KEY as string
);

// ✅ Initialize Resend (for email)
const resend = new Resend.Resend(process.env.RESEND_API_KEY || "");

// ✅ Helper function to generate unique Zeyada IDs
function generateZeyId() {
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ZEY-${random}`;
}

// 🕒 Helper to convert UTC timestamps to GMT+3
function toGMT3(date: string | Date | null): string | null {
  if (!date) return null;
  const d = new Date(date);
  // Convert to milliseconds +3 hours
  const gmt3 = new Date(d.getTime() + 3 * 60 * 60 * 1000);
  return gmt3.toISOString().replace("T", " ").substring(0, 19);
}

// ✅ POST /api/onboarding
router.post("/", async (req, res) => {
  try {
    const { business_name, industry, email, whatsapp, country, plan } = req.body;

    if (!business_name || !email || !whatsapp) {
      return res.status(400).json({ success: false, error: "Missing required fields." });
    }

    // Generate unique business ID
    const business_id = generateZeyId();

    // Insert new business record
    const { error: insertError } = await supabase.from("onboarding").insert([
      {
        business_id,
        business_name,
        industry,
        email,
        whatsapp,
        country,
        plan: plan || "Starter",
        status: "trial",
        renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days trial
      },
    ]);

    if (insertError) throw insertError;

    // Log event
    await supabase.from("activity_log").insert([
      {
        business_id,
        event_type: "signup",
        detail: { message: "New business signed up" },
        channel: "website",
      },
    ]);

    // ✅ Send welcome email via Resend
    try {
      await resend.emails.send({
        from: "Zeyada <noreply@zeyada.app>",
        to: email,
        subject: "Welcome to Zeyada 🚀 — Your Business ID",
        html: `
          <h2>Welcome to Zeyada!</h2>
          <p>Hi ${business_name},</p>
          <p>We’re excited to have you onboard. Here are your details:</p>
          <ul>
            <li><strong>Business ID:</strong> ${business_id}</li>
            <li><strong>Plan:</strong> ${plan || "Starter"}</li>
          </ul>
          <p>You can now message us anytime on WhatsApp using this ID to set up your automations.</p>
          <p><em>– The Zeyada Team</em></p>
        `,
      });
    } catch (emailErr: any) {
      console.error("Email failed:", emailErr.message);
    }

    // ✅ (Optional) Send WhatsApp welcome message
    // You can integrate Twilio, 360Dialog, or Meta Graph API here
    // Example:
    // await sendWhatsAppMessage(whatsapp, `👋 Welcome to Zeyada! Your ID is ${business_id}.`);

    console.log(`✅ New onboarding: ${business_name} (${business_id})`);
    res.json({
  success: true,
  business_id,
  renewal_date: toGMT3(new Date()),
  message: "Onboarding data saved with GMT+3 timezone",
});

  } catch (err: any) {
    console.error("❌ Onboarding error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
