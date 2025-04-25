import { NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

// Add Edge Runtime configuration
export const runtime = "edge"

export async function POST(request: Request) {
  console.log("🔍 API: analyze-brand-voice endpoint called")

  try {
    const { content, brandVoicePillars } = await request.json()

    if (!content || !brandVoicePillars) {
      console.error("❌ API: Missing content or brandVoicePillars in request")
      return NextResponse.json(
        {
          success: false,
          error: "Missing content or brand voice pillars",
        },
        { status: 400 },
      )
    }

    console.log(`🔍 API: Analyzing content (${content.length} chars) with ${brandVoicePillars.length} pillars`)

    // Format brand voice pillars for the prompt
    const pillarsFormatted = brandVoicePillars
      .map(
        (pillar, index) => `
Pillar ${index + 1}: ${pillar.title}
- Means: ${Array.isArray(pillar.means) ? pillar.means.join(", ") : "Not specified"}
- Doesn't Mean: ${Array.isArray(pillar.doesntMean) ? pillar.doesntMean.join(", ") : "Not specified"}
`,
      )
      .join("\n")

    // Create analysis prompt
    const prompt = `
Analyze this content and find phrases that strongly match the brand voice pillars.

BRAND VOICE PILLARS:
${pillarsFormatted}

CONTENT TO ANALYZE:
${content}

INSTRUCTIONS:
Find phrases in the content that strongly match each brand voice pillar. Only include strong, clear matches.
IMPORTANT: Only highlight specific phrases (5-15 words), never entire paragraphs or headings.
Do not highlight heading text like "Join Us for the Grand Opening" or "What to Expect".
Focus on the body text content only.

For each match, provide:
- The exact text from the content
- The pillar index (0-based) it matches
- The reason why it matches (brief explanation)

FORMAT YOUR RESPONSE AS A JSON ARRAY:
[
  {
    "text": "exact phrase from content",
    "pillarIndex": 0,
    "reason": "brief explanation of why this matches the pillar"
  }
]

Return ONLY the JSON array, no other text.
`

    console.log("🔍 API: Calling OpenAI for content analysis")

    // Call OpenAI API
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.3,
      maxTokens: 2500,
    })

    console.log("✅ API: Received response from OpenAI")

    // Parse the response
    try {
      const cleanedResponse = text
        .trim()
        .replace(/```json/g, "")
        .replace(/```/g, "")

      const highlights = JSON.parse(cleanedResponse)

      console.log(`✅ API: Successfully parsed ${highlights.length} highlights`)

      return NextResponse.json({
        success: true,
        highlights,
      })
    } catch (parseError) {
      console.error("❌ API: Failed to parse OpenAI response:", parseError)
      console.error("❌ API: Raw response:", text)

      return NextResponse.json({
        success: false,
        error: "Failed to parse analysis results",
        rawResponse: text,
      })
    }
  } catch (error) {
    console.error("❌ API: Error in analyze-brand-voice endpoint:", error)

    return NextResponse.json({
      success: false,
      error: error.message || "An error occurred during content analysis",
    })
  }
}
