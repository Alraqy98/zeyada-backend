"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./api/auth"));
const submitOnboarding_1 = __importDefault(require("./api/submitOnboarding"));
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
