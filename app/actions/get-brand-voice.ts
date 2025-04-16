"use server"

import { getBrandVoice as getBrandVoiceFromStorage } from "@/lib/data-service"
import { fallbackBrandVoice } from "@/lib/fallback-brand-voice"
import { BrandVoicePillar } from "@/lib/types"

export async function getBrandVoice() {
  try {
    console.log("[GetBrandVoice] Attempting to get brand voice data");
    
    // Try to get from localStorage (client-side)
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("generatedBrandVoice")
      
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log("[GetBrandVoice] Found data in localStorage with", 
          parsedData?.pillars?.length || 0, "pillars:", 
          parsedData?.pillars?.map((p: BrandVoicePillar) => p.title).join(", ") || "none");
        return { success: true, data: parsedData }
      } else {
        console.log("[GetBrandVoice] No data found in localStorage, checking data service");
      }
    }

    // Try to get from our data service
    const brandVoice = await getBrandVoiceFromStorage()
    if (brandVoice) {
      console.log("[GetBrandVoice] Found data in data service with", 
        brandVoice?.pillars?.length || 0, "pillars:", 
        brandVoice?.pillars?.map((p: BrandVoicePillar) => p.title).join(", ") || "none");
      return { success: true, data: brandVoice }
    } else {
      console.log("[GetBrandVoice] No data found in data service, using fallback");
    }

    // Return fallback data if nothing is found
    console.log("[GetBrandVoice] Using fallback brand voice with", 
      fallbackBrandVoice.pillars.length, "pillars:", 
      fallbackBrandVoice.pillars.map((p: BrandVoicePillar) => p.title).join(", "));
    return { success: true, data: fallbackBrandVoice }
  } catch (error) {
    console.error("[GetBrandVoice] Error fetching brand voice:", error)

    // Ultimate fallback
    console.log("[GetBrandVoice] Error occurred, using fallback brand voice");
    return {
      success: true,
      data: fallbackBrandVoice,
      warning: "Using fallback brand voice due to an error. Please try regenerating your brand voice.",
    }
  }
}
