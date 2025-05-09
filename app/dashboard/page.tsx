"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, BookOpen, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
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

export default function Dashboard() {
  const router = useRouter()
  const [brandVoice, setBrandVoice] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Apply fade-in effect on mount
    document.body.classList.add("fade-in")
    setTimeout(() => {
      document.body.classList.remove("fade-in")
    }, 10)

    // Also remove fade-out if it's present (for return visits)
    document.body.classList.remove("fade-out")

    try {
      const storedBrandVoice = localStorage.getItem("generatedBrandVoice")
      if (storedBrandVoice) {
        const parsedBrandVoice = JSON.parse(storedBrandVoice)
        setBrandVoice(parsedBrandVoice)
        console.log("Loaded stored brand voice:", parsedBrandVoice.executiveSummary)
      } else {
        // Set the fallback brand voice if none exists
        console.log("No stored brand voice found, using fallback")
        setBrandVoice(FALLBACK_BRAND_VOICE)
        localStorage.setItem("generatedBrandVoice", JSON.stringify(FALLBACK_BRAND_VOICE))
      }

      // Check if we just saved the brand voice and show toast
      if (localStorage.getItem("justSaved")) {
        toast({
          title: "Brand voice saved",
          description: "Your brand voice was saved successfully.",
        })
        localStorage.removeItem("justSaved")
      }
    } catch (error) {
      console.error("Error loading brand voice data:", error)
      // Use fallback on error
      setBrandVoice(FALLBACK_BRAND_VOICE)
      localStorage.setItem("generatedBrandVoice", JSON.stringify(FALLBACK_BRAND_VOICE))
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Handle click on brand voice card
  const handleBrandVoiceClick = () => {
    router.push("/onboarding/brand-voice")
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Main action cards - side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Create New Content</CardTitle>
            <CardDescription>Generate professional content using your brand voice</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard/content/new")} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Content
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Content Library</CardTitle>
            <CardDescription>View and manage your generated content</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard/history")} className="w-full" variant="outline">
              <BookOpen className="mr-2 h-4 w-4" />
              View Library
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Brand Voice and Feedback Cards - 2x2 grid layout */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Brand Voice Card */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleBrandVoiceClick}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Brand Voice</CardTitle>
            <CardDescription>View and update your brand voice pillars</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {isLoading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : brandVoice ? (
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {brandVoice.pillars.map((pillar, index) => (
                    <div
                      key={index}
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        index === 0
                          ? "bg-blue-100 text-blue-800"
                          : index === 1
                            ? "bg-green-100 text-green-800"
                            : index === 2
                              ? "bg-purple-100 text-purple-800"
                              : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {pillar.title}
                    </div>
                  ))}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Default brand voice available</p>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feedback Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Hit me with feedback</CardTitle>
            <CardDescription>It'll take 3mins tops, I promise.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => window.open("https://17447213116029723.a.freeform.computer/respond/5AdunDyoF-w", "_blank")}
              className="w-full"
              variant="outline"
            >
              Give feedback
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
