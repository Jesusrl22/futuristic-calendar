"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Crown, Star, User, ChevronDown, Check, X } from "lucide-react"

interface SubscriptionSelectorProps {
  currentPlan: string
  onPlanChange: (planId: string) => void
  onCancelSubscription?: () => void
}

export function SubscriptionSelector({ currentPlan, onPlanChange, onCancelSubscription }: SubscriptionSelectorProps) {
  const [isLoading, setIsLoading] = useState(false)

  const plans = [
    {
      id: "free",
      name: "Gratuito",
      icon: User,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      description: "Funciones básicas",
    },
    {
      id: "premium_monthly",
      name: "Premium",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-gradient-to-r from-yellow-500 to-orange-500",
      description: "€1.99/mes - Funciones avanzadas",
    },
    {
      id: "premium_yearly",
      name: "Premium Anual",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-gradient-to-r from-yellow-500 to-orange-500",
      description: "€20/año - Ahorra €3.88",
    },
    {
      id: "pro_monthly",
      name: "Pro",
      icon: Crown,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-r from-purple-500 to-blue-500",
      description: "€4.99/mes - IA + Premium",
    },
    {
      id: "pro_yearly",
      name: "Pro Anual",
      icon: Crown,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-r from-purple-500 to-blue-500",
      description: "€45/año - Ahorra €14.88",
    },
  ]

  const currentPlanInfo = plans.find((plan) => currentPlan.includes(plan.id.split("_")[0])) || plans[0]

  const handlePlanChange = async (planId: string) => {
    setIsLoading(true)
    try {
      await onPlanChange(planId)
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
      } catch (error) {
        console.error("Error canceling subscription:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent" disabled={isLoading}>
          <currentPlanInfo.icon className="h-4 w-4" />
          <Badge
            className={`${currentPlanInfo.bgColor} text-white border-none`}
            style={currentPlan === "free" ? { backgroundColor: "#6b7280", color: "white" } : {}}
          >
            {currentPlanInfo.name.toUpperCase()}
          </Badge>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Cambiar Plan</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {plans.map((plan) => {
          const isCurrentPlan = currentPlan.includes(plan.id.split("_")[0])
          const Icon = plan.icon

          return (
            <DropdownMenuItem
              key={plan.id}
              onClick={() => !isCurrentPlan && handlePlanChange(plan.id)}
              className={`flex items-center gap-3 p-3 cursor-pointer ${
                isCurrentPlan ? "bg-slate-100 dark:bg-slate-700" : ""
              }`}
              disabled={isCurrentPlan}
            >
              <Icon className={`h-4 w-4 ${plan.color}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{plan.name}</span>
                  {isCurrentPlan && <Check className="h-4 w-4 text-green-500" />}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{plan.description}</p>
              </div>
            </DropdownMenuItem>
          )
        })}

        {currentPlan !== "free" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleCancelSubscription}
              className="flex items-center gap-3 p-3 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
              <div>
                <span className="font-medium">Cancelar Suscripción</span>
                <p className="text-xs text-slate-500">Válida hasta el final del período</p>
              </div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
