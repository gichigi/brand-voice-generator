import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { url } = await req.json()

    if (!url) {
      return new NextResponse("URL is required", { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return new NextResponse("OPENAI_API_KEY is not set", { status: 500 })
    }

    const response = await fetch(url)
    const html = await response.text()

    const prompt = `Analyze the following HTML content and extract key information, including the main topic, target audience, and overall sentiment. Provide a concise summary of the website's purpose and effectiveness.
    
    HTML Content:
    ${html}
    
    Analysis:`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    })

    return NextResponse.json({ analysis: completion.choices[0].message.content })
  } catch (error: any) {
    console.error("[ANALYZE_WEBSITE_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
