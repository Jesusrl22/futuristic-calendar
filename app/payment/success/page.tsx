"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Zap, ArrowRight, Home, CreditCard } from "lucide-react"
import Link from "next/link"
import { getCreditPackage } from "@/lib/ai-credits"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [paymentData, setPaymentData] = useState<any>(null)

  useEffect(() => {
    const credits = searchParams.get("credits")
    const packageId = searchParams.get("package")

    if (credits && packageId) {
      const creditPackage = getCreditPackage(packageId)
      setPaymentData({
        credits: Number.parseInt(credits),
        package: creditPackage,
      })
    }

    setIsLoading(false)
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="bg-gradient-to-br from-slate-900/80 to-purple-900/50 backdrop-blur-sm border-slate-700">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-white mb-2">¡Pago Exitoso!</CardTitle>
            <p className="text-slate-300 text-lg">Tu compra se ha procesado correctamente</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Detalles de la compra */}
            {paymentData && (
              <div className="bg-slate-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-purple-400" />
                  Detalles de la Compra
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Paquete:</span>
                    <Badge className="bg-purple-600 text-white">{paymentData.package?.name}</Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Créditos añadidos:</span>
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-yellow-400" />
                      <span className="text-2xl font-bold text-purple-400">{paymentData.credits.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Precio pagado:</span>
                    <span className="text-xl font-semibold text-green-400">
                      €{paymentData.package?.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Estado:</span>
                    <Badge className="bg-green-600 text-white">Completado</Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Información adicional */}
            <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700">
              <h4 className="font-semibold text-blue-300 mb-2">¿Qué sigue?</h4>
              <ul className="text-sm text-blue-200 space-y-1">
                <li>• Tus créditos están disponibles inmediatamente</li>
                <li>• Los créditos no tienen fecha de caducidad</li>
                <li>• Puedes usar la IA para tareas, planificación y más</li>
                <li>• Recibirás un email de confirmación en breve</li>
              </ul>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Link href="/app">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Ir a la Aplicación
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
              >
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Volver al Inicio
                </Link>
              </Button>
            </div>

            {/* Soporte */}
            <div className="text-center pt-4 border-t border-slate-700">
              <p className="text-sm text-slate-400 mb-2">¿Tienes alguna pregunta sobre tu compra?</p>
              <Button variant="link" className="text-purple-400 hover:text-purple-300">
                Contactar Soporte
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
