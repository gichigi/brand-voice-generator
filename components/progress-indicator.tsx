"use client"

import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProgressIndicatorProps {
  steps: string[]
  currentStep: number
  onStepClick?: (step: number) => void
  showAllComplete?: boolean
  hideReviewStep?: boolean // Add this prop
}

export function ProgressIndicator({
  steps,
  currentStep,
  onStepClick,
  showAllComplete = false,
  hideReviewStep = false, // Add this prop
}: ProgressIndicatorProps) {
  // Filter out the "Review" step if hideReviewStep is true
  const displaySteps = hideReviewStep ? steps.filter((step) => step !== "Review") : steps
  const adjustedCurrentStep = hideReviewStep && currentStep >= steps.length - 1 ? displaySteps.length - 1 : currentStep

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      <div className="relative flex justify-between">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-muted" />
        <div
          className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 bg-primary transition-all duration-300 ease-in-out"
          style={{
            width: `${Math.min((adjustedCurrentStep / (displaySteps.length - 1)) * 100, 100)}%`,
            display: adjustedCurrentStep >= displaySteps.length ? "none" : "block",
          }}
        />

        {/* Steps */}
        {displaySteps.map((step, index) => {
          const isCompleted = showAllComplete || index < adjustedCurrentStep
          const isCurrent = !showAllComplete && index === adjustedCurrentStep

          return (
            <div key={index} className="relative flex flex-col items-center z-10">
              <button
                onClick={() => onStepClick?.(index)}
                disabled={
                  !showAllComplete && index > adjustedCurrentStep && adjustedCurrentStep !== displaySteps.length - 1
                }
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200",
                  isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : isCurrent
                      ? "border-primary bg-background text-primary"
                      : "border-muted bg-background text-muted-foreground",
                  (!showAllComplete &&
                    (index <= adjustedCurrentStep || adjustedCurrentStep === displaySteps.length - 1)) ||
                    showAllComplete
                    ? "cursor-pointer"
                    : "cursor-not-allowed opacity-50",
                )}
              >
                {isCompleted ? (
                  <CheckIcon className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </button>
              <button
                onClick={() => onStepClick?.(index)}
                disabled={
                  !showAllComplete && index > adjustedCurrentStep && adjustedCurrentStep !== displaySteps.length - 1
                }
                className={cn(
                  "absolute top-10 text-xs font-medium whitespace-nowrap transition-colors",
                  isCompleted ? "text-primary" : isCurrent ? "text-foreground" : "text-muted-foreground",
                  (!showAllComplete &&
                    (index <= adjustedCurrentStep || adjustedCurrentStep === displaySteps.length - 1)) ||
                    showAllComplete
                    ? "cursor-pointer hover:text-primary"
                    : "cursor-not-allowed opacity-50",
                )}
              >
                {step}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
