"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getUserAICredits, type AICreditsInfo } from "@/lib/ai-credits"
import { PayPalHtmlButtons } from "./paypal-html-buttons"
import { Sparkles, CreditCard, AlertCircle, Clock } from "lucide-react"

interface AICreditsDisplayProps {
  userId: string
  theme: any
}

export function AICreditsDisplay({ userId, theme }: AICreditsDisplayProps) {
  const [credits, setCredits] = useState<AICreditsInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false)

  useEffect(() => {
    loadCredits()
  }, [userId])

  const loadCredits = async () => {
    try {
      const creditsInfo = await getUserAICredits(userId)
      setCredits(creditsInfo)
    } catch (error) {
      console.error("Error loading AI credits:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePurchaseComplete = (purchasedCredits: number) => {
    // Refresh credits after purchase
    loadCredits()
    setShowPurchaseDialog(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
        <span className={`text-sm ${theme.textSecondary}`}>Cargando...</span>
      </div>
    )
  }

  if (!credits) {
    return (
      <div className="flex items-center space-x-2">
        <AlertCircle className="h-4 w-4 text-red-400" />
        <span className="text-sm text-red-400">Error cargando créditos</span>
      </div>
    )
  }

  const getStatusColor = () => {
    if (!credits.canUseAI) return "text-red-400"
    if (credits.remaining < 10) return "text-yellow-400"
    return "text-green-400"
  }

  const getStatusIcon = () => {
    if (!credits.canUseAI) return <AlertCircle className="h-4 w-4" />
    if (credits.remaining < 10) return <Clock className="h-4 w-4" />
    return <Sparkles className="h-4 w-4" />
  }

  const getStatusText = () => {
    if (!credits.canUseAI) return "Sin acceso IA"
    if (credits.remaining === 0) return "Sin créditos"
    if (credits.remaining < 10) return "Pocos créditos"
    return "IA disponible"
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Credits Display */}
      <div className="flex items-center space-x-2">
        <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="text-sm font-medium">{credits.remaining}</span>
        </div>
        <span className={`text-xs ${theme.textMuted}`}>créditos</span>
      </div>

      {/* Status Badge */}
      <Badge
        variant="secondary"
        className={`text-xs ${
          credits.canUseAI
            ? "bg-green-500/10 text-green-400 border-green-500/20"
            : "bg-red-500/10 text-red-400 border-red-500/20"
        }`}
      >
        {getStatusText()}
      </Badge>

      {/* Purchase Button */}
      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogTrigger asChild>
          <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
            <CreditCard className="h-3 w-3 mr-1" />
            Comprar
          </Button>
        </DialogTrigger>
        <DialogContent className={`${theme.cardBg} ${theme.border} max-w-4xl max-h-[90vh] overflow-y-auto`}>
          <DialogHeader>
            <DialogTitle className={`${theme.textPrimary} flex items-center gap-2`}>
              <Sparkles className="h-5 w-5 text-purple-400" />
              Comprar Créditos IA
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current Status */}
            <Card className={`${theme.cardBg} border-slate-600`}>
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className={`text-2xl font-bold ${theme.textPrimary}`}>{credits.remaining}</div>
                    <div className={`text-sm ${theme.textSecondary}`}>Créditos restantes</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${theme.textPrimary}`}>{credits.used}</div>
                    <div className={`text-sm ${theme.textSecondary}`}>Créditos usados</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold text-purple-400`}>{credits.totalCostEur.toFixed(2)}€</div>
                    <div className={`text-sm ${theme.textSecondary}`}>Coste total</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Purchase Options */}
            <PayPalHtmlButtons userId={userId} theme={theme} onPurchaseComplete={handlePurchaseComplete} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
