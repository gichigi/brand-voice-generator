"use server"

import { getBrandVoice as getBrandVoiceFromStorage } from "@/lib/data-service"

// Fallback brand voice data if everything else fails
const fallbackBrandVoice = {
  executiveSummary: "Our brand voice is vibrant, empathetic, and action-oriented.",
  pillars: [
    {
      id: "fallback-1",
      title: "Vibrant",
      means: ["Use colorful language", "Create vivid imagery", "Energize the reader"],
      doesntMean: ["Overly casual", "Unprofessional", "Exaggerated"],
      inspiration: "We bring ideas to life with dynamic, colorful expression.",
    },
    {
      id: "fallback-2",
      title: "Empathetic",
      means: ["Acknowledge feelings", "Show understanding", "Connect personally"],
      doesntMean: ["Overly emotional", "Presumptuous", "Insincere"],
      inspiration: "We genuinely understand and address our audience's needs and concerns.",
    },
    {
      id: "fallback-3",
      title: "Action-Oriented",
      means: ["Use strong verbs", "Provide clear next steps", "Inspire movement"],
      doesntMean: ["Demanding", "Pushy", "Unrealistic"],
      inspiration: "We motivate readers to take meaningful action through powerful calls to action.",
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
