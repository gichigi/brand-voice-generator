"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { generateBrandVoice } from "@/app/actions/generate-brand-voice"
import { useToast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/loading-spinner"
import { isOnboardingCompleted } from "@/lib/data-service"

type BrandVoiceData = {
  businessName: string
  yearFounded: string
  businessDescription: string
  selectedDemographics?: string[]
  businessValues: string[] | string
  additionalInfo: string
}

const loadingMessages = [
  "Analyzing your business values...",
  "Crafting your unique voice pillars...",
  "Finding the perfect tone...",
  "Polishing your brand personality...",
]

export default function Review() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState<BrandVoiceData | null>(null)
  const [loading, setLoading] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)
  const [checkingStatus, setCheckingStatus] = useState(true)

  useEffect(() => {
    // Apply fade-in effect on mount
    document.body.classList.add("fade-in")
    setTimeout(() => {
      document.body.classList.remove("fade-in")
    }, 10)

    // Also remove fade-out if it's present (for return visits)
    document.body.classList.remove("fade-out")
  }, [])

  useEffect(() => {
    // Check if onboarding is already completed
    if (isOnboardingCompleted()) {
      // If they've already completed onboarding but somehow got here,
      // we'll still let them continue but we'll check if they have form data
      const savedData = localStorage.getItem("brandVoiceData")
      if (!savedData) {
        // If no form data, redirect to dashboard
        router.push("/dashboard")
        return
      }
    }

    setCheckingStatus(false)

    const savedData = localStorage.getItem("brandVoiceData")
    if (savedData) {
      setFormData(JSON.parse(savedData))
    } else {
      router.push("/onboarding")
    }
  }, [router])

  useEffect(() => {
    if (!loading) return

    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [loading])

  const validateFormData = (data: BrandVoiceData): boolean => {
    return (
      !!data.businessName &&
      !!data.yearFounded &&
      !!data.businessDescription &&
      (Array.isArray(data.businessValues) ? data.businessValues.length > 0 : !!data.businessValues)
    )
  }

  const handleGenerate = async () => {
    if (!formData) return

    if (!validateFormData(formData)) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields before generating your brand voice.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setGenerationError(null)

    try {
      const result = await generateBrandVoice(formData)

      if (result.success && result.data) {
        // Store the generated brand voice data
        localStorage.setItem("brandVoiceGenerated", "true")
        localStorage.setItem("generatedBrandVoice", JSON.stringify(result.data))
        // Apply fade-out before navigating
        document.body.classList.add("fade-out")
        setTimeout(() => {
          router.push("/onboarding/brand-voice")
        }, 300)
      } else {
        setGenerationError(result.error || "Failed to generate brand voice. Please try again.")
        toast({
          title: "Generation failed",
          description: result.error || "Failed to generate brand voice. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error generating brand voice:", error)
      setGenerationError("An unexpected error occurred. Please try again.")
      toast({
        title: "Generation failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Go back to the additional information step (step 4)
  const handleBack = () => {
    router.push("/onboarding?step=4")
  }

  if (checkingStatus) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p>Checking onboarding status...</p>
        </div>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
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
          <h1 className="text-3xl font-bold mb-2">Define Your Brand Voice</h1>
          <p className="text-muted-foreground">
            Let's create a unique and authentic brand voice that helps you generate consistent content.
          </p>

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">Review</div>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: "100%" }}
            ></div>
          </div>
        </div>

        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Review Your Information</CardTitle>
            <CardDescription>
              Please review the information you've provided. We'll use this to generate your brand voice.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Business Information Section */}
            <div className="p-4 border rounded-md bg-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-lg">Business Information</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Business Name</h4>
                  <p>{formData.businessName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Year Founded</h4>
                  <p>{formData.yearFounded}</p>
                </div>
              </div>
            </div>

            {/* Business Description Section */}
            <div className="p-4 border rounded-md bg-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-lg">Business Description</h3>
              </div>
              <p className="whitespace-pre-line">{formData.businessDescription}</p>
            </div>

            {/* Target Demographics Section */}
            <div className="p-4 border rounded-md bg-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-lg">Target Demographics</h3>
              </div>
              {formData.selectedDemographics && formData.selectedDemographics.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.selectedDemographics.map((demographic, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {demographic}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No demographics selected</p>
              )}
            </div>

            {/* Business Values Section */}
            <div className="p-4 border rounded-md bg-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-lg">Business Values</h3>
              </div>
              {Array.isArray(formData.businessValues) && formData.businessValues.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.businessValues.map((value, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {value}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p>{formData.businessValues}</p>
              )}
            </div>

            {/* Additional Information Section */}
            <div className="p-4 border rounded-md bg-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-lg">Additional Information</h3>
              </div>
              {formData.additionalInfo ? (
                <p className="whitespace-pre-line">{formData.additionalInfo}</p>
              ) : (
                <p className="text-muted-foreground">No additional information provided</p>
              )}
            </div>

            {generationError && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                <p className="font-medium">Error generating brand voice</p>
                <p>{generationError}</p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between pt-6">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleGenerate} disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner />
                  <span className="animate-pulse">{loadingMessages[loadingMessageIndex]}</span>
                </div>
              ) : (
                <>
                  Generate Brand Voice
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
