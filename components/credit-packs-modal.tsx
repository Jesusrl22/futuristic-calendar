"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Zap, Crown } from "@/components/icons"
import { CREDIT_PACKS } from "@/lib/stripe"

interface CreditPacksModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userPlan: string
}

export function CreditPacksModal({ open, onOpenChange, userPlan }: CreditPacksModalProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handlePurchase = async (packId: string) => {
    return
    setLoading(packId)
    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId }),
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        alert("Error creating checkout session")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error processing purchase")
    } finally {
      setLoading(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            Buy AI Credit Packs
          </DialogTitle>
          <DialogDescription>
            Purchase additional AI credits that never expire. Perfect for when you need extra credits beyond your
            monthly allowance.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
            🔧 Payment system is currently being configured. Credit packs will be available soon with Stripe or PayPal
            Business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {CREDIT_PACKS.map((pack) => (
            <Card key={pack.id} className={`glass-card p-6 ${pack.popular ? "border-2 border-primary neon-glow" : ""}`}>
              {pack.popular && (
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <Crown className="w-4 h-4" />
                  <span className="text-xs font-semibold">BEST VALUE</span>
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{pack.name}</h3>
                  <p className="text-sm text-muted-foreground">{pack.description}</p>
                </div>
                <div className="text-center">
                  <Zap className="w-10 h-10 text-primary mx-auto mb-1" />
                  <p className="text-2xl font-bold">{pack.credits}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">€{pack.price}</span>
                  <span className="text-sm text-muted-foreground">(IVA incluido)</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">€{pack.priceBeforeVAT.toFixed(2)} sin IVA</p>
              </div>

              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Credits never expire</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Use anytime</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Stack with monthly credits</span>
                </li>
              </ul>

              <Button className="w-full neon-glow-hover" onClick={() => handlePurchase(pack.id)} disabled={true}>
                Coming Soon
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Purchased credits are added to your account immediately and never expire. Monthly
            subscription credits reset each month, but purchased credits remain available indefinitely.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
