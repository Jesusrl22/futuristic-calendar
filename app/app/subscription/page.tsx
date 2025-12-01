"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Check, Zap, Crown, ShoppingCart } from "@/components/icons"
import dynamic from "next/dynamic"
import { PayPalSubscriptionButton } from "@/components/paypal-subscription-button"

const CreditPacksModal = dynamic(() => import("@/components/credit-packs-modal").then((mod) => mod.CreditPacksModal), {
  ssr: false,
  loading: () => <div>Loading...</div>,
})

const plans = [
  {
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    credits: 0,
    monthlyPlanId: null,
    annualPlanId: null,
    features: [
      "0 AI credits/month",
      "Full Calendar access",
      "Unlimited tasks",
      "Basic Pomodoro timer",
      "5 Free themes",
      "Free tier achievements",
      "Basic settings",
    ],
  },
  {
    name: "Premium",
    monthlyPrice: 2.49,
    annualPrice: 24.99,
    credits: 100,
    monthlyPlanId: "P-29883874AF135140VNDN3GSI",
    annualPlanId: "P-59N82236FG469130PNDN3XEQ",
    features: [
      "100 AI credits/month",
      "Everything in Free",
      "Advanced Pomodoro (custom durations)",
      "Notes feature",
      "Wishlist feature",
      "10 themes (Free + Premium)",
      "Premium achievements",
    ],
    popular: true,
  },
  {
    name: "Pro",
    monthlyPrice: 6.49,
    annualPrice: 64.9,
    credits: 500,
    monthlyPlanId: null, // Add when you provide Pro monthly plan ID
    annualPlanId: null, // Add when you provide Pro annual plan ID
    features: [
      "500 AI credits/month",
      "Everything in Premium",
      "Statistics & analytics",
      "Custom theme creator",
      "All 15 themes + custom",
      "Pro achievements",
      "Priority support",
    ],
  },
]

export default function SubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState("free")
  const [credits, setCredits] = useState(0)
  const [monthlyCredits, setMonthlyCredits] = useState(0)
  const [purchasedCredits, setPurchasedCredits] = useState(0)
  const [expiresAt, setExpiresAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCreditPacks, setShowCreditPacks] = useState(false)
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly")

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
        setMonthlyCredits(data.ai_credits_monthly || 0)
        setPurchasedCredits(data.ai_credits_purchased || 0)
        setExpiresAt(data.subscription_expires_at || null)
      }
    } catch (error) {
      console.error("Error fetching subscription:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (planName: string) => {
    return
    alert(`Upgrade to ${planName} plan - Payment integration coming soon!`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  }

  return (
    <div className="p-4 md:p-8">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading subscription...</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="hidden md:block text-4xl font-bold mb-8">
            <span className="text-primary neon-text">Subscription</span>
          </h1>

          <Card className="glass-card p-4 md:p-6 neon-glow mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-2">Current Plan: {currentPlan.toUpperCase()}</h2>
                <p className="text-sm text-muted-foreground">Manage your subscription and billing</p>
                {expiresAt && (
                  <p className="text-xs md:text-sm text-orange-500 mt-2">Plan expires: {formatDate(expiresAt)}</p>
                )}
              </div>
              {currentPlan !== "free" && (
                <div className="text-center">
                  <Zap className="w-10 h-10 md:w-12 md:h-12 text-primary mx-auto mb-2" />
                  <p className="text-xl md:text-2xl font-bold text-primary">{credits} credits</p>
                  <p className="text-xs text-muted-foreground">
                    {monthlyCredits} monthly + {purchasedCredits} purchased
                  </p>
                </div>
              )}
            </div>
          </Card>

          <div className="mb-6 md:mb-8">
            <Button
              onClick={() => setShowCreditPacks(true)}
              className="w-full md:w-auto neon-glow-hover"
              size="lg"
              disabled
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Buy Extra AI Credits (Coming Soon)
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Purchase credits that never expire. Stack with your monthly allowance!
            </p>
          </div>

          <div className="flex justify-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 p-1 bg-secondary/50 rounded-lg">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-4 md:px-6 py-2 rounded-md text-sm md:text-base font-medium transition-all ${
                  billingPeriod === "monthly"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("annual")}
                className={`px-4 md:px-6 py-2 rounded-md text-sm md:text-base font-medium transition-all ${
                  billingPeriod === "annual"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Annual
                <span className="ml-2 text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {plans.map((plan, index) => {
              const price = billingPeriod === "monthly" ? plan.monthlyPrice : plan.annualPrice
              const planId = billingPeriod === "monthly" ? plan.monthlyPlanId : plan.annualPlanId

              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card
                    className={`glass-card p-4 md:p-6 h-full flex flex-col ${
                      plan.popular ? "neon-glow border-2 border-primary" : ""
                    }`}
                  >
                    {plan.popular && (
                      <div className="flex items-center gap-2 mb-4 text-primary">
                        <Crown className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-xs md:text-sm font-semibold">MOST POPULAR</span>
                      </div>
                    )}

                    <h3 className="text-xl md:text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-4 md:mb-6">
                      <span className="text-3xl md:text-4xl font-bold">€{price.toFixed(2)}</span>
                      <span className="text-sm md:text-base text-muted-foreground">
                        /{billingPeriod === "monthly" ? "month" : "year"}
                      </span>
                      {billingPeriod === "annual" && plan.monthlyPrice > 0 && (
                        <div className="text-xs text-green-500 mt-1">
                          €{(price / 12).toFixed(2)}/month when billed annually
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-4 md:mb-6 text-xs md:text-sm text-primary">
                      <Zap className="w-4 h-4" />
                      <span>{plan.credits} AI credits/month</span>
                    </div>

                    <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-xs md:text-sm">
                          <Check className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {currentPlan === plan.name.toLowerCase() ? (
                      <Button className="w-full bg-secondary" disabled>
                        Current Plan
                      </Button>
                    ) : planId ? (
                      <PayPalSubscriptionButton
                        planId={planId}
                        planName={plan.name}
                        onSuccess={(subId) => {
                          fetchSubscription()
                        }}
                      />
                    ) : plan.name === "Pro" ? (
                      <Button className="w-full" disabled>
                        Coming Soon
                      </Button>
                    ) : (
                      <Button className="w-full bg-secondary" disabled>
                        Current Plan
                      </Button>
                    )}
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <CreditPacksModal open={showCreditPacks} onOpenChange={setShowCreditPacks} userPlan={currentPlan} />
        </motion.div>
      )}
    </div>
  )
}
