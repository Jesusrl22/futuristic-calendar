"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { CheckCircle, Star, Zap, Crown, ArrowLeft, Sparkles } from "lucide-react"
import { PayPalButton } from "@/components/paypal-button"

interface PricingSectionProps {
  onBack: () => void
  onUpgrade: () => void
}

export function PricingSection({ onBack, onUpgrade }: PricingSectionProps) {
  const [isYearly, setIsYearly] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const plans = [
    {
      id: "free",
      name: "Gratis",
      description: "Perfecto para uso personal",
      price: { monthly: 0, yearly: 0 },
      features: [
        "Hasta 50 tareas",
        "Técnica Pomodoro básica",
        "Vista de calendario",
        "Logros básicos",
        "Sincronización en la nube",
        "Soporte por email",
      ],
      limitations: ["Sin temas personalizados", "Sin estadísticas avanzadas", "Sin exportación de datos"],
      popular: false,
      color: "from-gray-500 to-gray-600",
    },
    {
      id: "premium",
      name: "Premium",
      description: "Para profesionales productivos",
      price: { monthly: 9.99, yearly: 99.99 },
      features: [
        "Tareas ilimitadas",
        "Pomodoro avanzado con estadísticas",
        "Vista semanal y mensual",
        "Todos los logros desbloqueados",
        "Temas personalizados",
        "Estadísticas detalladas",
        "Exportación de datos",
        "Plantillas de tareas",
        "Recordatorios inteligentes",
        "Soporte prioritario",
      ],
      limitations: [],
      popular: true,
      color: "from-blue-500 to-purple-600",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Para equipos y organizaciones",
      price: { monthly: 29.99, yearly: 299.99 },
      features: [
        "Todo lo de Premium",
        "Colaboración en equipo",
        "Gestión de proyectos",
        "Reportes avanzados",
        "API personalizada",
        "SSO y seguridad avanzada",
        "Onboarding personalizado",
        "Soporte 24/7",
        "Integración con herramientas empresariales",
      ],
      limitations: [],
      popular: false,
      color: "from-purple-500 to-pink-600",
    },
  ]

  const handlePaymentSuccess = (planId: string) => {
    console.log(`Payment successful for plan: ${planId}`)
    onUpgrade()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Desbloquea tu Potencial
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Elige el plan perfecto para llevar tu productividad al siguiente nivel
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${!isYearly ? "text-gray-900 dark:text-gray-100 font-medium" : "text-gray-500"}`}>
              Mensual
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`text-sm ${isYearly ? "text-gray-900 dark:text-gray-100 font-medium" : "text-gray-500"}`}>
              Anual
            </span>
            {isYearly && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Ahorra 17%</Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? "border-2 border-blue-500 shadow-lg scale-105"
                  : "border border-gray-200 dark:border-gray-700 hover:border-blue-300"
              } ${selectedPlan === plan.id ? "ring-2 ring-blue-500" : ""}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-2 text-sm font-medium">
                  <Star className="w-4 h-4 inline mr-1" />
                  Más Popular
                </div>
              )}

              <CardHeader className={`text-center ${plan.popular ? "pt-12" : "pt-6"}`}>
                <div
                  className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center`}
                >
                  {plan.id === "free" && <Zap className="w-6 h-6 text-white" />}
                  {plan.id === "premium" && <Star className="w-6 h-6 text-white" />}
                  {plan.id === "enterprise" && <Crown className="w-6 h-6 text-white" />}
                </div>

                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <CardDescription className="mb-4">{plan.description}</CardDescription>

                <div className="mb-4">
                  <div className="text-4xl font-bold">
                    ${isYearly ? plan.price.yearly : plan.price.monthly}
                    {plan.price.monthly > 0 && (
                      <span className="text-lg font-normal text-gray-500">/{isYearly ? "año" : "mes"}</span>
                    )}
                  </div>
                  {isYearly && plan.price.monthly > 0 && (
                    <div className="text-sm text-gray-500 mt-1">
                      ${(plan.price.yearly / 12).toFixed(2)}/mes facturado anualmente
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  {plan.id === "free" ? (
                    <Button className="w-full bg-transparent" variant="outline" onClick={onBack}>
                      Continuar Gratis
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <PayPalButton
                        amount={isYearly ? plan.price.yearly : plan.price.monthly}
                        planName={plan.name}
                        onSuccess={() => handlePaymentSuccess(plan.id)}
                        className="w-full"
                      />
                      <Button
                        className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white`}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Elegir {plan.name}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">Preguntas Frecuentes</h2>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">¿Puedo cambiar de plan en cualquier momento?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Sí, puedes actualizar o degradar tu plan en cualquier momento. Los cambios se aplicarán en tu próximo
                  ciclo de facturación.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">¿Hay garantía de devolución?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Ofrecemos una garantía de devolución de 30 días sin preguntas. Si no estás satisfecho, te devolvemos
                  tu dinero.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">¿Mis datos están seguros?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Absolutamente. Utilizamos encriptación de nivel empresarial y cumplimos con todas las regulaciones de
                  privacidad internacionales.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">¿Necesitas un plan personalizado para tu empresa?</p>
          <Button variant="outline">Contactar Ventas</Button>
        </div>
      </div>
    </div>
  )
}
