"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CreditCard, Shield, CheckCircle } from "lucide-react"

interface PayPalPaymentProps {
  planId: string
  onSuccess: () => void
  onCancel: () => void
}

export function PayPalPayment({ planId, onSuccess, onCancel }: PayPalPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStep, setPaymentStep] = useState<"select" | "processing" | "success">("select")

  const handlePayPalPayment = async () => {
    setIsProcessing(true)
    setPaymentStep("processing")

    try {
      // Simulate PayPal payment process
      await new Promise((resolve) => setTimeout(resolve, 3000))

      setPaymentStep("success")
      setTimeout(() => {
        onSuccess()
      }, 2000)
    } catch (error) {
      console.error("Payment error:", error)
      setIsProcessing(false)
      setPaymentStep("select")
    }
  }

  const handleDemoPayment = async () => {
    setIsProcessing(true)
    setPaymentStep("processing")

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setPaymentStep("success")
    setTimeout(() => {
      onSuccess()
    }, 1500)
  }

  if (paymentStep === "success") {
    return (
      <Card className="bg-slate-800/50 border-green-500/30">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">¡Pago Exitoso!</h3>
          <p className="text-gray-400">Tu suscripción ha sido activada correctamente.</p>
        </CardContent>
      </Card>
    )
  }

  if (paymentStep === "processing") {
    return (
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardContent className="p-8 text-center">
          <Loader2 className="h-16 w-16 text-purple-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-xl font-bold text-white mb-2">Procesando Pago</h3>
          <p className="text-gray-400">Por favor espera mientras procesamos tu pago...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Método de Pago
          </CardTitle>
          <CardDescription className="text-gray-400">Selecciona tu método de pago preferido</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Demo Payment Button */}
          <Button
            onClick={handleDemoPayment}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Pago Demo (Simulado)
              </>
            )}
          </Button>

          {/* PayPal Button */}
          <Button
            onClick={handlePayPalPayment}
            disabled={isProcessing}
            className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white py-3"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h8.418c2.508 0 4.514.893 5.835 2.607 1.146 1.486 1.321 3.51.534 6.154-.906 3.04-2.474 4.977-4.563 5.629-.906.283-1.929.283-3.298.283H9.15c-.283 0-.566.283-.566.566l-.849 5.418c-.071.566-.566.849-1.132.849-.283 0-.566-.071-.849-.283-.283-.212-.566-.566-.566-.849l.849-5.418c.071-.566.566-.849 1.132-.849h3.581c1.369 0 2.392 0 3.298-.283 2.089-.652 3.657-2.589 4.563-5.629.787-2.644.612-4.668-.534-6.154C18.932.893 16.926 0 14.418 0H5.998c-.524 0-.972.382-1.054.901L1.837 20.597a.641.641 0 0 0 .633.74h4.606z" />
                </svg>
                Pagar con PayPal
              </>
            )}
          </Button>

          <div className="flex items-center gap-2 text-sm text-gray-400 justify-center">
            <Shield className="h-4 w-4" />
            <span>Pago seguro y encriptado</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
          Cancelar
        </Button>
      </div>
    </div>
  )
}
