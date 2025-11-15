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
      .select("id, email, name, subscription_tier, subscription_expires_at, created_at")
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
      const creditsMap = {
        free: 10,
        premium: 100,
        pro: 500,
      }
      updates.ai_credits = creditsMap[updates.subscription_tier as keyof typeof creditsMap] || 10
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select()

    if (error) {
      console.error("[API] Error updating user:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("[API] Updated user with AI credits:", updates.ai_credits)

    return NextResponse.json({ user: data?.[0] })
  } catch (error) {
    console.error("[API] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
