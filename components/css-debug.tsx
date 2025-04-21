"use client"

import { useEffect } from "react"

export function CSSDebug() {
  useEffect(() => {
    // Check if CSS is loaded
    const isCSSLoaded = document.styleSheets.length > 0
    console.log("CSS Debug: Style sheets loaded:", document.styleSheets.length)
    console.log("CSS Debug: Tailwind loaded:", document.body.classList.contains("dark") !== undefined)

    // Add a test class to verify Tailwind is working
    const testElement = document.createElement("div")
    testElement.classList.add("bg-red-500", "hidden")
    document.body.appendChild(testElement)

    const computedStyle = window.getComputedStyle(testElement)
    console.log("CSS Debug: Test element background:", computedStyle.backgroundColor)

    // Clean up
    document.body.removeChild(testElement)

    return () => {
      // Cleanup if needed
    }
  }, [])

  return null
}
