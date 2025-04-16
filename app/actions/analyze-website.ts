"use server"

import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function analyzeWebsite(url: string): Promise<{ description: string; error?: string }> {
  try {
    // Improved URL validation and formatting
    let formattedUrl = url.trim()

    // Add protocol if missing
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl
    }

    // Validate URL format
    try {
      new URL(formattedUrl)
    } catch (e) {
      return {
        description: "",
        error: "Invalid URL format. Please enter a valid website address.",
      }
    }

    console.log(`Attempting to fetch: ${formattedUrl}`)

    // Fetch the website content with timeout and better error handling
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const response = await fetch(formattedUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; VercelBot/1.0; +https://vercel.com/bot)",
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type") || ""
      if (!contentType.includes("text/html")) {
        throw new Error("The URL did not return HTML content")
      }

      const html = await response.text()

      // Extract text content from HTML (improved extraction)
      const textContent = extractTextFromHtml(html)

      if (!textContent || textContent.length < 100) {
        return {
          description: "",
          error:
            "Could not extract enough content from the website. Please try another URL or enter your description manually.",
        }
      }

      // Use OpenAI to analyze the content
      const prompt = `
  The following text is extracted from a website. Based on this content, write a concise description (maximum 100 words) 
  of what the business or organization does. Focus on their main products, services, or purpose.
  
  Format the response with:
  - Short, clear paragraphs (2-3 sentences each)
  - Line breaks between paragraphs
  - Clear structure (introduction, main points, conclusion if applicable)
  
  Website content:
  ${textContent.substring(0, 4000)}
`

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt,
        maxTokens: 200,
      })

      return { description: formatResponseText(text.trim()) }
    } catch (fetchError) {
      clearTimeout(timeoutId)
      console.error("Fetch error:", fetchError)

      // If we can extract a domain name, use it for a fallback analysis
      try {
        const domain = new URL(formattedUrl).hostname
        return await generateFallbackDescription(domain)
      } catch (e) {
        return {
          description: "",
          error: `Could not access the website: ${fetchError.message}. The website may be blocking our requests or is not accessible.`,
        }
      }
    }
  } catch (error) {
    console.error("Error analyzing website:", error)
    return {
      description: "",
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

// Helper function to extract text from HTML
function extractTextFromHtml(html: string): string {
  // Remove scripts, styles, and HTML tags
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>/gi, " ")
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, " ")
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

// Helper function to format the response text
function formatResponseText(text: string): string {
  // Remove any existing double line breaks
  let formatted = text.replace(/\n\s*\n/g, "\n")

  // Ensure sentences end with proper spacing
  formatted = formatted.replace(/\.(?=\S)/g, ". ")

  // Add line breaks between sentences that introduce new topics
  formatted = formatted.replace(
    /\. (However|Moreover|Furthermore|Additionally|In addition|Finally|Notably|At|The company|They|Their|With|This|These|Those)/g,
    ".\n\n$1",
  )

  // Trim any extra whitespace
  return formatted.trim()
}

// Generate a fallback description based on the domain name
async function generateFallbackDescription(domain: string): Promise<{ description: string; error?: string }> {
  try {
    const prompt = `
  Based on the domain name "${domain}", please generate a plausible business description (maximum 100 words).
  
  Format the response with:
  - Start with: "Based on the domain name, this appears to be..."
  - Use short, clear paragraphs (2-3 sentences each)
  - Add line breaks between paragraphs
  
  Focus on:
  - What this business might do
  - Its potential products or services
  - Its likely target audience
`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 200,
    })

    return {
      description: formatResponseText(text.trim()),
      error: "Note: We couldn't access the website directly, so this description is a guess based on the domain name.",
    }
  } catch (error) {
    console.error("Error generating fallback description:", error)
    return {
      description: "",
      error: "We couldn't analyze your website. Please enter your description manually.",
    }
  }
}
