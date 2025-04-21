/**
 * Utility functions for the onboarding process
 */

/**
 * Checks if the onboarding process has been completed
 * @returns boolean indicating if onboarding is complete
 */
export function isOnboardingCompleted(): boolean {
  // Check if running in a browser environment
  if (typeof window === "undefined") {
    return false
  }

  // Check if the brandVoiceGenerated flag is set in localStorage
  const brandVoiceGenerated = localStorage.getItem("brandVoiceGenerated")

  // Return true if the flag exists and is set to "true"
  return brandVoiceGenerated === "true"
}

/**
 * Marks the onboarding process as completed
 */
export function markOnboardingCompleted(): void {
  // Check if running in a browser environment
  if (typeof window === "undefined") {
    return
  }

  // Set the brandVoiceGenerated flag in localStorage
  localStorage.setItem("brandVoiceGenerated", "true")
}

/**
 * Resets the onboarding process
 */
export function resetOnboarding(): void {
  // Check if running in a browser environment
  if (typeof window === "undefined") {
    return
  }

  // Remove onboarding-related items from localStorage
  localStorage.removeItem("brandVoiceGenerated")
  localStorage.removeItem("brandVoiceData")
  localStorage.removeItem("generatedBrandVoice")
}
