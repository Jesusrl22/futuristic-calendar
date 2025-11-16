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
    
    if (range === "day") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    } else if (range === "week") {
      startDate = new Date(now)
      startDate.setDate(now.getDate() - now.getDay() + 1)
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    }
    
    const startDateISO = startDate.toISOString()

    const [tasksRes, completedRes, notesRes, pomodoroRes] = await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/tasks?user_id=eq.${userId}&select=*`, { headers }),
      fetch(`${supabaseUrl}/rest/v1/tasks?user_id=eq.${userId}&completed=eq.true&updated_at=gte.${startDateISO}&select=*`, { headers }),
      fetch(`${supabaseUrl}/rest/v1/notes?user_id=eq.${userId}&created_at=gte.${startDateISO}&select=*`, { headers }),
      fetch(`${supabaseUrl}/rest/v1/pomodoro_sessions?user_id=eq.${userId}&completed=eq.true&created_at=gte.${startDateISO}&select=*`, {
        headers,
      }),
    ])

    const tasks = tasksRes.ok ? await tasksRes.json() : []
    const completed = completedRes.ok ? await completedRes.json() : []
    const notes = notesRes.ok ? await notesRes.json() : []
    const pomodoro = pomodoroRes.ok ? await pomodoroRes.json() : []

    const totalFocusTimeMinutes = pomodoro.reduce((sum: number, s: any) => sum + (s.duration || 0), 0)
    const totalFocusTimeHours = Math.round((totalFocusTimeMinutes / 60) * 10) / 10

    let chartData: any[] = []
    
    if (range === "day") {
      // Show hours for today
      for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, '0') + ":00"
        const hourStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), i)
        const hourEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), i + 1)
        
        const tasksForHour = completed.filter((t: any) => {
          const taskDate = new Date(t.updated_at)
          return taskDate >= hourStart && taskDate < hourEnd
        }).length
        
        const pomodoroForHour = pomodoro.filter((p: any) => {
          const sessionDate = new Date(p.created_at)
          return sessionDate >= hourStart && sessionDate < hourEnd
        }).length
        
        if (tasksForHour > 0 || pomodoroForHour > 0) {
          chartData.push({ name: hour, tasks: tasksForHour, pomodoro: pomodoroForHour })
        }
      }
    } else if (range === "week") {
      // Show days of the week
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      chartData = days.map((day, index) => {
        const dayDate = new Date(startDate)
        dayDate.setDate(startDate.getDate() + index)
        const dayStart = dayDate.toISOString().split("T")[0]

        const tasksForDay = completed.filter((t: any) => {
          const completedDate = t.updated_at?.split("T")[0]
          return completedDate === dayStart
        }).length

        const pomodoroForDay = pomodoro.filter((p: any) => {
          const sessionDate = p.created_at?.split("T")[0]
          return sessionDate === dayStart
        }).length

        return { name: day, tasks: tasksForDay, pomodoro: pomodoroForDay }
      })
    } else {
      // Show weeks of the month
      const weeksInMonth = Math.ceil((new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()) / 7)
      for (let week = 0; week < weeksInMonth; week++) {
        const weekStart = new Date(startDate)
        weekStart.setDate(startDate.getDate() + (week * 7))
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 7)
        
        const tasksForWeek = completed.filter((t: any) => {
          const taskDate = new Date(t.updated_at)
          return taskDate >= weekStart && taskDate < weekEnd
        }).length
        
        const pomodoroForWeek = pomodoro.filter((p: any) => {
          const sessionDate = new Date(p.created_at)
          return sessionDate >= weekStart && sessionDate < weekEnd
        }).length
        
        chartData.push({ 
          name: `Week ${week + 1}`, 
          tasks: tasksForWeek, 
          pomodoro: pomodoroForWeek 
        })
      }
    }

    return NextResponse.json({
      totalTasks: tasks.length,
      completedTasks: completed.length,
      totalNotes: notes.length,
      totalPomodoro: pomodoro.length,
      totalFocusTime: totalFocusTimeHours,
      chartData,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
