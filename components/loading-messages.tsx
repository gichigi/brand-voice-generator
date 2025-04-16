"use client"

import { useState, useEffect } from "react"
import { Sparkles } from "lucide-react"

interface LoadingMessagesProps {
  context: "brandVoice" | "content" | "pillar"
  className?: string
}

export function LoadingMessages({ context, className }: LoadingMessagesProps) {
  const [messageIndex, setMessageIndex] = useState(0)

  const brandVoiceMessages = [
    "Analyzing your business values...",
    "Crafting your unique voice pillars...",
    "Finding the perfect tone for your audience...",
    "Polishing your brand personality...",
    "Finalizing your brand voice framework...",
  ]

  const contentMessages = [
    "Applying your brand voice...",
    "Crafting compelling content...",
    "Tailoring to your audience...",
    "Adding your unique perspective...",
    "Polishing the final details...",
  ]

  const pillarMessages = [
    "Refining your brand voice pillar...",
    "Aligning with your business values...",
    "Crafting distinctive guidelines...",
    "Enhancing pillar uniqueness...",
    "Polishing pillar details...",
  ]

  const messages =
    context === "brandVoice" ? brandVoiceMessages : context === "content" ? contentMessages : pillarMessages

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [messages.length])

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <Sparkles className="h-8 w-8 text-primary animate-pulse" />
      <div className="text-center">
        <p className="text-lg font-medium">{messages[messageIndex]}</p>
        <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
      </div>
    </div>
  )
}
