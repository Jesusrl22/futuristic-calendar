"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Crown, Star, Zap, Check, X } from "lucide-react"
import { PayPalPayment } from "@/components/paypal-payment"
import { AiCreditsPurchase } from "@/components/ai-credits-purchase"
import { SubscriptionCancellation } from "@/components/subscription-cancellation"
import type { User } from "@/lib/hybrid-database"

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  user: User
  onUserUpdate: (updates: Partial<User>) => void
}

export function SubscriptionModal({ isOpen, onClose, user, onUserUpdate }: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<"premium" | "pro" | null>(null)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [showAiCredits, setShowAiCredits] = useState(false)
  const [showCancellation, setShowCancellation] = useState(false)

  const plans = {
    premium: {
      name: "Premium",
      monthly: { base: 2.07, vat: 0.42, total: 2.49 },
      yearly: { base: 20.66, vat: 4.33, total: 24.99 },
      features: [
        "Tareas ilimitadas",
        "Notas avanzadas",
        "Lista de deseos premium",
        "Sincronización en la nube",
        "Soporte prioritario",
      ],
      notIncluded: ["Créditos IA incluidos"],
    },
    pro: {
      name: "Pro",
      monthly: { base: 4.96, vat: 1.03, total: 5.99 },
      yearly: { base: 45.45, vat: 9.54, total: 54.99 },
      features: [
        "Todo lo de Premium",
        "Asistente IA avanzado",
        "Créditos IA incluidos",
        "Análisis de productividad",
        "Integraciones premium",
        "API access",
      ],
      notIncluded: [],
    },
  }

  const getCurrentPlan = () => {
    if (user.is_pro) return "pro"
    if (user.is_premium) return "premium"
    return "free"
  }

  const currentPlan = getCurrentPlan()

  const handlePlanSelect = (plan: "premium" | "pro") => {
    setSelectedPlan(plan)
    setShowAiCredits(false)
    setShowCancellation(false)
  }

  const handlePaymentSuccess = (details: any) => {
    console.log("Payment successful:", details)
    // Update user plan based on payment
    if (selectedPlan === "premium") {
      onUserUpdate({
        is_premium: true,
        is_pro: false,
      })
    } else if (selectedPlan === "pro") {
      onUserUpdate({
        is_premium: false,
        is_pro: true,
        ai_credits: user.ai_credits + (billingCycle === "yearly" ? 2400 : 200), // Add credits for Pro plan
      })
    }
    onClose()
  }

  const handleCreditsPurchase = (credits: number) => {
    onUserUpdate({
      ai_credits: user.ai_credits + credits,
    })
    setShowAiCredits(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-purple-500/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Star className="h-6 w-6 text-purple-400" />
            Gestión de Suscripción
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Plan Status */}
          <div className="p-4 bg-slate-800/50 rounded-lg border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Plan Actual</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={currentPlan === "pro" ? "default" : "secondary"}>
                    {currentPlan === "pro" ? (
                      <>
                        <Crown className="h-3 w-3 mr-1" />
                        Pro
                      </>
                    ) : currentPlan === "premium" ? (
                      "Premium"
                    ) : (
                      "Free"
                    )}
                  </Badge>
                  <span className="text-sm text-gray-400">{user.ai_credits} créditos IA disponibles</span>
                </div>
              </div>
              {currentPlan !== "free" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCancellation(true)}
                  className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                >
                  Cancelar Plan
                </Button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => setShowAiCredits(true)}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
            >
              <Zap className="h-4 w-4 mr-2" />
              Comprar Créditos IA
            </Button>
            {currentPlan === "free" && (
              <Button
                onClick={() => handlePlanSelect("premium")}
                variant="outline"
                className="flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
              >
                Upgrade a Premium
              </Button>
            )}
          </div>

          {/* Billing Cycle Toggle */}
          {!showAiCredits && !showCancellation && (
            <div className="flex items-center justify-center gap-4 p-4 bg-slate-800/30 rounded-lg">
              <Button
                variant={billingCycle === "monthly" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBillingCycle("monthly")}
                className="text-white"
              >
                Mensual
              </Button>
              <Button
                variant={billingCycle === "yearly" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBillingCycle("yearly")}
                className="text-white"
              >
                Anual (2 meses gratis)
              </Button>
            </div>
          )}

          {/* AI Credits Purchase */}
          {showAiCredits && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Comprar Créditos IA</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowAiCredits(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <AiCreditsPurchase
                currentCredits={user.ai_credits}
                onPurchaseSuccess={handleCreditsPurchase}
                userPlan={currentPlan}
              />
            </div>
          )}

          {/* Subscription Cancellation */}
          {showCancellation && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Cancelar Suscripción</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowCancellation(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <SubscriptionCancellation
                user={user}
                onCancellationSuccess={() => {
                  onUserUpdate({ is_premium: false, is_pro: false })
                  setShowCancellation(false)
                  onClose()
                }}
              />
            </div>
          )}

          {/* Plan Comparison */}
          {!showAiCredits && !showCancellation && (
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(plans).map(([planKey, plan]) => {
                const isCurrentPlan = currentPlan === planKey
                const pricing = plan[billingCycle]

                return (
                  <div
                    key={planKey}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      selectedPlan === planKey
                        ? "border-purple-500 bg-purple-500/10"
                        : isCurrentPlan
                          ? "border-green-500/50 bg-green-500/5"
                          : "border-slate-700 bg-slate-800/30"
                    }`}
                  >
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                        {planKey === "pro" && <Crown className="h-5 w-5 text-yellow-400" />}
                        {plan.name}
                      </h3>
                      {isCurrentPlan && <Badge className="mt-2 bg-green-500/20 text-green-400">Plan Actual</Badge>}
                    </div>

                    <div className="text-center mb-6">
                      <div className="text-sm text-gray-400 mb-1">
                        Base: {pricing.base.toFixed(2)}€ + IVA: {pricing.vat.toFixed(2)}€
                      </div>
                      <div className="text-3xl font-bold text-white">
                        {pricing.total.toFixed(2)}€
                        <span className="text-sm text-gray-400 ml-1">
                          /{billingCycle === "monthly" ? "mes" : "año"}
                        </span>
                      </div>
                      {billingCycle === "yearly" && (
                        <div className="text-sm text-green-400 mt-1">
                          Ahorra {(plans[planKey as keyof typeof plans].monthly.total * 12 - pricing.total).toFixed(2)}€
                          al año
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                      {plan.notIncluded.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <X className="h-4 w-4 text-red-400 flex-shrink-0" />
                          <span className="text-gray-500">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {!isCurrentPlan && (
                      <Button
                        onClick={() => handlePlanSelect(planKey as "premium" | "pro")}
                        className={`w-full ${
                          selectedPlan === planKey
                            ? "bg-purple-600 hover:bg-purple-700"
                            : "bg-slate-700 hover:bg-slate-600"
                        }`}
                      >
                        {selectedPlan === planKey ? "Seleccionado" : `Cambiar a ${plan.name}`}
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Payment Section */}
          {selectedPlan && !showAiCredits && !showCancellation && (
            <div className="space-y-4">
              <Separator className="bg-purple-500/20" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Proceder con el pago - Plan {plans[selectedPlan].name}
                </h3>
                <PayPalPayment
                  amount={plans[selectedPlan][billingCycle].total}
                  currency="EUR"
                  description={`Plan ${plans[selectedPlan].name} - ${billingCycle === "monthly" ? "Mensual" : "Anual"}`}
                  onSuccess={handlePaymentSuccess}
                  onError={(error) => console.error("Payment error:", error)}
                  planType={selectedPlan}
                  billingCycle={billingCycle}
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
