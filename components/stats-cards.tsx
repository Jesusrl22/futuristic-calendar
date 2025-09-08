"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Target, CheckCircle2, Clock, Flame } from "lucide-react"

interface StatsCardsProps {
  completedTasks: number
  totalTasks: number
  progress: number
  streak: number
  theme: any
  t: (key: string) => string
  isMobile?: boolean
}

export function StatsCards({
  completedTasks,
  totalTasks,
  progress,
  streak,
  theme,
  t,
  isMobile = false,
}: StatsCardsProps) {
  const gridCols = isMobile ? "grid-cols-2" : "grid-cols-4"

  return (
    <div className={`grid ${gridCols} gap-4`}>
      <Card className={`bg-black/20 backdrop-blur-xl border-purple-500/20`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium text-white`}>{t("completedToday")}</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{completedTasks}</div>
          <p className="text-xs text-gray-400">de {totalTasks} tareas</p>
        </CardContent>
      </Card>

      <Card className={`bg-black/20 backdrop-blur-xl border-purple-500/20`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium text-white`}>{t("totalToday")}</CardTitle>
          <Target className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{totalTasks}</div>
          <p className="text-xs text-gray-400">tareas programadas</p>
        </CardContent>
      </Card>

      <Card className={`bg-black/20 backdrop-blur-xl border-purple-500/20`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium text-white`}>{t("progressToday")}</CardTitle>
          <Clock className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{Math.round(progress)}%</div>
          <Progress value={progress} className="mt-2" />
        </CardContent>
      </Card>

      <Card className={`bg-black/20 backdrop-blur-xl border-purple-500/20`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium text-white`}>{t("streak")}</CardTitle>
          <Flame className="h-4 w-4 text-orange-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{streak}</div>
          <p className="text-xs text-gray-400">días consecutivos</p>
        </CardContent>
      </Card>
    </div>
  )
}
