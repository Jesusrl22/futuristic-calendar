"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Crown, Zap, Star, Check, X, CreditCard } from "lucide-react"

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  currentPlan: "free" | "premium" | "pro"
  onPlanSelect: (plan: "free" | "premium" | "pro", billing: "monthly" | "yearly") => void
  onCancelSubscription: () => void
}

const plans = {
  free: {
    name: "Free",
    icon: Star,
    price: { monthly: 0, yearly: 0 },
    description: "Perfect for getting started",
    features: ["Up to 10 tasks per month", "Basic calendar", "3 basic themes", "Email support"],
    limitations: ["Limited tasks", "No wishlist", "No AI assistant", "Basic themes only"],
  },
  premium: {
    name: "Premium",
    icon: Crown,
    price: { monthly: 9.99, yearly: 99.99 },
    description: "For productive individuals",
    features: [
      "Unlimited tasks",
      "Advanced calendar",
      "Wishlist manager",
      "4 premium themes",
      "Priority support",
      "Task categories",
      "Notifications",
      "Export data",
    ],
    limitations: ["No AI assistant", "Limited AI credits"],
  },
  pro: {
    name: "Pro",
    icon: Zap,
    price: { monthly: 19.99, yearly: 199.99 },
    description: "For power users and teams",
    features: [
      "Everything in Premium",
      "AI Assistant",
      "1000 AI credits/month",
      "4 futuristic themes",
      "Advanced analytics",
      "Team collaboration",
      "API access",
      "Custom integrations",
      "24/7 support",
    ],
    limitations: [],
  },
}

