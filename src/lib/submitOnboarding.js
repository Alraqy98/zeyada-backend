import { supabase } from "../integrations/supabase/client.js";

export async function submitOnboarding(formData) {
  try {
    // Get the user's Supabase session token
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      return {
        success: false,
        error: "Please log in to continue",
        requiresAuth: true,
      };
    }

    // Send data to backend
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/submitOnboarding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend error: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Onboarding error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to complete onboarding",
    };
  }
}
