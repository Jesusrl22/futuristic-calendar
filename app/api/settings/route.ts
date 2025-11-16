import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("sb-access-token")?.value

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      },
    })

    if (!userResponse.ok) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const authUser = await userResponse.json()

    const profileResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users?id=eq.${authUser.id}&select=*`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        },
      },
    )

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text()
      console.error("[v0] Failed to fetch profile:", errorText)
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    const profile = await profileResponse.json()
    return NextResponse.json({ profile: profile[0], email: authUser.email })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("sb-access-token")?.value

    console.log("[v0] PATCH /api/settings - Starting save")

    if (!accessToken) {
      console.error("[v0] No access token found")
      return NextResponse.json({ error: "Unauthorized - No access token" }, { status: 401 })
    }

    const body = await request.json()
    console.log("[v0] Request body:", body)

    const {
      theme,
      language,
      notifications,
      timezone,
      pomodoro_work_duration,
      pomodoro_break_duration,
      pomodoro_long_break_duration,
    } = body

    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      },
    })

    if (!userResponse.ok) {
      const errorText = await userResponse.text()
      console.error("[v0] Failed to get user:", errorText)
      return NextResponse.json({ error: "Failed to authenticate", details: errorText }, { status: 401 })
    }

    const user = await userResponse.json()
    console.log("[v0] User ID:", user.id)

    const updates: any = { updated_at: new Date().toISOString() }
    if (theme !== undefined) updates.theme = theme
    if (language !== undefined) updates.language = language
    if (notifications !== undefined) updates.notifications = notifications
    if (timezone !== undefined) updates.timezone = timezone
    if (pomodoro_work_duration !== undefined) updates.pomodoro_work_duration = pomodoro_work_duration
    if (pomodoro_break_duration !== undefined) updates.pomodoro_break_duration = pomodoro_break_duration
    if (pomodoro_long_break_duration !== undefined)
      updates.pomodoro_long_break_duration = pomodoro_long_break_duration

    console.log("[v0] Updates to apply:", updates)

    const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users?id=eq.${user.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(updates),
    })

    console.log("[v0] Update response status:", updateResponse.status)

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      console.error("[v0] Failed to update settings. Status:", updateResponse.status, "Body:", errorText)
      return NextResponse.json(
        {
          error: "Failed to update settings",
          status: updateResponse.status,
          details: errorText,
        },
        { status: updateResponse.status },
      )
    }

    const updatedUser = await updateResponse.json()
    console.log("[v0] Settings updated successfully. User data:", updatedUser)

    return NextResponse.json({ success: true, user: updatedUser[0] || updatedUser })
  } catch (error: any) {
    console.error("[v0] Error updating settings:", error)
    return NextResponse.json(
      {
        error: "Failed to update settings",
        message: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
