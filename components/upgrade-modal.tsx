"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Lock, ShoppingCart } from "@/components/icons"

interface UpgradeModalProps {
  feature: string
  requiredPlan: "premium" | "pro"
  customMessage?: string
}

export function UpgradeModal({ feature, requiredPlan, customMessage }: UpgradeModalProps) {
  const planName = requiredPlan === "pro" ? "Pro" : "Premium"
  const planPrice = requiredPlan === "pro" ? "€6.49" : "€2.49"

  return (
    <div className="p-4 md:p-8">
      <Card className="glass-card p-8 md:p-12 text-center neon-glow max-w-2xl mx-auto">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 md:mb-6">
          <Lock className="w-6 h-6 md:w-8 md:h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          <span className="text-primary neon-text">Upgrade Required</span>
        </h2>
        <p className="text-sm md:text-base text-muted-foreground mb-2">
          {customMessage || `${feature} is a ${planName} feature.`}
        </p>
        <p className="text-base md:text-lg mb-6 md:mb-8">
          Upgrade to {planName} for just <span className="text-primary font-bold">{planPrice}/month</span> to unlock
          this feature.
        </p>

        {feature === "AI Assistant" && (
          <div className="mb-6 md:mb-8 p-4 bg-secondary/20 rounded-lg border border-border/50">
            <p className="text-sm md:text-base mb-4">
              Or purchase credit packs to access the AI Assistant without a subscription
            </p>
            <Link href="/app/subscription">
              <Button size="lg" variant="secondary" className="neon-glow-hover w-full md:w-auto">
                <ShoppingCart className="w-4 h-4 mr-2" />
                View Credit Packs
              </Button>
            </Link>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/app/subscription" className="w-full md:w-auto">
            <Button size="lg" className="neon-glow-hover w-full">
              Upgrade to {planName}
            </Button>
          </Link>
          <Link href="/app" className="w-full md:w-auto">
            <Button size="lg" variant="outline" className="w-full bg-transparent">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
