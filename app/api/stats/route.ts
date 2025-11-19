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
      // Today from 00:00:00 to 23:59:59 in UTC
      startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0))
      endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999))
    } else if (range === "week") {
      // Monday to today in UTC
      const dayOfWeek = now.getUTCDay()
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Monday = 0
      startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - diff, 0, 0, 0, 0))
      endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999))
    } else {
      // First day of month to today in UTC
      startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0))
      endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999))
    }
    
    const startDateISO = startDate.toISOString()
    const endDateISO = endDate.toISOString()

    const [tasksInPeriodRes, completedRes, notesRes, pomodoroRes] = await Promise.all([
      // Tasks created in the period
      fetch(`${supabaseUrl}/rest/v1/tasks?user_id=eq.${userId}&created_at=gte.${startDateISO}&created_at=lte.${endDateISO}&select=*`, { headers }),
      // Tasks completed in the period
      fetch(`${supabaseUrl}/rest/v1/tasks?user_id=eq.${userId}&completed=eq.true&updated_at=gte.${startDateISO}&updated_at=lte.${endDateISO}&select=*`, { headers }),
      // Notes created in the period
      fetch(`${supabaseUrl}/rest/v1/notes?user_id=eq.${userId}&created_at=gte.${startDateISO}&created_at=lte.${endDateISO}&select=*`, { headers }),
      // Pomodoro sessions completed in the period
      fetch(`${supabaseUrl}/rest/v1/pomodoro_sessions?user_id=eq.${userId}&created_at=gte.${startDateISO}&created_at=lte.${endDateISO}&select=*`, {
        headers,
      }),
    ])

    const tasksInPeriod = tasksInPeriodRes.ok ? await tasksInPeriodRes.json() : []
    const completed = completedRes.ok ? await completedRes.json() : []
    const notes = notesRes.ok ? await notesRes.json() : []
    const pomodoro = pomodoroRes.ok ? await pomodoroRes.json() : []

    const totalFocusTimeMinutes = pomodoro.reduce((sum: number, s: any) => sum + (s.duration || 0), 0)
    const totalFocusTimeHours = Math.round((totalFocusTimeMinutes / 60) * 10) / 10

    let chartData: any[] = []
    
    if (range === "day") {
      for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, '0') + ":00"
        const hourStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), i, 0, 0, 0))
        const hourEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), i, 59, 59, 999))
        const hourStartISO = hourStart.toISOString()
        const hourEndISO = hourEnd.toISOString()
        
        const tasksForHour = completed.filter((t: any) => {
          return t.updated_at >= hourStartISO && t.updated_at <= hourEndISO
        }).length
        
        const pomodoroForHour = pomodoro.filter((p: any) => {
          return p.created_at >= hourStartISO && p.created_at <= hourEndISO
        }).length
        
        chartData.push({ name: hour, tasks: tasksForHour, pomodoro: pomodoroForHour })
      }
    } else if (range === "week") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      for (let i = 0; i < 7; i++) {
        const dayDate = new Date(startDate)
        dayDate.setUTCDate(startDate.getUTCDate() + i)
        const dayStart = new Date(Date.UTC(dayDate.getUTCFullYear(), dayDate.getUTCMonth(), dayDate.getUTCDate(), 0, 0, 0, 0))
        const dayEnd = new Date(Date.UTC(dayDate.getUTCFullYear(), dayDate.getUTCMonth(), dayDate.getUTCDate(), 23, 59, 59, 999))
        const dayStartISO = dayStart.toISOString()
        const dayEndISO = dayEnd.toISOString()
        
        const tasksForDay = completed.filter((t: any) => {
          return t.updated_at >= dayStartISO && t.updated_at <= dayEndISO
        }).length

        const pomodoroForDay = pomodoro.filter((p: any) => {
          return p.created_at >= dayStartISO && p.created_at <= dayEndISO
        }).length

        chartData.push({ name: days[i], tasks: tasksForDay, pomodoro: pomodoroForDay })
      }
    } else {
      const firstDayOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
      const lastDayOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999))
      
      let currentWeekStart = new Date(firstDayOfMonth)
      let weekNumber = 1
      
      while (currentWeekStart <= lastDayOfMonth) {
        const weekEnd = new Date(currentWeekStart)
        weekEnd.setUTCDate(currentWeekStart.getUTCDate() + 6)
        weekEnd.setUTCHours(23, 59, 59, 999)
        
        // Don't go past end of month or today
        const effectiveEnd = weekEnd > lastDayOfMonth ? lastDayOfMonth : (weekEnd > endDate ? endDate : weekEnd)
        
        const weekStartISO = currentWeekStart.toISOString()
        const weekEndISO = effectiveEnd.toISOString()
        
        const tasksForWeek = completed.filter((t: any) => {
          return t.updated_at >= weekStartISO && t.updated_at <= weekEndISO
        }).length
        
        const pomodoroForWeek = pomodoro.filter((p: any) => {
          return p.created_at >= weekStartISO && p.created_at <= weekEndISO
        }).length
        
        chartData.push({ 
          name: `Week ${weekNumber}`, 
          tasks: tasksForWeek, 
          pomodoro: pomodoroForWeek 
        })
        
        currentWeekStart.setUTCDate(currentWeekStart.getUTCDate() + 7)
        weekNumber++
        
        // Stop if we've passed today
        if (currentWeekStart > endDate) break
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
