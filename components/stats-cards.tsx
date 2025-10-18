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
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary mb-1">Total Tareas</p>
              <p className="text-3xl font-bold text-primary">{totalTasks}</p>
              <p className="text-xs text-muted-foreground mt-1">Todas las tareas</p>
            </div>
            <div className="p-3 bg-primary/20 rounded-full">
              <Target className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-lg transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-accent-foreground mb-1">Completadas</p>
              <p className="text-3xl font-bold text-accent-foreground">{completedTasks}</p>
              <p className="text-xs text-muted-foreground mt-1">{completionRate}% del total</p>
            </div>
            <div className="p-3 bg-accent/20 rounded-full">
              <CheckCircle2 className="h-6 w-6 text-accent-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 hover:shadow-lg transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-foreground mb-1">Pendientes</p>
              <p className="text-3xl font-bold text-secondary-foreground">{pendingTasks}</p>
              <p className="text-xs text-muted-foreground mt-1">Por completar</p>
            </div>
            <div className="p-3 bg-secondary/20 rounded-full">
              <Clock className="h-6 w-6 text-secondary-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20 hover:shadow-lg transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-destructive mb-1">Vencidas</p>
              <p className="text-3xl font-bold text-destructive">{overdueTasks}</p>
              <p className="text-xs text-muted-foreground mt-1">Requieren atención</p>
            </div>
            <div className="p-3 bg-destructive/20 rounded-full">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
