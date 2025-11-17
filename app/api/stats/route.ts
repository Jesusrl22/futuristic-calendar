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
    let endDate: Date = now
    
    if (range === "day") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
    } else if (range === "week") {
      const dayOfWeek = now.getDay()
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1
      startDate = new Date(now)
      startDate.setDate(now.getDate() - diff)
      startDate.setHours(0, 0, 0, 0)
      endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 6)
      endDate.setHours(23, 59, 59, 999)
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    }
    
    const startDateISO = startDate.toISOString()
    const endDateISO = endDate.toISOString()

    console.log("[v0] Stats range:", range, "from", startDateISO, "to", endDateISO)

    const [allTasksRes, completedRes, notesRes, pomodoroRes] = await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/tasks?user_id=eq.${userId}&created_at=gte.${startDateISO}&created_at=lte.${endDateISO}&select=*`, { headers }),
      fetch(`${supabaseUrl}/rest/v1/tasks?user_id=eq.${userId}&completed=eq.true&updated_at=gte.${startDateISO}&updated_at=lte.${endDateISO}&select=*`, { headers }),
      fetch(`${supabaseUrl}/rest/v1/notes?user_id=eq.${userId}&created_at=gte.${startDateISO}&created_at=lte.${endDateISO}&select=*`, { headers }),
      fetch(`${supabaseUrl}/rest/v1/pomodoro_sessions?user_id=eq.${userId}&completed=eq.true&created_at=gte.${startDateISO}&created_at=lte.${endDateISO}&select=*`, {
        headers,
      }),
    ])

    const allTasks = allTasksRes.ok ? await allTasksRes.json() : []
    const completed = completedRes.ok ? await completedRes.json() : []
    const notes = notesRes.ok ? await notesRes.json() : []
    const pomodoro = pomodoroRes.ok ? await pomodoroRes.json() : []

    console.log("[v0] Stats data:", { allTasks: allTasks.length, completed: completed.length, notes: notes.length, pomodoro: pomodoro.length })

    const totalFocusTimeMinutes = pomodoro.reduce((sum: number, s: any) => sum + (s.duration || 0), 0)
    const totalFocusTimeHours = Math.round((totalFocusTimeMinutes / 60) * 10) / 10

    let chartData: any[] = []
    
    if (range === "day") {
      for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, '0') + ":00"
        const hourStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), i)
        const hourEnd = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), i + 1)
        
        const tasksForHour = completed.filter((t: any) => {
          const taskDate = new Date(t.updated_at)
          return taskDate >= hourStart && taskDate < hourEnd
        }).length
        
        const pomodoroForHour = pomodoro.filter((p: any) => {
          const sessionDate = new Date(p.created_at)
          return sessionDate >= hourStart && sessionDate < hourEnd
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

        const tasksForDay = completed.filter((t: any) => {
          const taskDate = new Date(t.updated_at)
          return taskDate >= dayStart && taskDate <= dayEnd
        }).length

        const pomodoroForDay = pomodoro.filter((p: any) => {
          const sessionDate = new Date(p.created_at)
          return sessionDate >= dayStart && sessionDate <= dayEnd
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
        
        const tasksForWeek = completed.filter((t: any) => {
          const taskDate = new Date(t.updated_at)
          return taskDate >= weekStart && taskDate <= weekEnd
        }).length
        
        const pomodoroForWeek = pomodoro.filter((p: any) => {
          const sessionDate = new Date(p.created_at)
          return sessionDate >= weekStart && sessionDate <= weekEnd
        }).length
        
        chartData.push({ 
          name: `Week ${week + 1}`, 
          tasks: tasksForWeek, 
          pomodoro: pomodoroForWeek 
        })
      }
    }

    return NextResponse.json({
      totalTasks: allTasks.length,
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
