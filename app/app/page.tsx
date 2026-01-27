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

      {/* Main Grid: Welcome Section + Stats Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Welcome Section - Left Side */}
        <div className="lg:col-span-2">
          <Card className="bg-card border border-border/50 p-8 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Hola, {user?.name?.split(" ")[0] || "Usuario"}</h2>
                <p className="text-sm text-muted-foreground mb-6">¡Bienvenido a tu dashboard de productividad!</p>
                <div className="text-6xl font-bold text-primary mb-2">
                  {new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <div className="text-2xl font-bold mb-2">{stats.tasks + stats.notes + stats.pomodoro}</div>
                  <div className="text-sm text-muted-foreground">Actividades hoy</div>
                  <div className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border/50">
                    Mantén el ritmo productivo
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Stats - Right Side */}
        <div>
          <Card className="bg-card border border-border/50 p-6 rounded-2xl h-full">
            <h3 className="text-lg font-bold mb-4">Resumen</h3>
            <p className="text-xs text-muted-foreground mb-6">Tu actividad de hoy</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Tareas</span>
                </div>
                <span className="text-lg font-bold text-blue-500">{stats.tasks}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-muted-foreground">Notas</span>
                </div>
                <span className="text-lg font-bold text-purple-500">{stats.notes}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-orange-500/10">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-muted-foreground">Pomodoros</span>
                </div>
                <span className="text-lg font-bold text-orange-500">{stats.pomodoro}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Créditos IA</span>
                </div>
                <span className="text-lg font-bold text-primary">{stats.monthlyCredits + stats.purchasedCredits}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title={t("tasks")} 
          value={stats.tasks} 
          icon={<CheckSquare className="w-6 h-6" />} 
          color="text-blue-500"
        />
        <StatCard 
          title={t("notes")} 
          value={stats.notes} 
          icon={<FileText className="w-6 h-6" />} 
          color="text-purple-500"
        />
        <StatCard 
          title={t("pomodoros")} 
          value={stats.pomodoro} 
          icon={<Timer className="w-6 h-6" />} 
          color="text-orange-500"
        />
        <StatCard 
          title={t("ai_credits")} 
          value={totalCredits} 
          icon={<Zap className="w-6 h-6" />} 
          color="text-primary"
          subtitle={`${stats.monthlyCredits} ${t("monthly")}`}
        />
      </div>

      {/* Bottom Section: Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* AI Quick Actions */}
        <div className="lg:col-span-2">
          <AIQuickActions />
        </div>

        {/* Streaks Widget */}
        <div>
          <StreaksWidget />
        </div>
      </div>

      {/* Final Ad Banner */}
      <AdsterraNativeBanner adKey="8afc8d7c671ba4c7dae868da0d2bbea98" width={728} height={90} className="mb-6" />
    </div>
  )
}
