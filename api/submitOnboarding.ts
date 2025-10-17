import express from "express";
import { submitOnboarding } from "../src/lib/submitOnboarding.js";

const app = express();
app.use(express.json());

app.post("/api/submitOnboarding", async (req, res) => {
  try {
    const result = await submitOnboarding(req.body);
    res.status(200).json({ success: true, result });
  } catch (error: any) {
    console.error("API Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/", (_, res) => res.send("Backend running ✅"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server live on port ${port}`));
