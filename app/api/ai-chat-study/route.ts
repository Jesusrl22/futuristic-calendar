import { type NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })

    const response = await groq.messages.create({
      model: "mixtral-8x7b-32768",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      system:
        "You are a helpful study assistant. Provide clear, educational explanations. Help users understand concepts, create study plans, quiz them on topics, and give learning advice. Keep responses concise but informative.",
    })

    const text = response.content[0].type === "text" ? response.content[0].text : "Unable to generate response"

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
