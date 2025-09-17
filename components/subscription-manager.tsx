"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Gem, Zap } from "lucide-react"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription"
import { CREDIT_PACKAGES } from "@/lib/ai-credits"

interface SubscriptionManagerProps {
  currentPlan: string
  onUpgrade: (planId: string) => void
  onPurchaseCredits: (packageId: string) => void
}

export function SubscriptionManager({ currentPlan, onUpgrade, onPurchaseCredits }: SubscriptionManagerProps) {
  const [selectedInterval, setSelectedInterval] = useState<"monthly" | "yearly">("monthly")

  const filteredPlans = SUBSCRIPTION_PLANS.filter((plan) => plan.id !== "free" && plan.interval === selectedInterval)

  const getPlanIcon = (planName: string) => {
    if (planName.toLowerCase().includes("pro")) return <Gem className="h-5 w-5" />
    if (planName.toLowerCase().includes("premium")) return <Crown className="h-5 w-5" />
    return <Zap className="h-5 w-5" />
  }

  return (
    <div className="space-y-8">
      {/* Plan Selection */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Elige tu plan</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Desbloquea todo el potencial de FutureTask</p>
        </div>

        {/* Interval Toggle */}
        <div className="flex justify-center">
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <Button
              variant={selectedInterval === "monthly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedInterval("monthly")}
            >
              Mensual
            </Button>
            <Button
              variant={selectedInterval === "yearly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedInterval("yearly")}
            >
              Anual
              <Badge variant="secondary" className="ml-2">
                Ahorra 20%
              </Badge>
            </Button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {filteredPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular ? "border-purple-500 shadow-lg scale-105" : ""
              } ${currentPlan === plan.id ? "bg-green-50 dark:bg-green-900/20" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-500 text-white">Más Popular</Badge>
                </div>
              )}

              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getPlanIcon(plan.name)}
                    <CardTitle>{plan.name}</CardTitle>
                  </div>
                  {currentPlan === plan.id && <Badge variant="secondary">Plan Actual</Badge>}
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold">{plan.priceFormatted}</div>
                  {plan.savings && <div className="text-sm text-green-600 dark:text-green-400">{plan.savings}</div>}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => onUpgrade(plan.id)}
                  disabled={currentPlan === plan.id}
                >
                  {currentPlan === plan.id ? "Plan Actual" : "Seleccionar Plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Credits Section (Pro users only) */}
      {currentPlan.includes("pro") && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Paquetes de Créditos IA</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Potencia tu productividad con nuestro asistente IA</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {CREDIT_PACKAGES.map((pkg) => (
              <Card key={pkg.id} className={`relative ${pkg.popular ? "border-blue-500 shadow-md" : ""}`}>
                {pkg.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white text-xs">Popular</Badge>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">{pkg.name}</CardTitle>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">{pkg.priceFormatted}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{pkg.credits} créditos</div>
                    {pkg.savings && <div className="text-xs text-green-600 dark:text-green-400">{pkg.savings}</div>}
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{pkg.description}</p>
                  <Button
                    className="w-full"
                    variant={pkg.popular ? "default" : "outline"}
                    onClick={() => onPurchaseCredits(pkg.id)}
                  >
                    Comprar Créditos
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">¿Cómo funcionan los créditos IA?</h3>
            <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
              <li>• 1 crédito = 1 consulta básica al asistente IA</li>
              <li>• Consultas complejas pueden usar más créditos</li>
              <li>• Los créditos no caducan nunca</li>
              <li>• Recibe notificaciones cuando te queden pocos créditos</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
