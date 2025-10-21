import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    const { data: user, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error fetching user:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      subscription_tier: user.subscription_tier || "free",
      billing_cycle: user.billing_cycle || "monthly",
      subscription_status: user.subscription_status || "active",
      ai_credits: user.ai_credits || 0,
      created_at: user.created_at,
      updated_at: user.updated_at,
    })
  } catch (error: any) {
    console.error("Error in subscription API:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
