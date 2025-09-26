"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Shield, CreditCard } from "lucide-react"
import PayPalPayment from "./paypal-payment"
import { CREDIT_PACKAGES, formatCurrency } from "@/lib/ai-credits"

interface AICreditsPurchaseProps {
  userId?: string
  onPurchaseComplete?: (credits: number) => void
}

export default function AICreditsPurchase({ userId, onPurchaseComplete }: AICreditsPurchaseProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId)
    setShowPayment(true)
  }

  const handlePaymentSuccess = (details: any) => {
    const creditPackage = CREDIT_PACKAGES.find((pkg) => pkg.id === selectedPackage)
    if (creditPackage && onPurchaseComplete) {
      onPurchaseComplete(creditPackage.credits)
    }

    // Redirigir a página de éxito
    window.location.href = `/payment/success?credits=${creditPackage?.credits}&package=${selectedPackage}`
  }

  const handlePaymentError = (error: any) => {
    console.error("Payment error:", error)
    setIsProcessing(false)
    // Mostrar error al usuario
  }

  const handlePaymentCancel = () => {
    setShowPayment(false)
    setSelectedPackage(null)
    setIsProcessing(false)
  }

  if (showPayment && selectedPackage) {
    const creditPackage = CREDIT_PACKAGES.find((pkg) => pkg.id === selectedPackage)
    if (!creditPackage) return null

    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-to-br from-slate-900 to-purple-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white text-center">Completar Compra</CardTitle>
            <div className="text-center">
              <Badge variant="secondary" className="bg-purple-600 text-white">
                {creditPackage.name} - {creditPackage.credits} créditos
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <PayPalPayment
              packageId={selectedPackage}
              amount={creditPackage.price}
              currency={creditPackage.currency}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onCancel={handlePaymentCancel}
            />

            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={() => setShowPayment(false)}
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Volver a paquetes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Comprar Créditos IA</h2>
        <p className="text-slate-300 text-lg">Elige el paquete que mejor se adapte a tus necesidades</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CREDIT_PACKAGES.map((pkg) => (
          <Card
            key={pkg.id}
            className={`relative bg-gradient-to-br from-slate-900/50 to-purple-900/30 backdrop-blur-sm border-slate-700 hover:border-purple-500 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
              pkg.popular ? "ring-2 ring-purple-500" : ""
            }`}
            onClick={() => handlePackageSelect(pkg.id)}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1">
                  <Star className="h-3 w-3 mr-1" />
                  Más Popular
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold text-white">{pkg.name}</CardTitle>
              <div className="text-3xl font-bold text-purple-400">{formatCurrency(pkg.price, pkg.currency)}</div>
              <p className="text-slate-400 text-sm">{pkg.description}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  <span className="text-2xl font-bold text-white">{pkg.credits.toLocaleString()}</span>
                  <span className="text-slate-400">créditos</span>
                </div>
              </div>

              <div className="space-y-2">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                className={`w-full ${
                  pkg.popular
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    : "bg-slate-700 hover:bg-slate-600"
                } text-white font-semibold py-3`}
                onClick={() => handlePackageSelect(pkg.id)}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Comprar Ahora
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Información de seguridad */}
      <div className="mt-12 text-center">
        <Card className="bg-slate-900/30 backdrop-blur-sm border-slate-700 max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Shield className="h-6 w-6 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Compra Segura</h3>
            </div>
            <p className="text-slate-300 mb-4">
              Todos los pagos son procesados de forma segura por PayPal con encriptación SSL de 256 bits.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-400">
              <div className="flex items-center justify-center space-x-2">
                <Check className="h-4 w-4 text-green-400" />
                <span>Sin suscripciones</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Check className="h-4 w-4 text-green-400" />
                <span>Créditos sin caducidad</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Check className="h-4 w-4 text-green-400" />
                <span>Soporte 24/7</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
