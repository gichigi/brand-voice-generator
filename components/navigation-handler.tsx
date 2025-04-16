"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { navigationEvents } from "@/lib/navigation-events"

/**
 * This component connects our navigation events system to the Next.js router.
 * It should be placed high in the component tree, ideally in the root layout.
 */
export function NavigationHandler() {
  const router = useRouter()

  useEffect(() => {
    // Subscribe to navigation events and use the router to navigate
    const unsubscribe = navigationEvents.subscribe((url) => {
      router.push(url)
    })

    // Clean up subscription when component unmounts
    return unsubscribe
  }, [router])

  // This is a utility component that doesn't render anything
  return null
}
