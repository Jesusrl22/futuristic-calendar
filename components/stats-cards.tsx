"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Target, Trophy } from "lucide-react"

interface StatsCardsProps {
  completedToday: number
  totalToday: number
  streak: number
  achievements: number
  theme: any
  t: (key: string) => string
}

export function StatsCards({ completedToday, totalToday, streak, achievements, theme, t }: StatsCardsProps) {
  const progressPercentage = totalToday > 0 ? (completedToday / totalToday) * 100 : 0

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${theme.textSecondary}`}>{t("completedToday")}</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${theme.textPrimary}`}>{completedToday}</div>
          <p className={`text-xs ${theme.textMuted}`}>de {totalToday} tareas</p>
        </CardContent>
      </Card>

      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${theme.textSecondary}`}>{t("progressToday")}</CardTitle>
          <Target className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${theme.textPrimary}`}>{Math.round(progressPercentage)}%</div>
          <p className={`text-xs ${theme.textMuted}`}>progreso del día</p>
        </CardContent>
      </Card>

      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${theme.textSecondary}`}>{t("streak")}</CardTitle>
          <Clock className="h-4 w-4 text-orange-400" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${theme.textPrimary}`}>{streak}</div>
          <p className={`text-xs ${theme.textMuted}`}>días consecutivos</p>
        </CardContent>
      </Card>

      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${theme.textSecondary}`}>{t("achievements")}</CardTitle>
          <Trophy className="h-4 w-4 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${theme.textPrimary}`}>{achievements}</div>
          <p className={`text-xs ${theme.textMuted}`}>logros desbloqueados</p>
        </CardContent>
      </Card>
    </div>
  )
}
