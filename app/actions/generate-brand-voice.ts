"use server"

import { openai, generateText } from "@ai-sdk/openai"

type BrandVoiceData = {
  businessName: string
  yearFounded: string
  businessDescription: string
  selectedDemographics?: string[]
  businessValues: string[]
  additionalInfo?: string
}

export async function generateBrandVoice(
  data: BrandVoiceData,
): Promise<{ success: boolean; data?: any; error?: string; warning?: string }> {
  try {
    const demographics = Array.isArray(data.selectedDemographics)
      ? data.selectedDemographics.join(", ")
      : "Not specified"
    const businessValues = Array.isArray(data.businessValues)
      ? data.businessValues.join(", ")
      : data.businessValues || "Not specified"

    // Improved prompt with more specific pillar guidance
    const prompt = `
Generate a brand voice for ${data.businessName} focused specifically on written content.

Business Context:
- Description: ${data.businessDescription}
- Target Demographics: ${demographics}
- Core Values: ${businessValues}
- Year Founded: ${data.yearFounded}
- Additional Info: ${data.additionalInfo || "None provided"}

Create a content-focused brand voice with:
1. An executive summary (2-3 sentences) that describes how the brand should sound in ALL written content
2. Three brand voice pillars for writers, each with:
  - A SINGLE WORD adjective title (CRITICAL: must be ONE WORD only, like "Bold", "Witty", "Compassionate")
  - 3 specific "What it means" guidelines with concrete writing techniques, language choices, and content approaches
  - 3 specific "What it doesn't mean" guidelines focusing on writing pitfalls, content mistakes, and tone errors to avoid
  - A brand inspiration example that specifically highlights how another brand uses similar writing styles in their content

IMPORTANT GUIDELINES FOR PILLAR GENERATION:
- Each pillar MUST have a SINGLE WORD adjective title (e.g., "Bold", "Sincere", "Playful")
- Avoid generic terms like "Professional", "Innovative", "Trustworthy"
- Choose distinct pillars that complement each other (e.g., don't use "Friendly" and "Approachable" as separate pillars)
- Make pillars practical and immediately applicable for content writers

Examples of good pillar names:
- Bold: Uses confident, direct language with strong statements
- Witty: Incorporates clever wordplay and subtle humor
- Compassionate: Shows deep empathy and understanding for user needs
- Vibrant: Uses colorful, energetic language that feels alive
- Precise: Focuses on accuracy, clarity, and specificity in all statements

Format as JSON:
{
 "executiveSummary": "Summary text focused on written content style",
 "pillars": [
   {
     "id": "pillar-1",
     "title": "SingleWordPillar",
     "means": ["Specific writing technique 1", "Specific language choice 2", "Specific content approach 3"],
     "doesntMean": ["Specific writing pitfall 1", "Specific content mistake 2", "Specific tone error 3"],
     "inspiration": "Brand Example – Brief explanation of their writing style and how it applies to ${data.businessName}"
   }
 ]
}

Return ONLY the JSON object without any markdown formatting or additional text.`

    console.log("[GenerateBrandVoice] Sending prompt:", prompt);

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 1500,
      temperature: 0.7,
    })

    console.log("[GenerateBrandVoice] Received raw response:", text.substring(0, 150) + "...");

    // Clean the response to remove any markdown formatting
    const cleanedText = cleanJsonResponse(text)
    console.log("[GenerateBrandVoice] Cleaned response (first 150 chars):", cleanedText.substring(0, 150) + "...");

    try {
      const brandVoice = JSON.parse(cleanedText)
      
      // Debug log the parsed pillars
      console.log("[GenerateBrandVoice] Generated brand voice with pillars:", 
        brandVoice?.pillars?.map((p, i) => `${i+1}. ${p.title}`).join(", ") || "none");
      
      return { success: true, data: brandVoice }
    } catch (error) {
      console.error("[GenerateBrandVoice] Failed to parse JSON:", error)
      console.error("[GenerateBrandVoice] Raw text:", text)
      console.error("[GenerateBrandVoice] Cleaned text:", cleanedText)
      return { success: false, error: "Failed to parse generated content. Please try again." }
    }
  } catch (error) {
    console.error("[GenerateBrandVoice] Error generating brand voice:", error)
    return { success: false, error: "Failed to generate brand voice. Please try again." }
  }
}

