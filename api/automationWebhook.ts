import express, { Request, Response } from "express";
import { Resend } from "resend";

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY || "");

router.post("/", async (req: Request, res: Response) => {
  try {
    const { business_id, email, whatsapp, plan } = req.body;

    // Send follow-up email immediately
    await resend.emails.send({
      from: "Zeyada <noreply@zeyada.app>",
      to: email,
      subject: "Let’s set up your first automation ⚙️",
      html: `
        <h2>Welcome again!</h2>
        <p>Your Zeyada ID: <strong>${business_id}</strong></p>
        <p>We noticed you’re on the <strong>${plan}</strong> plan.</p>
        <p>Here’s how to connect your WhatsApp and start automating messages 👇</p>
        <a href="https://zeyada.app/start" style="background:#6366f1;color:white;padding:10px 18px;border-radius:8px;text-decoration:none;">Start Setup</a>
        <p>– Zeyada Team</p>
      `,
    });

    console.log("✅ Automation webhook fired for", business_id);
    res.json({ success: true });
  } catch (err: any) {
    console.error("❌ Automation webhook error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
