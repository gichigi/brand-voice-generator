"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { DemographicsSelector } from "@/components/demographics-selector"
import { WebsiteAnalyzer } from "@/components/website-analyzer"
import { BusinessValuesSelector } from "@/components/business-values-selector"
import { toast } from "@/components/ui/use-toast"
import { isOnboardingCompleted } from "@/lib/data-service"

type OnboardingStep = {
  title: string
  description: string
  fields: {
    id: string
    label: string
    type: "input" | "textarea"
    placeholder: string
  }[]
  customComponent?: string
}

const steps: OnboardingStep[] = [
  {
    title: "Business Information",
    description: "Let's start with the basics about your business",
    fields: [
      {
        id: "businessName",
        label: "Business Name",
        type: "input",
        placeholder: "Apple Inc.",
      },
      {
        id: "yearFounded",
        label: "Year Founded",
        type: "input",
        placeholder: "2001",
      },
    ],
  },
  {
    title: "Business Description",
    description: "Tell us what your business does",
    customComponent: "website-analyzer",
    fields: [
      {
        id: "businessDescription",
        label: "Or start typing below.",
        type: "textarea",
        placeholder:
          "Apple is a technology company known for creating beautifully designed hardware, intuitive software, and a seamless ecosystem. We design devices like the iPhone, Mac, and Apple Watch, and build platforms like iOS and iCloud to help people stay connected, creative, and secure.",
      },
    ],
  },
  {
    title: "Target Audience",
    description: "Who are you trying to reach?",
    fields: [],
    customComponent: "demographics-selector",
  },
  {
    title: "Business Values",
    description: "What principles guide your business?",
    fields: [],
    customComponent: "business-values-selector",
  },
  {
title: "Additional Information",
description: "Anything else we should know?",
fields: [
  {
    id: "additionalInfo",
    label: "Additional Information",
    type: "textarea",
    placeholder:
      "Example for Apple:\n\n• Key products: iPhone, Mac, and growing services like iCloud and Apple Music\n\n• USPs: Seamless ecosystem, premium design, strong privacy focus\n\n• Upcoming: Apple Vision, expanded health and wellness features\n\n• Revenue: Growing emphasis on services and subscription revenue\n\n• Priorities: Innovation, simplicity, human-centered technology, privacy",
  },
] 
  },
]

