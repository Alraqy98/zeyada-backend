import express, { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const router = express.Router();

const supabase = createClient(
  process.env.YOUR_SUPABASE_URL as string,
  process.env.YOUR_SUPABASE_SERVICE_KEY as string
);
const resend = new Resend(process.env.RESEND_API_KEY || "");
const OWNER_EMAIL = process.env.OWNER_EMAIL || "alraqy98@gmail.com";
const REPORT_SECRET = process.env.REPORT_SECRET || "";

function fmt(dt: Date) {
  return dt.toLocaleString("en-GB", { timeZone: "Europe/Istanbul" });
}

function startBoundary(period: "daily" | "weekly") {
  const now = new Date();
  if (period === "daily") {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  // weekly = last 7 days
  const d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function sendReport(period: "daily" | "weekly") {
  const since = startBoundary(period).toISOString();
  const { data, error } = await supabase
    .from("onboarding")
    .select("business_id,business_name,industry,plan,email,whatsapp,created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const total = data?.length || 0;
  const rows =
    data?.map(
      (r) => `
        <tr>
          <td>${r.business_id}</td>
          <td>${r.business_name || "-"}</td>
          <td>${r.industry || "-"}</td>
          <td>${r.plan || "-"}</td>
          <td>${r.email || "-"}</td>
          <td>${r.whatsapp || "-"}</td>
          <td>${fmt(new Date(r.created_at))}</td>
        </tr>`
    ).join("") || "";

  const html = `
    <div style="font-family:ui-sans-serif,system-ui">
      <h2>Zeyada ${period === "daily" ? "Daily" : "Weekly"} Signups Report</h2>
      <p>Generated: ${fmt(new Date())}</p>
      <p><strong>Total:</strong> ${total}</p>
      <table width="100%" cellspacing="0" cellpadding="6" style="border-collapse:collapse;border:1px solid #eee">
        <thead>
          <tr style="background:#fafafa">
            <th align="left">ZEY-ID</th>
            <th align="left">Business</th>
            <th align="left">Industry</th>
            <th align="left">Plan</th>
            <th align="left">Email</th>
            <th align="left">WhatsApp</th>
            <th align="left">Created (Europe/Istanbul)</th>
          </tr>
        </thead>
        <tbody>
          ${rows || `<tr><td colspan="7">No signups in this period.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;

  await resend.emails.send({
    from: "Zeyada Reports <noreply@zeyada.app>",
    to: OWNER_EMAIL,
    subject: `Zeyada ${period === "daily" ? "Daily" : "Weekly"} Signups Report (${fmt(new Date())})`,
    html,
  });

  return { total };
}

// Secure endpoints (use x-report-secret)
router.get("/daily", async (req: Request, res: Response) => {
  if (req.header("x-report-secret") !== REPORT_SECRET) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  try {
    const out = await sendReport("daily");
    res.json({ success: true, ...out });
  } catch (e: any) {
    console.error("Report daily error:", e.message);
    res.status(500).json({ success: false, error: e.message });
  }
});

router.get("/weekly", async (req: Request, res: Response) => {
  if (req.header("x-report-secret") !== REPORT_SECRET) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  try {
    const out = await sendReport("weekly");
    res.json({ success: true, ...out });
  } catch (e: any) {
    console.error("Report weekly error:", e.message);
    res.status(500).json({ success: false, error: e.message });
  }
});

export default router;
