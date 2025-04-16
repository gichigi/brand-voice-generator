"use client"

import React, { useEffect, useRef, useState } from "react"
import { BrandVoiceLegend } from "@/components/brand-voice-legend"
import { BrandVoice, BrandVoiceHighlight, BrandVoiceLegendPillar } from "@/lib/types"
import { cn } from "@/lib/utils"

interface HighlightedContentProps {
  title?: string
  content: string
  highlights: BrandVoiceHighlight[]
  brandVoice?: BrandVoice
  showLegend?: boolean
}

function getBrandVoicePillars(highlights: BrandVoiceHighlight[], brandVoice?: BrandVoice) {
  if (brandVoice?.pillars?.length) {
    return brandVoice.pillars.map((pillar, index) => ({
      id: pillar.id,
      index,
      title: pillar.title,
    }))
  }

  const uniquePillars = new Set(highlights.map((h) => h.pillarIndex))
  return Array.from(uniquePillars).map((index) => ({
    id: `pillar-${index}`,
    index,
    title: `Pillar ${index + 1}`,
  }))
}

export function HighlightedContent({
  title,
  content,
  highlights,
  brandVoice,
  showLegend = true,
}: HighlightedContentProps) {
  const [htmlContent, setHtmlContent] = useState<React.ReactNode | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // --- DEBUG LOGGING ---
  console.log("[HighlightComponent] Received Props:", { 
    contentLength: content?.length || 0,
    brandVoicePillars: brandVoice?.pillars?.length || 0,
    highlightsCount: highlights?.length || 0,
    pillarTitles: brandVoice?.pillars?.map((p) => p.title).join(", ") || "none"
  });
  
  // Log a small sample of the content for debugging
  console.log("[HighlightComponent] Content sample:", 
    content?.substring(0, 150) + '...' + 
    (content?.includes("brand-voice-highlight") 
      ? `\nContains ${(content.match(/brand-voice-highlight/g) || []).length} highlight markers` 
      : "\nNo highlight markers found in content"));
  // --- END DEBUG LOGGING ---

  const pillars = getBrandVoicePillars(highlights, brandVoice)
  console.log("[HighlightComponent] Prepared pillars for legend:", pillars?.length)

  useEffect(() => {
    if (!content) {
      setHtmlContent(null)
      return
    }

    // Create a document fragment to work with the HTML content
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = content

    // If we have highlights, apply them
    if (highlights && highlights.length > 0) {
      // Apply animations with a slight delay for each highlight
      setTimeout(() => {
        const highlightElements = document.querySelectorAll(".brand-voice-highlight")
        console.log(`[HighlightComponent] Found ${highlightElements.length} highlight elements to animate`)
        
        highlightElements.forEach((element, index) => {
          setTimeout(() => {
            element.classList.add("highlight-active")
          }, index * 150) // Stagger the animations
        })
      }, 500)
    }

    setHtmlContent(
      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: tempDiv.innerHTML }}
      />
    )
  }, [content, highlights])

  // Add CSS to ensure proper formatting 
  useEffect(() => {
    if (!document.getElementById('content-format-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'content-format-styles';
      styleEl.textContent = `
        /* Ensure generated content is properly styled */
        .highlighted-content h1, .highlighted-content h2, .highlighted-content h3 {
          font-weight: bold;
          margin-top: 1.5em;
          margin-bottom: 0.75em;
          line-height: 1.2;
        }
        
        .highlighted-content h1 {
          font-size: 1.75rem;
        }
        
        .highlighted-content h2 {
          font-size: 1.5rem;
        }
        
        .highlighted-content h3 {
          font-size: 1.25rem;
        }
        
        .highlighted-content p {
          margin-bottom: 1em;
          line-height: 1.6;
        }
        
        .highlighted-content ul, .highlighted-content ol {
          margin-left: 1.5em;
          margin-bottom: 1em;
        }
        
        .highlighted-content li {
          margin-bottom: 0.5em;
        }
        
        /* Fix for any elements that might break the layout */
        .highlighted-content * {
          max-width: 100%;
        }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {title && <h2 className="text-xl font-semibold">{title}</h2>}
        {showLegend && pillars.length > 0 && <BrandVoiceLegend pillars={pillars} />}
      </div>
      <div className="space-y-2">
        {highlights.map((highlight, index) => (
          <div
            key={highlight.id || index}
            className={`rounded-lg p-4 ${
              highlight.pillarIndex !== undefined
                ? [
                    "bg-blue-50 dark:bg-blue-950",
                    "bg-green-50 dark:bg-green-950",
                    "bg-purple-50 dark:bg-purple-950",
                  ][highlight.pillarIndex % 3]
                : ""
            }`}
          >
            <p className="text-sm">{highlight.text}</p>
            {highlight.explanation && (
              <p className="mt-2 text-sm text-muted-foreground">{highlight.explanation}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
