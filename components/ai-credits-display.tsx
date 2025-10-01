"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, ShoppingCart, Crown, Star } from "lucide-react"
import { AiCreditsPurchase } from "@/components/ai-credits-purchase"

interface AiCreditsDisplayProps {
  credits: number
  creditsUsed: number
  plan: "free" | "premium" | "pro"
  onPurchaseSuccess?: (credits: number) => void
}

export function AiCreditsDisplay({ credits, creditsUsed, plan, onPurchaseSuccess }: AiCreditsDisplayProps) {
  const [showPurchase, setShowPurchase] = useState(false)

  const getCreditsColor = () => {
    if (credits === 0) return "text-red-400"
    if (credits < 10) return "text-yellow-400"
    return "text-green-400"
  }

  const getPlanBadge = () => {
    switch (plan) {
      case "pro":
        return (
          <Badge className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
            <Crown className="h-3 w-3 mr-1" />
            Pro
          </Badge>
        )
      case "premium":
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            <Star className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="border-slate-600 text-slate-400">
            Gratuito
          </Badge>
        )
    }
  }

  const getCreditsMessage = () => {
    switch (plan) {
      case "pro":
        return "Créditos IA incluidos en tu plan Pro"
      case "premium":
        return "Compra créditos IA para usar el asistente"
      default:
        return "Compra créditos IA para usar el asistente"
    }
  }

  const canPurchaseCredits = () => {
    // Todos los planes pueden comprar créditos adicionales
    return true
  }

  if (showPurchase) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Comprar Créditos IA</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPurchase(false)}
              className="text-slate-400 hover:text-white"
            >
              ← Volver
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <AiCreditsPurchase
            userId="current-user"
            currentCredits={credits}
            onPurchaseSuccess={(newCredits) => {
              onPurchaseSuccess?.(newCredits)
              setShowPurchase(false)
            }}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-400" />
            Créditos IA
          </CardTitle>
          {getPlanBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${getCreditsColor()}`}>{credits}</span>
              <span className="text-sm text-slate-400">disponibles</span>
            </div>
            {creditsUsed > 0 && <div className="text-xs text-slate-500">{creditsUsed} créditos usados</div>}
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">Estado</div>
            <div className={`text-sm font-medium ${credits > 0 ? "text-green-400" : "text-red-400"}`}>
              {credits > 0 ? "Activo" : "Sin créditos"}
            </div>
          </div>
        </div>

        <div className="text-sm text-slate-400">{getCreditsMessage()}</div>

        {canPurchaseCredits() && (
          <div className="space-y-2">
            <Button
              onClick={() => setShowPurchase(true)}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {credits > 0 ? "Comprar Más Créditos" : "Comprar Créditos IA"}
            </Button>

            {plan !== "pro" && (
              <div className="text-xs text-center text-slate-500">
                💡 <strong>Tip:</strong> El plan Pro incluye 1000 créditos IA mensuales
              </div>
            )}
          </div>
        )}

        {credits === 0 && (
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-center gap-2 text-yellow-300 text-sm">
              <Zap className="h-4 w-4" />
              <span className="font-medium">Sin créditos IA</span>
            </div>
            <p className="text-xs text-yellow-200 mt-1">
              Necesitas créditos IA para usar el asistente inteligente. Puedes comprar paquetes de créditos o actualizar
              a Pro.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
