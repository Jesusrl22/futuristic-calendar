import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const { data, error } = await supabase
      .from("users")
      .select("id, email, name, subscription_plan, subscription_expires_at, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[API] Error fetching users:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("[API] Fetched users:", data?.length || 0)

    return NextResponse.json({ users: data || [] })
  } catch (error) {
    console.error("[API] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId, updates } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    if (updates.subscription_tier) {
      // Rename subscription_tier to subscription_plan
      updates.subscription_plan = updates.subscription_tier
      updates.subscription_tier = updates.subscription_tier // Keep both for now

      const creditsMap = {
        free: 0,
        premium: 100,
        pro: 500,
      }
      updates.ai_credits = creditsMap[updates.subscription_plan as keyof typeof creditsMap] || 0
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    console.log("[API] Updating user with plan:", updates.subscription_plan, "and credits:", updates.ai_credits)

    const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select()

    if (error) {
      console.error("[API] Error updating user:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("[API] Updated user successfully")

    return NextResponse.json({ user: data?.[0] })
  } catch (error) {
    console.error("[API] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
