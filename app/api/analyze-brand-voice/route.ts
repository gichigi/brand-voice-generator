import OpenAI from "openai"
import { NextResponse } from "next/server"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { content, brandVoice } = await req.json()

    if (!content || !brandVoice) {
      return NextResponse.json({ error: "Missing content or brand voice profile" }, { status: 400 })
    }

    // Log what we're working with
    console.log(`[analyze-brand-voice] Analyzing content (${content.length} chars) with brand voice:`, {
      pillars: brandVoice.pillars?.map((p: any) => p.title) || [],
      summary: brandVoice.executiveSummary?.substring(0, 50) + "..." || "None"
    });

    // Create a structured prompt for the AI with improved guidance
    const prompt = `
      Analyze the following content and identify phrases or sentences that embody specific brand voice characteristics.
      
      Content:
      ${content}
      
      Brand Voice Executive Summary:
      ${brandVoice.executiveSummary || ""}
      
      Brand Voice Pillars:
      ${
        brandVoice.pillars
          ?.map(
            (pillar: any, index: number) =>
              `Pillar ${index} - ${pillar.title}:
         - What it means: ${pillar.means?.join(", ")}
         - What it doesn't mean: ${pillar.doesntMean?.join(", ")}
        `,
          )
          .join("\n") || "No pillars defined"
      }
      
      TASK:
      Carefully review the content and identify phrases that align with the brand voice pillars.
      
      IMPORTANT GUIDELINES:
      - HIGHLIGHT BETWEEN 40-50% OF THE CONTENT. This is essential for the user experience.
      - Include phrases that show even modest alignment with the brand voice pillars.
      - Don't just highlight the most obvious matches - be inclusive of partial matches too.
      - Identify phrases that exemplify each pillar (aim for balanced representation across pillars)
      - Keep each highlighted phrase between 3-15 words
      - Be precise about which pillar each phrase aligns with
      - Choose complete phrases that make sense on their own
      - Assign the exact pillar index number (0, 1, 2, etc.) matching the pillar list above
      
      Return the results as a JSON object with this structure:
      {
        "highlights": [
          {
            "text": "the exact phrase",
            "pillarIndex": 0, // index of the matching pillar (0, 1, 2, etc.)
            "pillarTitle": "${brandVoice.pillars?.[0]?.title || 'Unknown'}", // title of the pillar
            "explanation": "brief explanation of why this matches"
          },
          {
            "text": "another exact phrase",
            "pillarIndex": 1, // index of the matching pillar (0, 1, 2, etc.)
            "pillarTitle": "${brandVoice.pillars?.[1]?.title || 'Unknown'}", // title of the pillar
            "explanation": "brief explanation of why this matches"
          }
        ]
      }
      
      If no matches are found, return an empty highlights array.
    `

    console.log("[analyze-brand-voice] Sending brand voice analysis request...")

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.3, // Lower temperature for more focused results
    })

    // Parse the response and add IDs to highlights
    const rawAnalysisResult = JSON.parse(response.choices[0].message.content || "{}")
    
    // Add IDs and validate pillarIndex
    const processedHighlights = (rawAnalysisResult.highlights || []).map((highlight: any, index: number) => {
      // Get raw pillar index
      const rawPillarIndex = !isNaN(highlight.pillarIndex) && highlight.pillarIndex >= 0 
        ? highlight.pillarIndex 
        : 0;
        
      // Normalize to 0-2 range for our 3 pillar system
      const normalizedPillarIndex = rawPillarIndex % 3;
      
      // Get the appropriate pillar title - either use provided one or get from brand voice
      const pillarTitle = highlight.pillarTitle || 
        brandVoice.pillars?.[rawPillarIndex]?.title || 
        brandVoice.pillars?.[normalizedPillarIndex]?.title || 
        "Unknown";
      
      return {
        ...highlight,
        id: `highlight-${index}`,
        pillarIndex: normalizedPillarIndex,
        originalPillarIndex: rawPillarIndex,
        pillarTitle,
        pillarDescription: brandVoice.pillars?.[rawPillarIndex]?.means?.join(", ") || 
                          brandVoice.pillars?.[normalizedPillarIndex]?.means?.join(", ") || "",
      };
    });
    
    const analysisResult = { highlights: processedHighlights };

    console.log(`[analyze-brand-voice] Found ${analysisResult.highlights?.length || 0} brand voice elements`);
    
    if (analysisResult.highlights?.length > 0) {
      console.log(`[analyze-brand-voice] Sample highlights:`, analysisResult.highlights.slice(0, 2).map((h: any) => 
        `"${h.text}" (Pillar ${h.pillarIndex}: ${h.pillarTitle})`).join(", "));
    }

    return NextResponse.json({ highlights: analysisResult.highlights || [] })
  } catch (error) {
    console.error("[analyze-brand-voice] Error analyzing brand voice:", error)
    return NextResponse.json({ error: "Failed to analyze content for brand voice elements" }, { status: 500 })
  }
}
