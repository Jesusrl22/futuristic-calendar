import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const supabase = createServerClient()

  // Get current user
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  // Get user data from database with ALL plan-related columns
  const { data: user, error } = await supabase
    .from("users")
    .select(
      "id, email, subscription_plan, subscription_tier, plan, ai_credits_monthly, ai_credits_purchased, subscription_expires_at",
    )
    .eq("id", authUser.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    message: "User plan diagnostic",
    user: {
      id: user.id,
      email: user.email,
      subscription_plan: user.subscription_plan,
      subscription_tier: user.subscription_tier,
      plan: user.plan,
      ai_credits_monthly: user.ai_credits_monthly,
      ai_credits_purchased: user.ai_credits_purchased,
      subscription_expires_at: user.subscription_expires_at,
    },
    interpretation: {
      expected_credits_for_free: 0,
      expected_credits_for_premium: 100,
      expected_credits_for_pro: 500,
      current_total_credits: (user.ai_credits_monthly || 0) + (user.ai_credits_purchased || 0),
    },
  })
}
