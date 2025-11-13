import { NextResponse } from "next/server"
import { cookies } from "next/headers"

function getUserIdFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.sub || null
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("sb-access-token")?.value

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getUserIdFromToken(accessToken)
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const headers = {
      apikey: process.env.SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    }

    const [tasksRes, completedRes, notesRes, pomodoroRes] = await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/tasks?user_id=eq.${userId}&select=*`, { headers }),
      fetch(`${supabaseUrl}/rest/v1/tasks?user_id=eq.${userId}&completed=eq.true&select=*`, { headers }),
      fetch(`${supabaseUrl}/rest/v1/notes?user_id=eq.${userId}&select=*`, { headers }),
      fetch(`${supabaseUrl}/rest/v1/pomodoro_sessions?user_id=eq.${userId}&completed=eq.true&select=*`, {
        headers,
      }),
    ])

    const tasks = tasksRes.ok ? await tasksRes.json() : []
    const completed = completedRes.ok ? await completedRes.json() : []
    const notes = notesRes.ok ? await notesRes.json() : []
    const pomodoro = pomodoroRes.ok ? await pomodoroRes.json() : []

    const totalFocusTime = pomodoro.reduce((sum: number, s: any) => sum + (s.duration || 0), 0) / 60

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay() + 1)

    const weekData = days.map((day, index) => {
      const dayDate = new Date(startOfWeek)
      dayDate.setDate(startOfWeek.getDate() + index)
      const dayStart = dayDate.toISOString().split("T")[0]

      const tasksForDay = completed.filter((t: any) => {
        const completedDate = t.updated_at?.split("T")[0]
        return completedDate === dayStart
      }).length

      const pomodoroForDay = pomodoro.filter((p: any) => {
        const sessionDate = p.created_at?.split("T")[0]
        return sessionDate === dayStart
      }).length

      return {
        name: day,
        tasks: tasksForDay,
        pomodoro: pomodoroForDay,
      }
    })

    return NextResponse.json({
      totalTasks: tasks.length,
      completedTasks: completed.length,
      totalNotes: notes.length,
      totalPomodoro: pomodoro.length,
      totalFocusTime: Math.round(totalFocusTime),
      weeklyData: weekData,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
