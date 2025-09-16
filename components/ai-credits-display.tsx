"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sparkles, CreditCard, TrendingUp, AlertCircle, Zap } from "lucide-react"
import { getUserAICredits, formatCost, getCostExamples } from "@/lib/ai-credits"

interface AICreditsDisplayProps {
  userId: string
  theme: any
}

export function AICreditsDisplay({ userId, theme }: AICreditsDisplayProps) {
  const [credits, setCredits] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const userCredits = await getUserAICredits(userId)
        setCredits(userCredits)
      } catch (error) {
        console.error("Error fetching AI credits:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCredits()
  }, [userId])

  const costExamples = getCostExamples()

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${theme.textSecondary}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
        <span className="text-sm">Cargando créditos...</span>
      </div>
    )
  }

  const getCreditsColor = () => {
    if (credits >= 100) return "text-green-400"
    if (credits >= 50) return "text-yellow-400"
    if (credits >= 10) return "text-orange-400"
    return "text-red-400"
  }

  const getCreditsStatus = () => {
    if (credits >= 100) return "Excelente"
    if (credits >= 50) return "Bueno"
    if (credits >= 10) return "Bajo"
    return "Crítico"
  }

  return (
    <div className="space-y-4">
      {/* Main Credits Display */}
      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardHeader className="pb-3">
          <CardTitle className={`${theme.textPrimary} text-lg flex items-center justify-between`}>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>Créditos IA</span>
            </div>
            <Badge variant="secondary" className={`${getCreditsColor()} bg-opacity-20`}>
              {getCreditsStatus()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Credits Count */}
          <div className="text-center">
            <div className={`text-4xl font-bold ${getCreditsColor()}`}>{credits}</div>
            <p className={`text-sm ${theme.textSecondary}`}>créditos disponibles</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className={theme.textSecondary}>Nivel de créditos</span>
              <span className={theme.textSecondary}>{Math.min(100, (credits / 200) * 100).toFixed(0)}%</span>
            </div>
            <Progress value={Math.min(100, (credits / 200) * 100)} className="h-2" />
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className={`flex-1 ${theme.buttonSecondary}`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {showDetails ? "Ocultar" : "Ver"} detalles
            </Button>
            <Button size="sm" className={`flex-1 ${theme.buttonPrimary}`}>
              <CreditCard className="w-4 h-4 mr-2" />
              Comprar más
            </Button>
          </div>

          {/* Low Credits Warning */}
          {credits < 10 && (
            <div className={`flex items-center space-x-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20`}>
              <AlertCircle className="w-4 h-4 text-red-400" />
              <div>
                <p className={`text-sm font-medium text-red-400`}>Créditos bajos</p>
                <p className={`text-xs ${theme.textMuted}`}>
                  Compra más créditos para continuar usando las funciones de IA
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Information */}
      {showDetails && (
        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardHeader>
            <CardTitle className={`${theme.textPrimary} text-lg flex items-center space-x-2`}>
              <Zap className="w-5 h-5 text-yellow-400" />
              <span>Costos por consulta</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`text-sm ${theme.textSecondary} mb-4`}>
              Los créditos se calculan dinámicamente según el uso real de tokens. Solo pagas por lo que usas.
            </div>

            {/* Cost Examples */}
            <div className="space-y-3">
              {costExamples.map((example, index) => (
                <div key={index} className={`p-3 rounded-lg bg-slate-800/30 border ${theme.border}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`text-sm font-medium ${theme.textPrimary}`}>{example.scenario}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {example.creditsConsumed} crédito{example.creditsConsumed > 1 ? "s" : ""}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={theme.textSecondary}>
                      <span className="font-medium">Tokens:</span> {example.inputTokens + example.outputTokens}
                    </div>
                    <div className={theme.textSecondary}>
                      <span className="font-medium">Costo:</span> {formatCost(example.costEur)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Value Proposition */}
            <div className={`p-3 rounded-lg bg-purple-500/10 border border-purple-500/20`}>
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className={`text-sm font-medium ${theme.textPrimary}`}>Sistema justo y transparente</span>
              </div>
              <ul className={`text-xs ${theme.textSecondary} space-y-1`}>
                <li>• Consultas simples cuestan menos créditos</li>
                <li>• Ves el costo real antes de cada consulta</li>
                <li>• Sin tarifas fijas, solo pagas lo que usas</li>
                <li>• Historial detallado de todos tus gastos</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
