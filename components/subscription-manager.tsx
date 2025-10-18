"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Check, Crown, Loader2, Star } from "lucide-react"
import { subscriptionPlans, formatPrice, getYearlySavings } from "@/lib/subscription"
import { useLanguage } from "@/hooks/useLanguage"

interface SubscriptionManagerProps {
  currentPlan?: string
  onUpgrade?: (planId: string, billing: "monthly" | "yearly") => Promise<void>
  userId?: string
  billingCycle?: "monthly" | "yearly"
}

export function SubscriptionManager({
  currentPlan = "free",
  onUpgrade,
  userId,
  billingCycle = "monthly",
}: SubscriptionManagerProps) {
  const { t } = useLanguage()
  const [isYearly, setIsYearly] = useState(billingCycle === "yearly")
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const handleUpgrade = async (planId: string) => {
    if (!onUpgrade) return

    setLoadingPlan(planId)
    try {
      await onUpgrade(planId, isYearly ? "yearly" : "monthly")
    } catch (error) {
      console.error("Error upgrading plan:", error)
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center space-x-4">
        <span className={`text-sm ${!isYearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>
          {t("subscription.monthly")}
        </span>
        <Switch checked={isYearly} onCheckedChange={setIsYearly} />
        <span className={`text-sm ${isYearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>
          {t("subscription.yearly")}
        </span>
        {isYearly && (
          <Badge variant="secondary" className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
            {t("subscription.saveUpTo")} €40
          </Badge>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => {
          const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
          const savings = isYearly ? getYearlySavings(plan.id) : 0
          const isCurrentPlan = currentPlan === plan.id
          const isLoading = loadingPlan === plan.id

          return (
            <Card
              key={plan.id}
              className={`relative bg-card border-border ${
                plan.popular ? "ring-2 ring-primary/50" : ""
              } ${isCurrentPlan ? "ring-2 ring-green-500/50" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                    <Star className="w-3 h-3 mr-1" />
                    {t("subscription.mostPopular")}
                  </Badge>
                </div>
              )}

              {isCurrentPlan && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                    <Crown className="w-3 h-3 mr-1" />
                    {t("subscription.currentPlan")}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-xl text-foreground">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-foreground">
                    {formatPrice(price)}
                    {plan.id !== "free" && (
                      <span className="text-sm font-normal text-muted-foreground">
                        /{isYearly ? t("subscription.year") : t("subscription.month")}
                      </span>
                    )}
                  </div>
                  {isYearly && savings > 0 && (
                    <div className="text-sm text-green-600 dark:text-green-400">
                      {t("subscription.save")} {formatPrice(savings)} {t("subscription.perYear")}
                    </div>
                  )}
                </div>
                <CardDescription className="text-muted-foreground">
                  {plan.aiCreditsIncluded > 0
                    ? `${plan.aiCreditsIncluded} ${t("ai.creditsPerMonth")}`
                    : t("ai.noCreditsIncluded")}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    isCurrentPlan
                      ? "bg-green-600 hover:bg-green-700"
                      : plan.popular
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        : "bg-primary hover:bg-primary/90"
                  }`}
                  disabled={isCurrentPlan || isLoading}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t("common.loading")}...
                    </>
                  ) : isCurrentPlan ? (
                    t("subscription.currentPlan")
                  ) : plan.id === "free" ? (
                    t("subscription.free")
                  ) : (
                    `${t("subscription.upgrade")} ${isYearly ? t("subscription.yearly") : t("subscription.monthly")}`
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Additional Info */}
      <div className="text-center text-sm text-muted-foreground space-y-2">
        <p>{t("subscription.allPlansInclude")}:</p>
        <div className="flex flex-wrap justify-center gap-4">
          <span>✓ {t("subscription.cloudSync")}</span>
          <span>✓ {t("subscription.mobileAccess")}</span>
          <span>✓ {t("subscription.freeUpdates")}</span>
          <span>✓ {t("subscription.cancelAnytime")}</span>
        </div>
      </div>
    </div>
  )
}
