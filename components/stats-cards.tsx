"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Clock, Target, AlertTriangle, TrendingUp, Zap } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface StatsCardsProps {
  userId: string
  isDemo?: boolean
}

export function StatsCards({ userId, isDemo }: StatsCardsProps) {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
    todayCompleted: 0,
  })

  useEffect(() => {
    if (isDemo) {
      setStats({
        totalTasks: 24,
        completedTasks: 18,
        pendingTasks: 4,
        overdueTasks: 2,
        completionRate: 75,
        todayCompleted: 5,
      })
      return
    }

    loadStats()
  }, [userId, isDemo])

  const loadStats = async () => {
    try {
      const { data: tasks } = await supabase.from("tasks").select("*").eq("user_id", userId)

      if (tasks) {
        const completed = tasks.filter((t) => t.status === "completed").length
        const pending = tasks.filter((t) => t.status === "pending").length
        const overdue = tasks.filter((t) => {
          if (!t.due_date) return false
          return new Date(t.due_date) < new Date() && t.status !== "completed"
        }).length

        const today = new Date().toDateString()
        const todayCompleted = tasks.filter(
          (t) => t.status === "completed" && new Date(t.updated_at || t.created_at).toDateString() === today,
        ).length

        const rate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0

        setStats({
          totalTasks: tasks.length,
          completedTasks: completed,
          pendingTasks: pending,
          overdueTasks: overdue,
          completionRate: rate,
          todayCompleted,
        })
      }
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Estadísticas</h2>
        <div className="flex items-center gap-2 px-4 py-2 glass-card rounded-full">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold text-foreground">{stats.completionRate}% Completado</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tasks Card */}
        <Card className="premium-card card-hover glass-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary rounded-xl shadow-lg">
                <Target className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-3xl font-bold text-primary">{stats.totalTasks}</p>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-pulse w-full" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Todas las tareas</p>
          </CardContent>
        </Card>

        {/* Completed Tasks Card */}
        <Card className="premium-card card-hover glass-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary rounded-xl shadow-lg">
                <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground">Completadas</p>
                <p className="text-3xl font-bold text-primary">{stats.completedTasks}</p>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.completionRate}% del total • {stats.todayCompleted} hoy
            </p>
          </CardContent>
        </Card>

        {/* Pending Tasks Card */}
        <Card className="premium-card card-hover glass-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-accent rounded-xl shadow-lg">
                <Clock className="h-6 w-6 text-accent-foreground" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                <p className="text-3xl font-bold text-accent-foreground">{stats.pendingTasks}</p>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full animate-pulse w-3/4" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Por completar</p>
          </CardContent>
        </Card>

        {/* Overdue Tasks Card */}
        <Card className="premium-card card-hover glass-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-destructive rounded-xl shadow-lg animate-pulse">
                <AlertTriangle className="h-6 w-6 text-destructive-foreground" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground">Vencidas</p>
                <p className="text-3xl font-bold text-destructive">{stats.overdueTasks}</p>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-destructive rounded-full animate-pulse w-1/2" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Requieren atención urgente</p>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="premium-card card-hover glass-card border-border col-span-1 lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary rounded-lg">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Progreso Semanal</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Tareas Completadas</span>
                  <span className="text-sm font-semibold text-foreground">
                    {stats.completedTasks} / {stats.totalTasks}
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${stats.completionRate}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-2xl font-bold text-primary">{stats.todayCompleted}</p>
                  <p className="text-xs text-muted-foreground">Hoy</p>
                </div>
                <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-2xl font-bold text-primary">{stats.completionRate}%</p>
                  <p className="text-xs text-muted-foreground">Tasa</p>
                </div>
                <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-2xl font-bold text-primary">{stats.totalTasks}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card card-hover glass-card border-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4 text-foreground">Resumen Rápido</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-primary/10 rounded-lg border border-primary/20">
                <span className="text-sm text-muted-foreground">✅ Completadas</span>
                <span className="font-bold text-primary">{stats.completedTasks}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-accent/10 rounded-lg border border-accent/20">
                <span className="text-sm text-muted-foreground">⏳ Pendientes</span>
                <span className="font-bold text-accent-foreground">{stats.pendingTasks}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-destructive/10 rounded-lg border border-destructive/20">
                <span className="text-sm text-muted-foreground">⚠️ Vencidas</span>
                <span className="font-bold text-destructive">{stats.overdueTasks}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
