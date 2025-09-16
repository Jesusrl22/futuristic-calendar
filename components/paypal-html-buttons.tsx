"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, CheckCircle, AlertCircle } from "lucide-react"
import { CREDIT_PACKAGES } from "@/lib/ai-credits"

interface PayPalHtmlButtonsProps {
  userId: string
  theme: any
}

export function PayPalHtmlButtons({ userId, theme }: PayPalHtmlButtonsProps) {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)

  const handlePackageSelect = (packageIndex: number) => {
    setSelectedPackage(packageIndex)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className={`text-2xl font-bold ${theme.textPrimary} mb-2`}>Comprar Créditos IA</h2>
        <p className={`${theme.textSecondary}`}>
          Elige el paquete que mejor se adapte a tus necesidades. Solo pagas por lo que usas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {CREDIT_PACKAGES.map((pkg, index) => (
          <Card
            key={index}
            className={`${theme.cardBg} ${theme.border} relative overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 ${
              selectedPackage === index ? "ring-2 ring-purple-500" : ""
            } ${pkg.popular ? "border-purple-500" : ""}`}
            onClick={() => handlePackageSelect(index)}
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
              {/* PayPal Button */}
              <div className="space-y-3">
                <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" className="w-full">
                  <input type="hidden" name="cmd" value="_s-xclick" />
                  <input type="hidden" name="hosted_button_id" value={getButtonId(index)} />
                  <input type="hidden" name="custom" value={JSON.stringify({ userId, credits: pkg.credits })} />
                  <input
                    type="hidden"
                    name="return"
                    value={`https://future-task.com/payment/success?credits=${pkg.credits}`}
                  />
                  <input type="hidden" name="cancel_return" value="https://future-task.com/payment/cancel" />
                  <input type="hidden" name="notify_url" value="https://future-task.com/api/paypal/ipn" />

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Pagar con PayPal
                  </Button>
                </form>

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
        ))}
      </div>

      {/* Information Section */}
      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardHeader>
          <CardTitle className={`${theme.textPrimary} text-lg`}>¿Cómo funcionan los créditos?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg bg-blue-500/10 border border-blue-500/20`}>
              <h3 className={`font-medium ${theme.textPrimary} mb-2`}>Sistema justo</h3>
              <p className={`text-sm ${theme.textSecondary}`}>
                Solo pagas por los tokens que realmente usas. Consultas simples cuestan menos.
              </p>
            </div>
            <div className={`p-4 rounded-lg bg-green-500/10 border border-green-500/20`}>
              <h3 className={`font-medium ${theme.textPrimary} mb-2`}>Transparente</h3>
              <p className={`text-sm ${theme.textSecondary}`}>
                Ves el costo exacto de cada consulta antes de enviarla.
              </p>
            </div>
            <div className={`p-4 rounded-lg bg-purple-500/10 border border-purple-500/20`}>
              <h3 className={`font-medium ${theme.textPrimary} mb-2`}>Sin caducidad</h3>
              <p className={`text-sm ${theme.textSecondary}`}>Tus créditos no caducan nunca. Úsalos cuando quieras.</p>
            </div>
          </div>

          <div className={`p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20`}>
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <h3 className={`font-medium ${theme.textPrimary} mb-1`}>Importante</h3>
                <p className={`text-sm ${theme.textSecondary}`}>
                  Necesitas una suscripción Pro activa para poder usar los créditos IA. Los créditos se añaden
                  automáticamente a tu cuenta después del pago exitoso.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper function to get PayPal button ID based on package index
function getButtonId(packageIndex: number): string {
  const buttonIds = [
    "TU_BUTTON_ID_50_CREDITS", // Replace with actual PayPal button ID for 50 credits
    "TU_BUTTON_ID_100_CREDITS", // Replace with actual PayPal button ID for 100 credits
    "TU_BUTTON_ID_250_CREDITS", // Replace with actual PayPal button ID for 250 credits
    "TU_BUTTON_ID_500_CREDITS", // Replace with actual PayPal button ID for 500 credits
  ]

  return buttonIds[packageIndex] || buttonIds[0]
}
