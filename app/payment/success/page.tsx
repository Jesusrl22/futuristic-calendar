"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Sparkles, ArrowLeft, CreditCard } from "lucide-react"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [credits, setCredits] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const creditsParam = searchParams.get("credits")
    if (creditsParam) {
      setCredits(Number.parseInt(creditsParam))
    }
    setIsLoading(false)
  }, [searchParams])

  const handleGoBack = () => {
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <CheckCircle className="h-16 w-16 text-green-400" />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">¡Pago Exitoso!</CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-slate-300">Tu pago ha sido procesado correctamente</p>
            {credits && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2">
                  <CreditCard className="h-5 w-5 text-green-400" />
                  <span className="text-green-400 font-bold text-lg">+{credits} Créditos IA</span>
                </div>
                <p className="text-green-300 text-sm mt-1">Añadidos a tu cuenta</p>
              </div>
            )}
          </div>

          <div className="space-y-3 text-sm text-slate-400">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Pago verificado por PayPal</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Créditos añadidos automáticamente</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Recibo enviado por email</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700">
            <Button onClick={handleGoBack} className="w-full bg-purple-600 hover:bg-purple-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a la Aplicación
            </Button>
          </div>

          <div className="text-xs text-slate-500">
            <p>
              Si tienes algún problema, contacta con soporte en{" "}
              <a href="mailto:soporte@futuretask.com" className="text-purple-400 hover:underline">
                soporte@futuretask.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
