import type { HighlightSegment } from "@/app/actions/analyze-brand-voice-alignment"

/**
 * Applies highlights to HTML content using client-side DOM APIs
 */
export function applyHighlightsToHtml(htmlContent: string, highlights: HighlightSegment[]): string {
  console.log("🔍 Client: Applying highlights to HTML content")

  if (!htmlContent || !highlights || highlights.length === 0) {
    console.log("⚠️ Client: No content or highlights to process")
    return htmlContent
  }

  try {
    // Create a DOM element to work with
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = htmlContent

    console.log(`🔍 Client: Processing ${highlights.length} highlights`)

    // Sort highlights by their position in reverse order
    // This ensures we process from end to beginning to avoid position shifts
    const sortedHighlights = [...highlights].sort((a, b) => {
      // If we have startIndex, use it for sorting
      if (a.startIndex !== undefined && b.startIndex !== undefined) {
        return b.startIndex - a.startIndex
      }

      // Otherwise, find the text position in the content
      const contentText = tempDiv.textContent || ""
      const posA = contentText.indexOf(a.text)
      const posB = contentText.indexOf(b.text)

      return posB - posA
    })

    // Process each highlight
    for (const highlight of sortedHighlights) {
      const { text, pillarIndex } = highlight

      if (!text) {
        console.log("⚠️ Client: Skipping highlight with empty text")
        continue
      }

      // Find all text nodes in the DOM
      const textNodes = getTextNodes(tempDiv)
      let found = false

      // Try to find the text in the DOM
      for (const node of textNodes) {
        const nodeText = node.nodeValue || ""
        const index = nodeText.indexOf(text)

        if (index !== -1) {
          // Split the text node into three parts: before, highlight, after
          const before = nodeText.substring(0, index)
          const after = nodeText.substring(index + text.length)

          // Create new nodes
          const beforeNode = document.createTextNode(before)
          const afterNode = document.createTextNode(after)

          // Create highlight span
          const highlightSpan = document.createElement("span")
          highlightSpan.className = `brand-voice-highlight pillar-${pillarIndex}`
          highlightSpan.textContent = text

          // Get brand voice data from localStorage to access pillar titles
          let brandVoiceData = null
          try {
            const storedBrandVoice = localStorage.getItem("generatedBrandVoice")
            if (storedBrandVoice) {
              brandVoiceData = JSON.parse(storedBrandVoice)
            }
          } catch (error) {
            console.error("Error getting brand voice data:", error)
          }

          // Use the actual pillar title from brand voice data
          const pillarTitle = brandVoiceData?.pillars?.[pillarIndex]?.title || `Pillar ${pillarIndex + 1}`
          highlightSpan.title = pillarTitle

          // Replace the original node with the new nodes
          const parent = node.parentNode
          if (parent) {
            parent.insertBefore(beforeNode, node)
            parent.insertBefore(highlightSpan, node)
            parent.insertBefore(afterNode, node)
            parent.removeChild(node)
            found = true
            break
          }
        }
      }

      if (!found) {
        console.log(`⚠️ Client: Could not find text "${text}" in content`)
      }
    }

    console.log("✅ Client: Highlights applied successfully")
    return tempDiv.innerHTML
  } catch (error) {
    console.error("❌ Client: Error applying highlights:", error)
    return htmlContent
  }
}

/**
 * Gets all text nodes in a DOM element
 */
function getTextNodes(node: Node): Text[] {
  const textNodes: Text[] = []

  function traverse(currentNode: Node) {
    if (currentNode.nodeType === Node.TEXT_NODE) {
      // Only include non-empty text nodes
      if ((currentNode.nodeValue || "").trim()) {
        textNodes.push(currentNode as Text)
      }
    } else {
      // Recursively traverse child nodes
      const childNodes = currentNode.childNodes
      for (let i = 0; i < childNodes.length; i++) {
        traverse(childNodes[i])
      }
    }
  }

  traverse(node)
  return textNodes
}
