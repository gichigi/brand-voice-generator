import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "@ai-sdk/openai"

// Set a longer timeout for this route
export const maxDuration = 60 // 60 seconds

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Your existing brand voice generation logic here
    const prompt = `You are an expert brand voice generator. You take a description of a company and generate a brand voice for them. The brand voice should be short, concise, and memorable. It should capture the essence of the company and its values. It should be no more than 2 sentences. Company description: ${data.prompt}` // Your existing prompt

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 1500,
    })

    // Process the response
    const brandVoice = text

    return NextResponse.json({ success: true, data: brandVoice })
  } catch (error) {
    console.error("Error generating brand voice:", error)
    return NextResponse.json(
      { success: false, error: error.message || "An unexpected error occurred" },
      { status: 500 },
    )
  }
}
