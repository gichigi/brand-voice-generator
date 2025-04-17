"use server"

import OpenAI from "openai"

// Create OpenAI client directly
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function analyzeOnboardingWebsite(url: string): Promise<{ description: string; error?: string }> {
  try {
    // Validate URL
    let formattedUrl = url.trim()
    
    // Add protocol if missing
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl
    }
    
    try {
      new URL(formattedUrl)
    } catch (e) {
      return {
        description: "",
        error: "Invalid URL format. Please enter a valid website address.",
      }
    }
    
    console.log(`Attempting to analyze: ${formattedUrl}`)
    
    // Fetch the website content with timeout
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
      const textContent = extractTextFromHtml(html)

      if (!textContent || textContent.length < 100) {
        return {
          description: "",
          error: "Could not extract enough content from the website. Please try another URL or enter your description manually.",
        }
      }

      // Use OpenAI's direct client instead of the generateText function
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

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { 
            "role": "system", 
            "content": "You are a helpful assistant that analyzes website content and provides concise business descriptions."
          },
          { 
            "role": "user", 
            "content": prompt 
          }
        ],
        max_tokens: 200,
      })

      const generatedText = completion.choices[0]?.message.content || ""
      return { description: formatResponseText(generatedText.trim()) }
    } catch (fetchError) {
      clearTimeout(timeoutId)
      console.error("Fetch error:", fetchError)

      // Generate a fallback based on domain
      try {
        const domain = new URL(formattedUrl).hostname
        return await generateFallbackDescription(domain)
      } catch (e) {
        return {
          description: "",
          error: `Could not access the website. The website may be blocking our requests or is not accessible.`,
        }
      }
    }
  } catch (error) {
    console.error("Error in website analyzer:", error)
    return {
      description: "",
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

// Helper function to extract text from HTML
function extractTextFromHtml(html: string): string {
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

// Format response text
function formatResponseText(text: string): string {
  let formatted = text.replace(/\n\s*\n/g, "\n")
  formatted = formatted.replace(/\.(?=\S)/g, ". ")
  formatted = formatted.replace(
    /\. (However|Moreover|Furthermore|Additionally|In addition|Finally|Notably|At|The company|They|Their|With|This|These|Those)/g,
    ".\n\n$1",
  )
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

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          "role": "system", 
          "content": "You are a helpful assistant that analyzes domain names and creates plausible business descriptions."
        },
        { 
          "role": "user", 
          "content": prompt 
        }
      ],
      max_tokens: 200,
    })

    const generatedText = completion.choices[0]?.message.content || ""
    
    return {
      description: formatResponseText(generatedText.trim()),
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