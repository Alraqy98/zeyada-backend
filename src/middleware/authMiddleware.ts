import { supabase } from "../integrations/supabase/client";
import { Request, Response, NextFunction } from "express";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ success: false, error: "Missing access token" });
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return res.status(401).json({ success: false, error: "Invalid or expired token" });
    }

    // ✅ Optional: enforce verified email only
    if (!data.user.email_confirmed_at) {
      return res.status(403).json({ success: false, error: "Please verify your email first" });
    }

    // Store user on request object
    (req as any).user = data.user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ success: false, error: "Internal authentication error" });
  }
}
