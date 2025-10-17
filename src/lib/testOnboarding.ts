import "dotenv/config";
import { supabase } from "../integrations/supabase/client.js";
import submitOnboarding from "../../api/submitOnboarding";

async function runTest() {
  // 1️⃣ Log in first (replace with an actual test user)
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: "your_test_email@example.com",
    password: "Test1234!",
  });

  if (authError) {
    console.error("Login failed:", authError.message);
    return;
  }

  console.log("Logged in as:", authData.user?.email);

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

  const result = await submitOnboarding(formData);
  console.log("Result:", result);
}

runTest();
