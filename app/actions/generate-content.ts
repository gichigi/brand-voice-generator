"use server"

import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { fetchReferenceUrl } from "./fetch-reference-url"

// Fallback brand voice to use when no brand voice data is provided
const FALLBACK_BRAND_VOICE = {
  executiveSummary: "Our brand voice is vibrant, empathetic, and action-oriented.",
  pillars: [
    {
      title: "Vibrant",
      description:
        "We use colorful language and create vivid imagery to energize the reader. Our content is dynamic and engaging without being unprofessional.",
      examples: ["vibrant", "colorful", "energize", "dynamic"],
    },
    {
      title: "Empathetic",
      description:
        "We acknowledge feelings, show understanding, and connect personally with our audience. We genuinely address their needs and concerns.",
      examples: ["understand", "connect", "feel", "together"],
    },
    {
      title: "Action-Oriented",
      description:
        "We use strong verbs, provide clear next steps, and inspire movement. Our content motivates readers to take meaningful action.",
      examples: ["start", "create", "build", "transform"],
    },
  ],
}

// Word count to token mapping (approximate)
const WORD_TO_TOKEN_RATIO = 1.3 // Roughly 1.3 tokens per word on average

// Length settings with word counts
const LENGTH_SETTINGS = {
  short: { minWords: 300, maxWords: 400, targetWords: 350 },
  medium: { minWords: 400, maxWords: 500, targetWords: 450 },
  long: { minWords: 500, maxWords: 600, targetWords: 550 },
  // LinkedIn specific lengths
  "linkedin-short": { minWords: 80, maxWords: 120, targetWords: 100 },
  "linkedin-medium": { minWords: 150, maxWords: 250, targetWords: 200 },
  "linkedin-long": { minWords: 250, maxWords: 350, targetWords: 300 },
}

// Default content templates for fallbacks
const DEFAULT_CONTENT_TEMPLATES = {
  "blog-post": `# [TOPIC]

## Introduction
Welcome to our blog post about [TOPIC]. In this article, we'll explore key aspects and provide valuable insights.

## Main Points
### First Key Point
This is where we would discuss the first important aspect of [TOPIC].

### Second Key Point
Here we would explore another critical dimension of [TOPIC].

### Third Key Point
Finally, we would cover this essential element of [TOPIC].

## Conclusion
Thank you for reading our thoughts on [TOPIC]. We hope you found this information helpful.
`,

  "linkedin-post": `I'm excited to share some thoughts on [TOPIC].

This is an important topic for professionals in our industry because it impacts how we approach our work and deliver value to clients.

At our company, we believe in the importance of [TOPIC] and have seen firsthand how it creates positive outcomes.

What are your thoughts on [TOPIC]? I'd love to hear your experiences in the comments.
`,
}

// Fallback content generation function
function generateFallbackContent(contentType, topic) {
  const template = DEFAULT_CONTENT_TEMPLATES[contentType] || DEFAULT_CONTENT_TEMPLATES["blog-post"]
  return template.replace(/\[TOPIC\]/g, topic)
}

