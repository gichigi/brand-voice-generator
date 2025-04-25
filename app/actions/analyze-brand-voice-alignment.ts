"use server"

import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export interface HighlightSegment {
  text: string
  pillarIndex: number
  startIndex: number
  endIndex: number
  reason?: string // Optional reason for the highlight
}

export interface AnalysisResult {
  success: boolean
  highlights?: HighlightSegment[]
  highlightedHtml?: string
  error?: string
  debugInfo?: any
}

// Define the consistent fallback brand voice pillars
const FALLBACK_BRAND_VOICE_PILLARS = [
  {
    id: "fallback-1",
    title: "Vibrant",
    means: ["Use colorful language", "Create vivid imagery", "Energize the reader"],
    doesntMean: ["Overly casual", "Unprofessional", "Exaggerated"],
    inspiration: "We bring ideas to life with dynamic, colorful expression.",
  },
  {
    id: "fallback-2",
    title: "Empathetic",
    means: ["Acknowledge feelings", "Show understanding", "Connect personally"],
    doesntMean: ["Overly emotional", "Presumptuous", "Insincere"],
    inspiration: "We genuinely understand and address our audience's needs and concerns.",
  },
  {
    id: "fallback-3",
    title: "Action-Oriented",
    means: ["Use strong verbs", "Provide clear next steps", "Inspire movement"],
    doesntMean: ["Demanding", "Pushy", "Unrealistic"],
    inspiration: "We motivate readers to take meaningful action through powerful calls to action.",
  },
]