export default function Onboarding() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, string | string[]>>({
    businessName: "",
    yearFounded: "",
    businessDescription: "",
    selectedDemographics: [],
    businessValues: [],
    additionalInfo: "",
  })
  const [checkingStatus, setCheckingStatus] = useState(true)

  // Add refs for auto-expanding textareas
  const businessDescriptionRef = useRef<HTMLTextAreaElement>(null)
  const additionalInfoRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea function
  const autoResizeTextarea = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto"

    // Set the height to match the content (add a small buffer to prevent scrollbar flicker)
    textarea.style.height = `${textarea.scrollHeight + 2}px`
  }

  // Check if onboarding is already completed
  useEffect(() => {
    if (isOnboardingCompleted()) {
      // Redirect to dashboard if onboarding is already completed
      router.push("/dashboard")
    } else {
      setCheckingStatus(false)
    }
  }, [router])

  // Load saved data if available
  useEffect(() => {
    const savedData = localStorage.getItem("brandVoiceData")
    if (savedData) {
      setFormData(JSON.parse(savedData))
    }
  }, [])

  // Auto-resize textareas when they change or when step changes
  useEffect(() => {
    if (currentStep === 1 && businessDescriptionRef.current) {
      autoResizeTextarea(businessDescriptionRef.current)
    }

    if (currentStep === 4 && additionalInfoRef.current) {
      autoResizeTextarea(additionalInfoRef.current)
    }
  }, [currentStep, formData.businessDescription, formData.additionalInfo])

  const handleInputChange = (id: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [id]: value }))

    // Auto-resize textarea if it's the one being changed
    if (id === "businessDescription" && businessDescriptionRef.current) {
      setTimeout(() => autoResizeTextarea(businessDescriptionRef.current), 0)
    }

    if (id === "additionalInfo" && additionalInfoRef.current) {
      setTimeout(() => autoResizeTextarea(additionalInfoRef.current), 0)
    }
  }

  const handleNext = () => {
    // Save data after each step
    localStorage.setItem("brandVoiceData", JSON.stringify(formData))

    // Check validation for Business Information step
    if (currentStep === 0) {
      if (!formData.businessName || !formData.yearFounded) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields before proceeding.",
          variant: "destructive",
        })
        return
      }
    }

    // Check minimum word limit for business description
    if (currentStep === 1) {
      const wordCount = formData.businessDescription
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length
      if (wordCount < 10) {
        toast({
          title: "Description too short",
          description: "Please provide at least 10 words for your business description.",
          variant: "destructive",
        })
        return
      }
    }

    // Check if demographics are selected
    if (
      currentStep === 2 &&
      (!formData.selectedDemographics || (formData.selectedDemographics as string[]).length === 0)
    ) {
      toast({
        title: "No demographics selected",
        description: "Please select at least one target demographic before proceeding.",
        variant: "destructive",
      })
      return
    }

    // Check if business values are selected
    if (currentStep === 3 && (!formData.businessValues || (formData.businessValues as string[]).length === 0)) {
      toast({
        title: "No values selected",
        description: "Please select at least one business value before proceeding.",
        variant: "destructive",
      })
      return
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      router.push(`/onboarding?step=${currentStep + 1}`)
      // Scroll to top when changing steps
      window.scrollTo(0, 0)
    } else {
      router.push("/onboarding/review")
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      // Update URL to reflect the current step
      router.push(`/onboarding?step=${currentStep - 1}`)
      // Scroll to top when changing steps
      window.scrollTo(0, 0)
    } else {
      router.push("/")
    }
  }

  // Check if the Next button should be disabled
  const isNextButtonDisabled = () => {
    if (currentStep === 0) {
      return !formData.businessName || !formData.yearFounded
    }
    if (currentStep === 1) {
      const wordCount = formData.businessDescription
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length
      return wordCount < 10
    }
    if (currentStep === 2) {
      return !formData.selectedDemographics || (formData.selectedDemographics as string[]).length === 0
    }
    if (currentStep === 3) {
      return !formData.businessValues || (formData.businessValues as string[]).length === 0
    }
    return false
  }

  const currentStepData = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1

  if (checkingStatus) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p>Checking onboarding status...</p>
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
          <h1 className="text-3xl font-bold mb-2">Define Your Brand Voice</h1>
          <p className="text-muted-foreground">
            Let's create a unique and authentic brand voice that helps you generate consistent content.
          </p>

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>{currentStepData.title}</CardTitle>
            <CardDescription>{currentStepData.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {currentStepData.customComponent === "website-analyzer" && (
              <WebsiteAnalyzer
                description={formData.businessDescription as string}
                onDescriptionChange={(value) => handleInputChange("businessDescription", value)}
              />
            )}

            {currentStepData.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>{field.label}</Label>
                {field.type === "input" ? (
                  <Input
                    id={field.id}
                    placeholder={field.placeholder}
                    value={(formData[field.id] as string) || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isNextButtonDisabled()) {
                        e.preventDefault()
                        handleNext()
                      }
                    }}
                  />
                ) : (
                  <div className="space-y-1">
                    <Textarea
                      id={field.id}
                      placeholder={field.placeholder}
                      value={(formData[field.id] as string) || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="resize-none min-h-[120px]"
                      ref={
                        field.id === "businessDescription"
                          ? businessDescriptionRef
                          : field.id === "additionalInfo"
                            ? additionalInfoRef
                            : null
                      }
                    />
                    {field.id === "businessDescription" && (
                      <div className="text-xs text-muted-foreground">
                        <span>Minimum 10 words</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {currentStepData.customComponent === "demographics-selector" && (
              <DemographicsSelector
                value={(formData.selectedDemographics as string[]) || []}
                onChange={(value) => handleInputChange("selectedDemographics", value)}
              />
            )}

            {currentStepData.customComponent === "business-values-selector" && (
              <BusinessValuesSelector
                value={(formData.businessValues as string[]) || []}
                onChange={(value) => handleInputChange("businessValues", value)}
              />
            )}
          </CardContent>

          <CardFooter className="flex justify-between pt-6">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={isNextButtonDisabled()}
              className={currentStep === 0 ? "w-full" : ""}
            >
              {isLastStep ? "Review" : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
