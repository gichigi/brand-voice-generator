import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Export them to make them available to other modules
export { generateText, openai }

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

  "social-media-post": `Excited to share our thoughts on [TOPIC]! 

Key takeaway: [TOPIC] is transforming how we think about our industry.

What's your experience with [TOPIC]? Share in the comments below!

#[TOPIC] #Insights #Industry
`,

  "email-newsletter": `Subject: Important Updates on [TOPIC]

Hello,

We hope this email finds you well. We wanted to share some important insights about [TOPIC] that we believe will be valuable to you.

[TOPIC] has been evolving rapidly, and here are three things you should know:
1. First key point about [TOPIC]
2. Second important aspect to consider
3. How this might impact you

We're always here to help if you have questions about [TOPIC].

Best regards,
The Team
`,

  "landing-page": `# Transform Your Experience with [TOPIC]

## The Solution You've Been Looking For

[TOPIC] provides the tools and insights you need to succeed in today's competitive environment.

### Benefits
- Benefit 1
- Benefit 2
- Benefit 3

## Why Choose Us

Our approach to [TOPIC] is unique because we focus on results.

## Get Started Today

Contact us to learn more about how [TOPIC] can work for you.
`,
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

export async function generateAIContent(
  prompt: string,
  maxTokens = 2000,
  contentType = "blog-post",
  topic = "this topic",
  length = "medium",
) {
  try {
    // Get the length settings based on content type
    const lengthKey = contentType === "linkedin-post" ? `linkedin-${length}` : length

    const lengthSetting = LENGTH_SETTINGS[lengthKey] || LENGTH_SETTINGS.medium

    // Calculate approximate token count needed
    const targetTokens = Math.round(lengthSetting.targetWords * WORD_TO_TOKEN_RATIO)

    // Add explicit length instructions to the prompt
    const enhancedPrompt = `${prompt}

IMPORTANT LENGTH REQUIREMENTS:
- This content should be ${lengthSetting.minWords}-${lengthSetting.maxWords} words in length
- Target word count: ${lengthSetting.targetWords} words
- Please count your words carefully to ensure the content meets these requirements
- The content should be substantial enough to cover the topic thoroughly within these word count constraints
`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: enhancedPrompt,
      maxTokens: Math.max(targetTokens * 1.5, maxTokens), // Allow some buffer for the AI
    })

    return { success: true, data: text }
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
      success: true,
      data: generateFallbackContent(contentType, topic),
      warning:
        "We're using a template for now due to a temporary issue with our AI service. Your actual content will be more personalized and tailored to your needs.",
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
