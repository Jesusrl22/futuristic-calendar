"use client"

import { useState } from "react"
import { X, Check, Zap, Crown, Rocket, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  currentPlan: string
  userId: string
  onUpgrade?: (plan: string, billingCycle: string) => void
}

const plans = [
  {
    id: "free",
    name: "Free",
    icon: Zap,
    color: "from-gray-400 to-gray-600",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: ["Tareas ilimitadas", "Temporizador Pomodoro básico", "Algunos logros", "Sincronización limitada"],
    notIncluded: ["IA avanzada", "Temas personalizados", "Soporte prioritario", "Estadísticas detalladas"],
  },
  {
    id: "premium",
    name: "Premium",
    icon: Crown,
    color: "from-purple-400 to-pink-600",
    monthlyPrice: 2.49,
    yearlyPrice: 24.99,
    popular: true,
    features: [
      "Todo de Free",
      "Eventos ilimitados",
      "Notas ilimitadas",
      "Lista de deseos",
      "Pomodoro avanzado",
      "Todos los logros",
      "Sincronización en tiempo real",
    ],
    notIncluded: ["Créditos IA incluidos", "Soporte prioritario 24/7"],
  },
  {
    id: "pro",
    name: "Pro",
    icon: Rocket,
    color: "from-yellow-400 to-orange-600",
    monthlyPrice: 4.99,
    yearlyPrice: 49.99,
    features: [
      "Todo de Premium",
      "500 créditos IA/mes",
      "Asistente IA avanzado",
      "Soporte prioritario 24/7",
      "Funciones beta exclusivas",
      "API de integración",
      "Backup automático",
    ],
    notIncluded: [],
  },
]

