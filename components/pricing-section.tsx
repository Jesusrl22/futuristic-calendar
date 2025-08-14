"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Zap, Check, Crown, ArrowLeft, Sparkles, CreditCard } from "lucide-react"
import { toast } from "sonner"

interface PricingSectionProps {
  onBack: () => void
  onUpgrade: (plan: "monthly" | "yearly") => void
}

export function PricingSection({ onBack, onUpgrade }: PricingSectionProps) {
  const [isYearly, setIsYearly] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = async (plan: "monthly" | "yearly") => {
    setIsLoading(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false)
      onUpgrade(plan)
      toast.success("Welcome to Premium! 🎉")
    }, 2000)
  }

  const features = [
    "Unlimited tasks",
    "All premium themes",
    "Advanced analytics",
    "Priority support",
    "Ad-free experience",
    "Cloud synchronization",
    "Export data",
    "Custom categories",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10">
        <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/20 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to App
        </Button>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">FutureTask</h1>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Upgrade to Premium</h2>
          <p className="text-xl text-white/70">Unlock unlimited productivity</p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mt-8">
            <span className={`text-white ${!isYearly ? "font-semibold" : "opacity-70"}`}>Monthly</span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`text-white ${isYearly ? "font-semibold" : "opacity-70"}`}>Yearly</span>
            {isYearly && (
              <Badge className="bg-gradient-to-r from-green-400 to-green-500 text-white">
                <Sparkles className="h-3 w-3 mr-1" />
                Save 20%
              </Badge>
            )}
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="relative bg-white/10 backdrop-blur-md border-white/20 ring-2 ring-yellow-400">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1">
                <Crown className="h-4 w-4 mr-1" />
                Premium Plan
              </Badge>
            </div>
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl text-white">Premium</CardTitle>
              <div className="text-5xl font-bold text-white">€{isYearly ? "9.59" : "0.99"}</div>
              <div className="text-white/60 text-lg">{isYearly ? "/year (€0.80/month)" : "/month"}</div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center text-white/80">
                    <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => handleUpgrade(isYearly ? "yearly" : "monthly")}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white py-4 text-lg"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  {isLoading ? "Processing..." : `Upgrade to Premium - €${isYearly ? "9.59" : "0.99"}`}
                </Button>

                <p className="text-center text-white/60 text-sm">Cancel anytime. No questions asked.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-4">Why upgrade to Premium?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white/80">
              <div className="text-center">
                <div className="text-3xl mb-2">🚀</div>
                <div className="font-medium">Unlimited Tasks</div>
                <div className="text-sm">Never hit limits again</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎨</div>
                <div className="font-medium">Premium Themes</div>
                <div className="text-sm">Beautiful customization</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="font-medium">Advanced Analytics</div>
                <div className="text-sm">Deep productivity insights</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