export function SubscriptionModal({
  isOpen,
  onClose,
  currentPlan,
  onPlanSelect,
  onCancelSubscription,
}: SubscriptionModalProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [selectedPlan, setSelectedPlan] = useState<"free" | "premium" | "pro">(currentPlan)

  const getYearlySavings = (plan: keyof typeof plans) => {
    const monthly = plans[plan].price.monthly * 12
    const yearly = plans[plan].price.yearly
    return monthly - yearly
  }

  const handlePlanSelect = (plan: "free" | "premium" | "pro") => {
    setSelectedPlan(plan)
    onPlanSelect(plan, billingCycle)
  }

  const getPlanColor = (plan: keyof typeof plans) => {
    switch (plan) {
      case "premium":
        return "border-blue-500 bg-blue-50"
      case "pro":
        return "border-purple-500 bg-purple-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getPlanButtonColor = (plan: keyof typeof plans) => {
    switch (plan) {
      case "premium":
        return "bg-blue-600 hover:bg-blue-700"
      case "pro":
        return "bg-purple-600 hover:bg-purple-700"
      default:
        return "bg-gray-600 hover:bg-gray-700"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Choose Your Plan</DialogTitle>
          <p className="text-center text-muted-foreground">Upgrade your productivity with advanced features</p>
        </DialogHeader>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 my-6">
          <Label htmlFor="billing-toggle" className={billingCycle === "monthly" ? "font-semibold" : ""}>
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            checked={billingCycle === "yearly"}
            onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
          />
          <Label htmlFor="billing-toggle" className={billingCycle === "yearly" ? "font-semibold" : ""}>
            Yearly
          </Label>
          {billingCycle === "yearly" && <Badge className="bg-green-100 text-green-800">Save up to $40</Badge>}
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(plans).map(([planKey, plan]) => {
            const PlanIcon = plan.icon
            const isCurrentPlan = planKey === currentPlan
            const price = plan.price[billingCycle]
            const yearlySavings = billingCycle === "yearly" ? getYearlySavings(planKey as keyof typeof plans) : 0

            return (
              <Card
                key={planKey}
                className={`relative transition-all duration-200 ${
                  isCurrentPlan ? getPlanColor(planKey as keyof typeof plans) : "hover:shadow-lg"
                } ${planKey === "pro" ? "ring-2 ring-purple-500" : ""}`}
              >
                {planKey === "pro" && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-600 text-white">Most Popular</Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <PlanIcon className="h-6 w-6" />
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    {isCurrentPlan && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                  <div className="mt-4">
                    <div className="text-3xl font-bold">
                      ${price}
                      <span className="text-lg font-normal text-muted-foreground">
                        /{billingCycle === "yearly" ? "year" : "month"}
                      </span>
                    </div>
                    {billingCycle === "yearly" && yearlySavings > 0 && (
                      <p className="text-sm text-green-600 font-medium">Save ${yearlySavings}/year</p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Features */}
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="space-y-2 pt-2 border-t">
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-4">
                    {isCurrentPlan ? (
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full bg-transparent" disabled>
                          Current Plan
                        </Button>
                        {planKey !== "free" && (
                          <Button variant="destructive" size="sm" className="w-full" onClick={onCancelSubscription}>
                            Cancel Subscription
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Button
                        className={`w-full ${getPlanButtonColor(planKey as keyof typeof plans)}`}
                        onClick={() => handlePlanSelect(planKey as "free" | "premium" | "pro")}
                      >
                        {planKey === "free" ? (
                          "Downgrade to Free"
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4 mr-2" />
                            {planKey === currentPlan ? "Current Plan" : `Upgrade to ${plan.name}`}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Feature Comparison */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-center">Feature Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left">Feature</th>
                  <th className="border border-gray-200 p-3 text-center">Free</th>
                  <th className="border border-gray-200 p-3 text-center">Premium</th>
                  <th className="border border-gray-200 p-3 text-center">Pro</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-3 font-medium">Tasks per month</td>
                  <td className="border border-gray-200 p-3 text-center">10</td>
                  <td className="border border-gray-200 p-3 text-center">Unlimited</td>
                  <td className="border border-gray-200 p-3 text-center">Unlimited</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 p-3 font-medium">Calendar features</td>
                  <td className="border border-gray-200 p-3 text-center">Basic</td>
                  <td className="border border-gray-200 p-3 text-center">Advanced</td>
                  <td className="border border-gray-200 p-3 text-center">Advanced</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 font-medium">Themes</td>
                  <td className="border border-gray-200 p-3 text-center">3 basic</td>
                  <td className="border border-gray-200 p-3 text-center">7 themes</td>
                  <td className="border border-gray-200 p-3 text-center">11 themes</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 p-3 font-medium">Wishlist manager</td>
                  <td className="border border-gray-200 p-3 text-center">
                    <X className="h-4 w-4 text-red-500 mx-auto" />
                  </td>
                  <td className="border border-gray-200 p-3 text-center">
                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                  </td>
                  <td className="border border-gray-200 p-3 text-center">
                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 font-medium">AI Assistant</td>
                  <td className="border border-gray-200 p-3 text-center">
                    <X className="h-4 w-4 text-red-500 mx-auto" />
                  </td>
                  <td className="border border-gray-200 p-3 text-center">
                    <X className="h-4 w-4 text-red-500 mx-auto" />
                  </td>
                  <td className="border border-gray-200 p-3 text-center">
                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 p-3 font-medium">AI Credits/month</td>
                  <td className="border border-gray-200 p-3 text-center">0</td>
                  <td className="border border-gray-200 p-3 text-center">0</td>
                  <td className="border border-gray-200 p-3 text-center">1000</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 font-medium">Support</td>
                  <td className="border border-gray-200 p-3 text-center">Email</td>
                  <td className="border border-gray-200 p-3 text-center">Priority</td>
                  <td className="border border-gray-200 p-3 text-center">24/7</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-center">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Can I change plans anytime?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">What happens to my data if I downgrade?</h4>
                <p className="text-sm text-muted-foreground">
                  Your data is preserved, but some features may become read-only until you upgrade again.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Do you offer refunds?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, we offer a 30-day money-back guarantee for all paid plans.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">How do AI credits work?</h4>
                <p className="text-sm text-muted-foreground">
                  Each AI interaction uses credits. Pro users get 1000 credits monthly, with options to purchase more.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
