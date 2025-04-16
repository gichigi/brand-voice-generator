// Import shared types
import { BrandVoice, ContentItem } from "./types"
import { fallbackBrandVoice } from "./fallback-brand-voice"

// Other types
export type OnboardingData = {
  businessName: string
  yearFounded: string
  businessDescription: string
  selectedDemographics: string[]
  businessValues: string[]
  additionalInfo?: string
}

// Helper functions
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Brand Voice
export function saveBrandVoice(brandVoice: BrandVoice): boolean {
  try {
    localStorage.setItem("generatedBrandVoice", JSON.stringify(brandVoice))
    console.log("[DataService] Saved brand voice with", brandVoice?.pillars?.length || 0, "pillars");
    return true
  } catch (error) {
    console.error("Error saving brand voice:", error)
    return false
  }
}

export function getBrandVoice(): BrandVoice {
  try {
    // Check if we're in a browser environment before using localStorage
    if (typeof window !== 'undefined') {
      // IMPORTANT: Changed from "brandVoice" to "generatedBrandVoice" to match the key used elsewhere
      const brandVoice = localStorage.getItem("generatedBrandVoice")
      console.log("[DataService] Loading brand voice from localStorage:", 
                 brandVoice ? `Found with ${JSON.parse(brandVoice)?.pillars?.length || 0} pillars` : "Not found");
      
      return brandVoice ? JSON.parse(brandVoice) : fallbackBrandVoice
    } else {
      // Server-side rendering fallback
      console.log("[DataService] Server-side rendering, using fallback brand voice");
      return fallbackBrandVoice
    }
  } catch (error) {
    console.error("Error retrieving brand voice:", error)
    return fallbackBrandVoice
  }
}

// Content
export function saveContent(content: Omit<ContentItem, "id" | "createdAt">): {
  success: boolean
  contentId?: string
  error?: string
} {
  try {
    const contentId = `content_${Date.now()}`
    const newContent: ContentItem = {
      id: contentId,
      ...content,
      createdAt: new Date().toISOString(),
    }

    // Get existing contents
    const contents = getContents()

    // Add new content at the beginning
    contents.unshift(newContent)

    // Save back to localStorage
    localStorage.setItem("contents", JSON.stringify(contents))

    // Update the cache
    updateContentCache(contents)

    return { success: true, contentId }
  } catch (error) {
    console.error("Error saving content:", error)
    return { success: false, error: "Failed to save content" }
  }
}

export function updateContent(id: string, updates: Partial<ContentItem>): boolean {
  try {
    const contents = getContents()
    const updatedContents = contents.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      }
      return item
    })

    localStorage.setItem("contents", JSON.stringify(updatedContents))

    // Update the cache
    updateContentCache(updatedContents)

    return true
  } catch (error) {
    console.error(`Error updating content with ID ${id}:`, error)
    return false
  }
}

export function deleteContent(id: string): boolean {
  try {
    const contents = getContents()
    const filteredContents = contents.filter((item) => item.id !== id)

    localStorage.setItem("contents", JSON.stringify(filteredContents))

    // Update the cache
    updateContentCache(filteredContents)

    return true
  } catch (error) {
    console.error(`Error deleting content with ID ${id}:`, error)
    return false
  }
}

// Get all content items
export function getContents(): ContentItem[] {
  try {
    // Use a cached version if available
    if (window._cachedContents) {
      return window._cachedContents
    }

    const contents = localStorage.getItem("contents")
    const parsedContents = contents ? JSON.parse(contents) : []

    // Cache the result for future use
    window._cachedContents = parsedContents

    return parsedContents
  } catch (error) {
    console.error("Error retrieving contents:", error)
    return []
  }
}

// Get a single content item by ID
export function getContentById(id: string): ContentItem | null {
  try {
    const contents = getContents()
    return contents.find((item) => item.id === id) || null
  } catch (error) {
    console.error(`Error retrieving content with ID ${id}:`, error)
    return null
  }
}

// Onboarding
// Add this function to set both localStorage and cookie
export function setOnboardingCompleted(completed: boolean): void {
  // Set in localStorage
  localStorage.setItem("onboardingCompleted", String(completed))

  // Also set in cookie for middleware access
  document.cookie = `onboardingCompleted=${completed}; path=/; max-age=${60 * 60 * 24 * 365}` // 1 year
}

// Update the existing function to use the new one
export function saveOnboardingData(data: any): boolean {
  try {
    localStorage.setItem("onboardingData", JSON.stringify(data))
    setOnboardingCompleted(true)
    return true
  } catch (error) {
    console.error("Error saving onboarding data:", error)
    return false
  }
}

export function getOnboardingData(): any {
  try {
    const data = localStorage.getItem("onboardingData")
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Error retrieving onboarding data:", error)
    return null
  }
}

export function isOnboardingCompleted(): boolean {
  try {
    return localStorage.getItem("onboardingCompleted") === "true"
  } catch (error) {
    console.error("Error checking onboarding status:", error)
    return false
  }
}

export function getContent(id: string): ContentItem | null {
  try {
    const contents = getContents()
    return contents.find((item) => item.id === id) || null
  } catch (error) {
    console.error(`Error retrieving content with ID ${id}:`, error)
    return null
  }
}

// Add this function to update the cache when content is saved or updated
export function updateContentCache(newContents: ContentItem[]) {
  window._cachedContents = newContents
}

// Add TypeScript declaration for the global window object
declare global {
  interface Window {
    _cachedContents?: ContentItem[]
  }
}
