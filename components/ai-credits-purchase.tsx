"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, CreditCard, Zap, Star, ArrowRight, CheckCircle, AlertCircle } from "lucide-react"
import { PayPalPayment } from "./paypal-payment"
import { CREDIT_PACKAGES, getUserAICredits, type AICreditsInfo } from "@/lib/ai-credits"

interface AICreditsPurchaseProps {
  userId: string
  onCreditsUpdated: (newCredits: number) => void
  theme: any
}

export function AICreditsPurchase({ userId, onCreditsUpdated, theme }: AICreditsPurchaseProps) {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const [creditsInfo, setCreditsInfo] = useState<AICreditsInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [purchaseSuccess, setPurchaseSuccess] = useState<{ credits: number; package: string } | null>(null)

  useEffect(() => {
    loadCreditsInfo()
  }, [userId])

  const loadCreditsInfo = async () => {
    try {
      const info = await getUserAICredits(userId)
      setCreditsInfo(info)
    } catch (error) {
      console.error("Error loading credits info:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePurchaseSuccess = async (credits: number) => {
    const packageInfo = CREDIT_PACKAGES[selectedPackage!]
    setPurchaseSuccess({ credits, package: packageInfo.name })

    // Reload credits info
    await loadCreditsInfo()
    onCreditsUpdated(credits)

    // Clear success message after 5 seconds
    setTimeout(() => {
      setPurchaseSuccess(null)
      setSelectedPackage(null)
    }, 5000)
  }

  const handlePurchaseCancel = () => {
    setSelectedPackage(null)
  }

  const handlePurchaseError = (error: string) => {
    console.error("Purchase error:", error)
    // Error is handled by the PayPalPayment component
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className={`${theme.textSecondary}`}>Cargando información de créditos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <h2 className={`text-2xl font-bold ${theme.textPrimary} mb-2`}>Comprar Créditos IA</h2>
          <p className={`${theme.textSecondary} max-w-2xl mx-auto`}>
            Potencia tu productividad con nuestro asistente IA. Solo pagas por lo que usas, sin suscripciones ni
            compromisos.
          </p>
        </div>
      </div>

      {/* Current Credits Info */}
      {creditsInfo && (
        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className={`font-semibold ${theme.textPrimary}`}>Créditos Actuales</h3>
                  <p className={`text-sm ${theme.textSecondary}`}>{creditsInfo.remaining} créditos disponibles</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${theme.textPrimary}`}>{creditsInfo.remaining}</div>
                <div className={`text-xs ${theme.textMuted}`}>~{Math.floor(creditsInfo.remaining / 2)} consultas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {purchaseSuccess && (
        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <h3 className={`font-semibold ${theme.textPrimary}`}>¡Compra Exitosa!</h3>
                <p className={`text-sm ${theme.textSecondary}`}>
                  Se han añadido {purchaseSuccess.credits} créditos a tu cuenta ({purchaseSuccess.package})
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Package Selection */}
      {selectedPackage === null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CREDIT_PACKAGES.map((pkg, index) => (
            <Card
              key={pkg.id}
              className={`${theme.cardBg} ${theme.border} relative overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 ${
                pkg.popular ? "ring-2 ring-purple-500" : ""
              }`}
              onClick={() => setSelectedPackage(index)}
            >
              {pkg.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-xs font-bold">
                    POPULAR
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <CardTitle className={`${theme.textPrimary} text-lg flex items-center justify-between`}>
                  <span>{pkg.credits} Créditos</span>
                  <span className="text-2xl font-bold">{pkg.price}</span>
                </CardTitle>
                <div className="space-y-2">
                  <p className={`text-sm ${theme.textSecondary}`}>{pkg.description}</p>
                  <p className={`text-xs ${theme.textMuted}`}>{pkg.estimatedRequests}</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Seleccionar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                {/* Package Details */}
                <div className={`text-xs ${theme.textMuted} space-y-1 pt-2 border-t ${theme.border}`}>
                  <div className="flex justify-between">
                    <span>Costo IA:</span>
                    <span>{pkg.aiCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Comisión servicio:</span>
                    <span>{pkg.profit}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>{pkg.price}</span>
                  </div>
                </div>

                {/* Value Indicators */}
                <div className="space-y-2">
                  <div className={`flex items-center space-x-2 text-xs ${theme.textSecondary}`}>
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>Créditos instantáneos</span>
                  </div>
                  <div className={`flex items-center space-x-2 text-xs ${theme.textSecondary}`}>
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>Sin caducidad</span>
                  </div>
                  <div className={`flex items-center space-x-2 text-xs ${theme.textSecondary}`}>
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>Precio transparente</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Payment Component */
        <div className="max-w-md mx-auto">
          <div className="mb-4 text-center">
            <Button
              variant="outline"
              onClick={() => setSelectedPackage(null)}
              className={`${theme.border} ${theme.textSecondary}`}
            >
              ← Cambiar paquete
            </Button>
          </div>

          <PayPalPayment
            userId={userId}
            packageIndex={selectedPackage}
            onSuccess={handlePurchaseSuccess}
            onCancel={handlePurchaseCancel}
            onError={handlePurchaseError}
            theme={theme}
          />
        </div>
      )}

      {/* Information Section */}
      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardHeader>
          <CardTitle className={`${theme.textPrimary} text-lg flex items-center space-x-2`}>
            <Star className="w-5 h-5 text-yellow-500" />
            <span>¿Cómo funcionan los créditos?</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <h3 className={`font-medium ${theme.textPrimary} mb-2`}>Sistema justo</h3>
              <p className={`text-sm ${theme.textSecondary}`}>
                Solo pagas por los tokens que realmente usas. Consultas simples cuestan menos.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <h3 className={`font-medium ${theme.textPrimary} mb-2`}>Transparente</h3>
              <p className={`text-sm ${theme.textSecondary}`}>
                Ves el costo exacto de cada consulta antes de enviarla.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <h3 className={`font-medium ${theme.textPrimary} mb-2`}>Sin caducidad</h3>
              <p className={`text-sm ${theme.textSecondary}`}>Tus créditos no caducan nunca. Úsalos cuando quieras.</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <h3 className={`font-medium ${theme.textPrimary} mb-1`}>Importante</h3>
                <p className={`text-sm ${theme.textSecondary}`}>
                  Los créditos se añaden automáticamente a tu cuenta después del pago exitoso. Puedes usar el asistente
                  IA inmediatamente después de la compra.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
