"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { CheckSquare, FileText, Timer, Zap } from "@/components/icons"
import { AdsterraBanner } from "@/components/adsterra-banner"
import { AdsterraNativeBanner } from "@/components/adsterra-native-banner"
import { AdsterraMobileBanner } from "@/components/adsterra-mobile-banner"

export default function AppPage() {
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
      try {
        const response = await fetch("/api/auth/check-session")
        if (!response.ok) {
          window.location.href = "/login"
          return
        }

        const data = await response.json()
        if (!data.hasSession || !data.user) {
          window.location.href = "/login"
          return
        }

        setUser(data.user)
        fetchUserProfile()
        fetchStats()
      } catch (error) {
        console.error("[v0] Auth check failed:", error)
        window.location.href = "/login"
      }
    }

    checkAuth()

    const interval = setInterval(() => {
      fetchUserProfile()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/user/profile", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data)
        setStats((prev) => ({ ...prev, credits: data.ai_credits || 0 }))
      }
    } catch (error) {
      console.error("[v0] Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats?range=month")
      if (response.ok) {
        const data = await response.json()
        setStats((prev) => ({
          ...prev,
          tasks: data.completedTasks || 0,
          notes: data.totalNotes || 0,
          pomodoro: data.totalPomodoro || 0,
        }))
      }
    } catch (error) {
      console.error("[v0] Error fetching stats:", error)
    }
  }

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
    { title: "Tasks (This Month)", value: stats.tasks, icon: CheckSquare, color: "text-blue-500" },
    { title: "Notes (This Month)", value: stats.notes, icon: FileText, color: "text-purple-500" },
    { title: "Pomodoros (This Month)", value: stats.pomodoro, icon: Timer, color: "text-orange-500" },
    { title: "AI Credits", value: stats.credits, icon: Zap, color: "text-primary" },
  ]

  return (
    <div className="p-4 md:p-8">
      <h1 className="hidden md:block text-2xl md:text-4xl font-bold mb-6 md:mb-8">
        <span className="text-primary neon-text">Dashboard</span>
      </h1>

      <AdsterraBanner adKey="dd82d93d86b369641ec4dd731423cb09" width={728} height={90} className="mb-6" />
      <AdsterraMobileBanner adKey="5fedd77c571ac1a4c2ea68ca3d2bca98" width={320} height={50} className="mb-6" />

      <div>
        {user?.subscription_plan === "free" && <div className="mb-6">{/* Removing desktop banner import */}</div>}

        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-3xl font-bold mb-2">
            Welcome, <span className="text-primary neon-text">{user?.name || user?.email?.split("@")[0]}</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Here's your productivity overview ·
            <span
              className={`ml-2 font-medium ${
                user?.subscription_tier === "pro"
                  ? "text-yellow-500"
                  : user?.subscription_tier === "premium"
                    ? "text-purple-500"
                    : "text-gray-500"
              }`}
            >
              {user?.subscription_tier?.toUpperCase() || "FREE"} Plan
            </span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
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
          <Card className="glass-card p-4 md:p-8 neon-glow">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {[
                { title: "Create Task", href: "/app/tasks", icon: "📝" },
                { title: "Start Pomodoro", href: "/app/pomodoro", icon: "⏱️" },
                { title: "Ask AI", href: "/app/ai", icon: "🤖" },
              ].map((action) => (
                <a
                  key={action.title}
                  href={action.href}
                  className="p-4 md:p-6 rounded-lg bg-secondary/50 hover:bg-secondary transition-all duration-300 cursor-pointer group border border-border/50 hover:border-primary/50"
                >
                  <div className="text-3xl md:text-4xl mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                    {action.icon}
                  </div>
                  <h3 className="font-semibold text-sm md:text-base">{action.title}</h3>
                </a>
              ))}
            </div>
          </Card>
        </div>

        {user?.subscription_plan === "free" && (
          <div className="mt-6">
            <AdsterraNativeBanner
              containerId="container-105a3c31d27607df87969077c87047d4"
              scriptSrc="//pl28151206.effectivegatecpm.com/105a3c31d27607df87969077c87047d4/invoke.js"
              className="mt-6"
            />
            <AdsterraMobileBanner adKey="5fedd77c571ac1a4c2ea68ca3d2bca98" width={320} height={50} className="mt-6" />
          </div>
        )}
      </div>
    </div>
  )
}
