import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { randomBytes } from "crypto"

export async function POST(request: Request, { params }: { params: { teamId: string } }) {
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
    const { email, role = "member" } = body

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

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

    // Check team member limits based on subscription
    const { data: teamData, error: teamError } = await supabase
      .from("teams")
      .select("owner_id, team_members(count)")
      .eq("id", teamId)
      .single()

    if (teamError) {
      return NextResponse.json({ error: teamError.message }, { status: 500 })
    }

    const { data: ownerData, error: ownerError } = await supabase
      .from("users")
      .select("subscription_tier")
      .eq("id", teamData.owner_id)
      .single()

    if (ownerError) {
      return NextResponse.json({ error: ownerError.message }, { status: 500 })
    }

    const memberCount = teamData.team_members?.[0]?.count || 0
    const plan = ownerData.subscription_tier || "free"

    if (plan === "free" && memberCount >= 3) {
      return NextResponse.json({ error: "Member limit reached for free plan" }, { status: 403 })
    }
    if (plan === "premium" && memberCount >= 10) {
      return NextResponse.json({ error: "Member limit reached for premium plan" }, { status: 403 })
    }

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from("team_members")
      .select("id")
      .eq("team_id", teamId)
      .eq("user_id", user.id)
      .single()

    if (existingMember) {
      return NextResponse.json({ error: "User is already a team member" }, { status: 400 })
    }

    // Check for pending invitation
    const { data: existingInvite } = await supabase
      .from("team_invitations")
      .select("id")
      .eq("team_id", teamId)
      .eq("email", email.toLowerCase())
      .eq("status", "pending")
      .single()

    if (existingInvite) {
      return NextResponse.json({ error: "Invitation already sent to this email" }, { status: 400 })
    }

    // Generate invitation token
    const token = randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    // Create invitation
    const { data: invitation, error: inviteError } = await supabase
      .from("team_invitations")
      .insert({
        team_id: teamId,
        email: email.toLowerCase(),
        invited_by: user.id,
        token,
        role,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single()

    if (inviteError) {
      return NextResponse.json({ error: inviteError.message }, { status: 500 })
    }

    const { data: teamInfo } = await supabase.from("teams").select("name").eq("id", teamId).single()

    const { data: inviterInfo } = await supabase.from("users").select("name, email").eq("id", user.id).single()

    const teamName = teamInfo?.name || "a team"
    const inviterName = inviterInfo?.name || inviterInfo?.email || "Someone"

    try {
      const { sendTeamInvitationEmail } = await import("@/lib/email")
      await sendTeamInvitationEmail(email, token, teamName, inviterName)
    } catch (emailError) {
      console.error("[v0] Error sending invitation email:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ invitation }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Error in team invite POST:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
