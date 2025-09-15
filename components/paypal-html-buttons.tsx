"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CREDIT_PACKAGES } from "@/lib/ai-credits"
import { Sparkles, CreditCard, Check, Star } from "lucide-react"

interface PayPalHtmlButtonsProps {
  userId: string
  theme: any
  onPurchaseComplete?: (credits: number) => void
}

export function PayPalHtmlButtons({ userId, theme, onPurchaseComplete }: PayPalHtmlButtonsProps) {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Aquí pegarás los botones HTML que te genere PayPal Business
  const getPayPalButtonHTML = (packageIndex: number) => {
    const pkg = CREDIT_PACKAGES[packageIndex]

    // IMPORTANTE: Reemplaza estos botones con los que te genere PayPal Business
    // Cada botón debe tener un item_number único para identificar el paquete
    switch (packageIndex) {
      case 0: // 50 créditos - €1.00
        return `
          <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input type="hidden" name="hosted_button_id" value="TU_BUTTON_ID_1" />
            <input type="hidden" name="item_number" value="credits_50" />
            <input type="hidden" name="custom" value="${userId}" />
            <input type="hidden" name="return" value="${process.env.NEXT_PUBLIC_APP_URL}/payment/success?credits=50" />
            <input type="hidden" name="cancel_return" value="${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel" />
            <input type="hidden" name="notify_url" value="${process.env.NEXT_PUBLIC_APP_URL}/api/paypal/ipn" />
            <input type="image" src="https://www.paypalobjects.com/es_ES/ES/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Comprar ahora" />
          </form>
        `
      case 1: // 100 créditos - €2.00
        return `
          <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input type="hidden" name="hosted_button_id" value="TU_BUTTON_ID_2" />
            <input type="hidden" name="item_number" value="credits_100" />
            <input type="hidden" name="custom" value="${userId}" />
            <input type="hidden" name="return" value="${process.env.NEXT_PUBLIC_APP_URL}/payment/success?credits=100" />
            <input type="hidden" name="cancel_return" value="${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel" />
            <input type="hidden" name="notify_url" value="${process.env.NEXT_PUBLIC_APP_URL}/api/paypal/ipn" />
            <input type="image" src="https://www.paypalobjects.com/es_ES/ES/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Comprar ahora" />
          </form>
        `
      case 2: // 250 créditos - €5.00
        return `
          <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input type="hidden" name="hosted_button_id" value="TU_BUTTON_ID_3" />
            <input type="hidden" name="item_number" value="credits_250" />
            <input type="hidden" name="custom" value="${userId}" />
            <input type="hidden" name="return" value="${process.env.NEXT_PUBLIC_APP_URL}/payment/success?credits=250" />
            <input type="hidden" name="cancel_return" value="${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel" />
            <input type="hidden" name="notify_url" value="${process.env.NEXT_PUBLIC_APP_URL}/api/paypal/ipn" />
            <input type="image" src="https://www.paypalobjects.com/es_ES/ES/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Comprar ahora" />
          </form>
        `
      case 3: // 500 créditos - €10.00
        return `
          <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input type="hidden" name="hosted_button_id" value="TU_BUTTON_ID_4" />
            <input type="hidden" name="item_number" value="credits_500" />
            <input type="hidden" name="custom" value="${userId}" />
            <input type="hidden" name="return" value="${process.env.NEXT_PUBLIC_APP_URL}/payment/success?credits=500" />
            <input type="hidden" name="cancel_return" value="${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel" />
            <input type="hidden" name="notify_url" value="${process.env.NEXT_PUBLIC_APP_URL}/api/paypal/ipn" />
            <input type="image" src="https://www.paypalobjects.com/es_ES/ES/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Comprar ahora" />
          </form>
        `
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className={`text-2xl font-bold ${theme.textPrimary} mb-2`}>Comprar Créditos IA</h3>
        <p className={theme.textSecondary}>Elige el paquete que mejor se adapte a tus necesidades</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CREDIT_PACKAGES.map((pkg, index) => (
          <Card
            key={index}
            className={`${theme.cardBg} ${theme.border} relative transition-all duration-200 ${
              selectedPackage === index ? "ring-2 ring-purple-500" : ""
            } ${pkg.popular ? "ring-2 ring-yellow-500" : ""}`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-yellow-500 text-black font-bold px-3 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Más Popular
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="w-6 h-6 text-purple-400 mr-2" />
                <CardTitle className={`text-xl ${theme.textPrimary}`}>{pkg.credits} Créditos</CardTitle>
              </div>
              <div className={`text-3xl font-bold ${theme.textPrimary}`}>{pkg.price}</div>
              <p className={`text-sm ${theme.textSecondary}`}>{pkg.description}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Check className="w-4 h-4 text-green-400 mr-2" />
                  <span className={theme.textSecondary}>{pkg.estimatedRequests}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Check className="w-4 h-4 text-green-400 mr-2" />
                  <span className={theme.textSecondary}>Válido por 12 meses</span>
                </div>
                <div className="flex items-center text-sm">
                  <Check className="w-4 h-4 text-green-400 mr-2" />
                  <span className={theme.textSecondary}>Soporte prioritario</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700">
                {selectedPackage === index ? (
                  <div className="space-y-3">
                    <div
                      className="paypal-button-container"
                      dangerouslySetInnerHTML={{
                        __html: getPayPalButtonHTML(index),
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPackage(null)}
                      className="w-full text-slate-400 hover:text-white"
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setSelectedPackage(index)}
                    className={`w-full ${
                      pkg.popular ? "bg-yellow-600 hover:bg-yellow-700 text-black font-bold" : theme.buttonPrimary
                    }`}
                    disabled={isProcessing}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Seleccionar Paquete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className={`text-center text-sm ${theme.textMuted} space-y-2`}>
        <p>🔒 Pago seguro procesado por PayPal</p>
        <p>💳 Aceptamos tarjetas de crédito, débito y PayPal</p>
        <p>⚡ Los créditos se añaden automáticamente a tu cuenta</p>
      </div>
    </div>
  )
}
