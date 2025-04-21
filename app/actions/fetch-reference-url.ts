"use server"

import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function fetchReferenceUrl(url: string): Promise<{ content: string; error?: string }> {
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
        content: "",
        error: "Invalid URL format. Please enter a valid URL.",
      }
    }

    console.log(`Fetching reference URL: ${formattedUrl}`)

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
        if (response.status === 404) {
          return { content: "", error: "The page couldn't be found. Please check the URL and try again." }
        } else if (response.status === 403 || response.status === 401) {
          return { content: "", error: "This page requires permission to access." }
        } else {
          return { content: "", error: "We couldn't access this page." }
        }
      }

      const contentType = response.headers.get("content-type") || ""

      // Handle different content types
      let extractedContent = ""

      if (contentType.includes("text/html")) {
        const html = await response.text()
        extractedContent = extractTextFromHtml(html)
      } else if (contentType.includes("application/json")) {
        const json = await response.json()
        extractedContent = JSON.stringify(json, null, 2)
      } else if (contentType.includes("text/")) {
        extractedContent = await response.text()
      } else {
        return {
          content: "",
          error: "Unsupported content type. Only HTML, JSON, and text formats are supported.",
        }
      }

      if (!extractedContent || extractedContent.length < 100) {
        return {
          content: "",
          error: "Could not extract enough content from the URL. Please try another URL.",
        }
      }

      // Summarize the content to keep it within token limits
      return await summarizeUrlContent(extractedContent, formattedUrl)
    } catch (fetchError) {
      clearTimeout(timeoutId)
      console.error("Fetch error:", fetchError)
      if (fetchError.name === "AbortError") {
        return { content: "", error: "It took too long to load this page. Please try again or use a different source." }
      } else if (fetchError.message?.includes("ENOTFOUND")) {
        return { content: "", error: "We couldn't find this website. Please check the URL and try again." }
      } else {
        return { content: "", error: "We had trouble connecting to this source." }
      }
    }
  } catch (error) {
    console.error("Error processing reference URL:", error)
    return {
      content: "",
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

// Helper function to summarize the URL content
async function summarizeUrlContent(content: string, url: string): Promise<{ content: string; error?: string }> {
  try {
    // Limit content length to avoid token limits
    const truncatedContent = content.substring(0, 6000)

    const prompt = `
You are analyzing content from a URL to extract key information for content creation.

URL: ${url}

Content from the URL:
${truncatedContent}

Please extract and summarize the most important information from this content. Focus on:
1. Main topic and key points
2. Important facts, statistics, or data
3. Key arguments or perspectives
4. Relevant context that would be useful for content creation

Format your response as a concise summary (maximum 400 words) that highlights the most valuable information from this URL.
Do NOT include any commentary about the URL itself or the extraction process.
`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 800,
    })

    return { content: text.trim() }
  } catch (error) {
    console.error("Error summarizing URL content:", error)
    return {
      content: "",
      error: "Failed to summarize the URL content. Please try again later.",
    }
  }
}
