"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Check, CreditCard, Loader2, Shield, Sparkles, Crown, AlertCircle } from "lucide-react"

interface PayPalPaymentProps {
  plan: "free" | "premium" | "pro"
  onSuccess: () => void
  onCancel: () => void
}

const PLAN_DETAILS = {
  free: {
    name: "Free",
    price: "0",
    features: ["5 tareas por día", "Pomodoro básico", "1 lista de deseos", "Notas básicas"],
    color: "from-gray-400 to-gray-600",
    icon: Check,
  },
  premium: {
    name: "Premium",
    price: "2.99",
    features: [
      "Tareas ilimitadas",
      "Pomodoro avanzado",
      "Listas ilimitadas",
      "Notas avanzadas",
      "Sin anuncios",
      "5 créditos IA/mes",
    ],
    color: "from-blue-500 to-purple-600",
    icon: Sparkles,
  },
  pro: {
    name: "Pro",
    price: "4.99",
    features: [
      "Todo de Premium",
      "Asistente IA ilimitado",
      "Análisis avanzado",
      "Exportar datos",
      "Soporte prioritario",
      "Temas premium",
      "50 créditos IA/mes",
    ],
    color: "from-purple-500 to-pink-600",
    icon: Crown,
  },
}

export function PayPalPayment({ plan, onSuccess, onCancel }: PayPalPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)

  const planDetails = PLAN_DETAILS[plan]
  const PlanIcon = planDetails.icon

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsProcessing(false)
    setPaymentComplete(true)

    // Call success after showing success message
    setTimeout(() => {
      onSuccess()
    }, 1500)
  }

  if (paymentComplete) {
    return (
      <Card className="glass-card border-0 animate-fade-in">
        <CardContent className="p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 p-6 animate-float">
              <Check className="h-12 w-12 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2">¡Pago Exitoso!</h3>
          <p className="text-gray-400 mb-6">Tu suscripción ha sido activada correctamente</p>
          <Badge className={`bg-gradient-to-r ${planDetails.color} text-white text-lg px-6 py-2`}>
            <PlanIcon className="h-5 w-5 mr-2" />
            Plan {planDetails.name}
          </Badge>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Alert className="glass-card border-blue-500/30 bg-blue-500/10">
        <AlertCircle className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-blue-200">
          🎉 <strong>Modo Demo:</strong> Este es un sistema de pago simulado. No se realizará ningún cargo real.
        </AlertDescription>
      </Alert>

      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="gradient-text text-2xl">Resumen de Suscripción</span>
            <Badge className={`bg-gradient-to-r ${planDetails.color} text-white`}>
              <PlanIcon className="h-4 w-4 mr-1" />
              {planDetails.name}
            </Badge>
          </CardTitle>
          <CardDescription>Revisa los detalles de tu plan antes de continuar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="glass-effect rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Plan {planDetails.name}</span>
              <div className="text-right">
                <div className="text-3xl font-bold gradient-text">${planDetails.price}</div>
                <div className="text-sm text-gray-400">EUR/mes</div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-400" />
                Características incluidas:
              </h4>
              <ul className="space-y-2">
                {planDetails.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-300">
                    <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full btn-gradient h-14 text-lg font-semibold"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Procesando pago...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Confirmar Pago (Demo)
                </>
              )}
            </Button>

            <Button
              onClick={onCancel}
              variant="outline"
              disabled={isProcessing}
              className="w-full bg-transparent border-white/20 hover:bg-white/5"
            >
              Cancelar
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <Shield className="h-4 w-4 text-green-400" />
            <span>Pago seguro · Garantía de 30 días</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
