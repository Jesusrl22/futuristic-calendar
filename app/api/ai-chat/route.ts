import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { cookies } from "next/headers"
import { rateLimit } from "@/lib/redis"

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

    const rateLimitResult = await rateLimit(userId, "aiChat")

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Too many AI requests",
          message: "You're sending messages too quickly. Please wait a moment.",
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
        },
        { status: 429 },
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const headers = {
      apikey: process.env.SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    }

    const profileRes = await fetch(
      `${supabaseUrl}/rest/v1/users?id=eq.${userId}&select=ai_credits,ai_credits_monthly,ai_credits_purchased,subscription_tier`,
      { headers },
    )

    if (!profileRes.ok) {
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    const profiles = await profileRes.json()
    const profile = profiles[0]

    const monthlyCredits = profile.ai_credits_monthly || 0
    const purchasedCredits = profile.ai_credits_purchased || 0
    const totalCredits = monthlyCredits + purchasedCredits

    if (!profile || totalCredits < 2) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
    }

    let newMonthlyCredits = monthlyCredits
    let newPurchasedCredits = purchasedCredits

    if (monthlyCredits >= 2) {
      newMonthlyCredits -= 2
    } else if (monthlyCredits > 0) {
      const remaining = 2 - monthlyCredits
      newMonthlyCredits = 0
      newPurchasedCredits -= remaining
    } else {
      newPurchasedCredits -= 2
    }

    const newTotalCredits = newMonthlyCredits + newPurchasedCredits

    await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${userId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        ai_credits_monthly: newMonthlyCredits,
        ai_credits_purchased: newPurchasedCredits,
        ai_credits: newTotalCredits,
      }),
    })

    const { text } = await generateText({
      model: "openai/gpt-4o",
      prompt: message,
    })

    return NextResponse.json({
      response: text,
      remainingCredits: newTotalCredits,
      remainingMonthlyCredits: newMonthlyCredits,
      remainingPurchasedCredits: newPurchasedCredits,
    })
  } catch (error) {
    console.error("[v0] AI Chat Error:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
