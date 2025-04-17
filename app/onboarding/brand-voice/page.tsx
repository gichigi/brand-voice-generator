"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, RefreshCw, AlertCircle, Sparkles } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BrandVoiceGuide } from "./brand-voice-guide"
import { generateBrandVoice } from "@/app/actions/generate-brand-voice"
import { useToast } from "@/components/ui/use-toast"
import { LoadingMessages } from "@/components/loading-messages"
import { motion } from "framer-motion"
import { setOnboardingCompleted } from "@/lib/data-service"

type BrandVoiceData = {
  businessName: string
  yearFounded: string
  businessDescription: string
  selectedDemographics?: string[]
  businessValues: string[]
  additionalInfo: string
}

export default function BrandVoice() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState<BrandVoiceData | null>(null)
  const [brandVoiceData, setBrandVoiceData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [regenerationError, setRegenerationError] = useState<string | null>(null)

  useEffect(() => {
    const savedData = localStorage.getItem("brandVoiceData")
    const isGenerated = localStorage.getItem("brandVoiceGenerated")
    const generatedData = localStorage.getItem("generatedBrandVoice")

    if (!savedData || !isGenerated) {
      router.push("/onboarding")
      return
    }

    // Mark onboarding as completed when they reach this page
    setOnboardingCompleted(true)

    setFormData(JSON.parse(savedData))

    if (generatedData) {
      setBrandVoiceData(JSON.parse(generatedData))
      setLoading(false)
      // Add a slight delay before showing content for a nice transition
      setTimeout(() => {
        setShowContent(true)
      }, 300)
    } else {
      // If somehow we got here without generated data, we'll generate it now
      handleGenerateBrandVoice(JSON.parse(savedData))
    }
  }, [router])

  const handleGenerateBrandVoice = async (data: BrandVoiceData) => {
    setLoading(true)
    setRegenerationError(null)

    try {
      console.log("Starting brand voice generation with data:", JSON.stringify(data))
      const result = await generateBrandVoice(data)
      console.log("Generation result:", JSON.stringify(result))

      if (result && result.success && result.data) {
        setBrandVoiceData(result.data)
        localStorage.setItem("generatedBrandVoice", JSON.stringify(result.data))

        if (result.warning) {
          toast({
            title: "Brand Voice Generated",
            description: result.warning,
            variant: "warning",
          })
        }

        // Add a slight delay before showing content for a nice transition
        setTimeout(() => {
          setShowContent(true)
        }, 300)
      } else {
        const errorMessage = result?.error || "Failed to generate brand voice. Please try again."
        setRegenerationError(errorMessage)
        toast({
          title: "Generation failed",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error generating brand voice:", error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred. Please try again."
      setRegenerationError(errorMessage)
      toast({
        title: "Generation failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRegeneratePillar = (index: number, newPillar: any) => {
    if (!brandVoiceData) return

    const updatedPillars = [...brandVoiceData.pillars]
    updatedPillars[index] = newPillar

    const updatedData = {
      ...brandVoiceData,
      pillars: updatedPillars,
    }

    setBrandVoiceData(updatedData)
    localStorage.setItem("generatedBrandVoice", JSON.stringify(updatedData))

    toast({
      title: "Pillar regenerated",
      description: `The "${newPillar.title}" pillar has been updated.`,
    })
  }

  const handleRegenerateEntireBrandVoice = async () => {
    if (!formData) return

    setRegenerating(true)
    setRegenerationError(null)

    try {
      console.log("Starting brand voice regeneration...")
      console.log("Form data:", JSON.stringify(formData))

      const result = await generateBrandVoice(formData)

      console.log("Regeneration result:", JSON.stringify(result))

      if (result && result.success && result.data) {
        setBrandVoiceData(result.data)
        localStorage.setItem("generatedBrandVoice", JSON.stringify(result.data))

        if (result.warning) {
          toast({
            title: "Brand Voice Regenerated",
            description: result.warning,
            variant: "warning",
          })
        } else {
          toast({
            title: "Brand Voice Regenerated",
            description: "Your entire brand voice has been regenerated successfully.",
          })
        }
      } else {
        const errorMessage = result?.error || "Failed to regenerate brand voice. Please try again."
        setRegenerationError(errorMessage)
        toast({
          title: "Regeneration failed",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error regenerating brand voice:", error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred. Please try again."
      setRegenerationError(errorMessage)
      toast({
        title: "Regeneration failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setRegenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <LoadingMessages context="brandVoice" />
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
          <Button variant="outline" size="sm" onClick={handleRegenerateEntireBrandVoice} disabled={regenerating}>
            <RefreshCw className={`mr-2 h-4 w-4 ${regenerating ? "animate-spin" : ""}`} />
            Regenerate
          </Button>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Brand Voice</h1>
          <p className="text-muted-foreground">
            Here's your custom brand voice profile based on the information you provided.
          </p>
        </div>

        {regenerationError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Regeneration failed</AlertTitle>
            <AlertDescription>{regenerationError}</AlertDescription>
          </Alert>
        )}

        {regenerating ? (
          <div className="flex items-center justify-center h-64">
            <LoadingMessages context="brandVoice" />
          </div>
        ) : showContent ? (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Brand Voice Guide Component */}
            <BrandVoiceGuide
              businessName={formData?.businessName || ""}
              yearFounded={formData?.yearFounded || ""}
              businessDescription={formData?.businessDescription || ""}
              businessValues={formData?.businessValues || []}
              selectedDemographics={formData?.selectedDemographics}
              additionalInfo={formData?.additionalInfo}
              generatedData={brandVoiceData}
              onRegeneratePillar={handleRegeneratePillar}
            />

            {/* Alert moved to bottom */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Your brand voice can be edited at any time</AlertTitle>
              <AlertDescription>
                Access your brand voice settings from the dashboard to make changes whenever needed.
              </AlertDescription>
            </Alert>

            <Card>
              <CardFooter className="flex justify-between pt-6">
                <Button variant="outline" onClick={() => router.push("/onboarding/review")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Review
                </Button>
                <Button onClick={() => router.push("/dashboard")} className="bg-primary hover:bg-primary/90">
                  Continue to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <LoadingMessages context="brandVoice" />
          </div>
        )}
      </div>
    </div>
  )
}
