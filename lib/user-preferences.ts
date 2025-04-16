export interface UserPreferences {
  readingAge: number
  wordCount: number
  imageSuggestions: boolean
  includeQuotes: boolean
  addByline: boolean
  brandVoiceEnabled: boolean
  autoGeneratePrompt: boolean
  defaultContentType: string
  defaultContentLength: string
  customInstructions: string
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  readingAge: 12,
  wordCount: 500,
  imageSuggestions: false,
  includeQuotes: true,
  addByline: false,
  brandVoiceEnabled: true,
  autoGeneratePrompt: true,
  defaultContentType: "blog-post",
  defaultContentLength: "medium",
  customInstructions: "",
}

// In a real app, these would be API calls to your backend
export async function getUserPreferences(): Promise<UserPreferences> {
  // Simulate API call
  const savedPrefs = localStorage.getItem("userPreferences")
  if (savedPrefs) {
    return JSON.parse(savedPrefs)
  }
  return DEFAULT_PREFERENCES
}

export async function saveUserPreferences(preferences: UserPreferences): Promise<void> {
  // Simulate API call
  localStorage.setItem("userPreferences", JSON.stringify(preferences))
}

export async function resetUserPreferences(): Promise<UserPreferences> {
  // Simulate API call
  localStorage.setItem("userPreferences", JSON.stringify(DEFAULT_PREFERENCES))
  return DEFAULT_PREFERENCES
}
