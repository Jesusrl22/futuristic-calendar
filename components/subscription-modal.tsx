"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles } from "lucide-react"
import { subscriptionPlans, formatPrice, type BillingCycle } from "@/lib/subscription"
import { PayPalButtons } from "@paypal/react-paypal-js"

interface SubscriptionModalProps {
  userId: string
  currentPlan: string
  billingCycle: string
}

export function SubscriptionModal({ userId, currentPlan, billingCycle }: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>(currentPlan)
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>((billingCycle as BillingCycle) || "monthly")
  const [loading, setLoading] = useState(false)

  const handlePlanSelect = (planId: string) => {
    if (planId !== "free") {
      setSelectedPlan(planId)
    }
  }

  const selectedPlanData = subscriptionPlans.find((p) => p.id === selectedPlan)
  const price = selectedCycle === "monthly" ? selectedPlanData?.monthlyPrice : selectedPlanData?.yearlyPrice

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Elige tu Plan</h1>
        <p className="text-muted-foreground">Selecciona el plan que mejor se adapte a tus necesidades</p>
      </div>

      {/* Toggle Mensual/Anual */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg border border-border p-1 bg-muted/50">
          <Button
            variant={selectedCycle === "monthly" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedCycle("monthly")}
            className={selectedCycle === "monthly" ? "bg-primary text-primary-foreground" : ""}
          >
            Mensual
          </Button>
          <Button
            variant={selectedCycle === "yearly" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedCycle("yearly")}
            className={selectedCycle === "yearly" ? "bg-primary text-primary-foreground" : ""}
          >
            Anual
            <Badge variant="secondary" className="ml-2">
              Ahorra 20%
            </Badge>
          </Button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {subscriptionPlans.map((plan) => {
          const price = selectedCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice
          const isCurrentPlan = currentPlan === plan.id
          const isSelected = selectedPlan === plan.id

          return (
            <Card
              key={plan.id}
              className={`relative cursor-pointer transition-all ${
                isSelected ? "border-primary border-2 shadow-lg" : "hover:border-primary/50"
              } ${plan.popular ? "border-primary/50" : ""}`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Más Popular</Badge>
                </div>
              )}
              {isCurrentPlan && (
                <div className="absolute -top-3 right-4">
                  <Badge variant="secondary">Plan Actual</Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {plan.name}
                  {plan.aiCreditsIncluded > 0 && <Sparkles className="h-5 w-5 text-primary" />}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{formatPrice(price)}</span>
                  {price > 0 && (
                    <span className="text-muted-foreground">/{selectedCycle === "monthly" ? "mes" : "año"}</span>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full mt-6"
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => handlePlanSelect(plan.id)}
                  disabled={isCurrentPlan || plan.id === "free"}
                >
                  {isCurrentPlan ? "Plan Actual" : isSelected ? "✓ Seleccionado" : "Seleccionar"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Payment Section */}
      {selectedPlan !== "free" && selectedPlan !== currentPlan && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Confirmar Suscripción</CardTitle>
            <CardDescription>
              Has seleccionado el plan {selectedPlanData?.name} - {selectedCycle === "monthly" ? "Mensual" : "Anual"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Plan:</span>
                <span className="font-semibold">{selectedPlanData?.name}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Ciclo:</span>
                <span className="font-semibold">{selectedCycle === "monthly" ? "Mensual" : "Anual"}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-muted-foreground">Total:</span>
                <span className="text-2xl font-bold">{formatPrice(price || 0)}</span>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg mb-4">
              <p className="text-sm text-muted-foreground">
                Serás redirigido a PayPal para completar el pago de forma segura.
              </p>
            </div>

            <PayPalButtons
              style={{ layout: "vertical" }}
              createOrder={async () => {
                const response = await fetch("/api/paypal/create-subscription", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    planId: selectedPlan,
                    billingCycle: selectedCycle,
                    userId,
                  }),
                })
                const data = await response.json()
                return data.subscriptionId
              }}
              onApprove={async (data) => {
                setLoading(true)
                window.location.href = `/payment/success?subscription_id=${data.subscriptionID}`
              }}
              onError={(err) => {
                console.error("PayPal error:", err)
                alert("Error al procesar el pago")
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
