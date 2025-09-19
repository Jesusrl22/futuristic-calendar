"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Check, X, Star, Crown, Zap, Calendar, Target, Brain, Palette, BarChart3, Gift } from "lucide-react"
import { updateUserSubscription } from "@/lib/hybrid-database"

interface SubscriptionManagerProps {
  currentUser?: any
  onUpgrade?: (plan: string) => void
}

export function SubscriptionManager({ currentUser, onUpgrade }: SubscriptionManagerProps) {
  const [isYearly, setIsYearly] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  const plans = [
    {
      id: "free",
      name: "Gratuito",
      icon: <Target className="h-6 w-6" />,
      price: { monthly: 0, yearly: 0 },
      description: "Perfecto para empezar",
      color: "from-gray-400 to-gray-600",
      badge: null,
      features: [
        "Tareas ilimitadas",
        "Calendario básico",
        "Pomodoro básico (25/5/15 min)",
        "Temas básicos (claro/oscuro)",
        "Logros básicos",
        "Sincronización en la nube",
      ],
      limitations: [
        "Sin ajustes avanzados de Pomodoro",
        "Sin lista de deseos",
        "Sin notas avanzadas",
        "Sin asistente IA",
        "Sin análisis avanzados",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      icon: <Star className="h-6 w-6" />,
      price: { monthly: 1.99, yearly: 20 },
      description: "Para usuarios productivos",
      color: "from-yellow-400 to-orange-500",
      badge: "Más Popular",
      features: [
        "Todo del plan Gratuito",
        "Ajustes avanzados de Pomodoro",
        "Temas premium y personalización",
        "Lista de deseos completa",
        "Notas avanzadas con etiquetas",
        "Logros premium",
        "Gráficas de rendimiento",
        "Estadísticas detalladas",
        "Categorías personalizadas",
      ],
      limitations: ["Sin asistente IA", "Sin créditos IA", "Sin automatizaciones inteligentes"],
    },
    {
      id: "pro",
      name: "Pro",
      icon: <Crown className="h-6 w-6" />,
      price: { monthly: 4.99, yearly: 45 },
      description: "Máxima productividad con IA",
      color: "from-purple-500 to-blue-600",
      badge: "Recomendado",
      features: [
        "Todo del plan Premium",
        "Asistente IA completo",
        "500 créditos IA mensuales",
        "Análisis inteligente de productividad",
        "Sugerencias personalizadas por IA",
        "Automatizaciones inteligentes",
        "Predicciones de rendimiento",
        "Optimización de horarios",
        "Soporte prioritario",
      ],
      limitations: [],
    },
  ]

  const handleUpgrade = async (planId: string) => {
    if (!currentUser) return

    setLoading(planId)
    try {
      await updateUserSubscription(currentUser.id, planId, "active")
      onUpgrade?.(planId)
    } catch (error) {
      console.error("Error upgrading subscription:", error)
    } finally {
      setLoading(null)
    }
  }

  const getYearlySavings = (monthly: number, yearly: number) => {
    if (monthly === 0) return 0
    const monthlyCost = monthly * 12
    return Math.round(((monthlyCost - yearly) / monthlyCost) * 100)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Elige tu Plan Perfecto
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Desbloquea todo el potencial de FutureTask con nuestros planes diseñados para cada nivel de productividad
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 p-1 bg-muted rounded-lg w-fit mx-auto">
          <span className={`text-sm ${!isYearly ? "font-semibold" : "text-muted-foreground"}`}>Mensual</span>
          <Switch checked={isYearly} onCheckedChange={setIsYearly} />
          <span className={`text-sm ${isYearly ? "font-semibold" : "text-muted-foreground"}`}>
            Anual
            <Badge variant="secondary" className="ml-2 text-xs">
              Ahorra hasta 58%
            </Badge>
          </span>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = currentUser?.subscription_plan === plan.id
          const price = isYearly ? plan.price.yearly : plan.price.monthly
          const savings = getYearlySavings(plan.price.monthly, plan.price.yearly)

          return (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                isCurrentPlan ? "ring-2 ring-blue-500 shadow-lg" : ""
              } ${plan.id === "premium" ? "scale-105 border-orange-200" : ""}`}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-5`} />

              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-1 -right-1">
                  <Badge className={`bg-gradient-to-r ${plan.color} text-white border-0`}>{plan.badge}</Badge>
                </div>
              )}

              {isCurrentPlan && (
                <div className="absolute top-4 right-4">
                  <Badge variant="default" className="bg-blue-500">
                    Plan Actual
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center space-y-4">
                <div
                  className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center text-white`}
                >
                  {plan.icon}
                </div>
                <div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold">€{price}</span>
                    <span className="text-muted-foreground">/{isYearly ? "año" : "mes"}</span>
                  </div>
                  {isYearly && plan.price.monthly > 0 && (
                    <div className="text-sm text-green-600">
                      Ahorras {savings}% (€{(plan.price.monthly * 12 - plan.price.yearly).toFixed(2)}/año)
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-green-700 flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Incluye:
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-red-700 flex items-center gap-2">
                      <X className="h-4 w-4" />
                      No incluye:
                    </h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <X className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Button */}
                <Button
                  className={`w-full ${
                    isCurrentPlan
                      ? "bg-gray-100 text-gray-600 cursor-default"
                      : `bg-gradient-to-r ${plan.color} hover:opacity-90 text-white`
                  }`}
                  disabled={isCurrentPlan || loading === plan.id}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {loading === plan.id
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

      {/* Feature Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Comparación Detallada de Características
          </CardTitle>
          <CardDescription>Encuentra el plan perfecto para tus necesidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Característica</th>
                  <th className="text-center py-3 px-4">Gratuito</th>
                  <th className="text-center py-3 px-4">Premium</th>
                  <th className="text-center py-3 px-4">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  {
                    name: "Tareas ilimitadas",
                    free: true,
                    premium: true,
                    pro: true,
                    icon: <Target className="h-4 w-4" />,
                  },
                  {
                    name: "Calendario básico",
                    free: true,
                    premium: true,
                    pro: true,
                    icon: <Calendar className="h-4 w-4" />,
                  },
                  { name: "Pomodoro básico", free: true, premium: true, pro: true, icon: <Zap className="h-4 w-4" /> },
                  {
                    name: "Temas básicos",
                    free: true,
                    premium: true,
                    pro: true,
                    icon: <Palette className="h-4 w-4" />,
                  },
                  {
                    name: "Pomodoro avanzado",
                    free: false,
                    premium: true,
                    pro: true,
                    icon: <Zap className="h-4 w-4" />,
                  },
                  {
                    name: "Temas premium",
                    free: false,
                    premium: true,
                    pro: true,
                    icon: <Palette className="h-4 w-4" />,
                  },
                  {
                    name: "Lista de deseos",
                    free: false,
                    premium: true,
                    pro: true,
                    icon: <Gift className="h-4 w-4" />,
                  },
                  {
                    name: "Notas avanzadas",
                    free: false,
                    premium: true,
                    pro: true,
                    icon: <Target className="h-4 w-4" />,
                  },
                  {
                    name: "Gráficas de rendimiento",
                    free: false,
                    premium: true,
                    pro: true,
                    icon: <BarChart3 className="h-4 w-4" />,
                  },
                  { name: "Asistente IA", free: false, premium: false, pro: true, icon: <Brain className="h-4 w-4" /> },
                  {
                    name: "Créditos IA (500/mes)",
                    free: false,
                    premium: false,
                    pro: true,
                    icon: <Brain className="h-4 w-4" />,
                  },
                ].map((feature, index) => (
                  <tr key={index} className="hover:bg-muted/50">
                    <td className="py-3 px-4 flex items-center gap-2">
                      {feature.icon}
                      {feature.name}
                    </td>
                    <td className="text-center py-3 px-4">
                      {feature.free ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {feature.premium ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {feature.pro ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-400 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Preguntas Frecuentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">¿Puedo cambiar de plan en cualquier momento?</h4>
            <p className="text-sm text-muted-foreground">
              Sí, puedes actualizar o degradar tu plan en cualquier momento. Los cambios se aplicarán inmediatamente.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">¿Qué son los créditos IA?</h4>
            <p className="text-sm text-muted-foreground">
              Los créditos IA te permiten usar nuestro asistente inteligente para generar sugerencias, analizar tu
              productividad y automatizar tareas.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">¿Hay descuentos para estudiantes?</h4>
            <p className="text-sm text-muted-foreground">
              Sí, ofrecemos descuentos especiales para estudiantes. Contáctanos para más información.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
