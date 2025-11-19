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
      startDate = new Date(now)
      startDate.setDate(now.getDate() - diff)
      startDate.setHours(0, 0, 0, 0)
      endDate = new Date(now)
      endDate.setHours(23, 59, 59, 999)
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
      endDate = new Date(now)
      endDate.setHours(23, 59, 59, 999)
    }
    
    const startDateISO = startDate.toISOString()
    const endDateISO = endDate.toISOString()

    const [allTasksRes, completedRes, notesRes, pomodoroRes] = await Promise.all([
      // All tasks (not just created in period) to calculate completion rate correctly
      fetch(`${supabaseUrl}/rest/v1/tasks?user_id=eq.${userId}&select=*`, { headers }),
      // Tasks completed in the period
      fetch(`${supabaseUrl}/rest/v1/tasks?user_id=eq.${userId}&completed=eq.true&updated_at=gte.${startDateISO}&updated_at=lte.${endDateISO}&select=*`, { headers }),
      // Notes created in the period
      fetch(`${supabaseUrl}/rest/v1/notes?user_id=eq.${userId}&created_at=gte.${startDateISO}&created_at=lte.${endDateISO}&select=*`, { headers }),
      // Pomodoro sessions completed in the period
      fetch(`${supabaseUrl}/rest/v1/pomodoro_sessions?user_id=eq.${userId}&created_at=gte.${startDateISO}&created_at=lte.${endDateISO}&select=*`, {
        headers,
      }),
    ])

    const allTasks = allTasksRes.ok ? await allTasksRes.json() : []
    const completed = completedRes.ok ? await completedRes.json() : []
    const notes = notesRes.ok ? await notesRes.json() : []
    const pomodoro = pomodoroRes.ok ? await pomodoroRes.json() : []

    const totalFocusTimeMinutes = pomodoro.reduce((sum: number, s: any) => sum + (s.duration || 0), 0)
    const totalFocusTimeHours = Math.round((totalFocusTimeMinutes / 60) * 10) / 10

    const tasksInPeriod = allTasks.filter((t: any) => {
      return t.created_at >= startDateISO && t.created_at <= endDateISO
    })

    let chartData: any[] = []
    
    if (range === "day") {
      for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, '0') + ":00"
        const hourStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), i)
        const hourEnd = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), i + 1)
        const hourStartISO = hourStart.toISOString()
        const hourEndISO = hourEnd.toISOString()
        
        const tasksForHour = completed.filter((t: any) => {
          return t.updated_at >= hourStartISO && t.updated_at < hourEndISO
        }).length
        
        const pomodoroForHour = pomodoro.filter((p: any) => {
          return p.created_at >= hourStartISO && p.created_at < hourEndISO
        }).length
        
        chartData.push({ name: hour, tasks: tasksForHour, pomodoro: pomodoroForHour })
      }
    } else if (range === "week") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      chartData = days.map((day, index) => {
        const dayDate = new Date(startDate)
        dayDate.setDate(startDate.getDate() + index)
        const dayStart = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), 0, 0, 0, 0)
        const dayEnd = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), 23, 59, 59, 999)
        const dayStartISO = dayStart.toISOString()
        const dayEndISO = dayEnd.toISOString()
        
        const tasksForDay = completed.filter((t: any) => {
          return t.updated_at >= dayStartISO && t.updated_at <= dayEndISO
        }).length

        const pomodoroForDay = pomodoro.filter((p: any) => {
          return p.created_at >= dayStartISO && p.created_at <= dayEndISO
        }).length

        return { name: day, tasks: tasksForDay, pomodoro: pomodoroForDay }
      })
    } else {
      const weeksInMonth = Math.ceil((endDate.getDate() + new Date(startDate.getFullYear(), startDate.getMonth(), 1).getDay()) / 7)
      for (let week = 0; week < weeksInMonth; week++) {
        const weekStart = new Date(startDate)
        weekStart.setDate(startDate.getDate() + (week * 7))
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        weekEnd.setHours(23, 59, 59, 999)
        const weekStartISO = weekStart.toISOString()
        const weekEndISO = weekEnd.toISOString()
        
        const tasksForWeek = completed.filter((t: any) => {
          return t.updated_at >= weekStartISO && t.updated_at <= weekEndISO
        }).length
        
        const pomodoroForWeek = pomodoro.filter((p: any) => {
          return p.created_at >= weekStartISO && p.created_at <= weekEndISO
        }).length
        
        chartData.push({ 
          name: `Week ${week + 1}`, 
          tasks: tasksForWeek, 
          pomodoro: pomodoroForWeek 
        })
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
