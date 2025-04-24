"use client"

import { useEffect, useState, useRef } from "react"
import { applyHighlightsToHtml } from "@/lib/client-highlight-utils"

export interface HighlightSegment {
  text: string
  pillarIndex: number
  startIndex: number
  endIndex: number
  reason?: string // Optional reason for the highlight
}

interface HighlightedContentProps {
  content: string
  highlights?: HighlightSegment[]
  highlightedHtml?: string // Add this field
  showHighlights: boolean
  className?: string
  activePillars?: number[] // This prop is now ignored
}

export function HighlightedContent({
  content,
  highlights = [],
  highlightedHtml,
  showHighlights = true,
  className = "",
  activePillars, // We'll keep this prop but not use it
}: HighlightedContentProps) {
  const [debugMode, setDebugMode] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Add debug info
  useEffect(() => {
    console.log("🔍 HighlightedContent rendered with:")
    console.log("🔍 Content length:", content?.length || 0)
    console.log("🔍 Highlights count:", highlights?.length || 0)
    console.log("🔍 HighlightedHtml exists:", !!highlightedHtml)
    console.log("🔍 ShowHighlights:", showHighlights)

    // Add a keyboard shortcut for debug mode (Ctrl+Shift+D)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        setDebugMode((prev) => !prev)
        console.log("🔍 Debug mode toggled:", !debugMode)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [content, highlights, highlightedHtml, showHighlights, debugMode])

  // Apply highlights client-side if we have content but no highlightedHtml
  useEffect(() => {
    if (content && highlights.length > 0 && !highlightedHtml && contentRef.current) {
      console.log("🔍 HighlightedContent: Applying highlights client-side")
      try {
        const html = applyHighlightsToHtml(content, highlights)
        if (showHighlights) {
          contentRef.current.innerHTML = html
        }
      } catch (error) {
        console.error("❌ HighlightedContent: Error applying highlights client-side:", error)
      }
    }
  }, [content, highlights, highlightedHtml, showHighlights])

  // Toggle highlights visibility
  useEffect(() => {
    if (contentRef.current) {
      try {
        console.log("🔄 HighlightedContent: Updating content display", {
          showHighlights,
          hasHighlightedHtml: !!highlightedHtml,
          contentLength: content?.length || 0,
        })

        if (showHighlights && highlightedHtml) {
          console.log("🔍 HighlightedContent: Showing highlighted HTML")
          contentRef.current.innerHTML = highlightedHtml
        } else {
          console.log("🔍 HighlightedContent: Showing plain content")
          contentRef.current.innerHTML = content
        }
      } catch (error) {
        console.error("❌ HighlightedContent: Error updating content:", error)
        // Fallback to basic content
        contentRef.current.innerHTML = content
      }
    }
  }, [showHighlights, highlightedHtml, content])

  return (
    <div className={className}>
      <div ref={contentRef} />

      {/* Debug information - only visible when debug mode is enabled */}
      {debugMode && (
        <div className="mt-4 p-4 border border-red-500 bg-red-50 text-red-800 rounded">
          <h3 className="font-bold">Debug Info (Ctrl+Shift+D to toggle)</h3>
          <p>Content Length: {content?.length || 0}</p>
          <p>Highlights Count: {highlights?.length || 0}</p>
          <p>Show Highlights: {showHighlights ? "Yes" : "No"}</p>
          <p>Highlighted HTML exists: {highlightedHtml ? "Yes" : "No"}</p>

          {highlights && highlights.length > 0 && (
            <div className="mt-2">
              <h4 className="font-semibold">First 2 Highlights:</h4>
              <pre className="text-xs overflow-auto max-h-40 bg-white p-2 rounded">
                {JSON.stringify(highlights.slice(0, 2), null, 2)}
              </pre>
            </div>
          )}

          {highlightedHtml && (
            <div className="mt-2">
              <h4 className="font-semibold">Highlighted HTML Sample:</h4>
              <pre className="text-xs overflow-auto max-h-40 bg-white p-2 rounded">
                {highlightedHtml.substring(0, 200)}...
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