export async function analyzeBrandVoiceAlignment(
  content: string,
  brandVoicePillars: Array<{
    id: string
    title: string
    means: string[]
    doesntMean: string[]
  }>,
): Promise<AnalysisResult> {
  try {
    console.log("🔍 analyzeBrandVoiceAlignment called with content length:", content.length)
    console.log("🔍 Brand voice pillars:", JSON.stringify(brandVoicePillars, null, 2))

    // Validate brand voice pillars - if empty or invalid, use fallback
    if (!brandVoicePillars || !Array.isArray(brandVoicePillars) || brandVoicePillars.length === 0) {
      console.log("⚠️ No valid brand voice pillars provided, using fallback")
      brandVoicePillars = FALLBACK_BRAND_VOICE_PILLARS
    }

    // Strip HTML tags to get plain text for analysis
    const plainText = content
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()

    console.log("🔍 Plain text length after stripping HTML:", plainText.length)

    // If content is empty or too short, return empty result
    if (!plainText || plainText.length < 10) {
      console.log("❌ Content too short for analysis")
      return { success: true, highlights: [], debugInfo: { reason: "Content too short" } }
    }

    // Format brand voice pillars for the prompt
    const pillarsFormatted = brandVoicePillars
      .map(
        (pillar, index) => `
Pillar ${index + 1}: ${pillar.title}
- Means: ${pillar.means.join(", ")}
- Doesn't Mean: ${pillar.doesntMean.join(", ")}
`,
      )
      .join("\n")

    // Create a simplified analysis prompt
    const prompt = `
Analyze this content and find phrases that strongly match the brand voice pillars.

BRAND VOICE PILLARS:
${pillarsFormatted}

CONTENT TO ANALYZE:
${plainText}

INSTRUCTIONS:
Find phrases in the content that strongly match each brand voice pillar. Only include strong, clear matches.
IMPORTANT: Only highlight specific phrases (5-15 words), never entire paragraphs or headings.
Do not highlight heading text like "Join Us for the Grand Opening" or "What to Expect".
Focus on the body text content only.

For each match, provide:
- The exact text from the content
- The pillar index (0-based) it matches
- The start and end character positions in the original text

FORMAT YOUR RESPONSE AS A JSON ARRAY:
[
  {
    "text": "exact phrase from content",
    "pillarIndex": 0,
    "startIndex": 123,
    "endIndex": 135
  }
]

Return ONLY the JSON array, no other text.
`

    console.log("🔍 Sending simplified prompt to OpenAI for analysis")

    // Call OpenAI API
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.3,
      maxTokens: 2500,
    })

    console.log("✅ Received response from OpenAI")

    // Parse the response
    let highlights: HighlightSegment[] = []

    try {
      // Clean the response to ensure it's valid JSON
      const cleanedResponse = text
        .trim()
        .replace(/```json/g, "")
        .replace(/```/g, "")

      console.log("🔍 Cleaned response:", cleanedResponse.substring(0, 200) + "...")

      highlights = JSON.parse(cleanedResponse)
      console.log("✅ Successfully parsed JSON response, found", highlights.length, "highlights")

      // Validate the highlights
      highlights = highlights.filter(
        (h) =>
          typeof h.text === "string" &&
          typeof h.pillarIndex === "number" &&
          typeof h.startIndex === "number" &&
          typeof h.endIndex === "number" &&
          h.pillarIndex >= 0 &&
          h.pillarIndex < brandVoicePillars.length,
      )

      console.log("🔍 After validation, kept", highlights.length, "highlights")

      // Log the first few highlights for debugging
      if (highlights.length > 0) {
        console.log("🔍 Sample highlights:", JSON.stringify(highlights.slice(0, 2), null, 2))
      }

      // Map the highlights to the HTML content
      highlights = mapHighlightsToHtml(content, highlights)
      console.log("✅ Mapped highlights to HTML, final count:", highlights.length)
    } catch (parseError) {
      console.error("❌ Error parsing OpenAI response:", parseError)
      return {
        success: false,
        error: "Failed to parse analysis results",
        highlights: [],
        debugInfo: {
          error: parseError.message,
          rawResponse: text.substring(0, 500) + "...",
        },
      }
    }

    // Since we're in a server component, we need to modify the DOM manipulation code
    // to work in a Node.js environment. Replace the applyHighlightsToHtml function with this version:

    // Apply highlights directly to HTML content
    function applyHighlightsToHtml(htmlContent: string, highlights: HighlightSegment[]): string {
      if (!highlights || highlights.length === 0) {
        console.log("❌ No highlights to apply to HTML")
        return htmlContent
      }

      console.log("🔍 Applying", highlights.length, "highlights to HTML content")

      try {
        // Since we're in a server component, we can't use the DOM directly
        // Instead, we'll use a more careful string manipulation approach

        // First, parse the HTML to identify text nodes and their positions
        const textNodes: { text: string; startPos: number; endPos: number; inTag: boolean }[] = []
        let inTag = false
        let currentText = ""
        let currentStartPos = 0

        // Simple parser to identify text nodes
        for (let i = 0; i < htmlContent.length; i++) {
          const char = htmlContent[i]

          if (char === "<") {
            // We're entering a tag
            if (currentText.trim()) {
              textNodes.push({
                text: currentText,
                startPos: currentStartPos,
                endPos: i,
                inTag: false,
              })
            }
            inTag = true
            currentText = char
            currentStartPos = i
          } else if (char === ">" && inTag) {
            // We're exiting a tag
            currentText += char
            textNodes.push({
              text: currentText,
              startPos: currentStartPos,
              endPos: i + 1,
              inTag: true,
            })
            inTag = false
            currentText = ""
            currentStartPos = i + 1
          } else {
            // Continue building current text
            currentText += char
          }
        }

        // Add any remaining text
        if (currentText.trim()) {
          textNodes.push({
            text: currentText,
            startPos: currentStartPos,
            endPos: htmlContent.length,
            inTag: inTag,
          })
        }

        // Now apply highlights only to non-tag text nodes
        let result = ""
        let lastPos = 0

        for (const node of textNodes) {
          if (node.inTag) {
            // This is a tag, just add it as is
            result += node.text
          } else {
            // This is a text node, check for highlights
            const nodeText = node.text
            let highlightedText = nodeText
            let textOffset = 0

            // Find highlights that apply to this text node
            for (const highlight of highlights) {
              const { text, pillarIndex } = highlight
              let pos = highlightedText.indexOf(text, textOffset)

              while (pos !== -1) {
                // Get pillar title
                const pillarTitle = brandVoicePillars[pillarIndex]?.title || `Pillar ${pillarIndex + 1}`

                // Create the highlighted version
                const before = highlightedText.substring(0, pos)
                const after = highlightedText.substring(pos + text.length)

                highlightedText =
                  before +
                  `<span class="brand-voice-highlight pillar-${pillarIndex}" title="${pillarTitle}" data-pillar="${pillarIndex}">${text}</span>` +
                  after

                // Update position for next search, accounting for the added span
                textOffset =
                  pos +
                  text.length +
                  `<span class="brand-voice-highlight pillar-${pillarIndex}" title="${pillarTitle}" data-pillar="${pillarIndex}"></span>`
                    .length

                // Look for next occurrence
                pos = highlightedText.indexOf(text, textOffset)
              }
            }

            // Add the highlighted text to the result
            result += highlightedText
          }

          lastPos = node.endPos
        }

        // Add any remaining content
        if (lastPos < htmlContent.length) {
          result += htmlContent.substring(lastPos)
        }

        return result
      } catch (error) {
        console.error("❌ Error applying highlights to HTML:", error)
        // Fallback to the original content if there's an error
        return htmlContent
      }
    }

    // Add this before the final return statement
    const highlightedHtml = applyHighlightsToHtml(content, highlights)

    return {
      success: true,
      highlights,
      highlightedHtml,
      debugInfo: {
        highlightsCount: highlights.length,
        contentLength: content.length,
        highlightedHtmlSample: highlightedHtml.substring(0, 200) + "...",
      },
    }
  } catch (error) {
    console.error("❌ Error analyzing content:", error)
    return {
      success: false,
      error: error.message || "An error occurred during content analysis",
      highlights: [],
      debugInfo: { error: error.message },
    }
  }
}

