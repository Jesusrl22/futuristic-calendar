"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, ArrowLeft, CreditCard } from "lucide-react"

export default function PaymentCancelPage() {
  const router = useRouter()

  const handleGoBack = () => {
    router.push("/")
  }

  const handleTryAgain = () => {
    router.push("/?tab=ai") // Redirect to AI tab where payment options are
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Pago Cancelado</CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-slate-300">Has cancelado el proceso de pago</p>
            <p className="text-slate-400 text-sm">No se ha realizado ningún cargo a tu cuenta</p>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <p className="text-yellow-400 text-sm">
              💡 Los créditos IA te permiten usar el asistente inteligente para planificar tareas, generar ideas y
              optimizar tu productividad.
            </p>
          </div>

          <div className="space-y-3">
            <Button onClick={handleTryAgain} className="w-full bg-purple-600 hover:bg-purple-700">
              <CreditCard className="h-4 w-4 mr-2" />
              Intentar de Nuevo
            </Button>

            <Button onClick={handleGoBack} variant="ghost" className="w-full text-slate-300 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a la Aplicación
            </Button>
          </div>

          <div className="text-xs text-slate-500">
            <p>
              ¿Necesitas ayuda? Contacta con soporte en{" "}
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
