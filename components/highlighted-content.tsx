"use client"

import React, { useEffect, useRef, useState } from "react"
import { BrandVoiceLegend } from "@/components/brand-voice-legend"
import { BrandVoice, BrandVoiceHighlight, BrandVoiceLegendPillar } from "@/lib/types"
import { cn } from "@/lib/utils"
import { applyHighlightsToHtml } from "@/lib/brand-voice-highlight"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import ReactDOM from "react-dom"

interface HighlightedContentProps {
  content: string
  highlights?: BrandVoiceHighlight[]
  brandVoice?: BrandVoice
  className?: string
  showLegend?: boolean
}

export function HighlightedContent({
  content,
  highlights,
  brandVoice,
  className = "",
  showLegend = false,
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

  // Get brand voice pillars for the legend
  const getBrandVoicePillars = (): BrandVoiceLegendPillar[] => {
    // First priority: Use the official brand voice pillars if available
    if (brandVoice?.pillars && brandVoice.pillars.length > 0) {
      console.log("[HighlightComponent] Using official brand voice pillars:", 
        brandVoice.pillars.map((p) => p.title).join(", "));
      return brandVoice.pillars.map((pillar, index) => ({
        id: pillar.id || `pillar-${index}`,
        index,
        title: pillar.title,
        description: pillar.description,
      }))
    }
    
    // Second priority: Create pillars from highlights if no brand voice is provided
    if (highlights && highlights.length > 0) {
      // Group highlights by pillar
      const pillarsMap = new Map<string, BrandVoiceLegendPillar>()
      
      highlights.forEach((highlight) => {
        const pillarId = highlight.pillarId || `pillar-${highlight.pillarIndex}`
        if (!pillarsMap.has(pillarId)) {
          pillarsMap.set(pillarId, {
            id: pillarId,
            index: pillarsMap.size,
            title: highlight.pillarTitle || "Highlight",
            description: highlight.pillarDescription || "",
          })
        }
      })
      
      const extractedPillars = Array.from(pillarsMap.values());
      console.log("[HighlightComponent] Created pillars from highlights:", 
        extractedPillars.map((p) => p.title).join(", "));
      return extractedPillars;
    }
    
    // If no brand voice or highlights, return empty array
    console.log("[HighlightComponent] No pillars found, returning empty array");
    return []
  }

  const pillars = getBrandVoicePillars()
  console.log("[HighlightComponent] Prepared pillars for legend:", pillars?.length)

  useEffect(() => {
    if (!content) {
      setHtmlContent(null)
      return
    }

    // Handle optional highlights
    const safeHighlights = highlights || [];
    
    // Apply highlights to the content
    const highlightedHtml = applyHighlightsToHtml(content, safeHighlights);

    // Create a container div to parse the HTML
    const container = document.createElement('div');
    container.innerHTML = highlightedHtml;

    // Find all highlights and wrap them with HoverCard components
    const highlightElements = container.querySelectorAll('.brand-voice-highlight');
    highlightElements.forEach((highlight) => {
      const pillarTitle = highlight.getAttribute('data-pillar-title');
      const explanation = highlight.getAttribute('data-explanation');
      
      // Only wrap if we have a title or explanation
      if (pillarTitle || explanation) {
        const wrapper = document.createElement('span');
        wrapper.className = 'hover-highlight-wrapper';
        wrapper.setAttribute('data-pillar-title', pillarTitle || '');
        wrapper.setAttribute('data-explanation', explanation || '');
        highlight.parentNode?.insertBefore(wrapper, highlight);
        wrapper.appendChild(highlight);
      }
    });

    // Set the processed HTML
    setHtmlContent(
      <div className="prose dark:prose-invert max-w-none">
        <div 
          dangerouslySetInnerHTML={{ __html: container.innerHTML }} 
          ref={contentRef}
        />
      </div>
    );
  }, [content, highlights])

  // Add hover card functionality after the content is rendered
  useEffect(() => {
    if (!contentRef.current) return;

    const wrappers = contentRef.current.querySelectorAll('.hover-highlight-wrapper');
    wrappers.forEach((wrapper) => {
      const title = wrapper.getAttribute('data-pillar-title');
      const explanation = wrapper.getAttribute('data-explanation');
      
      if (!title && !explanation) return;

      ReactDOM.render(
        <HoverCard openDelay={200} closeDelay={100}>
          <HoverCardTrigger asChild>
            <span className="inline-block cursor-help">
              {wrapper.innerHTML}
            </span>
          </HoverCardTrigger>
          <HoverCardContent className="w-64">
            {title && <h4 className="font-semibold">{title}</h4>}
            {explanation && (
              <p className="text-sm text-muted-foreground mt-1">
                {explanation}
              </p>
            )}
          </HoverCardContent>
        </HoverCard>,
        wrapper
      );
    });

    // Cleanup on unmount
    return () => {
      const wrappers = contentRef.current?.querySelectorAll('.hover-highlight-wrapper');
      wrappers?.forEach((wrapper) => {
        ReactDOM.unmountComponentAtNode(wrapper);
      });
    };
  }, [htmlContent]);

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
    <div className={cn("highlighted-content", className)}>
      {/* Always show legend at the top if showLegend is true */}
      {showLegend && (
        <div className="mb-4">
          <BrandVoiceLegend pillars={pillars} />
        </div>
      )}
      
      {/* The content with highlights */}
      <div className="relative">
        {htmlContent}
      </div>
      
      <style jsx global>{`
        /* Base highlight style */
        .brand-voice-highlight {
          position: relative;
          padding: 2px 0;
          opacity: 0.7;
          transition: all 0.5s ease;
          border-radius: 2px;
        }
        
        .highlight-active {
          opacity: 1;
        }

        /* Tailwind colors that match the legend and brand-voice-highlights.css */
        .brand-voice-highlight.pillar-0 {
          background-color: rgba(219, 234, 254, 0.3); /* Tailwind blue-100 */
          box-shadow: 0 1px 0 rgba(59, 130, 246, 0.3); /* Tailwind blue-500 */
          text-decoration-color: #3b82f6; /* Tailwind blue-500 */
        }
        
        .brand-voice-highlight.pillar-1 {
          background-color: rgba(220, 252, 231, 0.3); /* Tailwind green-100 */
          box-shadow: 0 1px 0 rgba(34, 197, 94, 0.3); /* Tailwind green-500 */
          text-decoration-color: #22c55e; /* Tailwind green-500 */
        }
        
        .brand-voice-highlight.pillar-2 {
          background-color: rgba(243, 232, 255, 0.3); /* Tailwind purple-100 */
          box-shadow: 0 1px 0 rgba(168, 85, 247, 0.3); /* Tailwind purple-500 */
          text-decoration-color: #a855f7; /* Tailwind purple-500 */
        }
        
        /* For any additional pillar indexes, wrap back to the first 3 colors */
        .brand-voice-highlight.pillar-3,
        .brand-voice-highlight.pillar-6 {
          background-color: rgba(219, 234, 254, 0.3); /* Same as pillar-0 (blue) */
          box-shadow: 0 1px 0 rgba(59, 130, 246, 0.3);
          text-decoration-color: #3b82f6;
        }
        
        .brand-voice-highlight.pillar-4,
        .brand-voice-highlight.pillar-7 {
          background-color: rgba(220, 252, 231, 0.3); /* Same as pillar-1 (green) */
          box-shadow: 0 1px 0 rgba(34, 197, 94, 0.3);
          text-decoration-color: #22c55e;
        }
        
        .brand-voice-highlight.pillar-5,
        .brand-voice-highlight.pillar-8 {
          background-color: rgba(243, 232, 255, 0.3); /* Same as pillar-2 (purple) */
          box-shadow: 0 1px 0 rgba(168, 85, 247, 0.3);
          text-decoration-color: #a855f7;
        }
        
        /* Animation for highlights */
        @keyframes highlightPulse {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.8; }
        }
        
        .highlight-active {
          animation: highlightPulse 2s ease-in-out;
        }
      `}</style>
    </div>
  )
}