export async function generateContent(
  prompt: string,
  contentType = "blog-post",
  topic = "this topic",
  length = "medium",
  referenceUrl = "",
  brandVoiceData = null,
  businessInfo = null,
) {
  try {
    // Get the length settings based on content type
    const lengthKey = contentType === "linkedin-post" ? `linkedin-${length}` : length
    const lengthSetting = LENGTH_SETTINGS[lengthKey] || LENGTH_SETTINGS.medium

    // Calculate approximate token count needed
    const targetTokens = Math.round(lengthSetting.targetWords * WORD_TO_TOKEN_RATIO)

    // Process reference URL if provided
    let referenceContent = ""
    let referenceError = ""

    if (referenceUrl) {
      console.log("Processing reference URL:", referenceUrl)
      const result = await fetchReferenceUrl(referenceUrl)

      if (result.error) {
        referenceError = result.error
        console.warn("Reference URL error:", result.error)
      } else if (result.content) {
        referenceContent = result.content
        console.log("Successfully extracted reference URL content")
      }
    }

    // Format brand voice data for the prompt if available
    const brandVoiceSection = formatBrandVoiceForPrompt(brandVoiceData || FALLBACK_BRAND_VOICE)

    // Format business information for the prompt if available
    const businessInfoSection = businessInfo ? formatBusinessInfoForPrompt(businessInfo) : ""

    // Create system message with strong guardrails
    const systemMessage = `You are a content generator that follows brand voice guidelines precisely. 
CRITICAL INSTRUCTION: NEVER mention the brand voice pillar names directly in your content. 
Apply the voice characteristics naturally without explicitly referencing them.`

    // Create assistant message with brand voice guidelines
    const assistantMessage = `${brandVoiceSection}

${businessInfoSection}`

    // Create user message with content specifications
    let userMessage = `# CONTENT REQUEST
- Create a ${lengthSetting.targetWords}-word ${contentType} about "${topic}"
- Follow the brand voice guidelines precisely (highest priority)
- Ensure the content is relevant to the business context provided

# CONTENT SPECIFICATIONS
${prompt}

# LENGTH REQUIREMENTS
- This content should be ${lengthSetting.minWords}-${lengthSetting.maxWords} words in length
- Target word count: ${lengthSetting.targetWords} words
- Please count your words carefully to ensure the content meets these requirements`

    // Add reference content to the user message if available
    if (referenceContent) {
      userMessage += `

# REFERENCE MATERIAL
The following is extracted and summarized content from the reference URL you provided. Please incorporate relevant information from this material into your content while maintaining the brand voice:

${referenceContent}

INSTRUCTIONS FOR USING REFERENCE MATERIAL:
- Incorporate key facts, statistics, and insights from the reference material
- Do not copy the reference material verbatim - rewrite in your own words
- Cite the source appropriately if using specific data or quotes
- Maintain the requested brand voice and style while integrating this information`
    } else if (referenceError) {
      userMessage += `

NOTE ABOUT REFERENCE URL:
We attempted to fetch content from the reference URL you provided, but encountered an issue: ${referenceError}
Please proceed with content generation based on your knowledge of the topic.`
    }

    console.log("Generating content with OpenAI API...")
    console.log("Using API key:", process.env.OPENAI_API_KEY ? "API key is set" : "API key is not set")

    // Use messages format instead of a single prompt
    const { text } = await generateText({
      model: openai("gpt-4o"),
      messages: [
        { role: "system", content: systemMessage },
        { role: "assistant", content: assistantMessage },
        { role: "user", content: userMessage },
      ],
      temperature: 0.3,
      maxTokens: Math.max(targetTokens * 1.5, 2000), // Allow some buffer for the AI
    })

    return {
      success: true,
      data: text,
      referenceProcessed: !!referenceContent,
      referenceError: referenceError || undefined,
    }
  } catch (error) {
    console.error("Error generating AI content:", error)

    // Improved error messages
    if (error.message?.includes("API key")) {
      return {
        success: false,
        error: "There's an issue with the OpenAI API key. Please contact the site administrator.",
        data: generateFallbackContent(contentType, topic),
      }
    }

    if (error.message?.includes("429")) {
      return {
        success: false,
        error: "The AI service is currently experiencing high demand. Please try again in a few minutes.",
        data: generateFallbackContent(contentType, topic),
      }
    }

    if (error.message?.includes("timeout") || error.message?.includes("network")) {
      return {
        success: false,
        error: "Network issue detected. Please check your internet connection and try again.",
        data: generateFallbackContent(contentType, topic),
      }
    }

    // Use fallback content generation with better message
    return {
      success: false,
      error: error.message || "An unexpected error occurred while generating content.",
      data: generateFallbackContent(contentType, topic),
    }
  }
}

// Helper function to format brand voice data for the prompt - COMPLETELY REDESIGNED to avoid pillar titles
function formatBrandVoiceForPrompt(brandVoice) {
  // Validate the brand voice data structure
  if (!brandVoice || !brandVoice.pillars || !Array.isArray(brandVoice.pillars) || brandVoice.pillars.length === 0) {
    console.warn("Invalid brand voice data provided, using fallback")
    brandVoice = FALLBACK_BRAND_VOICE
  }

  // Create a guide that describes voice characteristics without using pillar titles
  const voiceGuide = brandVoice.pillars
    .map((pillar, index) => {
      return `
Voice Characteristic ${index + 1}:
Description: ${pillar.description || "No description provided"}
How to apply this characteristic:
- ${pillar.means ? pillar.means.join("\n- ") : "No specific guidelines provided"}
What to avoid:
- ${pillar.doesntMean ? pillar.doesntMean.join("\n- ") : "No specific guidelines provided"}
`
    })
    .join("\n")

  return `
# BRAND VOICE GUIDELINES (HIGHEST PRIORITY)
Brand Voice Summary: ${brandVoice.executiveSummary || "Clear, helpful, and authentic communication"}

${voiceGuide}

IMPORTANT: Write in this voice naturally without explicitly mentioning any of these characteristics by name.
`
}

// Helper function to format business information for the prompt
function formatBusinessInfoForPrompt(businessInfo) {
  if (!businessInfo) return ""

  return `
# BUSINESS CONTEXT
Business Name: ${businessInfo.businessName}
Year Founded: ${businessInfo.yearFounded}
Business Description: ${businessInfo.businessDescription}
${
  businessInfo.selectedDemographics && businessInfo.selectedDemographics.length > 0
    ? `Target Audience: ${businessInfo.selectedDemographics.join(", ")}`
    : ""
}
${
  businessInfo.businessValues && businessInfo.businessValues.length > 0
    ? `Core Values: ${
        Array.isArray(businessInfo.businessValues)
          ? businessInfo.businessValues.join(", ")
          : businessInfo.businessValues
      }`
    : ""
}
${businessInfo.additionalInfo ? `Additional Information: ${businessInfo.additionalInfo}` : ""}
`
}
