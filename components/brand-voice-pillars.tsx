"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface BrandVoicePillar {
  id: string
  title: string
  means: string[]
  doesntMean: string[]
  inspiration?: string
}

// Update the BrandVoicePillarsProps interface to fix the compact prop issue
interface BrandVoicePillarsProps {
  className?: string
  compact?: boolean // Make sure this is properly typed as optional boolean
  onPillarToggle?: (activePillars: number[]) => void
  activePillars?: number[]
}

// Define the consistent fallback brand voice pillars
const FALLBACK_BRAND_VOICE_PILLARS = [
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
]

// Then in the component function, ensure the compact prop is properly destructured
export function BrandVoicePillars({
  className = "",
  compact = false, // Default to false
  onPillarToggle,
  activePillars: externalActivePillars,
}: BrandVoicePillarsProps) {
  const [pillars, setPillars] = useState<BrandVoicePillar[]>([])

  // We'll set all pillars as active and not allow toggling
  const [internalActivePillars, setInternalActivePillars] = useState<number[]>([0, 1, 2, 3, 4, 5])
  const activePillars = internalActivePillars

  useEffect(() => {
    try {
      // Try to get brand voice from localStorage
      const storedBrandVoice = localStorage.getItem("generatedBrandVoice")
      if (storedBrandVoice) {
        const brandVoice = JSON.parse(storedBrandVoice)
        if (brandVoice.pillars && Array.isArray(brandVoice.pillars)) {
          setPillars(brandVoice.pillars)
          // Initialize all pillars as active
          setInternalActivePillars(brandVoice.pillars.map((_, index) => index))
          return
        }
      }

      // Fallback to default pillars if not found
      console.log("No brand voice found in localStorage, using fallback")
      setPillars(FALLBACK_BRAND_VOICE_PILLARS)
      // Store the fallback for future use
      localStorage.setItem(
        "generatedBrandVoice",
        JSON.stringify({
          executiveSummary: "Our brand voice is vibrant, empathetic, and action-oriented.",
          pillars: FALLBACK_BRAND_VOICE_PILLARS,
        }),
      )
      // Initialize all default pillars as active
      setInternalActivePillars([0, 1, 2])
    } catch (error) {
      console.error("Error loading brand voice pillars:", error)
      // Use fallback on error
      setPillars(FALLBACK_BRAND_VOICE_PILLARS)
      setInternalActivePillars([0, 1, 2])
    }
  }, [])

  // Get pillar color based on index - all pillars are now active
  const getPillarColor = (index: number) => {
    const colors = [
      "bg-blue-100 border-blue-200 text-blue-700",
      "bg-green-100 border-green-200 text-green-700",
      "bg-purple-100 border-purple-200 text-purple-700",
    ]
    return colors[index % colors.length]
  }

  if (pillars.length === 0) {
    return null
  }

  if (compact) {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {pillars.map((pillar, index) => (
          <div
            key={pillar.id}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getPillarColor(index)}`}
          >
            {pillar.title}
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-3">Your Brand Voice</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {pillars.map((pillar, index) => (
            <div key={pillar.id} className={`p-3 rounded-lg border ${getPillarColor(index)}`}>
              <h4 className="font-medium">{pillar.title}</h4>
              <div className="mt-1 text-sm">
                <div className="flex flex-wrap gap-1 mt-1">
                  {pillar.means.slice(0, 3).map((trait) => (
                    <span key={trait} className="inline-block px-2 py-0.5 bg-white/50 rounded text-xs">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
