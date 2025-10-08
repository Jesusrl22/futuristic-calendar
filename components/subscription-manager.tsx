"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Check, Crown, Loader2, Star } from "lucide-react"
import { subscriptionPlans, formatPrice, getYearlySavings } from "@/lib/subscription"
import { useLanguage } from "@/hooks/useLanguage"

interface SubscriptionManagerProps {
  currentPlan?: string
  onUpgrade?: (planId: string, billing: "monthly" | "yearly") => Promise<void>
}

export function SubscriptionManager({ currentPlan = "free", onUpgrade }: SubscriptionManagerProps) {
  const { t } = useLanguage()
  const [isYearly, setIsYearly] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const handleUpgrade = async (planId: string) => {
    if (!onUpgrade) return

    setLoadingPlan(planId)
    try {
      await onUpgrade(planId, isYearly ? "yearly" : "monthly")
    } catch (error) {
      console.error("Error upgrading plan:", error)
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center space-x-4">
        <span className={`text-sm ${!isYearly ? "text-white" : "text-gray-400"}`}>Mensual</span>
        <Switch checked={isYearly} onCheckedChange={setIsYearly} />
        <span className={`text-sm ${isYearly ? "text-white" : "text-gray-400"}`}>Anual</span>
        {isYearly && (
          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
            Ahorra hasta €40
          </Badge>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => {
          const price = isYearly ? plan.price.yearly : plan.price.monthly
          const savings = isYearly ? getYearlySavings(plan) : 0
          const isCurrentPlan = currentPlan === plan.id
          const isLoading = loadingPlan === plan.id

          return (
            <Card
              key={plan.id}
              className={`relative bg-slate-900/50 border-purple-500/20 backdrop-blur-sm ${
                plan.popular ? "ring-2 ring-purple-500/50" : ""
              } ${isCurrentPlan ? "ring-2 ring-green-500/50" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                    <Star className="w-3 h-3 mr-1" />
                    Más Popular
                  </Badge>
                </div>
              )}

              {isCurrentPlan && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                    <Crown className="w-3 h-3 mr-1" />
                    Actual
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-white">
                    {formatPrice(price)}
                    {plan.id !== "free" && (
                      <span className="text-sm font-normal text-gray-400">/{isYearly ? "año" : "mes"}</span>
                    )}
                  </div>
                  {isYearly && savings > 0 && (
                    <div className="text-sm text-green-400">Ahorras {formatPrice(savings)} al año</div>
                  )}
                </div>
                <CardDescription className="text-purple-300">{plan.aiCredits}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    isCurrentPlan
                      ? "bg-green-600 hover:bg-green-700"
                      : plan.popular
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        : "bg-slate-700 hover:bg-slate-600"
                  }`}
                  disabled={isCurrentPlan || isLoading}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Cargando...
                    </>
                  ) : isCurrentPlan ? (
                    "Plan Actual"
                  ) : plan.id === "free" ? (
                    "Gratis"
                  ) : (
                    `Actualizar ${isYearly ? "Anual" : "Mensual"}`
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Additional Info */}
      <div className="text-center text-sm text-gray-400 space-y-2">
        <p>Todos los planes incluyen:</p>
        <div className="flex flex-wrap justify-center gap-4">
          <span>✓ Sincronización en la nube</span>
          <span>✓ Acceso móvil</span>
          <span>✓ Actualizaciones gratuitas</span>
          <span>✓ Cancelación en cualquier momento</span>
        </div>
      </div>
    </div>
  )
}
