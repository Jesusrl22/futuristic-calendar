"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, Home, CreditCard } from "lucide-react"
import Link from "next/link"

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="bg-gradient-to-br from-slate-900/80 to-purple-900/50 backdrop-blur-sm border-slate-700">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
              <XCircle className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-white mb-2">Pago Cancelado</CardTitle>
            <p className="text-slate-300 text-lg">Has cancelado el proceso de pago</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Información */}
            <div className="bg-orange-900/20 rounded-lg p-6 border border-orange-700">
              <h3 className="text-xl font-semibold text-orange-300 mb-4">¿Qué ha pasado?</h3>
              <p className="text-orange-200 mb-4">
                El proceso de pago ha sido cancelado y no se ha realizado ningún cargo a tu cuenta.
              </p>
              <ul className="text-sm text-orange-200 space-y-2">
                <li>• No se ha procesado ningún pago</li>
                <li>• No se han añadido créditos a tu cuenta</li>
                <li>• Puedes intentar la compra nuevamente cuando quieras</li>
              </ul>
            </div>

            {/* Razones comunes */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-300 mb-3">Razones comunes de cancelación:</h4>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• Decidiste no completar la compra</li>
                <li>• Cerraste la ventana de PayPal</li>
                <li>• Problemas técnicos durante el proceso</li>
                <li>• Cambio de método de pago</li>
              </ul>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Link href="/app">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Intentar de Nuevo
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

            {/* Ayuda */}
            <div className="text-center pt-4 border-t border-slate-700">
              <p className="text-sm text-slate-400 mb-2">¿Necesitas ayuda con el proceso de pago?</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button variant="link" className="text-purple-400 hover:text-purple-300">
                  Ver Preguntas Frecuentes
                </Button>
                <Button variant="link" className="text-purple-400 hover:text-purple-300">
                  Contactar Soporte
                </Button>
              </div>
            </div>

            {/* Información de seguridad */}
            <div className="bg-green-900/20 rounded-lg p-4 border border-green-700">
              <p className="text-sm text-green-300 text-center">
                🔒 Todos nuestros pagos son procesados de forma segura por PayPal
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
