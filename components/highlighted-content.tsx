"use client"

import { useEffect, useState } from "react"

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

  // Function to render content with or without highlights
  const renderContent = () => {
    if (!showHighlights || !highlightedHtml) {
      console.log("🔍 Rendering original content (no highlights)")
      return <div dangerouslySetInnerHTML={{ __html: content }} />
    }

    console.log("🔍 Rendering content with highlights")
    return <div dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
  }

  return (
    <div className={className}>
      {renderContent()}

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
