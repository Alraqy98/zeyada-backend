"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // ✅ ensures .env loads even before server.ts
const supabase_js_1 = require("@supabase/supabase-js");
// ✅ Validate environment variables
if (!process.env.YOUR_SUPABASE_URL || !process.env.YOUR_SUPABASE_SERVICE_KEY) {
    console.error("❌ Missing Supabase environment variables in .env");
    throw new Error("Missing Supabase environment variables");
}
// ✅ Export your main Supabase client
exports.supabase = (0, supabase_js_1.createClient)(process.env.YOUR_SUPABASE_URL, process.env.YOUR_SUPABASE_SERVICE_KEY);
