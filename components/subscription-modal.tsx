"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Crown, Star, User, Check, Zap, Brain, Shield, Sparkles } from "lucide-react"

interface SubscriptionModalProps {
  currentPlan: string
  onPlanChange: (planId: string) => void
  onCancelSubscription?: () => void
  onClose: () => void
}

export function SubscriptionModal({
  currentPlan,
  onPlanChange,
  onCancelSubscription,
  onClose,
}: SubscriptionModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBilling, setSelectedBilling] = useState<"monthly" | "yearly">("monthly")

  const plans = [
    {
      id: "free",
      name: "Gratuito",
      icon: User,
      price: 0,
      priceYearly: 0,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      gradient: "from-gray-400 to-gray-600",
      description: "Perfecto para empezar",
      features: [
        "Tareas básicas ilimitadas",
        "Calendario básico",
        "Pomodoro básico (25/5/15 min)",
        "Temas básicos (claro/oscuro)",
        "Logros e insignias básicas",
        "Sincronización en la nube",
        "Soporte por email",
      ],
      popular: false,
    },
    {
      id: "premium",
      name: "Premium",
      icon: Star,
      price: 1.99,
      priceYearly: 20,
      color: "text-yellow-600",
      bgColor: "bg-gradient-to-r from-yellow-500 to-orange-500",
      gradient: "from-yellow-500 to-orange-500",
      description: "Para usuarios productivos",
      features: [
        "Todo lo del plan Gratuito",
        "Ajustes avanzados de Pomodoro",
        "Temas premium y personalización",
        "Lista de deseos completa",
        "Notas avanzadas con etiquetas",
        "Logros e insignias premium",
        "Gráficas de rendimiento avanzadas",
        "Estadísticas detalladas",
        "Soporte prioritario",
      ],
      popular: true,
      savings: "Ahorra €3.88 al año",
    },
    {
      id: "pro",
      name: "Pro",
      icon: Crown,
      price: 4.99,
      priceYearly: 45,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-r from-purple-500 to-blue-500",
      gradient: "from-purple-500 to-blue-500",
      description: "Máxima productividad con IA",
      features: [
        "Todo lo del plan Premium",
        "Asistente IA completo",
        "500 créditos IA mensuales",
        "Análisis inteligente de productividad",
        "Sugerencias personalizadas por IA",
        "Automatizaciones inteligentes",
        "Predicciones de rendimiento",
        "Integración con APIs externas",
        "Soporte premium 24/7",
      ],
      popular: false,
      savings: "Ahorra €14.88 al año",
    },
  ]

  const handlePlanChange = async (planId: string) => {
    setIsLoading(true)
    try {
      const finalPlanId = planId === "free" ? planId : `${planId}_${selectedBilling}`
      await onPlanChange(finalPlanId)
      onClose()
    } catch (error) {
      console.error("Error changing plan:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (onCancelSubscription) {
      setIsLoading(true)
      try {
        await onCancelSubscription()
        onClose()
      } catch (error) {
        console.error("Error canceling subscription:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const getPrice = (plan: any) => {
    if (plan.id === "free") return "€0"
    return selectedBilling === "yearly" ? `€${plan.priceYearly}/año` : `€${plan.price}/mes`
  }

  const getMonthlyPrice = (plan: any) => {
    if (plan.id === "free") return "€0"
    return selectedBilling === "yearly" ? `€${(plan.priceYearly / 12).toFixed(2)}/mes` : `€${plan.price}/mes`
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-7xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Elige tu Plan</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2">Desbloquea todo el potencial de FutureTask</p>
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-1 flex">
              <button
                onClick={() => setSelectedBilling("monthly")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedBilling === "monthly"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Mensual
              </button>
              <button
                onClick={() => setSelectedBilling("yearly")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all relative ${
                  selectedBilling === "yearly"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Anual
                <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1 py-0">Ahorra</Badge>
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => {
              const isCurrentPlan = currentPlan.includes(plan.id)
              const Icon = plan.icon

              return (
                <Card
                  key={plan.id}
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    plan.popular ? "ring-2 ring-purple-500 dark:ring-purple-400 scale-105" : "hover:scale-105"
                  } ${isCurrentPlan ? "ring-2 ring-green-500" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-center py-2 text-sm font-medium">
                      <Sparkles className="inline h-4 w-4 mr-1" />
                      Más Popular
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-2 text-sm font-medium">
                      <Check className="inline h-4 w-4 mr-1" />
                      Plan Actual
                    </div>
                  )}

                  <CardHeader className={`text-center ${plan.popular || isCurrentPlan ? "pt-12" : "pt-6"}`}>
                    <div
                      className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center mb-4`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">{plan.name}</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">{plan.description}</CardDescription>
                    <div className="mt-4">
                      <div className="text-4xl font-bold text-slate-900 dark:text-white">{getMonthlyPrice(plan)}</div>
                      {selectedBilling === "yearly" && plan.id !== "free" && (
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          Facturado anualmente ({getPrice(plan)})
                        </div>
                      )}
                      {selectedBilling === "yearly" && plan.savings && (
                        <div className="text-sm text-green-600 font-medium mt-1">{plan.savings}</div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-600 dark:text-slate-400">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handlePlanChange(plan.id)}
                      disabled={isLoading || isCurrentPlan}
                      className={`w-full mt-6 ${
                        plan.id === "free"
                          ? "bg-gray-500 hover:bg-gray-600"
                          : plan.id === "premium"
                            ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                            : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      } text-white`}
                    >
                      {isLoading
                        ? "Procesando..."
                        : isCurrentPlan
                          ? "Plan Actual"
                          : plan.id === "free"
                            ? "Cambiar a Gratuito"
                            : `Actualizar a ${plan.name}`}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Features Comparison */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 text-center">
              Comparación de Características
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center mb-3">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Gratuito</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Funciones básicas para empezar tu viaje de productividad
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center mb-3">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Premium</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Herramientas avanzadas y personalización para usuarios serios
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mb-3">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Pro</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Inteligencia artificial y automatización para máxima eficiencia
                </p>
              </div>
            </div>
          </div>

          {/* Cancel Subscription */}
          {currentPlan !== "free" && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={handleCancelSubscription}
                disabled={isLoading}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 bg-transparent"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar Suscripción
              </Button>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Tu suscripción seguirá activa hasta el final del período de facturación
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
