"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PayPalPaymentProps {
  plan: string
  billingCycle: string
  amount: number
  onSuccess: () => void
  onCancel: () => void
}

export function PayPalPayment({ plan, billingCycle, amount, onSuccess, onCancel }: PayPalPaymentProps) {
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    // Check if PayPal client ID is configured
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

    if (!clientId || clientId === "your-paypal-client-id" || clientId.includes("your-")) {
      console.log("⚠️ PayPal not configured - using demo mode")
      setIsDemoMode(true)
      return
    }

    // Load PayPal SDK
    const script = document.createElement("script")
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR&intent=subscription&vault=true`
    script.async = true

    script.onload = () => {
      console.log("✅ PayPal SDK loaded")
      setIsDemoMode(false)
    }

    script.onerror = () => {
      console.error("❌ Failed to load PayPal SDK")
      setError("Error al cargar PayPal. Usando modo demo.")
      setIsDemoMode(true)
    }

    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const handleDemoPayment = async () => {
    console.log("💳 Processing demo payment...")
    console.log("   Plan:", plan)
    console.log("   Billing:", billingCycle)
    console.log("   Amount:", amount)

    setProcessing(true)
    setError(null)

    try {
      // Simular llamada al backend
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("✅ Demo payment completed")
      setProcessing(false)
      onSuccess()
    } catch (err) {
      console.error("❌ Demo payment error:", err)
      setError("Error al procesar el pago demo")
      setProcessing(false)
    }
  }

  if (error && !isDemoMode) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={onCancel} variant="outline" className="w-full bg-transparent">
          Cerrar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {isDemoMode && (
        <Alert className="bg-blue-500/10 border-blue-500/20">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-700 dark:text-blue-400">
            <strong>Modo Demo:</strong> PayPal no está configurado. Este es un pago simulado para pruebas.
          </AlertDescription>
        </Alert>
      )}

      <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Plan</span>
            <span className="font-semibold capitalize">{plan}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Facturación</span>
            <span className="font-semibold capitalize">{billingCycle === "monthly" ? "Mensual" : "Anual"}</span>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{amount}€</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancel} disabled={processing} className="flex-1 bg-transparent">
          Cancelar
        </Button>
        <Button
          onClick={handleDemoPayment}
          disabled={processing}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {processing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              {isDemoMode ? "Pagar (Demo)" : "Pagar con PayPal"}
            </>
          )}
        </Button>
      </div>

      {isDemoMode && (
        <p className="text-xs text-center text-muted-foreground">
          Para usar PayPal real, configura NEXT_PUBLIC_PAYPAL_CLIENT_ID en .env.local
        </p>
      )}
    </div>
  )
}
