"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sparkles, Check, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrandVoiceGuide } from "./brand-voice-guide"
import { LoadingSpinner } from "@/components/loading-spinner"
import { setOnboardingCompleted } from "@/lib/data-service"
import { toast } from "@/components/ui/use-toast"

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

// Default business info for fallback
const DEFAULT_BUSINESS_INFO = {
  businessName: "Your Business",
  yearFounded: "2023",
  businessDescription: "A business focused on delivering value to customers",
  businessValues: ["Quality", "Innovation", "Customer Focus"],
  selectedDemographics: ["Professionals", "Business Owners"],
  additionalInfo: "",
}

// Button states
type ButtonState = "default" | "changed" | "saving" | "success"

export default function BrandVoicePage() {
  const router = useRouter()
  const [brandVoice, setBrandVoice] = useState<any>(null)
  const [originalBrandVoice, setOriginalBrandVoice] = useState<any>(null)
  const [formData, setFormData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [hasChanges, setHasChanges] = useState(false)
  const [buttonState, setButtonState] = useState<ButtonState>("default")

  useEffect(() => {
    // Apply fade-in effect on mount
    document.body.classList.add("fade-in")
    setTimeout(() => {
      document.body.classList.remove("fade-in")
    }, 10)

    // Also remove fade-out if it's present (for return visits)
    document.body.classList.remove("fade-out")

    // Load the generated brand voice and form data
    const storedBrandVoice = localStorage.getItem("generatedBrandVoice")
    const storedFormData = localStorage.getItem("brandVoiceData")

    try {
      // Handle brand voice data
      if (storedBrandVoice) {
        const parsedBrandVoice = JSON.parse(storedBrandVoice)
        setBrandVoice(parsedBrandVoice)
        setOriginalBrandVoice(JSON.parse(JSON.stringify(parsedBrandVoice))) // Deep copy for comparison
      } else {
        // Use fallback brand voice
        setBrandVoice(FALLBACK_BRAND_VOICE)
        setOriginalBrandVoice(JSON.parse(JSON.stringify(FALLBACK_BRAND_VOICE)))
        localStorage.setItem("generatedBrandVoice", JSON.stringify(FALLBACK_BRAND_VOICE))
      }

      // Handle form data
      if (storedFormData) {
        const parsedFormData = JSON.parse(storedFormData)
        setFormData(parsedFormData)
      } else {
        // Use default business info
        setFormData(DEFAULT_BUSINESS_INFO)
        localStorage.setItem("brandVoiceData", JSON.stringify(DEFAULT_BUSINESS_INFO))
      }
    } catch (error) {
      console.error("Error parsing data:", error)
      // Use fallbacks on error
      setBrandVoice(FALLBACK_BRAND_VOICE)
      setOriginalBrandVoice(JSON.parse(JSON.stringify(FALLBACK_BRAND_VOICE)))
      setFormData(DEFAULT_BUSINESS_INFO)
      localStorage.setItem("generatedBrandVoice", JSON.stringify(FALLBACK_BRAND_VOICE))
      localStorage.setItem("brandVoiceData", JSON.stringify(DEFAULT_BUSINESS_INFO))
    } finally {
      setLoading(false)
    }
  }, [router])

  // Check for changes when brandVoice is updated
  useEffect(() => {
    if (brandVoice && originalBrandVoice) {
      // Compare current brand voice with original
      const currentStr = JSON.stringify(brandVoice)
      const originalStr = JSON.stringify(originalBrandVoice)
      const changed = currentStr !== originalStr

      setHasChanges(changed)

      // Update button state based on changes
      if (changed && buttonState === "default") {
        setButtonState("changed")
      } else if (!changed && buttonState === "changed") {
        setButtonState("default")
      }
    }
  }, [brandVoice, originalBrandVoice, buttonState])

  const handleRegeneratePillar = (index: number, newPillar: any) => {
    if (!brandVoice) return

    // Update the pillar in the brand voice
    const updatedPillars = [...brandVoice.pillars]
    updatedPillars[index] = newPillar

    const updatedBrandVoice = {
      ...brandVoice,
      pillars: updatedPillars,
    }

    setBrandVoice(updatedBrandVoice)
    // Note: We don't save to localStorage here to track changes
  }

  const handleSaveAndReturn = async () => {
    // Start saving process
    setButtonState("saving")

    try {
      // Save the brand voice to localStorage
      localStorage.setItem("generatedBrandVoice", JSON.stringify(brandVoice))

      // Mark onboarding as completed
      setOnboardingCompleted(true)

      // Set flag for dashboard to show success toast
      localStorage.setItem("justSaved", "true")

      // Show success state after a delay
      setTimeout(() => {
        setButtonState("success")

        // Begin visual fade-out before redirect
        document.body.classList.add("fade-out")

        // Navigate to dashboard after fade-out animation
        setTimeout(() => {
          router.push("/dashboard")
        }, 300)
      }, 800)
    } catch (error) {
      console.error("Error saving brand voice:", error)

      // Reset button state
      setButtonState(hasChanges ? "changed" : "default")

      // Show error toast
      toast({
        title: "Error saving changes",
        description: "There was a problem saving your brand voice. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBackToReview = () => {
    // Apply fade-out before navigating
    document.body.classList.add("fade-out")
    setTimeout(() => {
      router.push("/onboarding/review")
    }, 300)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <header className="border-b bg-white">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xl">
              <Link href="/" className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span>Choir</span>
              </Link>
            </div>
          </div>
        </header>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <LoadingSpinner className="mx-auto mb-4" />
            <p>Loading your brand voice...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Choir</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {formData?.businessName ? `${formData.businessName}'s Brand Voice` : "Your Brand Voice"}
          </h1>
          <p className="text-muted-foreground">
            Here's your unique brand voice based on your business information. You can regenerate any pillar if needed.
          </p>
        </div>

        <BrandVoiceGuide
          businessName={formData.businessName}
          yearFounded={formData.yearFounded}
          businessDescription={formData.businessDescription}
          businessValues={formData.businessValues}
          selectedDemographics={formData.selectedDemographics}
          additionalInfo={formData.additionalInfo}
          generatedData={brandVoice}
          onRegeneratePillar={handleRegeneratePillar}
        />

        <div className="mt-8">
          <p className="text-sm text-muted-foreground italic text-center mb-4">
            You can tweak your brand voice anytime.
          </p>
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handleBackToReview} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Review
            </Button>
            <Button
              onClick={handleSaveAndReturn}
              disabled={buttonState === "saving" || buttonState === "success"}
              className={`transition-all duration-300 ${buttonState === "success" ? "bg-green-100 text-green-800 border-green-300" : ""}`}
            >
              {buttonState === "saving" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : buttonState === "success" ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Saved.
                </>
              ) : (
                <>Save and continue</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
