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
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

      const currentWeekStart = new Date(firstDayOfMonth)

      while (currentWeekStart.getDate() <= lastDayOfMonth) {
        const weekEnd = new Date(currentWeekStart)
        weekEnd.setDate(currentWeekStart.getDate() + 6)

        // Limit to last day of month
        if (weekEnd.getDate() > lastDayOfMonth || weekEnd.getMonth() !== now.getMonth()) {
          weekEnd.setDate(lastDayOfMonth)
        }
        weekEnd.setHours(23, 59, 59, 999)

        // Limit to current date for data collection
        const effectiveEnd = weekEnd > endDate ? endDate : weekEnd

        const tasksForWeek = 0 // Placeholder for completed tasks count
        const pomodoroForWeek = 0 // Placeholder for pomodoro count

        const startDay = currentWeekStart.getDate()
        const endDay = weekEnd.getDate()

        // Placeholder for chartData array
        const chartData: any[] = []

        chartData.push({
          name: `${startDay}-${endDay}`,
          tasks: tasksForWeek,
          pomodoro: pomodoroForWeek,
        })

        currentWeekStart.setDate(currentWeekStart.getDate() + 7)

        // Break if we've passed the last day of the month
        if (currentWeekStart.getDate() > lastDayOfMonth || currentWeekStart.getMonth() !== now.getMonth()) {
          break
        }
      }
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
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

      const currentWeekStart = new Date(firstDayOfMonth)

      while (currentWeekStart <= lastDayOfMonth) {
        const weekEnd = new Date(currentWeekStart)
        weekEnd.setDate(currentWeekStart.getDate() + 6)
        weekEnd.setHours(23, 59, 59, 999)

        const effectiveEnd = weekEnd > endDate ? endDate : weekEnd

        const tasksForWeek = completed.filter((t: any) => {
          const taskDate = new Date(t.updated_at)
          return taskDate >= currentWeekStart && taskDate <= effectiveEnd
        }).length

        const pomodoroForWeek = pomodoro.filter((p: any) => {
          const sessionDate = new Date(p.created_at)
          return sessionDate >= currentWeekStart && sessionDate <= effectiveEnd
        }).length

        const startDay = currentWeekStart.getDate()
        const endDay = effectiveEnd.getDate()

        chartData.push({
          name: `${startDay}-${endDay}`,
          tasks: tasksForWeek,
          pomodoro: pomodoroForWeek,
        })

        currentWeekStart.setDate(currentWeekStart.getDate() + 7)
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