// Helper function to map plain text highlights to HTML content
function mapHighlightsToHtml(htmlContent: string, highlights: HighlightSegment[]): HighlightSegment[] {
  console.log("🔍 mapHighlightsToHtml called with", highlights.length, "highlights")

  // This is a simplified approach - a more robust solution would use a proper HTML parser
  try {
    // Create a temporary element to parse the HTML
    const tempElement = document.createElement("div")
    tempElement.innerHTML = htmlContent

    // Get the text content
    const textContent = tempElement.textContent || tempElement.innerText
    console.log("🔍 Text content length from HTML:", textContent.length)

    // Map each highlight from plain text to HTML
    const mappedHighlights = highlights
      .map((highlight) => {
        const { text, pillarIndex, reason } = highlight

        // Find the text in the HTML content
        const textIndex = textContent.indexOf(text)
        if (textIndex === -1) {
          console.log("⚠️ Text not found in content:", text.substring(0, 30) + "...")
          return null
        }

        console.log("✅ Found text in content at index:", textIndex)

        // Find the corresponding position in the HTML
        let htmlIndex = 0
        let textCounter = 0

        while (textCounter < textIndex && htmlIndex < htmlContent.length) {
          if (htmlContent[htmlIndex] === "<") {
            // Skip HTML tag
            while (htmlIndex < htmlContent.length && htmlContent[htmlIndex] !== ">") {
              htmlIndex++
            }
          } else {
            textCounter++
          }
          htmlIndex++
        }

        // Calculate end index
        let endHtmlIndex = htmlIndex
        let endTextCounter = 0

        while (endTextCounter < text.length && endHtmlIndex < htmlContent.length) {
          if (htmlContent[endHtmlIndex] === "<") {
            // Skip HTML tag
            while (endHtmlIndex < htmlContent.length && htmlContent[endHtmlIndex] !== ">") {
              endHtmlIndex++
            }
          } else {
            endTextCounter++
          }
          endHtmlIndex++
        }

        console.log(`✅ Mapped text position: ${textIndex} -> HTML position: ${htmlIndex}-${endHtmlIndex}`)

        return {
          text,
          pillarIndex,
          startIndex: htmlIndex,
          endIndex: endHtmlIndex,
          reason,
        }
      })
      .filter(Boolean) as HighlightSegment[]

    console.log("✅ Mapped", mappedHighlights.length, "highlights to HTML positions")

    return mappedHighlights
  } catch (error) {
    console.error("❌ Error mapping highlights to HTML:", error)
    return [] // Return empty array on error
  }
}
