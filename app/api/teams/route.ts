import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all teams where user is a member
    const { data: teams, error } = await supabase
      .from("teams")
      .select(`
        *,
        team_members!inner(role),
        owner:users!teams_owner_id_fkey(name, email)
      `)
      .eq("team_members.user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching teams:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ teams: teams || [] })
  } catch (error: any) {
    console.error("[v0] Error in teams GET:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check user's subscription plan for team limits
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("subscription_tier")
      .eq("id", user.id)
      .single()

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 })
    }

    // Check current team count
    const { data: existingTeams, error: countError } = await supabase
      .from("team_members")
      .select("team_id")
      .eq("user_id", user.id)

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 })
    }

    const teamCount = existingTeams?.length || 0
    const plan = userData.subscription_tier || "free"

    // Enforce team limits based on plan
    if (plan === "free" && teamCount >= 1) {
      return NextResponse.json({ error: "Team limit reached for free plan" }, { status: 403 })
    }
    if (plan === "premium" && teamCount >= 3) {
      return NextResponse.json({ error: "Team limit reached for premium plan" }, { status: 403 })
    }

    const body = await request.json()
    const { name, description } = body

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Team name is required" }, { status: 400 })
    }

    // Create team
    const { data: team, error: createError } = await supabase
      .from("teams")
      .insert({
        name: name.trim(),
        description: description?.trim() || null,
        owner_id: user.id,
      })
      .select()
      .single()

    if (createError) {
      console.error("[v0] Error creating team:", createError)
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }

    // Add creator as owner in team_members
    const { error: memberError } = await supabase.from("team_members").insert({
      team_id: team.id,
      user_id: user.id,
      role: "owner",
    })

    if (memberError) {
      console.error("[v0] Error adding team member:", memberError)
      // Rollback - delete the team
      await supabase.from("teams").delete().eq("id", team.id)
      return NextResponse.json({ error: memberError.message }, { status: 500 })
    }

    return NextResponse.json({ team }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Error in teams POST:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
