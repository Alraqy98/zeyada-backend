"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const client_1 = require("../integrations/supabase/client");
async function requireAuth(req, res, next) {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ success: false, error: "Missing access token" });
        }
        const { data, error } = await client_1.supabase.auth.getUser(token);
        if (error || !data.user) {
            return res.status(401).json({ success: false, error: "Invalid or expired token" });
        }
        // ✅ Optional: enforce verified email only
        if (!data.user.email_confirmed_at) {
            return res.status(403).json({ success: false, error: "Please verify your email first" });
        }
        // Store user on request object
        req.user = data.user;
        next();
    }
    catch (err) {
        console.error("Auth middleware error:", err);
        res.status(500).json({ success: false, error: "Internal authentication error" });
    }
}
