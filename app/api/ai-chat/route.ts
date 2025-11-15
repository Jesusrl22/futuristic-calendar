import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { cookies } from "next/headers"

function getUserIdFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.sub || null
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    const cookieStore = await cookies()
    const accessToken = cookieStore.get("sb-access-token")?.value

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getUserIdFromToken(accessToken)
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const headers = {
      apikey: process.env.SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    }

    const profileRes = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${userId}&select=ai_credits,subscription_tier`, {
      headers,
    })

    if (!profileRes.ok) {
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    const profiles = await profileRes.json()
    const profile = profiles[0]

    if (!profile || profile.ai_credits < 2) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
    }

    await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${userId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ ai_credits: profile.ai_credits - 2 }),
    })

    const { text } = await generateText({
      model: "openai/gpt-4o",
      prompt: message,
    })

    return NextResponse.json({
      response: text,
      remainingCredits: profile.ai_credits - 2,
    })
  } catch (error) {
    console.error("[v0] AI Chat Error:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
