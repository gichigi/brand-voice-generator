import OpenAI from "openai"

// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = "edge"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request): Promise<Response> {
  try {
    // Extract the prompt data from the body of the request.
    const { prompt, systemMessage, assistantMessage } = await req.json()

    if (!prompt) {
      return new Response("No prompt in the request", { status: 400 })
    }

    // Ask OpenAI for a streaming chat completion using messages format
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage || "You are a helpful content generator." },
        { role: "assistant", content: assistantMessage || "" },
        { role: "user", content: prompt },
      ],
      stream: true,
      temperature: 0.3,
    })

    // Create a ReadableStream from the OpenAI response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()

        // Process the stream from OpenAI
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || ""
          if (content) {
            controller.enqueue(encoder.encode(content))
          }
        }
        controller.close()
      },
    })

    // Return the stream with the appropriate headers
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    })
  } catch (e) {
    console.error(e)
    return new Response("Something went wrong. Please ensure you have the correct OpenAI environment variables set.", {
      status: 500,
    })
  }
}
