"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, Plus, Zap, TrendingUp, AlertTriangle } from "lucide-react"
import { formatCredits } from "@/lib/ai-credits"

interface AiCreditsDisplayProps {
  credits: number
  onPurchaseCredits?: () => void
  showDetails?: boolean
  recentUsage?: number
  theme?: any
}

export function AiCreditsDisplay({
  credits,
  onPurchaseCredits,
  showDetails = false,
  recentUsage = 0,
  theme,
}: AiCreditsDisplayProps) {
  const getCreditsColor = (credits: number) => {
    if (credits > 500) return "text-green-600"
    if (credits > 100) return "text-blue-600"
    if (credits > 50) return "text-yellow-600"
    return "text-red-600"
  }

  const getCreditsStatus = (credits: number) => {
    if (credits > 500) return "Excelente"
    if (credits > 100) return "Bueno"
    if (credits > 50) return "Regular"
    if (credits > 10) return "Bajo"
    return "Crítico"
  }

  const getCreditsLevel = (credits: number) => {
    if (credits > 1000) return { level: "Unlimited", color: "text-purple-500", bg: "bg-purple-500/20" }
    if (credits > 500) return { level: "Professional", color: "text-green-500", bg: "bg-green-500/20" }
    if (credits > 200) return { level: "Advanced", color: "text-blue-500", bg: "bg-blue-500/20" }
    if (credits > 50) return { level: "Standard", color: "text-yellow-500", bg: "bg-yellow-500/20" }
    return { level: "Basic", color: "text-red-500", bg: "bg-red-500/20" }
  }

  if (!showDetails) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Brain className="h-3 w-3" />
        <span className={getCreditsColor(credits)}>{formatCredits(credits)}</span>
        <span className="text-xs text-gray-500">créditos IA</span>
      </Badge>
    )
  }

  const creditsLevel = getCreditsLevel(credits)
  const maxCreditsForProgress = 1000
  const progressValue = Math.min((credits / maxCreditsForProgress) * 100, 100)

  return (
    <Card className={theme ? `${theme.cardBg} ${theme.border}` : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          Créditos IA
          <Badge className={`${creditsLevel.bg} ${creditsLevel.color} border-0`}>{creditsLevel.level}</Badge>
        </CardTitle>
        <CardDescription>Usa tu asistente IA para potenciar tu productividad</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main credits display */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">{formatCredits(credits)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">créditos disponibles</div>
          </div>
          <div className="text-right">
            <Badge
              variant={credits > 100 ? "default" : credits > 50 ? "secondary" : "destructive"}
              className="flex items-center gap-1"
            >
              <Zap className="h-3 w-3" />
              {getCreditsStatus(credits)}
            </Badge>
            {recentUsage > 0 && (
              <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {recentUsage} usados hoy
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Nivel de créditos</span>
            <span>
              {Math.min(credits, maxCreditsForProgress)}/{maxCreditsForProgress}
            </span>
          </div>
          <Progress value={progressValue} className="h-3" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Básico</span>
            <span>Profesional</span>
          </div>
        </div>

        {/* Status alerts */}
        {credits < 100 && (
          <div
            className={`p-3 rounded-lg ${credits < 10 ? "bg-red-50 dark:bg-red-900/20" : "bg-yellow-50 dark:bg-yellow-900/20"}`}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className={`h-4 w-4 ${credits < 10 ? "text-red-500" : "text-yellow-500"}`} />
              <p
                className={`text-sm ${credits < 10 ? "text-red-800 dark:text-red-200" : "text-yellow-800 dark:text-yellow-200"}`}
              >
                {credits < 10
                  ? "🚫 Créditos muy bajos. Compra más para continuar usando el asistente IA."
                  : "⚠️ Tus créditos IA están bajos. Considera comprar más para seguir usando el asistente."}
              </p>
            </div>
          </div>
        )}

        {credits === 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <div className="text-center">
              <Brain className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <h3 className="font-medium text-red-800 dark:text-red-200 mb-1">Sin créditos IA</h3>
              <p className="text-sm text-red-600 dark:text-red-300">
                Necesitas créditos para usar el asistente IA. Compra un paquete para continuar.
              </p>
            </div>
          </div>
        )}

        {/* Purchase button */}
        {onPurchaseCredits && (
          <Button
            onClick={onPurchaseCredits}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            variant="default"
          >
            <Plus className="h-4 w-4 mr-2" />
            Comprar más créditos
          </Button>
        )}

        {/* Usage info */}
        <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium">Información de uso:</h4>
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>• Consultas simples:</span>
              <span>1-2 créditos</span>
            </div>
            <div className="flex justify-between">
              <span>• Consultas detalladas:</span>
              <span>3-5 créditos</span>
            </div>
            <div className="flex justify-between">
              <span>• Análisis complejos:</span>
              <span>5-10 créditos</span>
            </div>
            <div className="flex justify-between font-medium text-green-600">
              <span>• Los créditos no caducan</span>
              <span>✓</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
