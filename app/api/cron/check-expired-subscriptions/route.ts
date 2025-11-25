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

    const now = new Date().toISOString()
    const { data: expiredUsers, error: fetchError } = await supabase
      .from("users")
      .select("id, email, name, subscription_tier, subscription_expires_at")
      .not("subscription_expires_at", "is", null)
      .lt("subscription_expires_at", now)
      .neq("subscription_tier", "free")

    if (fetchError) {
      console.error("Error fetching expired users:", fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    if (!expiredUsers || expiredUsers.length === 0) {
      return NextResponse.json({
        message: "No expired subscriptions found",
        count: 0,
      })
    }

    const userIds = expiredUsers.map((u) => u.id)
    const { data: updatedUsers, error: updateError } = await supabase
      .from("users")
      .update({
        subscription_tier: "free",
        subscription_plan: "free",
        plan: "free",
        ai_credits: 10,
        subscription_expires_at: null,
      })
      .in("id", userIds)
      .select()

    if (updateError) {
      console.error("Error downgrading users:", updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Successfully processed expired subscriptions",
      count: updatedUsers?.length || 0,
      users: updatedUsers?.map((u) => ({ id: u.id, email: u.email, name: u.name })),
    })
  } catch (error) {
    console.error("Unexpected error in cron job:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  return POST(request)
}