export async function regeneratePillar(
  data: any,
  pillarIndex: number,
  existingPillars: any,
): Promise<{ success: boolean; data?: any; error?: string; warning?: string }> {
  try {
    const demographics = Array.isArray(data.selectedDemographics)
      ? data.selectedDemographics.join(", ")
      : "Not specified"
    const businessValues = Array.isArray(data.businessValues)
      ? data.businessValues.join(", ")
      : data.businessValues || "Not specified"

    const otherPillars = existingPillars
      .filter((_, index) => index !== pillarIndex)
      .map((pillar) => pillar.title)
      .join(", ")
      
    console.log("[RegeneratePillar] Regenerating pillar", pillarIndex, 
      "Current pillar:", existingPillars[pillarIndex]?.title || "unknown",
      "Other pillars:", otherPillars);

    // Improved prompt with clearer guidance
    const prompt = `
Generate a new brand voice pillar for ${data.businessName}'s written content, founded in ${data.yearFounded}.

Context:
Business Description: ${data.businessDescription}
Target Demographics: ${demographics}
Core Values: ${businessValues}
Additional Info: ${data.additionalInfo || "None provided"}
Existing Pillars: ${otherPillars}

IMPORTANT GUIDELINES FOR THE NEW PILLAR:
- The pillar MUST be a SINGLE WORD adjective (e.g., "Bold", "Witty", "Precise")
- The pillar must complement the existing pillars: ${otherPillars}
- The pillar should be practical and immediately applicable to content creation and writing
- The new pillar MUST be different from the one being replaced: "${existingPillars[pillarIndex]?.title || 'unknown'}"

Examples of strong, specific pillar names:
- Bold: Uses confident, direct language with strong statements
- Witty: Incorporates clever wordplay and subtle humor
- Compassionate: Shows deep empathy and understanding for user needs
- Vibrant: Uses colorful, energetic language that feels alive
- Precise: Focuses on accuracy, clarity, and specificity in all statements

Avoid generic, overused terms like: Consistent, Innovative, Professional, Empathetic, Authentic, Friendly, Informative, Ethical, Sustainable, Engaging, Dynamic, Trustworthy, Customer-centric, Reliable, Effective, Insightful, Quality-driven, Strategic, Visionary

For the pillar:
1. Use a SINGLE WORD adjective as the title
2. Provide 3 specific "What it means" guidelines with concrete writing techniques, language choices, and content approaches
3. List 3 specific "What it doesn't mean" guidelines focusing on writing pitfalls, content mistakes, and tone errors to avoid
4. Give 1 relevant brand inspiration example that specifically highlights how another brand uses similar writing styles in their content and how it relates to ${data.businessName}'s context

Format the response as a structured JSON object with this structure:
{
"id": "pillar-${pillarIndex + 1}",
"title": "SingleWordAdjective",
"means": ["Specific writing technique 1", "Specific language choice 2", "Specific content approach 3"],
"doesntMean": ["Specific writing pitfall 1", "Specific content mistake 2", "Specific tone error 3"],
"inspiration": "Brand Example – With brief explanation of their writing style and how it applies to ${data.businessName}"
}

IMPORTANT: 
- The pillar MUST be a SINGLE WORD adjective
- Return ONLY the JSON object without any markdown formatting or additional text`

    console.log("[RegeneratePillar] Sending prompt for pillar regeneration");

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 1000,
      temperature: 0.7,
    })

    console.log("[RegeneratePillar] Raw response (first 150 chars):", text.substring(0, 150) + "...");

    // Clean the response to remove any markdown formatting
    const cleanedText = cleanJsonResponse(text)
    console.log("[RegeneratePillar] Cleaned response (first 150 chars):", cleanedText.substring(0, 150) + "...");

    try {
      const pillarData = JSON.parse(cleanedText)
      console.log("[RegeneratePillar] Generated new pillar:", pillarData.title);
      return { success: true, data: pillarData }
    } catch (error) {
      console.error("[RegeneratePillar] Failed to parse JSON:", error)
      console.error("[RegeneratePillar] Raw text preview:", text.substring(0, 150) + "...")
      console.error("[RegeneratePillar] Cleaned text preview:", cleanedText.substring(0, 150) + "...")
      return {
        success: false,
        error: "Failed to parse generated content. Please try again.",
        warning: "The AI returned an invalid format. Please try regenerating the pillar.",
      }
    }
  } catch (error) {
    console.error("[RegeneratePillar] Error generating pillar:", error)
    return { success: false, error: "Failed to generate brand voice pillar. Please try again." }
  }
}

// Helper function to clean JSON response from markdown formatting
function cleanJsonResponse(text: string): string {
  // Remove markdown code block formatting if present
  let cleaned = text.trim()

  // Remove \`\`\`json or \`\`\` at the beginning
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7).trim()
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3).trim()
  }

  // Remove \`\`\` at the end
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3).trim()
  }

  return cleaned
}

export async function startBrandVoiceGeneration(
  data: any,
): Promise<{ success: boolean; jobId?: string; error?: string }> {
  try {
    // Simulate starting a background job
    const jobId = `job_${Date.now()}`
    // In a real implementation, you would enqueue a job to a queue
    // and return the job ID.
    return { success: true, jobId }
  } catch (error) {
    console.error("Error starting brand voice generation:", error)
    return { success: false, error: "Failed to start brand voice generation." }
  }
}

export async function checkJobStatus(
  jobId: string,
): Promise<{ success: boolean; status?: string; result?: any; error?: string }> {
  try {
    // Simulate checking the status of a background job
    // In a real implementation, you would query a database or queue
    // to get the job status and result.
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate processing time

    // Simulate a successful job completion
    if (Math.random() > 0.2) {
      const mockBrandVoice = {
        executiveSummary: "Our brand voice is confident, innovative, and user-friendly.",
        pillars: [
          {
            id: "1",
            title: "Confidence",
            means: ["Assertive", "Knowledgeable", "Authoritative"],
            doesntMean: ["Arrogant", "Boastful", "Dismissive"],
            inspiration: "We speak with the assurance of an industry leader.",
          },
          {
            id: "2",
            title: "Innovation",
            means: ["Forward-thinking", "Creative", "Cutting-edge"],
            doesntMean: ["Reckless", "Untested", "Gimmicky"],
            inspiration: "We showcase our commitment to pushing boundaries and creating new solutions.",
          },
          {
            id: "3",
            title: "User-friendly",
            means: ["Approachable", "Clear", "Helpful"],
            doesntMean: ["Oversimplified", "Patronizing", "Vague"],
            inspiration: "We make complex concepts accessible and easy to understand for all users.",
          },
        ],
      }
      return { success: true, status: "completed", result: mockBrandVoice }
    } else {
      // Simulate a failed job
      return { success: true, status: "failed", error: "Failed to generate brand voice." }
    }
  } catch (error) {
    console.error("Error checking job status:", error)
    return { success: false, error: "Failed to check job status." }
  }
}
