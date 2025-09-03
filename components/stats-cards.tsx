"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Target, Flame, Star } from "lucide-react"

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
  if (isMobile) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Card className={`${theme.cardBg} backdrop-blur-xl ${theme.border}`}>
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <div>
                  <p className={`text-xs ${theme.textSecondary}`}>{t("completedToday")}</p>
                  <p className={`text-lg font-bold ${theme.textPrimary}`}>{completedTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`${theme.cardBg} backdrop-blur-xl ${theme.border}`}>
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-blue-400" />
                <div>
                  <p className={`text-xs ${theme.textSecondary}`}>{t("totalToday")}</p>
                  <p className={`text-lg font-bold ${theme.textPrimary}`}>{totalTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className={`${theme.cardBg} backdrop-blur-xl ${theme.border}`}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${theme.textSecondary}`}>{t("progressToday")}</span>
              <span className={`text-sm font-bold ${theme.textPrimary}`}>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className={`${theme.cardBg} backdrop-blur-xl ${theme.border}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className={`text-sm ${theme.textSecondary}`}>{t("completedToday")}</p>
              <p className={`text-xl font-bold ${theme.textPrimary}`}>{completedTasks}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={`${theme.cardBg} backdrop-blur-xl ${theme.border}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-400" />
            <div>
              <p className={`text-sm ${theme.textSecondary}`}>{t("totalToday")}</p>
              <p className={`text-xl font-bold ${theme.textPrimary}`}>{totalTasks}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={`${theme.cardBg} backdrop-blur-xl ${theme.border}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <div>
              <p className={`text-sm ${theme.textSecondary}`}>{t("streak")}</p>
              <p className={`text-xl font-bold ${theme.textPrimary}`}>{streak} días</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={`${theme.cardBg} backdrop-blur-xl ${theme.border}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-purple-400" />
            <div>
              <p className={`text-sm ${theme.textSecondary}`}>{t("progressToday")}</p>
              <p className={`text-xl font-bold ${theme.textPrimary}`}>{Math.round(progress)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
