"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SubscriptionModal } from "./subscription-modal"
import { Crown, Zap, Rocket, Calendar, CreditCard, AlertCircle, Check } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SubscriptionManagerProps {
  userId: string
  currentPlan: string
  billingCycle: string
}

const planIcons = {
  free: Zap,
  premium: Crown,
  pro: Rocket,
}

const planColors = {
  free: "text-gray-500",
  premium: "text-purple-500",
  pro: "text-yellow-500",
}

const planDescriptions = {
  free: "Plan básico con funciones esenciales",
  premium: "Plan avanzado con todas las funciones premium",
  pro: "Plan profesional con IA ilimitada + Todo de Premium",
}

export function SubscriptionManager({ userId, currentPlan, billingCycle }: SubscriptionManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [planData, setPlanData] = useState<any>(null)

  console.log("📊 SubscriptionManager rendered with:", { userId, currentPlan, billingCycle })

  useEffect(() => {
    loadPlanData()
  }, [currentPlan])

  const loadPlanData = async () => {
    try {
      const response = await fetch(`/api/subscription?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setPlanData(data)
        console.log("✅ Plan data loaded:", data)
      }
    } catch (error) {
      console.error("❌ Error loading plan data:", error)
    }
  }

  const handleUpgrade = (plan: string, cycle: string) => {
    console.log("✨ Plan upgraded:", { plan, cycle })
    loadPlanData()
    setIsModalOpen(false)
  }

  const PlanIcon = planIcons[currentPlan as keyof typeof planIcons] || Zap
  const planColor = planColors[currentPlan as keyof typeof planColors] || "text-gray-500"
  const planDescription = planDescriptions[currentPlan as keyof typeof planDescriptions] || "Plan desconocido"

  // Características según el plan actual
  const getFeaturesList = () => {
    if (currentPlan === "free") {
      return [
        { text: "Tareas ilimitadas", included: true },
        { text: "Pomodoro básico", included: true },
        { text: "Algunos logros", included: true },
        { text: "2 temas", included: true },
        { text: "Eventos ilimitados", included: false },
        { text: "Notas ilimitadas", included: false },
        { text: "Lista de deseos", included: false },
        { text: "Créditos IA", included: false },
      ]
    }

    if (currentPlan === "premium") {
      return [
        { text: "✅ Todo de Free", included: true, highlight: true },
        { text: "Eventos ilimitados", included: true },
        { text: "Notas ilimitadas", included: true },
        { text: "Lista de deseos", included: true },
        { text: "Pomodoro avanzado", included: true },
        { text: "Todos los logros", included: true },
        { text: "6 temas premium", included: true },
        { text: "Estadísticas avanzadas", included: true },
        { text: "Sincronización en la nube", included: true },
        { text: "500 créditos IA/mes", included: false },
        { text: "Asistente IA avanzado", included: false },
        { text: "Soporte prioritario 24/7", included: false },
      ]
    }

    if (currentPlan === "pro") {
      return [
        { text: "✅ Todo de Premium + Free", included: true, highlight: true },
        { text: "500 créditos IA/mes", included: true },
        { text: "Asistente IA avanzado", included: true },
        { text: "14 temas profesionales", included: true },
        { text: "Análisis predictivo con IA", included: true },
        { text: "Soporte prioritario 24/7", included: true },
        { text: "Funciones beta exclusivas", included: true },
        { text: "API de integración", included: true },
        { text: "Backup automático diario", included: true },
      ]
    }

    return []
  }

  const features = getFeaturesList()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Suscripción</h1>
        <p className="text-muted-foreground">Gestiona tu plan y facturación</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Modo Demo</AlertTitle>
        <AlertDescription>
          Los pagos están simulados para demostración. En producción se integraría PayPal real.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg bg-muted ${planColor}`}>
                <PlanIcon className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="capitalize">{currentPlan}</CardTitle>
                <CardDescription>{planDescription}</CardDescription>
              </div>
            </div>
            <Badge variant={currentPlan === "pro" ? "default" : "secondary"} className="capitalize">
              {currentPlan}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Ciclo de facturación</span>
              </div>
              <p className="font-semibold capitalize">{billingCycle === "yearly" ? "Anual" : "Mensual"}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CreditCard className="w-4 h-4" />
                <span className="text-sm">Estado</span>
              </div>
              <p className="font-semibold text-green-600">Activo</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Características incluidas:</h3>
            <ul className="space-y-2 text-sm">
              {features.map((feature, index) => (
                <li key={index} className={`flex items-center gap-2 ${!feature.included ? "opacity-40" : ""}`}>
                  {feature.included ? (
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                  )}
                  <span className={feature.highlight ? "font-semibold text-primary" : ""}>{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div className="flex gap-3">
            <Button onClick={() => setIsModalOpen(true)} className="flex-1">
              {currentPlan === "free" ? "Mejorar Plan" : currentPlan === "premium" ? "Upgrade a Pro" : "Ver Planes"}
            </Button>
            {currentPlan !== "free" && (
              <Button variant="outline" onClick={() => setIsModalOpen(true)}>
                Ver Todos los Planes
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentPlan={currentPlan}
        userId={userId}
        onUpgrade={handleUpgrade}
      />
    </div>
  )
}
