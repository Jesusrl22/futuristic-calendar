"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Shield, CheckCircle } from "lucide-react"

interface PayPalPaymentProps {
  packageId: string
  amount: number
  currency: string
  onSuccess: (details: any) => void
  onError: (error: any) => void
  onCancel: () => void
}

declare global {
  interface Window {
    paypal?: any
  }
}

export default function PayPalPayment({
  packageId,
  amount,
  currency,
  onSuccess,
  onError,
  onCancel,
}: PayPalPaymentProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paypalLoaded, setPaypalLoaded] = useState(false)

  useEffect(() => {
    const loadPayPalScript = async () => {
      try {
        // Verificar si PayPal ya está cargado
        if (window.paypal) {
          setPaypalLoaded(true)
          setIsLoading(false)
          return
        }

        // Cargar el script de PayPal
        const script = document.createElement("script")
        script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=${currency}&intent=capture`
        script.async = true

        script.onload = () => {
          setPaypalLoaded(true)
          setIsLoading(false)
        }

        script.onerror = () => {
          setError("Error al cargar PayPal")
          setIsLoading(false)
        }

        document.body.appendChild(script)
      } catch (err) {
        console.error("Error loading PayPal script:", err)
        setError("Error al cargar PayPal")
        setIsLoading(false)
      }
    }

    loadPayPalScript()
  }, [currency])

  useEffect(() => {
    if (paypalLoaded && window.paypal && !isLoading) {
      renderPayPalButtons()
    }
  }, [paypalLoaded, isLoading, packageId, amount, currency])

  const renderPayPalButtons = () => {
    const paypalButtonContainer = document.getElementById("paypal-button-container")
    if (!paypalButtonContainer) return

    // Limpiar contenedor anterior
    paypalButtonContainer.innerHTML = ""

    window.paypal
      .Buttons({
        style: {
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "paypal",
          height: 50,
        },

        createOrder: async () => {
          try {
            setIsProcessing(true)
            setError(null)

            const response = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                packageId,
                amount,
                currency,
              }),
            })

            const data = await response.json()

            if (!response.ok) {
              throw new Error(data.error || "Error al crear la orden")
            }

            return data.id
          } catch (err) {
            console.error("Error creating order:", err)
            setError(err instanceof Error ? err.message : "Error al crear la orden")
            setIsProcessing(false)
            throw err
          }
        },

        onApprove: async (data: any) => {
          try {
            setIsProcessing(true)

            const response = await fetch("/api/paypal/capture-order", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                orderId: data.orderID,
                packageId,
              }),
            })

            const result = await response.json()

            if (!response.ok) {
              throw new Error(result.error || "Error al procesar el pago")
            }

            onSuccess(result)
          } catch (err) {
            console.error("Error capturing order:", err)
            setError(err instanceof Error ? err.message : "Error al procesar el pago")
            onError(err)
          } finally {
            setIsProcessing(false)
          }
        },

        onCancel: () => {
          setIsProcessing(false)
          onCancel()
        },

        onError: (err: any) => {
          console.error("PayPal error:", err)
          setError("Error en el procesamiento del pago")
          setIsProcessing(false)
          onError(err)
        },
      })
      .render("#paypal-button-container")
  }

  if (isLoading) {
    return (
      <Card className="w-full bg-slate-900/50 backdrop-blur-sm border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
            <span className="text-slate-300">Cargando PayPal...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full bg-red-900/20 backdrop-blur-sm border-red-700">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <Button
              onClick={() => {
                setError(null)
                setIsLoading(true)
                window.location.reload()
              }}
              variant="outline"
              className="border-red-600 text-red-400 hover:bg-red-900/30"
            >
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full bg-slate-900/50 backdrop-blur-sm border-slate-700">
      <CardContent className="p-6">
        {/* Información de seguridad */}
        <div className="mb-6 p-4 bg-green-900/20 rounded-lg border border-green-700">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-5 w-5 text-green-400" />
            <span className="text-green-400 font-medium">Pago Seguro</span>
          </div>
          <p className="text-sm text-green-300">Procesado por PayPal con encriptación SSL de 256 bits</p>
        </div>

        {/* Resumen del pedido */}
        <div className="mb-6 p-4 bg-slate-800/50 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">Resumen del Pedido</h3>
          <div className="flex justify-between items-center">
            <span className="text-slate-300">Total a pagar:</span>
            <span className="text-2xl font-bold text-purple-400">
              {amount.toFixed(2)} {currency}
            </span>
          </div>
        </div>

        {/* Botones de PayPal */}
        <div className="relative">
          <div id="paypal-button-container" className="min-h-[50px]"></div>

          {isProcessing && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto mb-2" />
                <p className="text-slate-300">Procesando pago...</p>
              </div>
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-4 text-sm text-slate-400">
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4" />
              <span>Sin suscripciones</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4" />
              <span>Créditos sin caducidad</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-500">Al completar la compra, aceptas nuestros términos y condiciones</p>
        </div>
      </CardContent>
    </Card>
  )
}
