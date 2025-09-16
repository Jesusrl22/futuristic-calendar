"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Sparkles, ArrowRight, Home, CreditCard } from "lucide-react"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [credits, setCredits] = useState<number | null>(null)

  useEffect(() => {
    const creditsParam = searchParams.get("credits")
    if (creditsParam) {
      setCredits(Number.parseInt(creditsParam, 10))
    }
    setIsLoading(false)
  }, [searchParams])

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <div className="text-white text-xl">Procesando pago...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500/30">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
              </div>
            </div>
          </div>
          <h1 className={`text-3xl font-bold ${theme.textPrimary}`}>¡Pago Exitoso!</h1>
          <p className={`text-lg ${theme.textSecondary}`}>
            Tu compra ha sido procesada correctamente y los créditos han sido añadidos a tu cuenta.
          </p>
        </div>

        {/* Purchase Details */}
        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardHeader>
            <CardTitle className={`${theme.textPrimary} flex items-center space-x-2`}>
              <CreditCard className="w-5 h-5 text-purple-400" />
              <span>Detalles de la compra</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {credits && (
              <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${theme.textPrimary}`}>Créditos IA añadidos</h3>
                    <p className={`text-sm ${theme.textSecondary}`}>Listos para usar inmediatamente</p>
                  </div>
                </div>
                <Badge className="bg-green-500 text-white text-lg px-4 py-2">+{credits} créditos</Badge>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg bg-slate-800/30 border ${theme.border}`}>
                <h4 className={`font-medium ${theme.textPrimary} mb-1`}>Estado</h4>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className={`text-sm text-green-400`}>Completado</span>
                </div>
              </div>
              <div className={`p-4 rounded-lg bg-slate-800/30 border ${theme.border}`}>
                <h4 className={`font-medium ${theme.textPrimary} mb-1`}>Método de pago</h4>
                <p className={`text-sm ${theme.textSecondary}`}>PayPal</p>
              </div>
              <div className={`p-4 rounded-lg bg-slate-800/30 border ${theme.border}`}>
                <h4 className={`font-medium ${theme.textPrimary} mb-1`}>Fecha</h4>
                <p className={`text-sm ${theme.textSecondary}`}>{new Date().toLocaleDateString("es-ES")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardHeader>
            <CardTitle className={`${theme.textPrimary}`}>¿Qué sigue?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-purple-400">1</span>
                </div>
                <div>
                  <h4 className={`font-medium ${theme.textPrimary}`}>Tus créditos están listos</h4>
                  <p className={`text-sm ${theme.textSecondary}`}>
                    Los créditos se han añadido automáticamente a tu cuenta y puedes usarlos inmediatamente.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-purple-400">2</span>
                </div>
                <div>
                  <h4 className={`font-medium ${theme.textPrimary}`}>Usa el asistente IA</h4>
                  <p className={`text-sm ${theme.textSecondary}`}>
                    Ve a la pestaña "IA Assistant" para empezar a usar tus créditos con consultas inteligentes.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-purple-400">3</span>
                </div>
                <div>
                  <h4 className={`font-medium ${theme.textPrimary}`}>Monitorea tu uso</h4>
                  <p className={`text-sm ${theme.textSecondary}`}>
                    Puedes ver tu saldo de créditos y historial de uso en cualquier momento.
                  </p>
                </div>
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
            <Home className="w-4 h-4" />
            <span>Volver al inicio</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => router.push("/?tab=ai")}
            variant="outline"
            className={`flex-1 ${theme.buttonSecondary} flex items-center justify-center space-x-2`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Usar IA ahora</span>
          </Button>
        </div>

        {/* Footer Note */}
        <div className={`text-center text-sm ${theme.textMuted}`}>
          <p>
            Si tienes algún problema o pregunta, no dudes en contactarnos en{" "}
            <a href="mailto:support@future-task.com" className="text-purple-400 hover:underline">
              support@future-task.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
