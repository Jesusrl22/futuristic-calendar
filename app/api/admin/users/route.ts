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

    const { data: users, error } = await supabase
      .from("users")
      .select(
        "id, email, name, subscription_tier, subscription_expires_at, created_at, ai_credits_monthly, ai_credits_purchased",
      )
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] GET users error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("[v0] Fetched users from DB:", users?.length)

    const usersWithStats = await Promise.all(
      (users || []).map(async (user) => {
        const { count: tasksCount } = await supabase
          .from("tasks")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)

        const { count: notesCount } = await supabase
          .from("notes")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)

        const { count: pomodorosCount } = await supabase
          .from("pomodoro_sessions")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)

        const initialCredits = {
          free: 0,
          premium: 100,
          pro: 500,
        }
        const planCredits = initialCredits[(user.subscription_tier || "free") as keyof typeof initialCredits] || 0
        const monthlyCredits = user.ai_credits_monthly || 0
        const purchasedCredits = user.ai_credits_purchased || 0
        const totalCredits = monthlyCredits + purchasedCredits
        const creditsUsed = planCredits > 0 ? planCredits - monthlyCredits : 0

        return {
          ...user,
          subscription_plan: user.subscription_tier, // Map subscription_tier to subscription_plan for backwards compatibility
          stats: {
            tasks: tasksCount || 0,
            notes: notesCount || 0,
            pomodoros: pomodorosCount || 0,
            creditsUsed: creditsUsed,
            creditsRemaining: totalCredits,
          },
        }
      }),
    )

    console.log("[v0] Returning users with stats:", usersWithStats[0])
    return NextResponse.json({ users: usersWithStats })
  } catch (error) {
    console.error("[v0] GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId, updates } = await request.json()

    console.log("[v0] Admin API PATCH received:", { userId, updates })

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    if (updates.subscription_tier) {
      const planName = updates.subscription_tier.toLowerCase()

      const creditsMap = {
        free: 0,
        premium: 100,
        pro: 500,
      }

      updates.subscription_plan = planName
      updates.subscription_tier = planName
      updates.plan = planName
      updates.ai_credits_monthly = creditsMap[planName as keyof typeof creditsMap] || 0
      updates.last_credit_reset = new Date().toISOString()

      if (!updates.subscription_expires_at) {
        updates.subscription_expires_at = null
      }

      console.log("[v0] Final updates to apply:", updates)

      // Keep ai_credits_purchased unchanged (don't include it in updates)
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select()

    if (error) {
      console.error("[v0] Supabase update error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("[v0] User updated successfully:", data?.[0])

    return NextResponse.json({ user: data?.[0] })
  } catch (error) {
    console.error("[v0] PATCH error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const { error } = await supabase.from("users").delete().eq("id", userId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "User deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
