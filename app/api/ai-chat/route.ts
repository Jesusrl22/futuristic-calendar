import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check credits
    const { data: profile } = await supabase.from("users").select("ai_credits").eq("id", user.id).single()

    if (!profile || profile.ai_credits < 2) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
    }

    // Deduct credits
    await supabase
      .from("users")
      .update({ ai_credits: profile.ai_credits - 2 })
      .eq("id", user.id)

    // Generate AI response
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: message,
    })

    return NextResponse.json({
      response: text,
      remainingCredits: profile.ai_credits - 2,
    })
  } catch (error) {
    console.error("AI Chat Error:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
