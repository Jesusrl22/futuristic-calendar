import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { teamId: string } }) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { teamId } = params

    const { data: team, error: teamError } = await supabase.from("teams").select("*").eq("id", teamId).single()

    if (teamError) {
      return NextResponse.json({ error: teamError.message }, { status: 404 })
    }

    // Get user's membership
    const { data: membership, error: memberError } = await supabase
      .from("team_members")
      .select("role")
      .eq("team_id", teamId)
      .eq("user_id", user.id)
      .single()

    if (memberError || !membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get all team members with user details
    const { data: members, error: membersError } = await supabase
      .from("team_members")
      .select(`
        id,
        role,
        joined_at,
        users (id, name, email)
      `)
      .eq("team_id", teamId)

    if (membersError) {
      console.error("[v0] Error fetching members:", membersError)
    }

    return NextResponse.json({
      ...team,
      role: membership.role,
      members: members || [],
    })
  } catch (error: any) {
    console.error("[v0] Error in team GET:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { teamId: string } }) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { teamId } = params
    const body = await request.json()
    const { name, description } = body

    // Check if user is owner or admin
    const { data: membership, error: memberError } = await supabase
      .from("team_members")
      .select("role")
      .eq("team_id", teamId)
      .eq("user_id", user.id)
      .single()

    if (memberError || !membership || !["owner", "admin"].includes(membership.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Update team
    const { data: team, error: updateError } = await supabase
      .from("teams")
      .update({
        name: name?.trim(),
        description: description?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", teamId)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ team })
  } catch (error: any) {
    console.error("[v0] Error in team PATCH:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { teamId: string } }) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { teamId } = params

    // Check if user is owner
    const { data: team, error: teamError } = await supabase.from("teams").select("owner_id").eq("id", teamId).single()

    if (teamError || !team || team.owner_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete team (cascade will handle members, tasks, etc.)
    const { error: deleteError } = await supabase.from("teams").delete().eq("id", teamId)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Error in team DELETE:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
