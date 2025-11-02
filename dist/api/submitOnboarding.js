"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // ✅ Load .env before Supabase
const supabase_js_1 = require("@supabase/supabase-js");
const router = express_1.default.Router();
// ✅ Validate env variables
if (!process.env.LOVABLE_SUPABASE_URL || !process.env.LOVABLE_SUPABASE_ANON_KEY) {
    console.error("❌ Missing Lovable Supabase credentials in .env");
    throw new Error("Missing LOVABLE_SUPABASE_URL or LOVABLE_SUPABASE_ANON_KEY");
}
if (!process.env.YOUR_SUPABASE_URL || !process.env.YOUR_SUPABASE_SERVICE_KEY) {
    console.error("❌ Missing your Supabase credentials in .env");
    throw new Error("Missing YOUR_SUPABASE_URL or YOUR_SUPABASE_SERVICE_KEY");
}
// ✅ Initialize Supabase clients
const lovableSupabase = (0, supabase_js_1.createClient)(process.env.LOVABLE_SUPABASE_URL, process.env.LOVABLE_SUPABASE_ANON_KEY);
const yourSupabase = (0, supabase_js_1.createClient)(process.env.YOUR_SUPABASE_URL, process.env.YOUR_SUPABASE_SERVICE_KEY);
// ✅ Health check route
router.get("/ping", (req, res) => {
    res.json({ message: "Submit Onboarding route is alive!" });
});
// ✅ Main onboarding route
router.post("/", async (req, res) => {
    console.log("📩 [Onboarding] Endpoint hit.");
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.log("❌ Missing Authorization header");
            return res.status(401).json({ success: false, error: "Missing Authorization header" });
        }
        const token = authHeader.split(" ")[1];
        const { data: userData, error: authError } = await lovableSupabase.auth.getUser(token);
        if (authError || !userData?.user) {
            console.log("❌ Invalid token:", authError?.message);
            return res.status(401).json({ success: false, error: "Invalid or expired token" });
        }
        console.log("✅ Authenticated Lovable user:", userData.user.email);
        const formData = req.body;
        console.log("🧠 Received data:", formData);
        const { error: insertError } = await yourSupabase
            .from("onboarding")
            .insert([{ user_id: userData.user.id, ...formData }]);
        if (insertError) {
            console.error("❌ Supabase insert error:", insertError.message);
            return res.status(400).json({ success: false, error: insertError.message });
        }
        console.log("✅ Data inserted successfully");
        return res.json({ success: true, message: "Onboarding data saved successfully" });
    }
    catch (error) {
        console.error("💥 Server error:", error);
        return res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown server error",
        });
    }
});
// ✅ Default export (required by server.ts)
exports.default = router;
