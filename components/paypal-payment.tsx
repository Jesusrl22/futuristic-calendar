"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Shield, CheckCircle, AlertCircle } from "lucide-react"
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
  onError?: (error: string) => void
  theme: any
}

export function PayPalPayment({ userId, packageIndex, onSuccess, onCancel, onError, theme }: PayPalPaymentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [paypalLoaded, setPaypalLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [sdkError, setSdkError] = useState<string | null>(null)

  const creditPackage = CREDIT_PACKAGES[packageIndex]

  useEffect(() => {
    loadPayPalSDK()
  }, [])

  useEffect(() => {
    if (paypalLoaded && creditPackage) {
      renderPayPalButton()
    }
  }, [paypalLoaded, creditPackage])

  const loadPayPalSDK = () => {
    if (window.paypal) {
      setPaypalLoaded(true)
      return
    }

    if (document.querySelector('script[src*="paypal.com/sdk"]')) {
      const checkPayPal = setInterval(() => {
        if (window.paypal) {
          setPaypalLoaded(true)
          clearInterval(checkPayPal)
        }
      }, 100)
      return
    }

    const script = document.createElement("script")
    script.src = `https://www.paypal.com/sdk/js?client-id=AfTXM0fv3XQWk88Wf2wa4kOesH5tUoLpJDGfBQwZC0Re5H1yUhOhamMA_Akr3keDwPkAaaEf79BXLNLl&currency=EUR&intent=capture&enable-funding=venmo,paylater`
    script.async = true

    script.onload = () => {
      console.log("✅ PayPal SDK loaded successfully")
      setPaypalLoaded(true)
      setSdkError(null)
    }

    script.onerror = () => {
      console.error("❌ Failed to load PayPal SDK")
      setSdkError("Failed to load PayPal SDK")
      setPaypalLoaded(false)
    }

    document.body.appendChild(script)
  }

  const renderPayPalButton = () => {
    if (!window.paypal || !creditPackage) {
      console.error("PayPal SDK not loaded or invalid package")
      return
    }

    const paypalButtonContainer = document.getElementById(`paypal-button-${packageIndex}`)
    if (!paypalButtonContainer) {
      console.error("PayPal button container not found")
      return
    }

    paypalButtonContainer.innerHTML = ""

    try {
      window.paypal
        .Buttons({
          style: {
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "paypal",
            height: 45,
            tagline: false,
          },

          createOrder: async () => {
            console.log("🔄 Creating PayPal order...")
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
                throw new Error(data.error || `HTTP ${response.status}`)
              }

              console.log("✅ PayPal order created:", data.orderID)
              return data.orderID
            } catch (error) {
              console.error("❌ Error creating PayPal order:", error)
              const errorMessage = error instanceof Error ? error.message : "Error creating order"
              setError(errorMessage)
              setPaymentStatus("error")
              setIsLoading(false)
              onError?.(errorMessage)
              throw error
            }
          },

          onApprove: async (data: any) => {
            console.log("🔄 PayPal payment approved, capturing...")

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
                throw new Error(result.error || `HTTP ${response.status}`)
              }

              console.log("✅ PayPal payment captured successfully:", result)
              setPaymentStatus("success")
              setError(null)
              onSuccess(result.credits)
            } catch (error) {
              console.error("❌ Error capturing PayPal payment:", error)
              const errorMessage = error instanceof Error ? error.message : "Error processing payment"
              setError(errorMessage)
              setPaymentStatus("error")
              onError?.(errorMessage)
            } finally {
              setIsLoading(false)
            }
          },

          onCancel: (data: any) => {
            console.log("❌ PayPal payment cancelled:", data)
            setIsLoading(false)
            setPaymentStatus("idle")
            setError(null)
            onCancel?.()
          },

          onError: (err: any) => {
            console.error("❌ PayPal error:", err)
            const errorMessage = "Payment processing error"
            setError(errorMessage)
            setPaymentStatus("error")
            setIsLoading(false)
            onError?.(errorMessage)
          },
        })
        .render(`#paypal-button-${packageIndex}`)
        .catch((error: any) => {
          console.error("❌ Error rendering PayPal button:", error)
          setSdkError("Failed to render PayPal button")
        })
    } catch (error) {
      console.error("❌ Error setting up PayPal button:", error)
      setSdkError("Failed to setup PayPal button")
    }
  }

  if (!creditPackage) {
    return (
      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Package not found</span>
          </div>
        </CardContent>
      </Card>
    )
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
        {/* Payment Status Messages */}
        {paymentStatus === "processing" && (
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            <span className={`text-sm ${theme.textPrimary}`}>Procesando pago...</span>
          </div>
        )}

        {paymentStatus === "success" && (
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className={`text-sm ${theme.textPrimary}`}>¡Pago completado exitosamente!</span>
          </div>
        )}

        {(error || sdkError) && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className={`text-sm font-medium ${theme.textPrimary}`}>Error de pago</span>
            </div>
            <p className="text-sm text-red-400">{error || sdkError}</p>
            {(error || sdkError) && (
              <Button
                onClick={() => {
                  setError(null)
                  setSdkError(null)
                  setPaymentStatus("idle")
                  if (!paypalLoaded) {
                    loadPayPalSDK()
                  }
                }}
                variant="outline"
                size="sm"
                className="mt-2 text-red-400 border-red-400 hover:bg-red-500/10"
              >
                Reintentar
              </Button>
            )}
          </div>
        )}

        {/* PayPal Button Container */}
        <div className="space-y-3">
          <div id={`paypal-button-${packageIndex}`} className="min-h-[45px]">
            {!paypalLoaded && !sdkError && (
              <div className={`flex items-center justify-center p-4 border border-dashed ${theme.border} rounded-lg`}>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span className={`text-sm ${theme.textMuted}`}>Cargando PayPal...</span>
              </div>
            )}

            {sdkError && (
              <div
                className={`flex flex-col items-center justify-center p-4 border border-dashed border-red-500/20 rounded-lg`}
              >
                <AlertCircle className="w-6 h-6 text-red-400 mb-2" />
                <span className={`text-sm text-red-400 text-center mb-2`}>Error cargando PayPal</span>
                <Button
                  onClick={loadPayPalSDK}
                  variant="outline"
                  size="sm"
                  className="text-red-400 border-red-400 hover:bg-red-500/10 bg-transparent"
                >
                  Reintentar
                </Button>
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

        {/* Value Indicators */}
        <div className="space-y-2">
          <div className={`flex items-center space-x-2 text-xs ${theme.textSecondary}`}>
            <CheckCircle className="w-3 h-3 text-green-400" />
            <span>Créditos añadidos instantáneamente</span>
          </div>
          <div className={`flex items-center space-x-2 text-xs ${theme.textSecondary}`}>
            <CheckCircle className="w-3 h-3 text-green-400" />
            <span>Sin fecha de caducidad</span>
          </div>
          <div className={`flex items-center space-x-2 text-xs ${theme.textSecondary}`}>
            <CheckCircle className="w-3 h-3 text-green-400" />
            <span>Costo transparente por consulta</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
