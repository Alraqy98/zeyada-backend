import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import authRoutes from "./api/auth";
import submitOnboarding from "./api/submitOnboarding";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/submitOnboarding", submitOnboarding);

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
app.get("/", (req, res) => {
  res.send("✅ Zeyada backend is live!");
});
