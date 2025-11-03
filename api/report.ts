// api/report.ts
import express, { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Initialize clients
const supabase = createClient(
  process.env.YOUR_SUPABASE_URL as string,
  process.env.YOUR_SUPABASE_SERVICE_KEY as string
);
const resend = new Resend(process.env.RESEND_API_KEY || "");

// Utility: Format date as readable string (KSA timezone)
function formatDate(date: Date) {
  return date.toLocaleString("en-SA", {
    timeZone: "Asia/Riyadh",
    dateStyle: "full",
  });
}

// 🗓️ GET /api/report/daily
router.get("/daily", async (req: Request, res: Response) => {
  try {
    const since = new Date();
    since.setHours(0, 0, 0, 0); // midnight

    const { data, error } = await supabase
      .from("onboarding")
      .select("business_name, industry, plan, created_at")
      .gte("created_at", since.toISOString());

    if (error) throw error;

    const total = data.length;
    const list = data
      .map(
        (x: any) =>
          `• ${x.business_name} — ${x.industry} — ${x.plan} (${new Date(
            x.created_at
          ).toLocaleTimeString("en-SA", { timeZone: "Asia/Riyadh" })})`
      )
      .join("<br>");

    const htmlReport = `
      <h2>🗓️ Zeyada Daily Report — ${formatDate(new Date())}</h2>
      <p><strong>${total}</strong> new signups today.</p>
      ${total > 0 ? `<div>${list}</div>` : "<p>No new signups yet.</p>"}
      <br><p>— Automated by Zeyada ⚙️</p>
    `;

    await resend.emails.send({
      from: "Zeyada Reports <noreply@zeyada.app>",
      to: "alraqy98@gmail.com", // your personal email here
      subject: `Zeyada Daily Report — ${formatDate(new Date())}`,
      html: htmlReport,
    });

    console.log(`📊 Sent daily report to alraqy98@gmail.com (${total} signups)`);

    res.json({ success: true, count: total });
  } catch (err: any) {
    console.error("❌ Report error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
