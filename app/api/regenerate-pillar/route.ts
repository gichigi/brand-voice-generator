import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { pillarStatement } = await req.json()

    if (!pillarStatement) {
      return new NextResponse("Pillar Statement is required", { status: 400 })
    }

    const prompt = `
      You are an expert brand messaging consultant. You help companies refine their core messaging.

      I will provide you with a pillar statement. Your job is to regenerate the pillar statement, making it more clear, concise, and compelling.

      Pillar Statement: ${pillarStatement}
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    })

    const regeneratedPillar = completion.choices[0]?.message?.content

    if (!regeneratedPillar) {
      return new NextResponse("Failed to regenerate pillar statement", { status: 500 })
    }

    return NextResponse.json({ regeneratedPillar })
  } catch (error) {
    console.log("[REGENERATE_PILLAR_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
