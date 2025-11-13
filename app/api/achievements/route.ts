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

    const user = await userResponse.json()

    const achievementsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/achievements?user_id=eq.${user.id}&select=*`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
      },
    )

    const [tasksResponse, notesResponse, pomodoroResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/tasks?user_id=eq.${user.id}&completed=eq.true&select=id`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Prefer: "count=exact",
        },
      }),
      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/notes?user_id=eq.${user.id}&select=id`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Prefer: "count=exact",
        },
      }),
      fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/pomodoro_sessions?user_id=eq.${user.id}&completed=eq.true&select=id`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Prefer: "count=exact",
          },
        },
      ),
    ])

    const achievements = await achievementsResponse.json()
    const tasksCount = Number.parseInt(tasksResponse.headers.get("content-range")?.split("/")[1] || "0")
    const notesCount = Number.parseInt(notesResponse.headers.get("content-range")?.split("/")[1] || "0")
    const pomodoroCount = Number.parseInt(pomodoroResponse.headers.get("content-range")?.split("/")[1] || "0")

    return NextResponse.json({
      achievements,
      stats: {
        tasks: tasksCount,
        notes: notesCount,
        pomodoro: pomodoroCount,
      },
    })
  } catch (error) {
    console.error("Error fetching achievements:", error)
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 })
  }
}
