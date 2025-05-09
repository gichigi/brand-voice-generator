// Type definitions
export interface ContentItem {
  id: string
  contentType: string
  topic: string
  content: string
  outline?: string
  htmlContent?: string
  markdownContent?: string
  keywords?: string
  customContext?: string
  referenceUrl?: string
  contentOutline?: string
  wordCount?: number
  brandVoiceId?: string
  businessInfoId?: string
  highlights?: any[] // Add this line
  createdAt: string
  updatedAt?: string
}

export interface BrandVoice {
  executiveSummary: string
  pillars: Array<{
    id: string
    title: string
    means: string[]
    doesntMean: string[]
    inspiration: string
  }>
}

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
    localStorage.setItem("brandVoice", JSON.stringify(brandVoice))
    return true
  } catch (error) {
    console.error("Error saving brand voice:", error)
    return false
  }
}

export function getBrandVoice(): BrandVoice {
  try {
    const brandVoice = localStorage.getItem("brandVoice")
    return brandVoice ? JSON.parse(brandVoice) : getDefaultBrandVoice()
  } catch (error) {
    console.error("Error retrieving brand voice:", error)
    return getDefaultBrandVoice()
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

// Get default brand voice
function getDefaultBrandVoice(): BrandVoice {
  return {
    executiveSummary: "Our brand voice is clear, helpful, and authentic.",
    pillars: [
      {
        id: "fallback-1",
        title: "Clear",
        means: ["Use simple language", "Avoid jargon", "Be concise"],
        doesntMean: ["Oversimplified", "Vague", "Incomplete"],
        inspiration: "We communicate complex ideas in accessible ways.",
      },
      {
        id: "fallback-2",
        title: "Helpful",
        means: ["Focus on solutions", "Anticipate needs", "Provide value"],
        doesntMean: ["Pushy", "Patronizing", "Overpromising"],
        inspiration: "We prioritize being useful over being promotional.",
      },
      {
        id: "fallback-3",
        title: "Authentic",
        means: ["Be honest", "Show personality", "Stay consistent"],
        doesntMean: ["Unprofessional", "Oversharing", "Inconsistent"],
        inspiration: "We build trust through genuine communication.",
      },
    ],
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

// Add this function to check if a brand voice has been generated
export function hasBrandVoiceBeenGenerated(): boolean {
  try {
    const brandVoice = localStorage.getItem("brandVoice")
    // If brandVoice exists in localStorage and is not the default, return true
    return (
      !!brandVoice && brandVoice.includes('"executiveSummary"') && !brandVoice.includes("clear, helpful, and authentic")
    )
  } catch (error) {
    console.error("Error checking if brand voice has been generated:", error)
    return false
  }
}
