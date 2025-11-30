import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Reset monthly credits based on subscription tier
    // Premium gets 100, Pro gets 500, Free gets 0
    const { data: premiumUsers } = await supabase
      .from("users")
      .select("id, ai_credits_purchased")
      .eq("subscription_tier", "premium")

    const { data: proUsers } = await supabase
      .from("users")
      .select("id, ai_credits_purchased")
      .eq("subscription_tier", "pro")

    let updatedCount = 0

    // Reset Premium users to 100 monthly credits
    if (premiumUsers && premiumUsers.length > 0) {
      for (const user of premiumUsers) {
        const totalCredits = 100 + (user.ai_credits_purchased || 0)
        await supabase
          .from("users")
          .update({
            ai_credits_monthly: 100,
            ai_credits: totalCredits,
          })
          .eq("id", user.id)
        updatedCount++
      }
    }

    // Reset Pro users to 500 monthly credits
    if (proUsers && proUsers.length > 0) {
      for (const user of proUsers) {
        const totalCredits = 500 + (user.ai_credits_purchased || 0)
        await supabase
          .from("users")
          .update({
            ai_credits_monthly: 500,
            ai_credits: totalCredits,
          })
          .eq("id", user.id)
        updatedCount++
      }
    }

    return NextResponse.json({
      message: "Successfully reset monthly credits",
      count: updatedCount,
    })
  } catch (error) {
    console.error("Error resetting monthly credits:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  return POST(request)
}
