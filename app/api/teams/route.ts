import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get team IDs where user is a member
    const { data: memberships, error: memberError } = await supabase
      .from("team_members")
      .select("team_id, role")
      .eq("user_id", user.id)

    if (memberError) {
      console.error("[v0] Error fetching memberships:", memberError)
      return NextResponse.json({ error: memberError.message }, { status: 500 })
    }

    if (!memberships || memberships.length === 0) {
      return NextResponse.json({ teams: [] })
    }

    const teamIds = memberships.map((m) => m.team_id)

    // Get teams details
    const { data: teams, error: teamsError } = await supabase
      .from("teams")
      .select("*")
      .in("id", teamIds)
      .order("created_at", { ascending: false })

    if (teamsError) {
      console.error("[v0] Error fetching teams:", teamsError)
      return NextResponse.json({ error: teamsError.message }, { status: 500 })
    }

    // Get member counts for each team
    const teamsWithCounts = await Promise.all(
      teams.map(async (team) => {
        const { count } = await supabase
          .from("team_members")
          .select("*", { count: "exact", head: true })
          .eq("team_id", team.id)

        const membership = memberships.find((m) => m.team_id === team.id)

        return {
          ...team,
          role: membership?.role || "member",
          member_count: count || 0,
        }
      }),
    )

    return NextResponse.json({ teams: teamsWithCounts })
  } catch (error: any) {
    console.error("[v0] Error in teams GET:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()

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
