import "dotenv/config";
import fetch from "node-fetch";
import { supabase } from "../integrations/supabase/client.js";

async function runTest() {
  // 1️⃣ Log in with a real test user
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: "your_test_email@example.com",
    password: "Test1234!",
  });

  if (authError) {
    console.error("Login failed:", authError.message);
    return;
  }

  const token = authData.session.access_token;

  // 2️⃣ Prepare your onboarding data
  const formData = {
    businessName: "Zeyada",
    website: "https://zeyada.ai",
    country: "Saudi Arabia",
    city: "Riyadh",
    languages: "English, Arabic",
    channels: "WhatsApp, Web",
    workingDays: "Sun-Thu",
    hours: "9am-6pm",
    businessActivity: "AI Automations",
    description: "Testing onboarding API",
    painPoint: "Manual data handling",
    automationGoal: "Automate client responses",
  };

  // 3️⃣ Call your local API route (the Express endpoint)
  const response = await fetch("http://localhost:3000/api/submitOnboarding", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  const result = await response.json();
  console.log("✅ API response:", result);
}

runTest();
