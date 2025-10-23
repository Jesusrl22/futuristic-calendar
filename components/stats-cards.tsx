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
        <h2 className="text-3xl font-bold gradient-text">Estadísticas</h2>
        <div className="flex items-center gap-2 px-4 py-2 glass-card rounded-full">
          <TrendingUp className="h-5 w-5 text-green-500" />
          <span className="text-sm font-semibold">{stats.completionRate}% Completado</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tasks Card */}
        <Card className="premium-card card-hover glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  {stats.totalTasks}
                </p>
              </div>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse w-full" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Todas las tareas</p>
          </CardContent>
        </Card>

        {/* Completed Tasks Card */}
        <Card className="premium-card card-hover glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completadas</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  {stats.completedTasks}
                </p>
              </div>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {stats.completionRate}% del total • {stats.todayCompleted} hoy
            </p>
          </CardContent>
        </Card>

        {/* Pending Tasks Card */}
        <Card className="premium-card card-hover glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pendientes</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                  {stats.pendingTasks}
                </p>
              </div>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full animate-pulse w-3/4" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Por completar</p>
          </CardContent>
        </Card>

        {/* Overdue Tasks Card */}
        <Card className="premium-card card-hover glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg animate-pulse">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Vencidas</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  {stats.overdueTasks}
                </p>
              </div>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-pulse w-1/2" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Requieren atención urgente</p>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="premium-card card-hover glass-card border-0 col-span-1 lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold">Progreso Semanal</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tareas Completadas</span>
                  <span className="text-sm font-semibold">
                    {stats.completedTasks} / {stats.totalTasks}
                  </span>
                </div>
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full transition-all duration-500"
                    style={{ width: `${stats.completionRate}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{stats.todayCompleted}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Hoy</p>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{stats.completionRate}%</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Tasa</p>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{stats.totalTasks}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card card-hover glass-card border-0">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Resumen Rápido</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">✅ Completadas</span>
                <span className="font-bold text-green-600">{stats.completedTasks}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">⏳ Pendientes</span>
                <span className="font-bold text-amber-600">{stats.pendingTasks}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">⚠️ Vencidas</span>
                <span className="font-bold text-red-600">{stats.overdueTasks}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
