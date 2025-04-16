"use server"

import { getBrandVoice as getBrandVoiceFromStorage } from "@/lib/data-service"

// Fallback brand voice data if everything else fails
const fallbackBrandVoice = {
  executiveSummary: "A balanced brand voice that combines professionalism with approachability.",
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

export async function getBrandVoice() {
  try {
    // Try to get from localStorage (client-side)
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("generatedBrandVoice")
      if (savedData) {
        return { success: true, data: JSON.parse(savedData) }
      }
    }

    // Try to get from our data service
    const brandVoice = await getBrandVoiceFromStorage()
    if (brandVoice) {
      return { success: true, data: brandVoice }
    }

    // Return fallback data if nothing is found
    return { success: true, data: fallbackBrandVoice }
  } catch (error) {
    console.error("Error fetching brand voice:", error)

    // Ultimate fallback
    return {
      success: true,
      data: fallbackBrandVoice,
      warning: "Using fallback brand voice due to an error. Please try regenerating your brand voice.",
    }
  }
}
