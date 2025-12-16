import { NextResponse } from "next/server"
import { createServerClient, createServiceRoleClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { token: string } }) {
  try {
    const supabase = await createServiceRoleClient()
    const { token } = params

    const { data: invitation, error } = await supabase
      .from("team_invitations")
      .select(`
        *,
        teams(name, description),
        users:invited_by(name, email)
      `)
      .eq("token", token)
      .eq("status", "pending")
      .maybeSingle()

    if (error || !invitation) {
      return NextResponse.json({ error: "Invalid or expired invitation" }, { status: 404 })
    }

    // Check if expired
    if (new Date(invitation.expires_at) < new Date()) {
      return NextResponse.json({ error: "Invitation has expired" }, { status: 410 })
    }

    return NextResponse.json({ invitation })
  } catch (error: any) {
    console.error("[v0] Error in invitation GET:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { token: string } }) {
  try {
    const supabase = await createServerClient()
    const serviceSupabase = await createServiceRoleClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] User accepting invitation:", user.id, user.email)

    const { token } = params

    const { data: invitation, error: inviteError } = await serviceSupabase
      .from("team_invitations")
      .select("*")
      .eq("token", token)
      .eq("status", "pending")
      .maybeSingle()

    if (inviteError || !invitation) {
      console.log("[v0] Invitation not found or error:", inviteError)
      return NextResponse.json({ error: "Invalid or expired invitation" }, { status: 404 })
    }

    console.log("[v0] Found invitation:", invitation.id, "team:", invitation.team_id)

    // Check if expired
    if (new Date(invitation.expires_at) < new Date()) {
      console.log("[v0] Invitation expired")
      return NextResponse.json({ error: "Invitation has expired" }, { status: 410 })
    }

    // Check if already a member
    const { data: existingMember } = await serviceSupabase
      .from("team_members")
      .select("id")
      .eq("team_id", invitation.team_id)
      .eq("user_id", user.id)
      .maybeSingle()

    if (existingMember) {
      console.log("[v0] User is already a member of this team")
      return NextResponse.json({ error: "You are already a member of this team", teamId: invitation.team_id })
    }

    console.log("[v0] Inserting team member:", {
      team_id: invitation.team_id,
      user_id: user.id,
      role: invitation.role || "member",
    })

    const { data: member, error: memberError } = await serviceSupabase
      .from("team_members")
      .insert({
        team_id: invitation.team_id,
        user_id: user.id,
        role: invitation.role || "member",
      })
      .select()
      .maybeSingle()

    if (memberError) {
      console.error("[v0] Error adding team member:", memberError)
      return NextResponse.json({ error: `Failed to add member: ${memberError.message}` }, { status: 500 })
    }

    console.log("[v0] Successfully added team member:", member)

    const { error: updateError } = await serviceSupabase
      .from("team_invitations")
      .update({ status: "accepted" })
      .eq("id", invitation.id)

    if (updateError) {
      console.error("[v0] Error updating invitation status:", updateError)
    }

    console.log("[v0] Successfully accepted invitation")
    return NextResponse.json({ member, teamId: invitation.team_id })
  } catch (error: any) {
    console.error("[v0] Error accepting invitation:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
