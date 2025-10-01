"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Clock, Target, AlertTriangle } from "lucide-react"

interface StatsCardsProps {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  overdueTasks: number
}

export function StatsCards({ totalTasks, completedTasks, pendingTasks, overdueTasks }: StatsCardsProps) {
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20 hover:shadow-lg transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Total Tareas</p>
              <p className="text-3xl font-bold text-blue-700">{totalTasks}</p>
              <p className="text-xs text-blue-500 mt-1">Todas las tareas</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-full">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20 hover:shadow-lg transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">Completadas</p>
              <p className="text-3xl font-bold text-green-700">{completedTasks}</p>
              <p className="text-xs text-green-500 mt-1">{completionRate}% del total</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-full">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20 hover:shadow-lg transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 mb-1">Pendientes</p>
              <p className="text-3xl font-bold text-orange-700">{pendingTasks}</p>
              <p className="text-xs text-orange-500 mt-1">Por completar</p>
            </div>
            <div className="p-3 bg-orange-500/20 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-500/20 hover:shadow-lg transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 mb-1">Vencidas</p>
              <p className="text-3xl font-bold text-red-700">{overdueTasks}</p>
              <p className="text-xs text-red-500 mt-1">Requieren atención</p>
            </div>
            <div className="p-3 bg-red-500/20 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
