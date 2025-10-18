"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("../src/integrations/supabase/client");
const router = express_1.default.Router();
/**
 * ✅ SIGNUP
 * Creates a new user and sends a verification email automatically.
 */
router.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await client_1.supabase.auth.signUp({
            email,
            password,
        });
        if (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
        return res.json({
            success: true,
            message: "Signup successful. Please verify your email before logging in.",
            user: data.user,
        });
    }
    catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({ success: false, error: "Server error during signup." });
    }
});
/**
 * ✅ LOGIN
 * Logs in the user and returns access + refresh tokens for authentication.
 */
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await client_1.supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            return res.status(401).json({ success: false, error: error.message });
        }
        const { session, user } = data;
        return res.json({
            success: true,
            message: "Login successful.",
            user: {
                id: user.id,
                email: user.email,
            },
            access_token: session?.access_token,
            refresh_token: session?.refresh_token,
            expires_in: session?.expires_in,
        });
    }
    catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ success: false, error: "Server error during login." });
    }
});
/**
 * ✅ REFRESH TOKEN
 * Allows extending the session without relogin.
 */
router.post("/refresh", async (req, res) => {
    const { refresh_token } = req.body;
    try {
        const { data, error } = await client_1.supabase.auth.refreshSession({ refresh_token });
        if (error) {
            return res.status(401).json({ success: false, error: error.message });
        }
        const { session } = data;
        return res.json({
            success: true,
            message: "Token refreshed successfully.",
            access_token: session?.access_token,
            refresh_token: session?.refresh_token,
            expires_in: session?.expires_in,
        });
    }
    catch (err) {
        console.error("Refresh token error:", err);
        return res.status(500).json({ success: false, error: "Server error during token refresh." });
    }
});
/**
 * ✅ LOGOUT
 * Revokes the user’s current session.
 */
router.post("/logout", async (_req, res) => {
    try {
        const { error } = await client_1.supabase.auth.signOut();
        if (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
        return res.json({ success: true, message: "Logout successful." });
    }
    catch (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ success: false, error: "Server error during logout." });
    }
});
exports.default = router;
