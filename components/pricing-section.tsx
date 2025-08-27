"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Check, Crown, X, Palette, Timer, BarChart3, Bell, Target, BookOpen, ArrowLeft } from "lucide-react"

interface PricingSectionProps {
  onSelectPlan: (plan: "free" | "premium") => void
  currentPlan: "free" | "premium"
  onBack?: () => void
}

export default function PricingSection({ onSelectPlan, currentPlan, onBack }: PricingSectionProps) {
  const [isYearly, setIsYearly] = useState(false)

  const monthlyPrice = 1.99
  const yearlyPrice = 19.99
  const yearlyMonthlyEquivalent = yearlyPrice / 12

  const features = {
    free: [
      { name: "Hasta 50 tareas por mes", included: true },
      { name: "3 temas básicos", included: true },
      { name: "10 sesiones Pomodoro/día", included: true },
      { name: "Estadísticas básicas", included: true },
      { name: "Plantillas del sistema", included: true },
      { name: "Tareas ilimitadas", included: false },
      { name: "8 temas premium", included: false },
      { name: "Pomodoro ilimitado", included: false },
      { name: "Estadísticas avanzadas", included: false },
      { name: "Objetivos y Lista de Deseos", included: false },
      { name: "Notas y Blog personal", included: false },
      { name: "Sin anuncios", included: false },
      { name: "Exportación de datos", included: false },
      { name: "Soporte prioritario", included: false },
    ],
    premium: [
      { name: "Tareas ilimitadas", included: true },
      { name: "11 temas (3 básicos + 8 premium)", included: true },
      { name: "Pomodoro ilimitado", included: true },
      { name: "Estadísticas avanzadas", included: true },
      { name: "Objetivos y Lista de Deseos", included: true },
      { name: "Notas y Blog personal", included: true },
      { name: "Sin anuncios", included: true },
      { name: "Exportación de datos", included: true },
      { name: "Notificaciones avanzadas", included: true },
      { name: "Soporte prioritario", included: true },
      { name: "Acceso anticipado a nuevas funciones", included: true },
    ],
  }

  const premiumHighlights = [
    {
      icon: Crown,
      title: "Tareas Ilimitadas",
      description: "Crea tantas tareas como necesites sin restricciones",
    },
    {
      icon: Palette,
      title: "8 Temas Premium",
      description: "Personaliza tu experiencia con temas exclusivos como Cósmico, Galaxia y más",
    },
    {
      icon: Timer,
      title: "Pomodoro Avanzado",
      description: "Sesiones ilimitadas con estadísticas detalladas y sonidos personalizados",
    },
    {
      icon: BarChart3,
      title: "Estadísticas Avanzadas",
      description: "Análisis profundo de tu productividad con gráficos y métricas detalladas",
    },
    {
      icon: Target,
      title: "Objetivos y Lista de Deseos",
      description: "Establece y rastrea objetivos personales con sistema de hitos y progreso",
    },
    {
      icon: BookOpen,
      title: "Notas y Blog Personal",
      description: "Crea y organiza notas personales con categorías, etiquetas y favoritos",
    },
    {
      icon: Bell,
      title: "Sin Anuncios",
      description: "Experiencia completamente libre de distracciones publicitarias",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {onBack && (
            <Button onClick={onBack} variant="ghost" className="text-white hover:bg-white/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          )}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">FutureTask Premium</h1>
          </div>
          <div></div>
        </div>

        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Elige tu plan</h2>
            <p className="text-white/80 mb-6">Desbloquea todo el potencial de FutureTask</p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`text-sm ${!isYearly ? "font-semibold text-white" : "text-white/60"}`}>Mensual</span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} />
              <span className={`text-sm ${isYearly ? "font-semibold text-white" : "text-white/60"}`}>Anual</span>
              {isYearly && <Badge className="bg-green-100 text-green-800 border-green-200">Ahorra 17%</Badge>}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card
              className={`relative bg-white/10 backdrop-blur-md border-white/20 ${currentPlan === "free" ? "ring-2 ring-blue-500" : ""}`}
            >
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-white">Plan Gratuito</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">€0</span>
                  <span className="text-white/60">/mes</span>
                </div>
                <p className="text-white/60 mt-2">Perfecto para empezar</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {features.free.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-white/40 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${feature.included ? "text-white" : "text-white/40"}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
                <Button
                  variant={currentPlan === "free" ? "default" : "outline"}
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20"
                  onClick={() => onSelectPlan("free")}
                  disabled={currentPlan === "free"}
                >
                  {currentPlan === "free" ? "Plan Actual" : "Seleccionar Gratuito"}
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card
              className={`relative bg-white/10 backdrop-blur-md border-white/20 ${currentPlan === "premium" ? "ring-2 ring-yellow-500" : "ring-2 ring-blue-500"}`}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1">
                  <Crown className="h-4 w-4 mr-1" />
                  Más Popular
                </Badge>
              </div>
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl font-bold text-white flex items-center justify-center">
                  <Crown className="h-6 w-6 mr-2 text-yellow-400" />
                  Plan Premium
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">
                    €{isYearly ? yearlyMonthlyEquivalent.toFixed(2) : monthlyPrice.toFixed(2)}
                  </span>
                  <span className="text-white/60">/mes</span>
                  {isYearly && (
                    <div className="text-sm text-white/60 mt-1">
                      Facturado anualmente (€{yearlyPrice.toFixed(2)}/año)
                    </div>
                  )}
                </div>
                <p className="text-white/60 mt-2">Para máxima productividad</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {features.premium.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-white">{feature.name}</span>
                    </div>
                  ))}
                </div>

                {currentPlan === "premium" ? (
                  <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500" disabled>
                    <Crown className="h-4 w-4 mr-2" />
                    Plan Actual
                  </Button>
                ) : (
                  <Button
                    onClick={() => onSelectPlan("premium")}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Actualizar a Premium
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Premium Features Highlight */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">¿Por qué elegir Premium?</h3>
              <p className="text-white/80">Descubre todas las funciones que desbloquearás</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {premiumHighlights.map((highlight, index) => (
                <Card
                  key={index}
                  className="bg-white/10 backdrop-blur-md border-white/20 hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <highlight.icon className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-white">{highlight.title}</h4>
                    </div>
                    <p className="text-white/70 text-sm">{highlight.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-center text-white mb-8">Preguntas Frecuentes</h3>
            <div className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-white mb-2">¿Puedo cambiar de plan en cualquier momento?</h4>
                  <p className="text-white/70 text-sm">
                    Sí, puedes actualizar a Premium o cancelar tu suscripción en cualquier momento desde la
                    configuración de tu cuenta.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-white mb-2">¿Qué incluyen los temas premium?</h4>
                  <p className="text-white/70 text-sm">
                    Los temas premium incluyen 8 diseños exclusivos como Cósmico, Galaxia, Bosque Místico, y más, con
                    gradientes únicos y paletas de colores cuidadosamente diseñadas.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-white mb-2">¿Qué son los Objetivos y Lista de Deseos?</h4>
                  <p className="text-white/70 text-sm">
                    Es una función premium que te permite establecer objetivos personales, dividirlos en hitos más
                    pequeños, y seguir tu progreso hacia el logro de tus metas más importantes.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-white mb-2">¿Cómo funciona el sistema de Notas y Blog?</h4>
                  <p className="text-white/70 text-sm">
                    Puedes crear notas personales, organizarlas por categorías, añadir etiquetas, marcar favoritos y
                    usar la búsqueda avanzada. Es perfecto para journaling, ideas, recetas o cualquier tipo de escritura
                    personal.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
