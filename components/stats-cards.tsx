"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Target, Check, Flame, Star } from "lucide-react"

interface StatsCardsProps {
  tasks: Array<{
    id: string
    completed: boolean
    date: string
  }>
  isMobile?: boolean
}

export function StatsCards({ tasks, isMobile = false }: StatsCardsProps) {
  // Calculate stats
  const today = new Date().toISOString().split("T")[0]
  const todayTasks = tasks.filter((task) => task.date === today)
  const completedToday = todayTasks.filter((task) => task.completed).length
  const totalToday = todayTasks.length
  const progress = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0

  // Calculate streak (simplified - just completed tasks in last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split("T")[0]
  })

  const streak = last7Days.reduce((count, date) => {
    const dayTasks = tasks.filter((task) => task.date === date)
    const dayCompleted = dayTasks.filter((task) => task.completed).length
    return count + (dayCompleted > 0 ? 1 : 0)
  }, 0)

  const gridCols = isMobile ? "grid-cols-2" : "grid-cols-4"

  return (
    <div className={`grid ${gridCols} gap-4`}>
      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-sm text-gray-300">Total Hoy</p>
              <p className="text-xl font-bold text-white">{totalToday}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-sm text-gray-300">Completadas</p>
              <p className="text-xl font-bold text-white">{completedToday}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {!isMobile && (
        <>
          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-sm text-gray-300">Racha</p>
                  <p className="text-xl font-bold text-white">{streak}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-300">Progreso</p>
                  <p className="text-xl font-bold text-white">{progress}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