export function SubscriptionModal({ isOpen, onClose, currentPlan, userId, onUpgrade }: SubscriptionModalProps) {
  const [isYearly, setIsYearly] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  console.log("🎨 SubscriptionModal rendered with:", {
    isOpen,
    currentPlan,
    userId,
    plansCount: plans.length,
  })

  const handleSelectPlan = (planId: string) => {
    console.log("🎯 Plan selected:", planId)
    setError(null)
    if (planId === currentPlan) {
      return
    }
    setSelectedPlan(planId)
  }

  const handleContinue = () => {
    console.log("▶️ Continue clicked, selected plan:", selectedPlan)
    if (!selectedPlan || selectedPlan === "free") {
      return
    }
    setError(null)
    setShowPayment(true)
  }

  const handlePaymentSuccess = async () => {
    console.log("✅ Payment successful, updating subscription...")
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/subscription/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          plan: selectedPlan,
          billingCycle: isYearly ? "yearly" : "monthly",
        }),
      })

      const result = await response.json()
      console.log("📡 API response:", result)

      if (!response.ok) {
        throw new Error(result.error || result.details || "Error al actualizar la suscripción")
      }

      console.log("✅ Subscription updated successfully:", result)
      setSuccess(true)

      if (onUpgrade && selectedPlan) {
        onUpgrade(selectedPlan, isYearly ? "yearly" : "monthly")
      }

      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error: any) {
      console.error("❌ Error updating subscription:", error)
      setError(error.message || "Error al actualizar la suscripción")
      setLoading(false)
    }
  }

  const handleDemoPayment = () => {
    console.log("🎭 Demo payment simulated")
    handlePaymentSuccess()
  }

  const selectedPlanData = plans.find((p) => p.id === selectedPlan)
  const amount = selectedPlanData ? (isYearly ? selectedPlanData.yearlyPrice : selectedPlanData.monthlyPrice) : 0

  return (
    <>
      <Dialog open={isOpen && !showPayment && !success} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Elige tu Plan
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Selecciona el plan que mejor se adapte a tus necesidades
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-center gap-4 p-4 bg-muted/50 rounded-lg">
              <Label htmlFor="billing-toggle" className={!isYearly ? "font-semibold" : "text-muted-foreground"}>
                Mensual
              </Label>
              <Switch id="billing-toggle" checked={isYearly} onCheckedChange={setIsYearly} />
              <Label htmlFor="billing-toggle" className={isYearly ? "font-semibold" : "text-muted-foreground"}>
                Anual
              </Label>
              {isYearly && (
                <Badge variant="secondary" className="bg-green-500/20 text-green-700 dark:text-green-400">
                  Ahorra hasta 17%
                </Badge>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const PlanIcon = plan.icon
                const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
                const isCurrentPlan = plan.id === currentPlan
                const isSelected = plan.id === selectedPlan

                return (
                  <Card
                    key={plan.id}
                    className={`relative overflow-hidden transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? "ring-4 ring-primary shadow-2xl scale-105"
                        : isCurrentPlan
                          ? "ring-2 ring-green-500/50"
                          : "hover:shadow-xl hover:scale-[1.02]"
                    }`}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 text-xs font-semibold rounded-bl-lg">
                        Más Popular
                      </div>
                    )}

                    {isCurrentPlan && (
                      <div className="absolute top-0 left-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 text-xs font-semibold rounded-br-lg">
                        Plan Actual
                      </div>
                    )}

                    <CardContent className="p-6 space-y-6">
                      <div className="space-y-4">
                        <div
                          className={`w-16 h-16 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg`}
                        >
                          <PlanIcon className="w-8 h-8 text-white" />
                        </div>

                        <div>
                          <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold">{price}€</span>
                            {price > 0 && (
                              <span className="text-muted-foreground text-lg">/{isYearly ? "año" : "mes"}</span>
                            )}
                          </div>
                          {isYearly && price > 0 && (
                            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                              {(price / 12).toFixed(2)}€/mes • Facturado anualmente
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3 min-h-[320px]">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm leading-relaxed">{feature}</span>
                          </div>
                        ))}
                        {plan.notIncluded.map((feature, index) => (
                          <div key={`not-${index}`} className="flex items-start gap-3 opacity-40">
                            <X className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm line-through leading-relaxed">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Button
                        className={`w-full transition-all ${
                          isCurrentPlan
                            ? "bg-green-500 hover:bg-green-600"
                            : isSelected
                              ? "bg-primary hover:bg-primary/90 shadow-lg"
                              : "bg-gradient-to-r " + plan.color + " hover:opacity-90"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSelectPlan(plan.id)
                        }}
                        disabled={isCurrentPlan}
                      >
                        {isCurrentPlan ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Plan Actual
                          </>
                        ) : isSelected ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Seleccionado
                          </>
                        ) : (
                          "Seleccionar Plan"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {selectedPlan && selectedPlan !== currentPlan && selectedPlan !== "free" && (
              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button variant="outline" onClick={onClose} disabled={loading}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleContinue}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>Continuar con {selectedPlanData?.name}</>
                  )}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {showPayment && selectedPlan && (
        <Dialog open={showPayment} onOpenChange={() => setShowPayment(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Completar Pago</DialogTitle>
              <DialogDescription>Modo Demo - Pago Simulado</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Modo Demo</AlertTitle>
                <AlertDescription>
                  Esta es una demostración. En producción, aquí aparecerían los botones de PayPal.
                </AlertDescription>
              </Alert>

              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">{selectedPlanData?.name}</span>
                  <span className="text-2xl font-bold text-primary">{amount}€</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {isYearly ? "Facturación anual" : "Facturación mensual"}
                </div>
                {isYearly && amount > 0 && (
                  <div className="text-xs text-green-600 dark:text-green-400">
                    {(amount / 12).toFixed(2)}€/mes • Ahorra{" "}
                    {(
                      ((selectedPlanData!.monthlyPrice * 12 - amount) / (selectedPlanData!.monthlyPrice * 12)) *
                      100
                    ).toFixed(0)}
                    %
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Button onClick={handleDemoPayment} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    "Simular Pago (Demo)"
                  )}
                </Button>

                <Button variant="outline" onClick={() => setShowPayment(false)} disabled={loading} className="w-full">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {success && (
        <Dialog open={success} onOpenChange={() => setSuccess(false)}>
          <DialogContent className="max-w-md">
            <div className="text-center space-y-4 py-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">¡Suscripción Actualizada!</h3>
                <p className="text-muted-foreground">
                  Tu plan ha sido actualizado a {selectedPlanData?.name} exitosamente.
                </p>
              </div>
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">Recargando página...</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
