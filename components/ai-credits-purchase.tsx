"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Star, Check, AlertCircle, Crown } from "lucide-react"
import { PayPalPayment } from "@/components/paypal-payment"

interface CreditPack {
  id: string
  name: string
  credits: number
  basePrice: number
  vat: number
  finalPrice: number
  popular?: boolean
  bestValue?: boolean
  bonus?: number
  features: string[]
  description: string
}

interface AiCreditsPurchaseProps {
  userId: string
  currentCredits: number
  onPurchaseSuccess: (credits: number) => void
}

export function AiCreditsPurchase({ userId, currentCredits, onPurchaseSuccess }: AiCreditsPurchaseProps) {
  const [selectedPack, setSelectedPack] = useState<string | null>(null)
  const [showPayment, setShowPayment] = useState(false)

  const creditPacks: CreditPack[] = [
    {
      id: "credits-starter",
      name: "Starter",
      credits: 100,
      basePrice: 2.47,
      vat: 0.52,
      finalPrice: 2.99,
      description: "Perfecto para probar la IA",
      features: [
        "100 créditos IA",
        "~100 mensajes simples",
        "~50 análisis complejos",
        "Válido por 6 meses",
        "Soporte básico",
      ],
    },
    {
      id: "credits-popular",
      name: "Popular",
      credits: 500,
      basePrice: 8.26,
      vat: 1.73,
      finalPrice: 9.99,
      popular: true,
      bonus: 50,
      description: "El más elegido por usuarios",
      features: [
        "500 créditos IA",
        "+50 créditos bonus",
        "~550 mensajes simples",
        "~275 análisis complejos",
        "Válido por 12 meses",
        "Soporte prioritario",
      ],
    },
    {
      id: "credits-professional",
      name: "Professional",
      credits: 1000,
      basePrice: 14.87,
      vat: 3.12,
      finalPrice: 17.99,
      bonus: 200,
      bestValue: true,
      description: "Mejor precio por crédito",
      features: [
        "1000 créditos IA",
        "+200 créditos bonus",
        "~1200 mensajes simples",
        "~600 análisis complejos",
        "Válido por 12 meses",
        "Soporte 24/7",
        "Acceso beta a funciones",
      ],
    },
    {
      id: "credits-enterprise",
      name: "Enterprise",
      credits: 2500,
      basePrice: 33.05,
      vat: 6.94,
      finalPrice: 39.99,
      bonus: 500,
      description: "Para uso intensivo",
      features: [
        "2500 créditos IA",
        "+500 créditos bonus",
        "~3000 mensajes simples",
        "~1500 análisis complejos",
        "Sin caducidad",
        "Soporte dedicado",
        "Consultoría incluida",
        "API personalizada",
      ],
    },
  ]

  const handlePackSelect = (packId: string) => {
    setSelectedPack(packId)
    setShowPayment(true)
  }

  const handlePaymentSuccess = (packId: string) => {
    const pack = creditPacks.find((p) => p.id === packId)
    if (pack) {
      const totalCredits = pack.credits + (pack.bonus || 0)
      onPurchaseSuccess(totalCredits)
    }
    setShowPayment(false)
  }

  const getCostPerCredit = (pack: CreditPack) => {
    const totalCredits = pack.credits + (pack.bonus || 0)
    return (pack.finalPrice / totalCredits).toFixed(3)
  }

  if (showPayment && selectedPack) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => setShowPayment(false)} className="text-purple-400">
          ← Volver a paquetes
        </Button>
        <PayPalPayment
          planId={selectedPack}
          onSuccess={() => handlePaymentSuccess(selectedPack)}
          onCancel={() => setShowPayment(false)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2">Comprar Créditos IA</h3>
        <p className="text-gray-400">
          Tienes <span className="text-purple-400 font-semibold">{currentCredits}</span> créditos disponibles
        </p>
      </div>

      {/* Info Banner */}
      <Card className="bg-blue-900/20 border-blue-500/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <h3 className="text-blue-400 font-medium mb-1">¿Por qué comprar créditos por separado?</h3>
              <div className="text-sm text-gray-300 space-y-1">
                <p>
                  • <strong>Flexibilidad:</strong> Compra solo lo que necesitas
                </p>
                <p>
                  • <strong>Sin caducidad:</strong> Los créditos comprados no expiran (excepto Starter)
                </p>
                <p>
                  • <strong>Para todos los planes:</strong> Free, Premium y Pro pueden comprar créditos extra
                </p>
                <p>
                  • <strong>Mejor control:</strong> No hay renovaciones automáticas
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {creditPacks.map((pack) => (
          <Card
            key={pack.id}
            className={`relative bg-slate-800/50 border-2 transition-all duration-200 hover:scale-105 ${
              pack.popular
                ? "border-purple-500 shadow-lg shadow-purple-500/20"
                : pack.bestValue
                  ? "border-yellow-500 shadow-lg shadow-yellow-500/20"
                  : "border-slate-700 hover:border-purple-500/50"
            }`}
          >
            {pack.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1">
                  <Star className="h-3 w-3 mr-1" />
                  Más Popular
                </Badge>
              </div>
            )}

            {pack.bestValue && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-3 py-1">
                  <Crown className="h-3 w-3 mr-1" />
                  Mejor Valor
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg font-bold text-white">{pack.name}</CardTitle>
              <p className="text-sm text-gray-400">{pack.description}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-1 text-purple-400">
                  <Zap className="h-5 w-5" />
                  <span className="text-2xl font-bold">
                    {pack.credits}
                    {pack.bonus && <span className="text-green-400">+{pack.bonus}</span>}
                  </span>
                  <span className="text-sm text-gray-400">créditos</span>
                </div>
                <div className="text-sm text-gray-400">
                  <div>Base: €{pack.basePrice.toFixed(2)}</div>
                  <div>IVA (21%): €{pack.vat.toFixed(2)}</div>
                </div>
                <div className="text-2xl font-bold text-white">€{pack.finalPrice.toFixed(2)}</div>
                <div className="text-xs text-gray-500">€{getCostPerCredit(pack)} por crédito</div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {pack.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handlePackSelect(pack.id)}
                className={`w-full ${
                  pack.popular
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    : pack.bestValue
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black"
                      : "bg-slate-700 hover:bg-slate-600"
                } text-white`}
              >
                Comprar Créditos
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-800/30 border-purple-500/20">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <h4 className="font-semibold text-white">¿Cómo funcionan los créditos IA?</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-400" />
                <span>1 crédito = mensaje simple</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-400" />
                <span>2-3 créditos = análisis complejo</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-400" />
                <span>Los créditos se acumulan</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 <strong>Tip:</strong> Los usuarios Pro obtienen 500 créditos automáticamente cada mes, pero pueden
              comprar más si los necesitan
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
