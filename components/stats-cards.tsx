"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Target, Check, Flame, Star } from "lucide-react"

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
      <Card className={`${theme.cardBg} ${theme.border} backdrop-blur-xl`}>
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

      <Card className={`${theme.cardBg} ${theme.border} backdrop-blur-xl`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5 text-green-400" />
            <div>
              <p className={`text-sm ${theme.textSecondary}`}>{t("completedToday")}</p>
              <p className={`text-xl font-bold ${theme.textPrimary}`}>{completedTasks}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {!isMobile && (
        <>
          <Card className={`${theme.cardBg} ${theme.border} backdrop-blur-xl`}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-orange-400" />
                <div>
                  <p className={`text-sm ${theme.textSecondary}`}>{t("streak")}</p>
                  <p className={`text-xl font-bold ${theme.textPrimary}`}>{streak}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`${theme.cardBg} ${theme.border} backdrop-blur-xl`}>
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
        </>
      )}
    </div>
  )
}
