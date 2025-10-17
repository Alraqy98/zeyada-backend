import { supabase } from "../integrations/supabase/client.js";
export async function submitOnboarding(formData) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return {
                success: false,
                error: "Please log in to continue",
                requiresAuth: true,
            };
        }
        // Save profile info
        const { error: profileError } = await supabase.from("profiles").upsert({
            id: user.id,
            business_name: formData.businessName,
            website: formData.website,
            country: formData.country,
            city: formData.city,
        });
        if (profileError)
            throw profileError;
        // Save AI profile data
        const { error: aiError } = await supabase.from("ai_profile").upsert({
            user_id: user.id,
            business_activity_raw: formData.businessActivity,
            pain_point: formData.painPoint,
            automation_goal: formData.automationGoal,
        });
        if (aiError)
            throw aiError;
        // Save onboarding details
        const { error: onboardingError } = await supabase.from("onboarding").upsert({
            user_id: user.id,
            completed: true,
            languages: formData.languages,
            channels: formData.channels,
            working_days: formData.workingDays,
            hours: formData.hours,
        });
        if (onboardingError)
            throw onboardingError;
        return { success: true };
    }
    catch (error) {
        console.error("Onboarding error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to complete onboarding",
        };
    }
}
