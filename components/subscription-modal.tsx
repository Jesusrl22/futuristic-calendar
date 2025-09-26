"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Zap, Star, Sparkles } from "lucide-react"
import { useLanguage } from "@/hooks/useLanguage"

interface SubscriptionModalProps {
  currentPlan: "free" | "pro"
  onPlanChange?: (plan: "free" | "pro") => void
  trigger?: React.ReactNode
}

const plans = {
  free: {
    name: "Gratuito",
    nameEn: "Free",
    price: "$0",
    period: "/mes",
    periodEn: "/month",
    description: "Perfecto para empezar",
    descriptionEn: "Perfect to get started",
    features: [
      "Hasta 50 tareas",
      "10 créditos de IA por mes",
      "Notas básicas",
      "Lista de deseos",
      "Pomodoro timer",
      "Soporte por email",
    ],
    featuresEn: [
      "Up to 50 tasks",
      "10 AI credits per month",
      "Basic notes",
      "Wishlist",
      "Pomodoro timer",
      "Email support",
    ],
    icon: Star,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  pro: {
    name: "Pro",
    nameEn: "Pro",
    price: "$9.99",
    period: "/mes",
    periodEn: "/month",
    description: "Para usuarios avanzados",
    descriptionEn: "For power users",
    features: [
      "Tareas ilimitadas",
      "1000 créditos de IA por mes",
      "Notas avanzadas con etiquetas",
      "Lista de deseos ilimitada",
      "Pomodoro personalizable",
      "Análisis de productividad",
      "Exportar datos",
      "Soporte prioritario",
    ],
    featuresEn: [
      "Unlimited tasks",
      "1000 AI credits per month",
      "Advanced notes with tags",
      "Unlimited wishlist",
      "Customizable Pomodoro",
      "Productivity analytics",
      "Data export",
      "Priority support",
    ],
    icon: Crown,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    popular: true,
  },
}

export function SubscriptionModal({ currentPlan, onPlanChange, trigger }: SubscriptionModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro">(currentPlan)
  const { language, t } = useLanguage()

  const handlePlanSelect = (plan: "free" | "pro") => {
    setSelectedPlan(plan)
    if (onPlanChange && typeof onPlanChange === "function") {
      onPlanChange(plan)
    }
    setIsOpen(false)
  }

  const defaultTrigger = (
    <Button variant="outline" className="gap-2 bg-transparent">
      <Sparkles className="h-4 w-4" />
      {t("subscription.upgrade")}
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">{t("subscription.title")}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {Object.entries(plans).map(([planKey, plan]) => {
            const PlanIcon = plan.icon
            const isCurrentPlan = planKey === currentPlan
            const isSelected = planKey === selectedPlan

            return (
              <Card
                key={planKey}
                className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected ? `ring-2 ring-offset-2 ${plan.color.replace("text-", "ring-")}` : ""
                } ${plan.borderColor}`}
                onClick={() => setSelectedPlan(planKey as "free" | "pro")}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">Popular</Badge>
                  </div>
                )}

                <CardHeader className={`text-center ${plan.bgColor} rounded-t-lg`}>
                  <div className="flex justify-center mb-2">
                    <div className={`p-3 rounded-full ${plan.bgColor} ${plan.color}`}>
                      <PlanIcon className="h-8 w-8" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{language === "es" ? plan.name : plan.nameEn}</CardTitle>
                  <CardDescription>{language === "es" ? plan.description : plan.descriptionEn}</CardDescription>
                  <div className="text-3xl font-bold mt-2">
                    {plan.price}
                    <span className="text-sm font-normal text-muted-foreground">
                      {language === "es" ? plan.period : plan.periodEn}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {(language === "es" ? plan.features : plan.featuresEn).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    {isCurrentPlan ? (
                      <Button disabled className="w-full">
                        {t("subscription.current")}
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        variant={planKey === "pro" ? "default" : "outline"}
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePlanSelect(planKey as "free" | "pro")
                        }}
                      >
                        {planKey === "pro" ? (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            {t("subscription.upgrade")}
                          </>
                        ) : (
                          "Seleccionar Plan"
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            {language === "es"
              ? "Puedes cambiar o cancelar tu suscripción en cualquier momento."
              : "You can change or cancel your subscription at any time."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SubscriptionModal
