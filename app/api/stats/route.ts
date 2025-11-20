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

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url)
    const range = searchParams.get("range") || "week"

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const headers = {
      apikey: process.env.SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    }

    const now = new Date()
    let startDate: Date
    let endDate: Date

    if (range === "day") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
    } else if (range === "week") {
      const dayOfWeek = now.getDay()
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff, 0, 0, 0, 0)
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    }

    const [tasksInPeriodRes, completedRes, notesRes, pomodoroRes] = await Promise.all([
      fetch(
        `${supabaseUrl}/rest/v1/tasks?user_id=eq.${userId}&created_at=gte.${startDate.toISOString()}&created_at=lte.${endDate.toISOString()}&select=*`,
        { headers },
      ),
      fetch(
        `${supabaseUrl}/rest/v1/tasks?user_id=eq.${userId}&completed=eq.true&updated_at=gte.${startDate.toISOString()}&updated_at=lte.${endDate.toISOString()}&select=*`,
        { headers },
      ),
      fetch(
        `${supabaseUrl}/rest/v1/notes?user_id=eq.${userId}&created_at=gte.${startDate.toISOString()}&created_at=lte.${endDate.toISOString()}&select=*`,
        { headers },
      ),
      fetch(
        `${supabaseUrl}/rest/v1/pomodoro_sessions?user_id=eq.${userId}&created_at=gte.${startDate.toISOString()}&created_at=lte.${endDate.toISOString()}&select=*`,
        { headers },
      ),
    ])

    const tasksInPeriod = tasksInPeriodRes.ok ? await tasksInPeriodRes.json() : []
    const completed = completedRes.ok ? await completedRes.json() : []
    const notes = notesRes.ok ? await notesRes.json() : []
    const pomodoro = pomodoroRes.ok ? await pomodoroRes.json() : []

    const totalFocusTimeMinutes = pomodoro.reduce((sum: number, s: any) => sum + (s.duration || 0), 0)
    const totalFocusTimeHours = Math.round((totalFocusTimeMinutes / 60) * 10) / 10

    const chartData: any[] = []

    if (range === "day") {
      for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, "0") + ":00"
        const hourStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), i, 0, 0, 0)
        const hourEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), i, 59, 59, 999)

        const tasksForHour = completed.filter((t: any) => {
          const taskDate = new Date(t.updated_at)
          return taskDate >= hourStart && taskDate <= hourEnd
        }).length

        const pomodoroForHour = pomodoro.filter((p: any) => {
          const sessionDate = new Date(p.created_at)
          return sessionDate >= hourStart && sessionDate <= hourEnd
        }).length

        chartData.push({ name: hour, tasks: tasksForHour, pomodoro: pomodoroForHour })
      }
    } else if (range === "week") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      for (let i = 0; i < 7; i++) {
        const dayDate = new Date(startDate)
        dayDate.setDate(startDate.getDate() + i)
        const dayStart = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), 0, 0, 0, 0)
        const dayEnd = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), 23, 59, 59, 999)

        const tasksForDay = completed.filter((t: any) => {
          const taskDate = new Date(t.updated_at)
          return taskDate >= dayStart && taskDate <= dayEnd
        }).length

        const pomodoroForDay = pomodoro.filter((p: any) => {
          const sessionDate = new Date(p.created_at)
          return sessionDate >= dayStart && sessionDate <= dayEnd
        }).length

        chartData.push({ name: days[i], tasks: tasksForDay, pomodoro: pomodoroForDay })
      }
    } else {
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

      let currentWeekStart = 1

      while (currentWeekStart <= lastDayOfMonth) {
        const weekStartDate = new Date(now.getFullYear(), now.getMonth(), currentWeekStart, 0, 0, 0, 0)
        const weekEndDay = Math.min(currentWeekStart + 6, lastDayOfMonth)
        const weekEndDate = new Date(now.getFullYear(), now.getMonth(), weekEndDay, 23, 59, 59, 999)

        const tasksForWeek = completed.filter((t: any) => {
          const taskDate = new Date(t.updated_at)
          return taskDate >= weekStartDate && taskDate <= weekEndDate
        }).length

        const pomodoroForWeek = pomodoro.filter((p: any) => {
          const sessionDate = new Date(p.created_at)
          return sessionDate >= weekStartDate && sessionDate <= weekEndDate
        }).length

        chartData.push({
          name: `${currentWeekStart}-${weekEndDay}`,
          tasks: tasksForWeek,
          pomodoro: pomodoroForWeek,
        })

        currentWeekStart += 7
      }
    }

    return NextResponse.json({
      totalTasks: tasksInPeriod.length,
      completedTasks: completed.length,
      totalNotes: notes.length,
      totalPomodoro: pomodoro.length,
      totalFocusTime: totalFocusTimeHours,
      chartData,
    })
  } catch (error) {
    console.error("[v0] Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
