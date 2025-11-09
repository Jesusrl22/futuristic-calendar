"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { CheckSquare, FileText, Timer, Zap } from "@/components/icons"

export default function AppPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    tasks: 0,
    notes: 0,
    pomodoro: 0,
    credits: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      setUser(user)

      // Fetch user stats
      const tasksData = await supabase.from("tasks").select("*")
      const notesData = await supabase.from("notes").select("*")
      const pomodoroData = await supabase.from("pomodoro_sessions").select("*")
      const profileData = await supabase.from("users").select("ai_credits")

      setStats({
        tasks: tasksData.data?.length || 0,
        notes: notesData.data?.length || 0,
        pomodoro: pomodoroData.data?.filter((s: any) => s.completed)?.length || 0,
        credits: profileData.data?.[0]?.ai_credits || 100,
      })

      setLoading(false)
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const statCards = [
    { title: "Tasks", value: stats.tasks, icon: CheckSquare, color: "text-blue-500" },
    { title: "Notes", value: stats.notes, icon: FileText, color: "text-purple-500" },
    { title: "Pomodoro Sessions", value: stats.pomodoro, icon: Timer, color: "text-orange-500" },
    { title: "AI Credits", value: stats.credits, icon: Zap, color: "text-primary" },
  ]

  return (
    <div className="p-8">
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="text-primary neon-text">{user?.email?.split("@")[0]}</span>
          </h1>
          <p className="text-muted-foreground">Here's your productivity overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, i) => (
            <div key={stat.title}>
              <Card className="glass-card p-6 neon-glow-hover transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`w-8 h-8 ${stat.color} group-hover:scale-110 transition-transform`} />
                </div>
                <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </Card>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="glass-card p-8 neon-glow">
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Create Task", href: "/app/tasks", icon: "📝" },
                { title: "Start Pomodoro", href: "/app/pomodoro", icon: "⏱️" },
                { title: "Ask AI", href: "/app/ai", icon: "🤖" },
              ].map((action, i) => (
                <a
                  key={action.title}
                  href={action.href}
                  className="p-6 rounded-lg bg-secondary/50 hover:bg-secondary transition-all duration-300 cursor-pointer group border border-border/50 hover:border-primary/50"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{action.icon}</div>
                  <h3 className="font-semibold">{action.title}</h3>
                </a>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
