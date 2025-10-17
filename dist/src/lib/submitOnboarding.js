"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitOnboarding = submitOnboarding;
const client_js_1 = require("../integrations/supabase/client.js");
async function submitOnboarding(formData) {
    try {
        const { data: { user } } = await client_js_1.supabase.auth.getUser();
        if (!user) {
            return {
                success: false,
                error: "Please log in to continue",
                requiresAuth: true,
            };
        }
        // ✅ Save profile info
        const { error: profileError } = await client_js_1.supabase
            .from("profiles")
            .upsert({
            user_id: user.id,
            business_name: formData.businessName,
            website: formData.website,
            country: formData.country,
            timezone: "UTC",
            hours: formData.hours,
            working_days: formData.workingDays,
            hours_json: {
                hours: formData.hours,
                workingDays: formData.workingDays,
            },
        });
        if (profileError)
            throw profileError;
        // ✅ Save AI profile info
        const { error: onboardingError } = await client_js_1.supabase
            .from("ai_profiles")
            .upsert({
            user_id: user.id,
            description: formData.description,
            detected_language: formData.languages,
            industry: formData.businessActivity,
            channels_json: { channels: formData.channels },
            suggestions_json: null,
        });
        if (onboardingError)
            throw onboardingError;
        return { success: true };
    }
    catch (error) {
        console.error("Onboarding error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unexpected error during onboarding",
        };
    }
}
