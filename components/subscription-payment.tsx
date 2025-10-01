"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Check, Crown, Zap, Star, Loader2, Info } from "lucide-react"

interface SubscriptionPlan {
  id: string
  name: string
  monthlyPriceBase: number
  monthlyPriceFinal: number
  yearlyPriceBase: number
  yearlyPriceFinal: number
  features: string[]
  popular?: boolean
  current?: boolean
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "premium",
    name: "Premium",
    monthlyPriceBase: 2.06,
    monthlyPriceFinal: 2.49,
    yearlyPriceBase: 20.65,
    yearlyPriceFinal: 24.99,
    features: [
      "Tareas ilimitadas",
      "Notas avanzadas",
      "Calendario integrado",
      "Sincronización en la nube",
      "Soporte prioritario",
      "Sin anuncios",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPriceBase: 4.95,
    monthlyPriceFinal: 5.99,
    yearlyPriceBase: 45.45,
    yearlyPriceFinal: 54.99,
    popular: true,
    features: [
      "Todo lo de Premium",
      "500 créditos IA mensuales",
      "Asistente IA avanzado",
      "Análisis de productividad",
      "Integraciones premium",
      "Soporte 24/7",
      "Funciones beta exclusivas",
    ],
  },
]

interface SubscriptionPaymentProps {
  userId: string
  userEmail: string
  userName: string
  currentPlan?: string
  onSuccess?: () => void
}

export function SubscriptionPayment({
  userId,
  userEmail,
  userName,
  currentPlan = "free",
  onSuccess,
}: SubscriptionPaymentProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async (planId: string) => {
    setIsLoading(true)
    setSelectedPlan(planId)

    try {
      const planType = `${planId}_${billingCycle}`

      const response = await fetch("/api/paypal/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planType,
          userId,
          userEmail,
          userName,
        }),
      })

      const data = await response.json()

      if (data.approvalUrl) {
        // Redirect to PayPal for approval
        window.location.href = data.approvalUrl
      } else {
        throw new Error("No approval URL received")
      }
    } catch (error) {
      console.error("Subscription error:", error)
      alert("Error al crear la suscripción. Por favor, inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
      setSelectedPlan(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  const calculateVAT = (basePrice: number) => {
    return basePrice * 0.21
  }

  const getYearlySavings = (monthlyFinal: number, yearlyFinal: number) => {
    const monthlyCost = monthlyFinal * 12
    const savings = monthlyCost - yearlyFinal
    const percentage = Math.round((savings / monthlyCost) * 100)
    return { savings, percentage }
  }

  return (
    <div className="space-y-6">
      {/* VAT Info */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
        <Info className="h-4 w-4" />
        <span>Todos los precios incluyen IVA (21%)</span>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center">
        <div className="bg-slate-800 p-1 rounded-lg flex">
          <Button
            variant={billingCycle === "monthly" ? "default" : "ghost"}
            size="sm"
            onClick={() => setBillingCycle("monthly")}
            className="text-sm"
          >
            Mensual
          </Button>
          <Button
            variant={billingCycle === "yearly" ? "default" : "ghost"}
            size="sm"
            onClick={() => setBillingCycle("yearly")}
            className="text-sm"
          >
            Anual
            <Badge variant="secondary" className="ml-2 text-xs">
              Ahorra hasta 17%
            </Badge>
          </Button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subscriptionPlans.map((plan) => {
          const priceBase = billingCycle === "monthly" ? plan.monthlyPriceBase : plan.yearlyPriceBase
          const priceFinal = billingCycle === "monthly" ? plan.monthlyPriceFinal : plan.yearlyPriceFinal
          const vatAmount = calculateVAT(priceBase)
          const isCurrentPlan = currentPlan === plan.id
          const yearlySavings = getYearlySavings(plan.monthlyPriceFinal, plan.yearlyPriceFinal)
          const isProcessing = isLoading && selectedPlan === plan.id

          return (
            <Card
              key={plan.id}
              className={`relative bg-slate-900/50 border-2 transition-all duration-200 ${
                plan.popular
                  ? "border-purple-500/50 shadow-lg shadow-purple-500/20"
                  : "border-slate-700 hover:border-purple-500/30"
              } ${isCurrentPlan ? "opacity-60" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Más Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {plan.id === "premium" ? (
                    <Crown className="h-5 w-5 text-yellow-400" />
                  ) : (
                    <Zap className="h-5 w-5 text-purple-400" />
                  )}
                  <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                </div>

                <div className="space-y-3">
                  <div className="text-3xl font-bold text-white">
                    {formatPrice(priceFinal)}
                    <span className="text-sm font-normal text-gray-400">
                      /{billingCycle === "monthly" ? "mes" : "año"}
                    </span>
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-slate-800/50 rounded-lg p-3 text-xs space-y-1">
                    <div className="flex justify-between text-gray-400">
                      <span>Precio base:</span>
                      <span>{formatPrice(priceBase)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>IVA (21%):</span>
                      <span>{formatPrice(vatAmount)}</span>
                    </div>
                    <Separator className="bg-slate-600" />
                    <div className="flex justify-between text-white font-medium">
                      <span>Total:</span>
                      <span>{formatPrice(priceFinal)}</span>
                    </div>
                  </div>

                  {billingCycle === "yearly" && (
                    <div className="text-sm text-green-400">
                      Ahorras {formatPrice(yearlySavings.savings)} ({yearlySavings.percentage}%)
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <Separator className="bg-slate-700" />

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Separator className="bg-slate-700" />

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isCurrentPlan || isLoading}
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      : "bg-slate-700 hover:bg-slate-600"
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : isCurrentPlan ? (
                    "Plan Actual"
                  ) : (
                    `Suscribirse a ${plan.name}`
                  )}
                </Button>

                {isCurrentPlan && <p className="text-center text-xs text-gray-400">Ya tienes este plan activo</p>}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Additional Info */}
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-400">Todos los precios incluyen IVA. Puedes cancelar en cualquier momento.</p>
        <p className="text-xs text-gray-500">Los pagos son procesados de forma segura por PayPal</p>
      </div>
    </div>
  )
}
