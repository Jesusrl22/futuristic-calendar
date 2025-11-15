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
          Authorization: `Bearer ${accessToken}`,
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
      },
    )

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

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
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

    const user = await userResponse.json()

    const updates: any = { updated_at: new Date().toISOString() }
    if (theme !== undefined) updates.theme = theme
    if (language !== undefined) updates.language = language
    if (notifications !== undefined) updates.notifications = notifications
    if (timezone !== undefined) updates.timezone = timezone
    if (pomodoro_work_duration !== undefined) updates.pomodoro_work_duration = pomodoro_work_duration
    if (pomodoro_break_duration !== undefined) updates.pomodoro_break_duration = pomodoro_break_duration
    if (pomodoro_long_break_duration !== undefined)
      updates.pomodoro_long_break_duration = pomodoro_long_break_duration

    await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users?id=eq.${user.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
