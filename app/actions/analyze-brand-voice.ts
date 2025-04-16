"use server"

import OpenAI from "openai"
import type { BrandVoiceHighlight } from "@/lib/brand-voice-highlight"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function analyzeBrandVoice(content: string, brandVoice: any): Promise<BrandVoiceHighlight[]> {
  try {
    if (!content || !brandVoice) {
      console.error("Missing content or brand voice profile")
      return []
    }

    // For development/testing, return mock highlights if no OpenAI key
    if (!process.env.OPENAI_API_KEY) {
      console.warn("No OpenAI API key found, using mock highlights")
      return createMockHighlights(content, brandVoice)
    }

    // Extract the exact pillar information for clear reference
    const pillarsInfo = brandVoice.pillars.map((pillar, index) => {
      return {
        index,
        title: pillar.title,
        means: pillar.whatItMeans?.join(", ") || pillar.means?.join(", ") || "",
        doesntMean: pillar.whatItDoesntMean?.join(", ") || pillar.doesntMean?.join(", ") || "",
      }
    });

    console.log("[AnalyzeBrandVoice] Using exact brand voice pillars:", 
      pillarsInfo.map(p => `${p.index}: ${p.title}`).join(", "));

    // Create a structured prompt for the AI with explicit pillar mapping
    const prompt = `
      Analyze the following HTML content and identify phrases or sentences that embody the EXACT brand voice pillars provided below.
      
      HTML Content:
      \`\`\`html
      ${content}
      \`\`\`
      
      Brand Voice Profile Summary:
      ${brandVoice.executiveSummary || ""}
      
      IMPORTANT: You MUST ONLY use these EXACT brand voice pillars for your analysis. DO NOT invent your own pillars.
      
      Brand Voice Pillars (EXACT - use these precise pillars and indexes):
      ${pillarsInfo.map(pillar => 
        `Pillar ${pillar.index} - "${pillar.title}":
         - What it means: ${pillar.means}
         - What it doesn't mean: ${pillar.doesntMean}
        `
      ).join("\n\n")}
      
      For each identified phrase or sentence that embodies one of these brand voice pillars:
      1. Extract the EXACT text that matches (must be found verbatim in the content)
      2. Identify which pillar index (0, 1, or 2) it represents - THIS MUST MATCH THE INDEXES SHOWN ABOVE
      3. Provide a brief explanation of why it matches that specific pillar
      
      Return the results as a JSON object with this structure:
      {
        "highlights": [
          {
            "text": "exact phrase or sentence that appears in the content",
            "pillarIndex": 0, // MUST match the exact index from the list above
            "explanation": "brief explanation of why this matches the pillar titled [EXACT PILLAR TITLE]"
          }
        ]
      }
      
      IMPORTANT REQUIREMENTS: 
      - HIGHLIGHT BETWEEN 40-50% OF THE TOTAL CONTENT. This is essential for the user experience.
      - Be generous in highlighting content that shows even modest alignment with the brand voice pillars.
      - Don't just highlight the most obvious matches - include phrases that partially align with the pillars too.
      - The "text" MUST be an exact substring that appears in the content
      - The "pillarIndex" MUST correspond to the correct pillar index (0, 1, or 2) as listed above
      - Keep phrases under 20 words for the best highlighting experience
      - Aim for balanced representation across all pillars when possible
      - If no matches are found, return an empty highlights array
    `

    // Make the API call with temperature 0 for more deterministic results
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Or gpt-4-turbo if preferred
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0, // Lower temperature for more consistent results
    })

    const analysisResult = JSON.parse(response.choices[0].message.content || "{}")

    // --- DEBUG LOGGING ---
    console.log("[ServerAction] Analyzed content using brand pillars:", pillarsInfo.map(p => p.title).join(", "));
    // --- END DEBUG LOGGING ---

    // Transform the results into our BrandVoiceHighlight format
    const highlights: BrandVoiceHighlight[] = (analysisResult.highlights || []).map((item: any, index: number) => {
      // Validate that the pillar index is within range
      const pillarIndex = Number(item.pillarIndex);
      const validPillarIndex = !isNaN(pillarIndex) && 
                               pillarIndex >= 0 && 
                               pillarIndex < brandVoice.pillars.length ? 
                               pillarIndex : 0;
      
      return {
        id: `highlight-${Date.now()}-${index}`,
        text: item.text,
        pillarIndex: validPillarIndex,
        explanation: item.explanation || `Matches the "${brandVoice.pillars[validPillarIndex]?.title}" pillar`,
      };
    }).filter(item => 
        typeof item.text === 'string' && 
        item.text.length > 0 &&
        typeof item.pillarIndex === 'number'
    );

    console.log("[ServerAction] Generated highlights with pillar mapping:", 
      highlights.map(h => `"${h.text.substring(0, 20)}..." -> Pillar ${h.pillarIndex} (${brandVoice.pillars[h.pillarIndex]?.title})`));

    return highlights
  } catch (error) {
    console.error("Error analyzing brand voice:", error)
    return []
  }
}

// Function to create mock highlights for testing without OpenAI
function createMockHighlights(content: string, brandVoice: any): BrandVoiceHighlight[] {
  const highlights: BrandVoiceHighlight[] = []

  // Extract some sentences from the content
  const sentences = content.match(/[^.!?]+[.!?]+/g) || []

  // Create highlights for some sentences
  for (let i = 0; i < Math.min(sentences.length, 5); i++) {
    if (sentences[i].length > 20 && Math.random() > 0.5) {
      const pillarIndex = i % (brandVoice.pillars?.length || 3)
      const pillar = brandVoice.pillars?.[pillarIndex]

      highlights.push({
        id: `mock-highlight-${i}`,
        text: sentences[i].trim(),
        pillarIndex,
        explanation: `This matches the "${pillar?.title || `Pillar ${pillarIndex + 1}`}" brand voice element.`,
      })
    }
  }

  return highlights
}
