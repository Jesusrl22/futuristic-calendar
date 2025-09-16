"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, ArrowLeft, CreditCard, HelpCircle } from "lucide-react"

export default function PaymentCancelPage() {
  const router = useRouter()

  const theme = {
    gradient: "from-slate-900 via-purple-900 to-slate-900",
    cardBg: "bg-slate-800/50 backdrop-blur-sm",
    border: "border-slate-700",
    textPrimary: "text-white",
    textSecondary: "text-slate-300",
    textMuted: "text-slate-400",
    buttonPrimary: "bg-purple-600 hover:bg-purple-700",
    buttonSecondary: "bg-slate-700 hover:bg-slate-600",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Cancel Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center border-2 border-orange-500/30">
              <XCircle className="w-10 h-10 text-orange-400" />
            </div>
          </div>
          <h1 className={`text-3xl font-bold ${theme.textPrimary}`}>Pago Cancelado</h1>
          <p className={`text-lg ${theme.textSecondary}`}>
            Has cancelado el proceso de pago. No se ha realizado ningún cargo a tu cuenta.
          </p>
        </div>

        {/* Information Card */}
        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardHeader>
            <CardTitle className={`${theme.textPrimary} flex items-center space-x-2`}>
              <HelpCircle className="w-5 h-5 text-orange-400" />
              <span>¿Qué pasó?</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                <div>
                  <p className={`${theme.textSecondary}`}>
                    El pago fue cancelado antes de completarse, por lo que no se realizó ningún cargo.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                <div>
                  <p className={`${theme.textSecondary}`}>
                    No se añadieron créditos a tu cuenta y tu saldo permanece sin cambios.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                <div>
                  <p className={`${theme.textSecondary}`}>
                    Puedes intentar realizar la compra nuevamente cuando estés listo.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reasons for Cancellation */}
        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardHeader>
            <CardTitle className={`${theme.textPrimary}`}>Posibles razones para la cancelación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg bg-slate-800/30 border ${theme.border}`}>
                <h4 className={`font-medium ${theme.textPrimary} mb-2`}>Cambio de opinión</h4>
                <p className={`text-sm ${theme.textSecondary}`}>Decidiste no completar la compra en este momento.</p>
              </div>
              <div className={`p-4 rounded-lg bg-slate-800/30 border ${theme.border}`}>
                <h4 className={`font-medium ${theme.textPrimary} mb-2`}>Problema técnico</h4>
                <p className={`text-sm ${theme.textSecondary}`}>Hubo un error durante el proceso de pago en PayPal.</p>
              </div>
              <div className={`p-4 rounded-lg bg-slate-800/30 border ${theme.border}`}>
                <h4 className={`font-medium ${theme.textPrimary} mb-2`}>Método de pago</h4>
                <p className={`text-sm ${theme.textSecondary}`}>
                  Problemas con la tarjeta o cuenta de PayPal seleccionada.
                </p>
              </div>
              <div className={`p-4 rounded-lg bg-slate-800/30 border ${theme.border}`}>
                <h4 className={`font-medium ${theme.textPrimary} mb-2`}>Revisión necesaria</h4>
                <p className={`text-sm ${theme.textSecondary}`}>Quisiste revisar los detalles antes de confirmar.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => router.push("/")}
            className={`flex-1 ${theme.buttonPrimary} flex items-center justify-center space-x-2`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al inicio</span>
          </Button>
          <Button
            onClick={() => router.push("/?tab=credits")}
            variant="outline"
            className={`flex-1 ${theme.buttonSecondary} flex items-center justify-center space-x-2`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Intentar de nuevo</span>
          </Button>
        </div>

        {/* Help Section */}
        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className={`font-medium ${theme.textPrimary}`}>¿Necesitas ayuda?</h3>
              <p className={`text-sm ${theme.textSecondary}`}>
                Si experimentaste problemas técnicos o tienes preguntas sobre los créditos IA, contáctanos:
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                <a href="mailto:support@future-task.com" className="text-purple-400 hover:underline text-sm">
                  support@future-task.com
                </a>
                <span className={`text-sm ${theme.textMuted} hidden sm:inline`}>•</span>
                <span className={`text-sm ${theme.textMuted}`}>Respuesta en menos de 24 horas</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
