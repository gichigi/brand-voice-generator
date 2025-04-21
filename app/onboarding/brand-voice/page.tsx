"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrandVoiceGuide } from "./brand-voice-guide"
import { LoadingSpinner } from "@/components/loading-spinner"
import { setOnboardingCompleted } from "@/lib/data-service"

export default function BrandVoicePage() {
  const router = useRouter()
  const [brandVoice, setBrandVoice] = useState<any>(null)
  const [formData, setFormData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load the generated brand voice and form data
    const storedBrandVoice = localStorage.getItem("generatedBrandVoice")
    const storedFormData = localStorage.getItem("brandVoiceData")

    if (!storedBrandVoice || !storedFormData) {
      // If either is missing, redirect to review page
      router.push("/onboarding/review")
      return
    }

    try {
      const parsedBrandVoice = JSON.parse(storedBrandVoice)
      const parsedFormData = JSON.parse(storedFormData)

      setBrandVoice(parsedBrandVoice)
      setFormData(parsedFormData)
    } catch (error) {
      console.error("Error parsing data:", error)
    } finally {
      setLoading(false)
    }
  }, [router])

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
    localStorage.setItem("generatedBrandVoice", JSON.stringify(updatedBrandVoice))
  }

  const handleComplete = () => {
    // Mark onboarding as completed
    setOnboardingCompleted(true)

    // Save the brand voice to localStorage
    if (brandVoice) {
      localStorage.setItem("brandVoice", JSON.stringify(brandVoice))
    }

    // Redirect to dashboard
    router.push("/dashboard")
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

  if (!brandVoice || !formData) {
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
            <p className="mb-4">No brand voice data found.</p>
            <Button onClick={() => router.push("/onboarding/review")}>Go Back to Review</Button>
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
          <h1 className="text-3xl font-bold mb-2">Your Brand Voice</h1>
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

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => router.push("/onboarding/review")}>
            Back to Review
          </Button>
          <Button onClick={handleComplete}>Continue to Dashboard</Button>
        </div>
      </div>
    </div>
  )
}
