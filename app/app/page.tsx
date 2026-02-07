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
    totalTasks: 0,
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

    // Refresh profile every 5 seconds
    const profileInterval = setInterval(() => {
      fetchUserProfile()
    }, 5000)

    // Refresh stats every 3 seconds to show updated task progress
    const statsInterval = setInterval(() => {
      fetchStats()
    }, 3000)

    return () => {
      clearInterval(profileInterval)
      clearInterval(statsInterval)
    }
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
          totalTasks: data.totalTasks || 0,
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
  
  // Calculate max credits based on subscription tier
  const getMaxCredits = () => {
    if (!user?.subscription_tier) return 500
    const tiers: { [key: string]: number } = { free: 0, premium: 100, pro: 500 }
    return tiers[user.subscription_tier] || 500
  }
  
  const maxCredits = getMaxCredits()

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
      </div>

      {/* Ad Banners */}
      <AdsterraBanner adKey="dd82d93d86b369641ec4dd731423cb09" width={728} height={90} className="mb-6" />
      <AdsterraMobileBanner adKey="5fedd77c571ac1a4c2ea68ca3d2bca98" width={320} height={50} className="mb-6" />

      {/* Main Grid: Welcome Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Welcome Section - Left Side */}
        <div className="lg:col-span-2">
          <Card className="bg-card border border-border/50 p-8 rounded-2xl">
            <Card className="bg-card border border-border/50 p-6 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4">Hola, {user?.name?.split(" ")[0] || "Usuario"}</h2>
              <p className="text-sm text-muted-foreground mb-4">¡Bienvenido a tu dashboard de productividad!</p>
              <div className="text-5xl font-bold text-primary mb-2">
                {new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
              </p>
            </Card>

            <Card className="bg-card border border-border/50 p-6 rounded-2xl flex flex-col items-center justify-center">
              <div className="text-5xl mb-3">🎯</div>
              <div className="text-4xl font-bold text-primary mb-1">{stats.totalTasks - stats.tasks}</div>
              <div className="text-sm text-muted-foreground mb-3">Tareas por completar</div>
              <div className="text-xs text-muted-foreground">
                {stats.totalTasks > 0 
                  ? `${Math.round((stats.tasks / stats.totalTasks) * 100)}% completadas`
                  : "Crea tu primera tarea"
                }
              </div>
            </Card>
          </Card>
        </div>

        {/* Credits Card - Right Side */}
        <div>
          <Card className="bg-card border border-border/50 p-4 rounded-2xl h-full flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold mb-3">Créditos IA</h3>
              <div className="text-4xl font-bold text-primary mb-1">{totalCredits}</div>
              <p className="text-xs text-muted-foreground mb-4">Disponibles este mes</p>
              
              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${totalCredits > 0 ? Math.min((totalCredits / maxCredits) * 100, 100) : 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{totalCredits}/{maxCredits}</span>
                  <span>
                    {totalCredits > 0 ? Math.round((totalCredits / maxCredits) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Plan: <strong>{user?.subscription_tier?.toUpperCase()}</strong></span>
                <Zap className="w-4 h-4 text-primary" />
              </div>
            </div>
          </Card>
        </div>
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
