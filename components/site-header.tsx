"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { isOnboardingCompleted } from "@/lib/data-service"

export function SiteHeader() {
  const [onboardingComplete, setOnboardingComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if onboarding is completed
    const completed = isOnboardingCompleted()
    setOnboardingComplete(completed)
    setIsLoading(false)
  }, [])

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Choir</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {isLoading ? (
            <Button disabled variant="ghost">
              Loading...
            </Button>
          ) : onboardingComplete ? (
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          ) : (
            <Link href="/onboarding">
              <Button>Get Started</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
