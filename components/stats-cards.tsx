"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Target, Trophy } from "lucide-react"

interface StatsCardsProps {
  userId: string
}

export function StatsCards({ userId }: StatsCardsProps) {
  const theme = {
    cardBg: "bg-slate-800/50 backdrop-blur-sm",
    border: "border-slate-700",
    textPrimary: "text-white",
    textSecondary: "text-slate-300",
    textMuted: "text-slate-400",
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${theme.textSecondary}`}>Completadas Hoy</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${theme.textPrimary}`}>0</div>
          <p className={`text-xs ${theme.textMuted}`}>de 0 tareas</p>
        </CardContent>
      </Card>

      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${theme.textSecondary}`}>Progreso Hoy</CardTitle>
          <Target className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${theme.textPrimary}`}>0%</div>
          <p className={`text-xs ${theme.textMuted}`}>progreso del día</p>
        </CardContent>
      </Card>

      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${theme.textSecondary}`}>Racha</CardTitle>
          <Clock className="h-4 w-4 text-orange-400" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${theme.textPrimary}`}>0</div>
          <p className={`text-xs ${theme.textMuted}`}>días consecutivos</p>
        </CardContent>
      </Card>

      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${theme.textSecondary}`}>Logros</CardTitle>
          <Trophy className="h-4 w-4 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${theme.textPrimary}`}>0</div>
          <p className={`text-xs ${theme.textMuted}`}>logros desbloqueados</p>
        </CardContent>
      </Card>
    </div>
  )
}
