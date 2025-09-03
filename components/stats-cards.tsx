"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Target, Trophy, Flame } from "lucide-react"

interface Task {
  id: string
  completed: boolean
  date: string
}

interface Achievement {
  id: string
}

interface StatsCardsProps {
  tasks: Task[]
  achievements: Achievement[]
  currentUser: any
  translations: (key: string) => string
}

function StatsCards({ tasks, achievements, currentUser, translations: t }: StatsCardsProps) {
  const today = new Date().toISOString().split("T")[0]
  const todayTasks = tasks.filter((task) => task.date === today)
  const completedTodayTasks = todayTasks.filter((task) => task.completed)
  const totalCompleted = tasks.filter((task) => task.completed).length

  return (
    <div className="space-y-4">
      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">Estadísticas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-300">Hoy</span>
              </div>
              <p className="text-2xl font-bold text-white">{completedTodayTasks.length}</p>
              <p className="text-xs text-gray-400">de {todayTasks.length}</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-300">Total</span>
              </div>
              <p className="text-2xl font-bold text-white">{totalCompleted}</p>
              <p className="text-xs text-gray-400">completadas</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-gray-300">Logros</span>
              </div>
              <p className="text-2xl font-bold text-white">{achievements.length}</p>
              <p className="text-xs text-gray-400">desbloqueados</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-gray-300">Racha</span>
              </div>
              <p className="text-2xl font-bold text-white">3</p>
              <p className="text-xs text-gray-400">días</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Progreso de hoy</span>
              <span className="text-white">
                {todayTasks.length > 0 ? Math.round((completedTodayTasks.length / todayTasks.length) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${todayTasks.length > 0 ? (completedTodayTasks.length / todayTasks.length) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Pomodoro sessions */}
          <div className="border-t border-purple-500/30 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Sesiones Pomodoro</span>
              <span className="text-white font-bold">{currentUser?.pomodoroSessions || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { StatsCards }
export { StatsCards as default }
