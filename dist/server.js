"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // ✅ forces .env to load
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./api/auth"));
const submitOnboarding_1 = __importDefault(require("./api/submitOnboarding"));
console.log("🔍 Render ENV CHECK:", {
    YOUR_SUPABASE_URL: process.env.YOUR_SUPABASE_URL ? "✅ found" : "❌ missing",
    YOUR_SUPABASE_SERVICE_KEY: process.env.YOUR_SUPABASE_SERVICE_KEY ? "✅ found" : "❌ missing",
    LOVABLE_SUPABASE_URL: process.env.LOVABLE_SUPABASE_URL ? "✅ found" : "❌ missing",
    LOVABLE_SUPABASE_ANON_KEY: process.env.LOVABLE_SUPABASE_ANON_KEY ? "✅ found" : "❌ missing",
});
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Request logger
app.use((req, res, next) => {
    console.log(`➡️  ${req.method} ${req.url}`);
    next();
});
// Routes
app.use("/api/auth", auth_1.default);
app.use("/api/submitOnboarding", submitOnboarding_1.default);
// Server start
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
app.get("/", (req, res) => {
    res.send("✅ Zeyada backend is live!");
});
