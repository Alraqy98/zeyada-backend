"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const submitOnboarding_js_1 = require("../src/lib/submitOnboarding.js");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/api/submitOnboarding", async (req, res) => {
    try {
        const result = await (0, submitOnboarding_js_1.submitOnboarding)(req.body);
        res.status(200).json({ success: true, result });
    }
    catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.get("/", (_, res) => res.send("Backend running ✅"));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server live on port ${port}`));
