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
      .single()

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

    const { token } = params

    const { data: invitation, error: inviteError } = await serviceSupabase
      .from("team_invitations")
      .select("*")
      .eq("token", token)
      .eq("status", "pending")
      .single()

    if (inviteError || !invitation) {
      return NextResponse.json({ error: "Invalid or expired invitation" }, { status: 404 })
    }

    // Check if expired
    if (new Date(invitation.expires_at) < new Date()) {
      return NextResponse.json({ error: "Invitation has expired" }, { status: 410 })
    }

    // Check if user email matches invitation email
    const { data: userData } = await supabase.from("users").select("email").eq("id", user.id).single()

    if (userData?.email?.toLowerCase() !== invitation.email.toLowerCase()) {
      return NextResponse.json({ error: "This invitation is for a different email address" }, { status: 403 })
    }

    const { data: member, error: memberError } = await serviceSupabase
      .from("team_members")
      .insert({
        team_id: invitation.team_id,
        user_id: user.id,
        role: invitation.role || "member",
      })
      .select()
      .single()

    if (memberError) {
      return NextResponse.json({ error: memberError.message }, { status: 500 })
    }

    await serviceSupabase.from("team_invitations").update({ status: "accepted" }).eq("id", invitation.id)

    return NextResponse.json({ member, teamId: invitation.team_id })
  } catch (error: any) {
    console.error("[v0] Error accepting invitation:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
