"use server"

import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function testOpenAI() {
  try {
    // Check if API key is set
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return {
        success: false,
        message: "OpenAI API key is not configured",
        error: "OPENAI_API_KEY environment variable is not set",
      }
    }

    // Simple test prompt
    const prompt = "Respond with a simple 'Hello, I am working!' message to confirm the API is functioning."

    console.log("Making test request to OpenAI API...")

    // Make the API call
    const startTime = Date.now()
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 50,
    })
    const endTime = Date.now()

    console.log("OpenAI API response received:", text)

    return {
      success: true,
      message: `OpenAI API is working! Response time: ${endTime - startTime}ms`,
      data: {
        response: text,
        model: "gpt-4o",
        responseTime: `${endTime - startTime}ms`,
      },
    }
  } catch (error) {
    console.error("OpenAI API test failed:", error)

    return {
      success: false,
      message: "Failed to connect to OpenAI API",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
