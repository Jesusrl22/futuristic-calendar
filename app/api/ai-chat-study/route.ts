import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: "groq/mixtral-8x7b-32768",
      prompt: message,
      system:
        "You are a helpful study assistant. Provide clear, educational explanations. Keep responses concise but informative.",
    })

    return NextResponse.json({
      response: text,
      message: text,
    })
  } catch (error) {
    console.error("[v0] Study AI Error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate response",
        message: "Sorry, I couldn't generate a response. Please try again.",
      },
      { status: 500 },
    )
  }
}
