import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, plan, billingCycle } = body

    console.log("💾 Updating subscription:", { userId, plan, billingCycle })

    if (!userId || !plan) {
      return NextResponse.json({ error: "userId and plan are required" }, { status: 400 })
    }

    const updateData: any = {
      subscription_tier: plan,
      subscription_status: "active",
      billing_cycle: billingCycle || "monthly",
      updated_at: new Date().toISOString(),
    }

    if (plan === "pro") {
      updateData.ai_credits = 500
    } else if (plan === "premium") {
      updateData.ai_credits = 0
    } else {
      updateData.ai_credits = 0
    }

    console.log("💾 Update data:", updateData)

    const { data, error } = await supabase.from("users").update(updateData).eq("id", userId).select()

    if (error) {
      console.error("❌ Supabase error:", error)
      return NextResponse.json({ error: error.message, details: error.details }, { status: 500 })
    }

    console.log("✅ Subscription updated successfully:", data)

    return NextResponse.json({
      success: true,
      message: "Subscription updated successfully",
      data: data?.[0],
    })
  } catch (error: any) {
    console.error("❌ Error in subscription update:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
