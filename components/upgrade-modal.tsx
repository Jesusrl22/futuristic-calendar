"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Lock } from "@/components/icons"

interface UpgradeModalProps {
  feature: string
  requiredPlan: "premium" | "pro"
}

export function UpgradeModal({ feature, requiredPlan }: UpgradeModalProps) {
  const planName = requiredPlan === "pro" ? "Pro" : "Premium"
  const planPrice = requiredPlan === "pro" ? "€6.49" : "€2.49"

  return (
    <div className="p-8">
      <Card className="glass-card p-12 text-center neon-glow max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-4">
          <span className="text-primary neon-text">Upgrade Required</span>
        </h2>
        <p className="text-muted-foreground mb-2">
          {feature} is a {planName} feature.
        </p>
        <p className="text-lg mb-8">
          Upgrade to {planName} for just <span className="text-primary font-bold">{planPrice}/month</span> to unlock
          this feature.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/app/subscription">
            <Button size="lg" className="neon-glow-hover">
              Upgrade to {planName}
            </Button>
          </Link>
          <Link href="/app">
            <Button size="lg" variant="outline">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
