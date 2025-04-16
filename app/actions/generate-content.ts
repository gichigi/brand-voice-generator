"use server"

import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { fetchReferenceUrl } from "./fetch-reference-url"

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

export async function generateContent(
  prompt: string,
  contentType = "blog-post",
  topic = "this topic",
  length = "medium",
  referenceUrl = "",
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

    // Add explicit length requirements to the prompt
    let enhancedPrompt = `${prompt}

IMPORTANT LENGTH REQUIREMENTS:
- This content should be ${lengthSetting.minWords}-${lengthSetting.maxWords} words in length
- Target word count: ${lengthSetting.targetWords} words
- Please count your words carefully to ensure the content meets these requirements
- The content should be substantial enough to cover the topic thoroughly within these word count constraints
`

    // Add reference content to the prompt if available
    if (referenceContent) {
      enhancedPrompt += `

REFERENCE MATERIAL:
The following is extracted and summarized content from the reference URL you provided. Please incorporate relevant information from this material into your content:

${referenceContent}

INSTRUCTIONS FOR USING REFERENCE MATERIAL:
- Incorporate key facts, statistics, and insights from the reference material
- Do not copy the reference material verbatim - rewrite in your own words
- Cite the source appropriately if using specific data or quotes
- Maintain the requested tone and style while integrating this information
`
    } else if (referenceError) {
      enhancedPrompt += `

NOTE ABOUT REFERENCE URL:
We attempted to fetch content from the reference URL you provided, but encountered an issue: ${referenceError}
Please proceed with content generation based on your knowledge of the topic.
`
    }

    console.log("Generating content with OpenAI API...")
    console.log("Using API key:", process.env.OPENAI_API_KEY ? "API key is set" : "API key is not set")

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: enhancedPrompt,
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

// Function to generate fallback content based on templates
function generateFallbackContent(contentType: string, topic: string): string {
  // Get the appropriate template or default to blog post
  const template = DEFAULT_CONTENT_TEMPLATES[contentType] || DEFAULT_CONTENT_TEMPLATES["blog-post"]

  // Replace [TOPIC] placeholders with the actual topic
  return template.replace(/\[TOPIC\]/g, topic)
}
