import { supabase } from "../integrations/supabase/client";

export interface OnboardingFormData {
  businessName: string;
  website: string;
  country: string;
  city: string;
  languages: string;
  channels: string;
  workingDays: string;
  hours: string;
  businessActivity: string;
  description: string;
  painPoint: string;
  automationGoal: string;
}

export interface OnboardingResult {
  success: boolean;
  error?: string;
  requiresAuth?: boolean;
}

export async function submitOnboarding(formData: OnboardingFormData): Promise<OnboardingResult> {
  try {
    // Insert into 'onboarding' table directly using service role key
    const { error } = await supabase.from("onboarding").insert([formData]);

    if (error) {
      console.error("Supabase insert error:", error);
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error("Onboarding error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unexpected error during onboarding",
    };
  }
}
