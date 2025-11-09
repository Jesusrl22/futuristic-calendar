"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { Check, Zap, Crown } from "@/components/icons"

const plans = [
  {
    name: "Free",
    price: 0,
    credits: 100,
    features: [
      "100 AI credits/month",
      "Unlimited tasks & notes",
      "Basic statistics",
      "Calendar view",
      "Pomodoro timer",
    ],
  },
  {
    name: "Pro",
    price: 9.99,
    credits: 500,
    features: [
      "500 AI credits/month",
      "Everything in Free",
      "Advanced analytics",
      "Priority support",
      "Custom themes",
      "Export data",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: 19.99,
    credits: 2000,
    features: [
      "2000 AI credits/month",
      "Everything in Pro",
      "Unlimited AI access",
      "Team collaboration",
      "API access",
      "White-label option",
    ],
  },
]

export default function SubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState("free")
  const [credits, setCredits] = useState(0)

  useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data } = await supabase.from("users").select("subscription_tier, ai_credits").eq("id", user.id).single()

      setCurrentPlan(data?.subscription_tier || "free")
      setCredits(data?.ai_credits || 0)
    }
  }

  const handleUpgrade = async (planName: string) => {
    alert(`Upgrade to ${planName} plan - Payment integration coming soon!`)
  }

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold mb-8">
          <span className="text-primary neon-text">Subscription</span>
        </h1>

        <Card className="glass-card p-6 neon-glow mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Current Plan: {currentPlan.toUpperCase()}</h2>
              <p className="text-muted-foreground">Manage your subscription and billing</p>
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
                  <span className="text-4xl font-bold">${plan.price}</span>
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
    </div>
  )
}
