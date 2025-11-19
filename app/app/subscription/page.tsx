"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Check, Zap, Crown } from "@/components/icons"

const plans = [
  {
    name: "Free",
    price: 0,
    credits: 0,
    features: ["0 AI credits/month", "Unlimited tasks & notes", "Basic statistics", "Calendar view", "Pomodoro timer"],
  },
  {
    name: "Premium",
    price: 2.49,
    credits: 100,
    features: [
      "100 AI credits/month",
      "Everything in Free",
      "Team collaboration",
      "Priority support",
      "Custom integrations",
    ],
    popular: true,
  },
  {
    name: "Pro",
    price: 6.49,
    credits: 500,
    features: [
      "500 AI credits/month",
      "Everything in Premium",
      "Advanced analytics",
      "API access",
      "Custom themes",
      "Export data",
    ],
  },
]

export default function SubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState("free")
  const [credits, setCredits] = useState(0)
  const [expiresAt, setExpiresAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscription()
    
    const interval = setInterval(() => {
      fetchSubscription()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const fetchSubscription = async () => {
    try {
      const response = await fetch("/api/user/profile", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setCurrentPlan(data.subscription_tier || "free")
        setCredits(data.ai_credits || 0)
        setExpiresAt(data.subscription_expires_at || null)
      }
    } catch (error) {
      console.error("Error fetching subscription:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (planName: string) => {
    alert(`Upgrade to ${planName} plan - Payment integration coming soon!`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  }

  return (
    <div className="p-8">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading subscription...</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold mb-8">
            <span className="text-primary neon-text">Subscription</span>
          </h1>

          <Card className="glass-card p-6 neon-glow mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Current Plan: {currentPlan.toUpperCase()}</h2>
                <p className="text-muted-foreground">Manage your subscription and billing</p>
                {expiresAt && <p className="text-sm text-orange-500 mt-2">Plan expires: {formatDate(expiresAt)}</p>}
              </div>
              <div className="text-center">
                <Zap className="w-12 h-12 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary">{credits} credits</p>
                <p className="text-xs text-muted-foreground">remaining</p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card
                  className={`glass-card p-6 h-full flex flex-col ${
                    plan.popular ? "neon-glow border-2 border-primary" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="flex items-center gap-2 mb-4 text-primary">
                      <Crown className="w-5 h-5" />
                      <span className="text-sm font-semibold">MOST POPULAR</span>
                    </div>
                  )}

                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">€{plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>

                  <div className="flex items-center gap-2 mb-6 text-sm text-primary">
                    <Zap className="w-4 h-4" />
                    <span>{plan.credits} AI credits/month</span>
                  </div>

                  <ul className="space-y-3 mb-6 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      currentPlan === plan.name.toLowerCase() ? "bg-secondary" : plan.popular ? "neon-glow-hover" : ""
                    }`}
                    disabled={currentPlan === plan.name.toLowerCase()}
                    onClick={() => handleUpgrade(plan.name)}
                  >
                    {currentPlan === plan.name.toLowerCase() ? "Current Plan" : "Upgrade"}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
