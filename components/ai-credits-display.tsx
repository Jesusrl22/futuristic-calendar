"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Zap, TrendingUp, DollarSign } from "lucide-react"
import {
  getUserAICredits,
  addAICredits,
  getUserAIUsage,
  formatCost,
  CREDIT_PACKAGES,
  getPlanComparison,
  type AICreditsInfo,
  type AIUsage,
} from "@/lib/ai-credits"

interface AICreditsDisplayProps {
  userId: string
  theme: any
  onCreditsUpdate?: (credits: any) => void
}

export function AICreditsDisplay({ userId, theme, onCreditsUpdate }: AICreditsDisplayProps) {
  const [creditsInfo, setCreditsInfo] = useState<AICreditsInfo>({
    credits: 0,
    used: 0,
    remaining: 0,
    resetDate: null,
    canUseAI: false,
    totalCostEur: 0,
    totalTokensUsed: 0,
    monthlyLimit: 0,
    planType: "monthly",
    isUnlimited: false,
  })
  const [recentUsage, setRecentUsage] = useState<AIUsage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showPurchase, setShowPurchase] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showPlanComparison, setShowPlanComparison] = useState(false)

  useEffect(() => {
    loadCreditsInfo()
    loadRecentUsage()
  }, [userId])

  const loadCreditsInfo = async () => {
    try {
      const info = await getUserAICredits(userId)
      setCreditsInfo(info)
      onCreditsUpdate?.(info)
    } catch (error) {
      console.error("Error loading credits info:", error)
    }
  }

  const loadRecentUsage = async () => {
    try {
      const usage = await getUserAIUsage(userId, 5)
      setRecentUsage(usage)
    } catch (error) {
      console.error("Error loading recent usage:", error)
    }
  }

  const handlePurchaseCredits = async (credits: number, price: number) => {
    setIsLoading(true)
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const success = await addAICredits(userId, credits)
      if (success) {
        await loadCreditsInfo()
        setShowPurchase(false)
        alert(`¡${credits} créditos añadidos exitosamente! 🎉\nValor: €${price.toFixed(2)}`)
      } else {
        alert("Error al añadir créditos. Intenta de nuevo.")
      }
    } catch (error) {
      console.error("Error purchasing credits:", error)
      alert("Error al procesar la compra.")
    } finally {
      setIsLoading(false)
    }
  }

  const getResetDateText = () => {
    if (!creditsInfo.resetDate) return ""
    const resetDate = new Date(creditsInfo.resetDate)
    const now = new Date()
    const daysUntilReset = Math.ceil((resetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (creditsInfo.planType === "yearly") {
      if (daysUntilReset <= 0) return "Se reinician hoy"
      if (daysUntilReset <= 30) return `Se reinician en ${daysUntilReset} días`
      const monthsUntilReset = Math.ceil(daysUntilReset / 30)
      return `Se reinician en ${monthsUntilReset} ${monthsUntilReset === 1 ? "mes" : "meses"}`
    } else {
      if (daysUntilReset <= 0) return "Se reinician hoy"
      if (daysUntilReset === 1) return "Se reinician mañana"
      return `Se reinician en ${daysUntilReset} días`
    }
  }

  const progressPercentage = creditsInfo.credits > 0 ? (creditsInfo.remaining / creditsInfo.credits) * 100 : 0

  const getEfficiencyColor = () => {
    const avgCostPerCredit = creditsInfo.used > 0 ? creditsInfo.totalCostEur / creditsInfo.used : 0
    if (avgCostPerCredit <= 0.015) return "text-green-400"
    if (avgCostPerCredit <= 0.025) return "text-yellow-400"
    return "text-red-400"
  }

  const planComparison = getPlanComparison()

  return (
    <div className="space-y-4">
      {/* Credits Overview */}
      <Card className={`${theme.cardBg} ${theme.border} w-48`}>
        <CardHeader className="pb-2">
          <CardTitle className={`${theme.textPrimary} text-sm flex items-center space-x-2`}>
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>Créditos IA</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-lg font-bold ${theme.textPrimary}`}>{creditsInfo.remaining}</div>
              <p className={`text-xs ${theme.textSecondary}`}>disponibles</p>
            </div>
            <Badge variant="outline" className="text-xs">
              {creditsInfo.used}/{creditsInfo.credits}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      {showPlanComparison && (
        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardHeader>
            <CardTitle className={`${theme.textPrimary} text-lg flex items-center space-x-2`}>
              <DollarSign className="w-5 h-5 text-green-400" />
              <span>Comparación de Planes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Monthly Plans */}
              <div className="space-y-3">
                <h4 className={`font-semibold ${theme.textPrimary} text-center`}>Planes Mensuales</h4>
                <div className={`p-3 rounded-lg border ${theme.border} bg-black/5`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className={`font-semibold ${theme.textPrimary}`}>Premium</div>
                      <div className={`text-sm ${theme.textMuted}`}>Sin IA</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${theme.textPrimary}`}>€1.99/mes</div>
                      <div className={`text-xs ${theme.textMuted}`}>0 créditos</div>
                    </div>
                  </div>
                </div>
                <div className={`p-3 rounded-lg border ${theme.border} bg-purple-500/10 ring-1 ring-purple-500/30`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className={`font-semibold ${theme.textPrimary} flex items-center space-x-1`}>
                        <span>Pro</span>
                        <Sparkles className="w-3 h-3 text-purple-400" />
                      </div>
                      <div className={`text-sm ${theme.textMuted}`}>Con IA</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${theme.textPrimary}`}>€4.99/mes</div>
                      <div className={`text-xs text-purple-400`}>150 créditos/mes</div>
                      <div className={`text-xs ${theme.textMuted}`}>Valor: €3.00</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Yearly Plans */}
              <div className="space-y-3">
                <h4 className={`font-semibold ${theme.textPrimary} text-center`}>Planes Anuales</h4>
                <div className={`p-3 rounded-lg border ${theme.border} bg-black/5`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className={`font-semibold ${theme.textPrimary}`}>Premium</div>
                      <div className={`text-sm ${theme.textMuted}`}>Sin IA</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${theme.textPrimary}`}>€20/año</div>
                      <div className={`text-xs text-green-400`}>Ahorro: €3.88</div>
                      <div className={`text-xs ${theme.textMuted}`}>0 créditos</div>
                    </div>
                  </div>
                </div>
                <div className={`p-3 rounded-lg border ${theme.border} bg-purple-500/10 ring-2 ring-purple-500/50`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className={`font-semibold ${theme.textPrimary} flex items-center space-x-1`}>
                        <span>Pro</span>
                        <Sparkles className="w-3 h-3 text-purple-400" />
                      </div>
                      <div className={`text-sm ${theme.textMuted}`}>Con IA</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${theme.textPrimary}`}>€50/año</div>
                      <div className={`text-xs text-green-400`}>Ahorro: €9.88</div>
                      <div className={`text-xs text-purple-400`}>1,500 créditos/año</div>
                      <div className={`text-xs ${theme.textMuted}`}>~125/mes • Valor: €30</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`text-xs ${theme.textMuted} text-center p-2 border border-blue-500/20 rounded`}>
              💡 Los planes anuales incluyen más créditos por euro invertido
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Statistics */}
      {showStats && recentUsage.length > 0 && (
        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardHeader>
            <CardTitle className={`${theme.textPrimary} text-lg flex items-center space-x-2`}>
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span>Uso Reciente</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentUsage.map((usage, index) => (
              <div key={usage.id} className={`p-3 rounded-lg border ${theme.border} bg-black/5`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className={`text-sm ${theme.textPrimary} truncate`}>{usage.request_text.substring(0, 50)}...</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs">
                      <span className={theme.textMuted}>
                        {usage.input_tokens}→{usage.output_tokens} tokens
                      </span>
                      <span className={theme.textMuted}>{usage.credits_consumed} créditos</span>
                      <span className={`font-semibold ${theme.textSecondary}`}>{formatCost(usage.cost_eur)}</span>
                      <Badge variant="outline" className="text-xs">
                        {usage.request_type}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs ${theme.textMuted}`}>
                      {new Date(usage.created_at).toLocaleDateString()}
                    </div>
                    <div className={`text-xs ${theme.textMuted}`}>{usage.model_used}</div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Purchase Credits */}
      {showPurchase && (
        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardHeader>
            <CardTitle className={`${theme.textPrimary} text-lg flex items-center space-x-2`}>
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>Comprar Créditos IA</span>
            </CardTitle>
            <p className={`text-sm ${theme.textMuted}`}>
              Basado en costos reales de OpenAI • 1 crédito = €0.02 •
              {creditsInfo.planType === "yearly" ? " Plan anual activo" : " Plan mensual activo"}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {CREDIT_PACKAGES.map((pkg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${theme.border} ${
                    pkg.popular ? "ring-2 ring-purple-500/50" : ""
                  } relative`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        POPULAR
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-semibold ${theme.textPrimary}`}>{pkg.credits} créditos</div>
                      <div className={`text-xs ${theme.textSecondary}`}>{pkg.description}</div>
                      <div className={`text-xs ${theme.textMuted} mt-1`}>{pkg.estimatedRequests}</div>
                      <div className={`text-xs ${theme.textMuted}`}>Valor real: {formatCost(pkg.credits * 0.02)}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${theme.textPrimary}`}>{pkg.price}</div>
                      <Button
                        size="sm"
                        onClick={() => handlePurchaseCredits(pkg.credits, pkg.priceValue)}
                        disabled={isLoading}
                        className={`mt-1 ${theme.buttonPrimary}`}
                      >
                        {isLoading ? "..." : "Comprar"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`text-xs ${theme.textMuted} text-center p-2 border border-blue-500/20 rounded`}>
              💡 Los créditos no caducan y se suman a tu plan actual
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Add named export for compatibility;
