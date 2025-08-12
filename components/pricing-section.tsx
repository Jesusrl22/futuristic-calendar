"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Check, Crown, Zap, ArrowLeft, Star, Sparkles } from "lucide-react"

interface PricingSectionProps {
  onBack: () => void
  onUpgrade: (plan: "monthly" | "yearly") => void
}

export function PricingSection({ onBack, onUpgrade }: PricingSectionProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly")

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Up to 50 tasks",
        "Basic calendar view",
        "Simple Pomodoro timer",
        "Basic task categories",
        "Mobile responsive",
      ],
      limitations: ["Limited to 50 tasks", "Basic themes only", "Ads supported", "No advanced analytics"],
      popular: false,
      current: true,
    },
    {
      id: "monthly",
      name: "Premium Monthly",
      price: "$4.99",
      period: "per month",
      description: "Full access to all features",
      features: [
        "Unlimited tasks",
        "Advanced calendar views",
        "Advanced Pomodoro settings",
        "Custom categories & tags",
        "Premium themes",
        "Advanced analytics",
        "Priority support",
        "Ad-free experience",
        "Data export",
        "Team collaboration",
      ],
      popular: false,
      current: false,
    },
    {
      id: "yearly",
      name: "Premium Yearly",
      price: "$39.99",
      period: "per year",
      originalPrice: "$59.88",
      description: "Best value - Save 33%",
      features: [
        "Everything in Monthly",
        "2 months free",
        "Priority feature requests",
        "Beta access to new features",
        "Advanced integrations",
        "Custom branding",
      ],
      popular: true,
      current: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-yellow-400 mr-2" />
            <h1 className="text-4xl font-bold text-white">Choose Your Plan</h1>
          </div>
          <p className="text-xl text-white/80 mb-6">Unlock the full potential of FutureTask</p>
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant={selectedPlan === "monthly" ? "default" : "outline"}
              onClick={() => setSelectedPlan("monthly")}
              className={
                selectedPlan === "monthly"
                  ? "bg-white text-purple-600"
                  : "bg-white/10 border-white/20 text-white hover:bg-white/20"
              }
            >
              Monthly
            </Button>
            <Button
              variant={selectedPlan === "yearly" ? "default" : "outline"}
              onClick={() => setSelectedPlan("yearly")}
              className={
                selectedPlan === "yearly"
                  ? "bg-white text-purple-600"
                  : "bg-white/10 border-white/20 text-white hover:bg-white/20"
              }
            >
              Yearly
              <Badge className="ml-2 bg-green-500 text-white">Save 33%</Badge>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative bg-white/10 backdrop-blur-md border-white/20 ${
                plan.popular ? "ring-2 ring-yellow-400 scale-105" : ""
              } ${plan.current ? "opacity-60" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-white flex items-center justify-center">
                  {plan.id === "free" && <Zap className="h-5 w-5 mr-2" />}
                  {plan.id !== "free" && <Crown className="h-5 w-5 mr-2 text-yellow-400" />}
                  {plan.name}
                </CardTitle>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-white/60 ml-2">/{plan.period}</span>
                  </div>
                  {plan.originalPrice && (
                    <div className="text-white/60 line-through text-sm">Originally {plan.originalPrice}</div>
                  )}
                </div>
                <CardDescription className="text-white/70">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="text-white/90 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.limitations && (
                  <>
                    <Separator className="bg-white/20" />
                    <div className="space-y-2">
                      <h4 className="text-white/80 font-medium text-sm">Limitations:</h4>
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="h-4 w-4 border border-white/40 rounded flex-shrink-0" />
                          <span className="text-white/60 text-sm">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="pt-4">
                  {plan.current ? (
                    <Button disabled className="w-full bg-white/20 text-white/60">
                      Current Plan
                    </Button>
                  ) : plan.id === "free" ? (
                    <Button
                      variant="outline"
                      className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={onBack}
                    >
                      Continue with Free
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onUpgrade(plan.id as "monthly" | "yearly")}
                      className={`w-full ${
                        plan.popular
                          ? "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
                          : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      }`}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Upgrade to {plan.name}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-white/60 text-sm mb-4">All plans include a 14-day free trial. Cancel anytime.</p>
          <div className="flex items-center justify-center space-x-6 text-white/60 text-sm">
            <span>✓ Secure payment</span>
            <span>✓ No hidden fees</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </div>
    </div>
  )
}
