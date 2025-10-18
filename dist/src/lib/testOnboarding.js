"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_js_1 = require("../integrations/supabase/client.js");
const submitOnboarding_1 = __importDefault(require("../../api/submitOnboarding"));
async function runTest() {
    var _a;
    // 1️⃣ Log in first (replace with an actual test user)
    const { data: authData, error: authError } = await client_js_1.supabase.auth.signInWithPassword({
        email: "your_test_email@example.com",
        password: "Test1234!",
    });
    if (authError) {
        console.error("Login failed:", authError.message);
        return;
    }
    console.log("Logged in as:", (_a = authData.user) === null || _a === void 0 ? void 0 : _a.email);
    // 2️⃣ Then send the onboarding data
    const formData = {
        businessName: "Zeyada Test",
        website: "https://zeyada.ai",
        country: "Saudi Arabia",
        city: "Riyadh",
        languages: "English, Arabic",
        channels: "WhatsApp, Web",
        workingDays: "Sunday-Thursday",
        hours: "9am-6pm",
        businessActivity: "AI Automations",
        description: "Testing onboarding function",
        painPoint: "Manual customer handling",
        automationGoal: "Automate lead response",
    };
    const result = await (0, submitOnboarding_1.default)(formData);
    console.log("Result:", result);
}
runTest();
