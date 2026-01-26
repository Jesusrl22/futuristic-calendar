"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { CheckSquare, FileText, Timer, Zap } from "@/components/icons"
import { AdsterraBanner } from "@/components/adsterra-banner"
import { AdsterraNativeBanner } from "@/components/adsterra-native-banner"
import { AdsterraMobileBanner } from "@/components/adsterra-mobile-banner"
import { useTranslation } from "@/hooks/useTranslation"
import { StreaksWidget } from "@/components/streaks-widget"
import { AIQuickActions } from "@/components/ai-quick-actions"
import { TimezoneDisplay } from "@/components/timezone-display"
import { StatCard } from "@/components/stat-card"
import { Insights } from "@/components/insights"

export default function AppPage() {
  const { t } = useTranslation()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    tasks: 0,
    notes: 0,
    pomodoro: 0,
    monthlyCredits: 0,
    purchasedCredits: 0,
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

        setUser(data)
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
        console.log("[v0] Full user profile:", data)
        console.log("[v0] Subscription tier:", data.subscription_tier)
        console.log("[v0] Credits breakdown:", {
          monthly: data.ai_credits,
          purchased: data.ai_credits_purchased,
          total: (data.ai_credits || 0) + (data.ai_credits_purchased || 0),
        })
        setUser(data)
        setStats((prev) => ({
          ...prev,
          monthlyCredits: data.ai_credits || 0,
          purchasedCredits: data.ai_credits_purchased || 0,
        }))
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
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    )
  }

  const totalCredits = stats.monthlyCredits + stats.purchasedCredits
  const hasCredits = totalCredits > 0

  const statCards = [
    { title: t("tasks"), value: stats.tasks, icon: <CheckSquare className="w-6 h-6" />, color: "text-blue-500" },
    { title: t("notes"), value: stats.notes, icon: <FileText className="w-6 h-6" />, color: "text-purple-500" },
    { title: t("pomodoros"), value: stats.pomodoro, icon: <Timer className="w-6 h-6" />, color: "text-orange-500" },
    {
      title: t("ai_credits"),
      value: hasCredits ? totalCredits : 0,
      icon: <Zap className="w-6 h-6" />,
      color: "text-primary",
      subtitle: hasCredits
        ? stats.monthlyCredits > 0 && stats.purchasedCredits > 0
          ? `${stats.monthlyCredits} ${t("monthly")} · ${stats.purchasedCredits} ${t("purchased")}`
          : stats.monthlyCredits > 0
            ? t("monthly_credits")
            : t("purchased_credits")
        : t("upgrade_or_buy_credit_packs"),
      noCredits: !hasCredits,
    },
  ]

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12a9 9 0 016-8.486M6 12a6 6 0 1112 0m-12 0a6 6 0 0112 0m-12 0A9 9 0 1015.486 6M6 12a6 6 0 1012 0" />
        </svg>
        <span>Dashboard</span>
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Overview</h1>
        <p className="text-muted-foreground">Monitor key metrics and manage your platform</p>
      </div>

      {/* Ad Banners */}
      <AdsterraBanner adKey="dd82d93d86b369641ec4dd731423cb09" width={728} height={90} className="mb-6" />
      <AdsterraMobileBanner adKey="5fedd77c571ac1a4c2ea68ca3d2bca98" width={320} height={50} className="mb-6" />

      {/* Main Grid: Welcome Section + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Welcome Section - Left Side */}
        <div className="lg:col-span-2">
          <Card className="bg-card border border-border/50 p-8 rounded-2xl">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Hope you're well, {user?.name?.split(" ")[0] || "Demo"}</h2>
                <p className="text-sm text-muted-foreground mb-6">Ready to make today productive! 🚀</p>
                <div className="text-6xl font-bold text-primary mb-2">
                  {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">☁️</div>
                  <div className="text-3xl font-bold mb-2">17°C</div>
                  <div className="text-sm text-muted-foreground">Light rain</div>
                  <div className="text-xs text-muted-foreground mt-2">Los Angeles</div>
                  <div className="text-xs text-muted-foreground">Saturday, {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Insights - Right Side */}
        <div>
          <Card className="bg-card border border-border/50 p-6 rounded-2xl h-full">
            <h3 className="text-lg font-bold mb-4">Insights</h3>
            <p className="text-xs text-muted-foreground mb-6">Performance analytics</p>
            
            <div className="space-y-4 mb-6">
              <button className="w-full px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary/70 text-sm font-medium transition-colors">
                Performance
              </button>
              <button className="w-full px-4 py-2 rounded-lg bg-transparent hover:bg-secondary/50 text-sm font-medium transition-colors border border-border/50">
                Trends
              </button>
            </div>

            <div className="flex justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--primary))" strokeWidth="8" strokeDasharray="226.19" strokeDashoffset="0" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold">85%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-muted-foreground">Task Completion</span>
                </div>
                <span className="text-primary font-semibold">85%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                  <span className="text-muted-foreground">User Engagement</span>
                </div>
                <span className="text-secondary font-semibold">84%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: "hsl(30, 80%, 55%)"}}></div>
                  <span className="text-muted-foreground">Response Time</span>
                </div>
                <span className="font-semibold">78%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Projects */}
        <Card className="bg-card border border-border/50 p-6 rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-secondary" />
            </div>
            <button className="text-muted-foreground hover:text-foreground text-2xl">⋮</button>
          </div>
          <div className="text-3xl font-bold mb-1">{stats.tasks}</div>
          <div className="text-sm text-muted-foreground mb-2">Total Projects</div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-primary">↑ +3</span>
            <span className="text-xs text-muted-foreground">This month</span>
          </div>
        </Card>

        {/* Avg. Response Time */}
        <Card className="bg-card border border-border/50 p-6 rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Timer className="w-5 h-5 text-secondary" />
            </div>
            <button className="text-muted-foreground hover:text-foreground text-2xl">⋮</button>
          </div>
          <div className="text-3xl font-bold mb-1">32 min</div>
          <div className="text-sm text-muted-foreground mb-2">Avg. Response Time</div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">→ 0%</span>
            <span className="text-xs text-muted-foreground">This month</span>
          </div>
        </Card>

        {/* Active Users */}
        <Card className="bg-card border border-border/50 p-6 rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <button className="text-muted-foreground hover:text-foreground text-2xl">⋮</button>
          </div>
          <div className="text-3xl font-bold mb-1">1,847</div>
          <div className="text-sm text-muted-foreground mb-2">Active Users</div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-primary">↑ +12%</span>
            <span className="text-xs text-muted-foreground">This month</span>
          </div>
        </Card>

        {/* Task Completion */}
        <Card className="bg-card border border-border/50 p-6 rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-secondary" />
            </div>
            <button className="text-muted-foreground hover:text-foreground text-2xl">⋮</button>
          </div>
          <div className="text-3xl font-bold mb-1">78%</div>
          <div className="text-sm text-muted-foreground mb-2">Task Completion</div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-primary">↑ +5%</span>
            <span className="text-xs text-muted-foreground">This month</span>
          </div>
        </Card>
      </div>

      {/* Bottom Grid: Quick Tasks + Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Quick Tasks */}
        <Card className="bg-card border border-border/50 p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-1">Quick Tasks</h3>
          <p className="text-xs text-muted-foreground mb-6">Manage your daily tasks</p>
          
          <div className="flex gap-4 mb-6">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/30 hover:bg-muted/50 text-sm font-medium transition-colors">
              <div className="w-4 h-4 rounded border border-muted-foreground"></div>
              Active (3)
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/30 hover:bg-muted/50 text-sm font-medium transition-colors">
              <div className="w-4 h-4 rounded border border-primary/60 bg-primary/20"></div>
              Completed (3)
            </button>
          </div>

          <div className="space-y-3 mb-6">
            {["test", "Set up repository structure", "Draft project requirements"].map((task, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span className="text-sm">{task}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input 
              placeholder="Add a quick task..." 
              className="flex-1 px-3 py-2 rounded-lg bg-secondary/30 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium">+</button>
          </div>
        </Card>

        {/* Calendar */}
        <Card className="bg-card border border-border/50 p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-1">Calendar</h3>
          <p className="text-xs text-muted-foreground mb-4">Saturday, {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <button className="p-1 hover:bg-secondary/50 rounded">←</button>
              <span className="font-semibold">November 2025</span>
              <button className="p-1 hover:bg-secondary/50 rounded">→</button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
                <div key={day} className="text-muted-foreground font-medium">{day}</div>
              ))}
              {Array.from({length: 35}, (_, i) => {
                const date = i - 5;
                const isCurrentDay = date === 15;
                return (
                  <button
                    key={i}
                    className={`p-2 rounded-lg text-sm font-medium transition-all ${
                      isCurrentDay 
                        ? "bg-primary text-primary-foreground"
                        : date > 0 && date <= 30
                        ? "hover:bg-secondary/50"
                        : "text-muted-foreground/50"
                    }`}
                  >
                    {date > 0 && date <= 30 ? date : ""}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue Analytics */}
      <Card className="bg-card border border-border/50 p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold">Revenue Analytics</h3>
            <p className="text-xs text-muted-foreground">Revenue breakdown by category</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-secondary/20 hover:bg-secondary/30 text-sm font-medium transition-colors">
            This Quarter ▼
          </button>
        </div>
        
        <div className="h-48 flex items-end justify-around gap-4 px-4">
          {[60, 45, 30].map((height, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-12 rounded-t-lg bg-gradient-to-b from-primary to-primary/50" style={{height: `${height}%`}}></div>
              <span className="text-xs text-muted-foreground">${(30 + i * 15).toFixed(0)}k</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Additional Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <StreaksWidget />
        <AIQuickActions />
      </div>
    </div>
  )
}
