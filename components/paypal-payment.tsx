"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Shield, CheckCircle } from "lucide-react"
import { CREDIT_PACKAGES } from "@/lib/ai-credits"

declare global {
  interface Window {
    paypal?: any
  }
}

interface PayPalPaymentProps {
  userId: string
  packageIndex: number
  onSuccess: (credits: number) => void
  onCancel?: () => void
  theme: any
}

export function PayPalPayment({ userId, packageIndex, onSuccess, onCancel, theme }: PayPalPaymentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [paypalLoaded, setPaypalLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")

  const creditPackage = CREDIT_PACKAGES[packageIndex]

  useEffect(() => {
    // Load PayPal SDK
    if (!window.paypal && !document.querySelector('script[src*="paypal.com/sdk"]')) {
      const script = document.createElement("script")
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=EUR&intent=capture`
      script.async = true
      script.onload = () => {
        setPaypalLoaded(true)
        renderPayPalButton()
      }
      script.onerror = () => {
        setError("Error al cargar PayPal")
      }
      document.body.appendChild(script)
    } else if (window.paypal) {
      setPaypalLoaded(true)
      renderPayPalButton()
    }
  }, [])

  const renderPayPalButton = () => {
    if (!window.paypal || !creditPackage) return

    const paypalButtonContainer = document.getElementById(`paypal-button-${packageIndex}`)
    if (!paypalButtonContainer) return

    // Clear existing buttons
    paypalButtonContainer.innerHTML = ""

    window.paypal
      .Buttons({
        style: {
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "paypal",
          height: 40,
        },
        createOrder: async () => {
          setIsLoading(true)
          setPaymentStatus("processing")
          setError(null)

          try {
            const response = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                packageIndex,
                userId,
              }),
            })

            const data = await response.json()

            if (!response.ok) {
              throw new Error(data.error || "Error al crear la orden")
            }

            return data.orderID
          } catch (error) {
            console.error("Error creating PayPal order:", error)
            setError(error instanceof Error ? error.message : "Error al crear la orden")
            setPaymentStatus("error")
            setIsLoading(false)
            throw error
          }
        },
        onApprove: async (data: any) => {
          try {
            const response = await fetch("/api/paypal/capture-order", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                orderID: data.orderID,
              }),
            })

            const result = await response.json()

            if (!response.ok) {
              throw new Error(result.error || "Error al procesar el pago")
            }

            setPaymentStatus("success")
            onSuccess(result.credits)
          } catch (error) {
            console.error("Error capturing PayPal payment:", error)
            setError(error instanceof Error ? error.message : "Error al procesar el pago")
            setPaymentStatus("error")
          } finally {
            setIsLoading(false)
          }
        },
        onCancel: () => {
          setIsLoading(false)
          setPaymentStatus("idle")
          onCancel?.()
        },
        onError: (err: any) => {
          console.error("PayPal error:", err)
          setError("Error en el procesamiento del pago")
          setPaymentStatus("error")
          setIsLoading(false)
        },
      })
      .render(`#paypal-button-${packageIndex}`)
  }

  if (!creditPackage) {
    return <div className={`text-red-400`}>Paquete no encontrado</div>
  }

  return (
    <Card className={`${theme.cardBg} ${theme.border} relative overflow-hidden`}>
      {creditPackage.popular && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-xs font-bold">
            POPULAR
          </Badge>
        </div>
      )}

      <CardHeader className="pb-4">
        <CardTitle className={`${theme.textPrimary} text-lg flex items-center justify-between`}>
          <span>{creditPackage.credits} Créditos IA</span>
          <span className="text-2xl font-bold">{creditPackage.price}</span>
        </CardTitle>
        <div className="space-y-2">
          <p className={`text-sm ${theme.textSecondary}`}>{creditPackage.description}</p>
          <p className={`text-xs ${theme.textMuted}`}>{creditPackage.estimatedRequests}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Payment Status */}
        {paymentStatus === "processing" && (
          <div className={`flex items-center space-x-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20`}>
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            <span className={`text-sm ${theme.textPrimary}`}>Procesando pago...</span>
          </div>
        )}

        {paymentStatus === "success" && (
          <div className={`flex items-center space-x-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20`}>
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className={`text-sm ${theme.textPrimary}`}>¡Pago completado exitosamente!</span>
          </div>
        )}

        {error && (
          <div className={`p-3 rounded-lg bg-red-500/10 border border-red-500/20`}>
            <p className={`text-sm text-red-400`}>{error}</p>
          </div>
        )}

        {/* PayPal Button Container */}
        <div className="space-y-3">
          <div id={`paypal-button-${packageIndex}`} className="min-h-[40px]">
            {!paypalLoaded && (
              <div className={`flex items-center justify-center p-3 border border-dashed ${theme.border} rounded-lg`}>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span className={`text-sm ${theme.textMuted}`}>Cargando PayPal...</span>
              </div>
            )}
          </div>

          {/* Security Info */}
          <div className={`flex items-center justify-center space-x-2 text-xs ${theme.textMuted}`}>
            <Shield className="w-3 h-3" />
            <span>Pago seguro procesado por PayPal</span>
          </div>
        </div>

        {/* Package Details */}
        <div className={`text-xs ${theme.textMuted} space-y-1 pt-2 border-t ${theme.border}`}>
          <div className="flex justify-between">
            <span>Costo IA:</span>
            <span>{creditPackage.aiCost}</span>
          </div>
          <div className="flex justify-between">
            <span>Comisión servicio:</span>
            <span>{creditPackage.profit}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>{creditPackage.price}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
