"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Zap, TrendingUp, DollarSign } from "lucide-react"
import type { User } from "@/lib/database"

interface AiCreditsDisplayProps {
  user: User
  theme: any
}

export function AiCreditsDisplay({ user, theme }: AiCreditsDisplayProps) {
  const credits = user.ai_credits || 0
  const creditsUsed = user.ai_credits_used || 0
  const totalCost = user.ai_total_cost_eur || 0
  const remainingCredits = credits - creditsUsed
  const usagePercentage = credits > 0 ? (creditsUsed / credits) * 100 : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Créditos Restantes</p>
              <p className="text-2xl font-bold text-green-400">{remainingCredits.toLocaleString()}</p>
            </div>
            <Zap className="h-8 w-8 text-green-400" />
          </div>
          <div className="mt-3">
            <Progress value={100 - usagePercentage} className="h-2" />
            <p className="text-xs text-slate-500 mt-1">
              {creditsUsed.toLocaleString()} / {credits.toLocaleString()} usados
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Créditos Usados</p>
              <p className="text-2xl font-bold text-blue-400">{creditsUsed.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-400" />
          </div>
          <div className="mt-3">
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
              {usagePercentage.toFixed(1)}% usado
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Costo Total</p>
              <p className="text-2xl font-bold text-yellow-400">€{totalCost.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-400" />
          </div>
          <div className="mt-3">
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
              Este mes
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
