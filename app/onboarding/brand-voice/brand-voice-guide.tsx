"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Star, X, Minus, RefreshCw, AlertCircle } from "lucide-react"
import { regeneratePillar } from "@/app/actions/generate-brand-voice"
import { LoadingMessages } from "@/components/loading-messages"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Define the consistent fallback brand voice
const FALLBACK_BRAND_VOICE = {
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

interface BrandVoiceGuideProps {
  businessName: string
  yearFounded: string
  businessDescription: string
  businessValues: string[]
  selectedDemographics?: string[]
  additionalInfo?: string
  generatedData?: any
  onRegeneratePillar: (index: number, newPillar: any) => void
}

export function BrandVoiceGuide({
  businessName,
  yearFounded,
  businessDescription,
  businessValues,
  selectedDemographics,
  additionalInfo,
  generatedData,
  onRegeneratePillar,
}: BrandVoiceGuideProps) {
  const [regeneratingPillar, setRegeneratingPillar] = useState<number | null>(null)
  const [regenerationError, setRegenerationError] = useState<string | null>(null)

  // Use the generated data if available, otherwise use default data
  const executiveSummary =
    generatedData?.executiveSummary ||
    `${businessName}'s brand voice combines clarity and personality to connect with its audience.`

  // Define color schemes for different pillar types
  const pillarColors = [
    { color: "bg-blue-100 text-blue-700 border-blue-300", bgColor: "bg-blue-50" },
    { color: "bg-green-100 text-green-700 border-green-300", bgColor: "bg-green-50" },
    { color: "bg-purple-100 text-purple-700 border-purple-300", bgColor: "bg-purple-50" },
    { color: "bg-amber-100 text-amber-700 border-amber-300", bgColor: "bg-amber-50" },
    { color: "bg-rose-100 text-rose-700 border-rose-300", bgColor: "bg-rose-50" },
    { color: "bg-teal-100 text-teal-700 border-teal-300", bgColor: "bg-teal-50" },
  ]

  // Use the generated pillars if available, otherwise use default pillars
  const brandVoicePillars = generatedData?.pillars || FALLBACK_BRAND_VOICE.pillars

  // Add color information to the pillars if using generated data
  const coloredPillars = (generatedData?.pillars || brandVoicePillars).map((pillar, index) => {
    return {
      ...pillar,
      color: pillar.color || pillarColors[index % pillarColors.length].color,
      bgColor: pillar.bgColor || pillarColors[index % pillarColors.length].bgColor,
    }
  })

  const handleRegeneratePillar = async (index: number) => {
    if (!generatedData) return

    setRegeneratingPillar(index)
    setRegenerationError(null)

    try {
      // Create a simplified version of the pillars for the server action
      const simplifiedPillars = coloredPillars.map((pillar) => ({
        id: pillar.id,
        title: pillar.title,
        means: pillar.means,
        doesntMean: pillar.doesntMean,
        inspiration: pillar.inspiration,
      }))

      const formData = {
        businessName,
        yearFounded,
        businessDescription,
        businessValues,
        selectedDemographics,
        additionalInfo,
      }

      console.log("Starting pillar regeneration for index:", index)

      // Call the server action with a timeout
      const result = (await Promise.race([
        regeneratePillar(formData, index, simplifiedPillars),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), 30000)),
      ])) as any

      console.log("Pillar regeneration result:", result)

      if (result && result.success && result.data) {
        // Create a new pillar with the color information
        const newPillar = {
          ...result.data,
          color: coloredPillars[index].color,
          bgColor: coloredPillars[index].bgColor,
        }

        onRegeneratePillar(index, newPillar)

        if (result.warning) {
          toast({
            title: "Pillar Updated",
            description: result.warning,
          })
        } else {
          toast({
            title: "Pillar Updated",
            description: `The "${newPillar.title}" pillar has been regenerated successfully.`,
          })
        }
      } else {
        throw new Error(result?.error || "Invalid response format from server")
      }
    } catch (error) {
      console.error("Error regenerating pillar:", error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred. Please try again."
      setRegenerationError(errorMessage)
      toast({
        title: "Regeneration failed",
        description: errorMessage,
      })
    } finally {
      setRegeneratingPillar(null)
    }
  }

  const highlightKeywords = (text: string) => {
    if (!text) return "" // Handle undefined or empty text

    const keywords = [
      "confident",
      "direct",
      "inspire",
      "action",
      "playful",
      "conversational",
      "humor",
      "approachable",
      "clear",
      "simple",
      "transparent",
      "trust",
    ]

    // Check if text contains the separator
    if (!text.includes(" – ")) {
      return text
    }

    return text.split(" ").map((word, index) => {
      const lowerWord = word.toLowerCase().replace(/[^a-z]/g, "")
      if (keywords.includes(lowerWord)) {
        return <strong key={index}>{word} </strong>
      }
      return word + " "
    })
  }

  const formatInspiration = (inspiration: string) => {
    if (!inspiration) return ""

    // Check if the inspiration contains the separator
    if (inspiration.includes(" – ")) {
      const [brand, description] = inspiration.split(" – ")
      return (
        <>
          <strong>{brand}</strong> – {highlightKeywords(description)}
        </>
      )
    }

    // If no separator, return as is
    return inspiration
  }

  useEffect(() => {
    // Check if we're using the fallback pillars (no generatedData)
    if (!generatedData && !regeneratingPillar) {
      toast({
        title: "Using example brand voice",
        description: "We couldn't generate a custom brand voice. Showing example pillars instead.",
      })
    }
  }, [generatedData, regeneratingPillar])

  return (
    <div className="space-y-8">
      {regenerationError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{regenerationError}</AlertDescription>
        </Alert>
      )}

      {/* Executive Summary */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-slate max-w-none">
            <p className="text-lg">{executiveSummary}</p>
          </div>
        </CardContent>
      </Card>

      {/* Brand Voice Pillars */}
      <div className="space-y-6">
        {coloredPillars.map((pillar, index) => (
          <Card key={index} className="border shadow-sm overflow-hidden">
            <CardHeader className={`${pillar.color.split(" ")[0]} bg-opacity-30 border-b`}>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">{pillar.title}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRegeneratePillar(index)}
                  disabled={regeneratingPillar !== null}
                >
                  {regeneratingPillar === index ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className={`p-6 ${pillar.bgColor} bg-opacity-30`}>
              {regeneratingPillar === index ? (
                <div className="py-8">
                  <LoadingMessages context="pillar" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                          <ArrowRight className="h-5 w-5 text-primary" />
                          What It Means
                        </h3>
                        <ul className="space-y-2">
                          {pillar.means.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <X className="h-5 w-5 text-destructive" />
                        What It Doesn't Mean
                      </h3>
                      <ul className="space-y-2">
                        {pillar.doesntMean.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Minus className="h-4 w-4 text-destructive mt-1 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Star className="h-5 w-5 text-amber-500" />
                      Iconic Inspiration
                    </h3>
                    <div className="bg-white bg-opacity-50 p-4 rounded-md border border-slate-200">
                      <p className="text-sm">{formatInspiration(pillar.inspiration)}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
