"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StatsPage() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    totalNotes: 0,
    totalPomodoro: 0,
    totalFocusTime: 0,
  })
  const [weeklyData, setWeeklyData] = useState<any[]>([])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const [tasksRes, completedRes, notesRes, pomodoroRes] = await Promise.all([
        supabase.from("tasks").select("*", { count: "exact" }).eq("user_id", user.id),
        supabase.from("tasks").select("*", { count: "exact" }).eq("user_id", user.id).eq("completed", true),
        supabase.from("notes").select("*", { count: "exact" }).eq("user_id", user.id),
        supabase.from("pomodoro_sessions").select("*").eq("user_id", user.id).eq("completed", true),
      ])

      const totalFocusTime = (pomodoroRes.data?.reduce((sum, s) => sum + s.duration, 0) || 0) / 60

      setStats({
        totalTasks: tasksRes.count || 0,
        completedTasks: completedRes.count || 0,
        totalNotes: notesRes.count || 0,
        totalPomodoro: pomodoroRes.data?.length || 0,
        totalFocusTime: Math.round(totalFocusTime),
      })

      // Generate weekly data
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      const weekData = days.map((day) => ({
        name: day,
        tasks: Math.floor(Math.random() * 10),
        pomodoro: Math.floor(Math.random() * 8),
      }))
      setWeeklyData(weekData)
    }
  }

  const completionRate = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0

  return (
    <div className="p-8">
      <div>
        <h1 className="text-4xl font-bold mb-8">
          <span className="text-primary neon-text">Statistics</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Total Tasks", value: stats.totalTasks, color: "text-blue-500" },
            { title: "Completed", value: stats.completedTasks, color: "text-green-500" },
            { title: "Notes", value: stats.totalNotes, color: "text-purple-500" },
            { title: "Focus Time", value: `${stats.totalFocusTime}m`, color: "text-primary" },
          ].map((stat, i) => (
            <div key={stat.title}>
              <Card className="glass-card p-6 neon-glow-hover">
                <h3 className="text-sm text-muted-foreground mb-2">{stat.title}</h3>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </Card>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="glass-card p-6 neon-glow">
            <h2 className="text-xl font-bold mb-6">Weekly Activity</h2>
            <Tabs defaultValue="tasks">
              <TabsList className="mb-4">
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
              </TabsList>
              <TabsContent value="tasks">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid rgba(184,255,78,0.3)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="tasks" fill="#b8ff4e" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="pomodoro">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid rgba(184,255,78,0.3)",
                        borderRadius: "8px",
                      }}
                    />
                    <Line type="monotone" dataKey="pomodoro" stroke="#b8ff4e" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </Card>

          <Card className="glass-card p-6 neon-glow">
            <h2 className="text-xl font-bold mb-6">Productivity Insights</h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Task Completion Rate</span>
                  <span className="text-sm font-semibold text-primary">{completionRate}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    style={{ width: `${completionRate}%` }}
                    className="h-full bg-primary transition-all duration-1000"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <span className="text-sm">Average Focus Time</span>
                  <span className="font-semibold text-primary">{Math.round(stats.totalFocusTime / 7)}m/day</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <span className="text-sm">Pomodoro Sessions</span>
                  <span className="font-semibold text-primary">{stats.totalPomodoro}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <span className="text-sm">Notes Created</span>
                  <span className="font-semibold text-primary">{stats.totalNotes}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
