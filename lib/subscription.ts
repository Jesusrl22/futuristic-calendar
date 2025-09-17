// Subscription Management System
export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  priceFormatted: string
  interval: "monthly" | "yearly"
  features: string[]
  popular?: boolean
  savings?: string
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    priceFormatted: "Gratis",
    interval: "monthly",
    features: ["Tareas ilimitadas", "Notas básicas", "Logros básicos", "Sincronización en la nube"],
  },
  {
    id: "premium_monthly",
    name: "Premium",
    price: 4.99,
    priceFormatted: "$4.99/mes",
    interval: "monthly",
    features: [
      "Todo lo de Free",
      "Lista de deseos",
      "Logros premium",
      "Temas personalizados",
      "Estadísticas avanzadas",
      "Soporte prioritario",
    ],
  },
  {
    id: "premium_yearly",
    name: "Premium Anual",
    price: 49.99,
    priceFormatted: "$49.99/año",
    interval: "yearly",
    features: ["Todo lo de Premium", "2 meses gratis"],
    savings: "Ahorra $9.89",
  },
  {
    id: "pro_monthly",
    name: "Pro",
    price: 9.99,
    priceFormatted: "$9.99/mes",
    interval: "monthly",
    popular: true,
    features: [
      "Todo lo de Premium",
      "Asistente IA",
      "Créditos IA incluidos",
      "Análisis inteligente",
      "Automatizaciones",
      "API access",
    ],
  },
  {
    id: "pro_yearly",
    name: "Pro Anual",
    price: 99.99,
    priceFormatted: "$99.99/año",
    interval: "yearly",
    features: ["Todo lo de Pro", "2 meses gratis", "Créditos IA bonus"],
    savings: "Ahorra $19.89",
  },
]

export interface UserSubscription {
  id: string
  userId: string
  planId: string
  status: "active" | "canceled" | "expired" | "trial"
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  trialEnd?: Date
}

export function getPlanFeatures(planId: string): string[] {
  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId)
  return plan?.features || []
}

export function canAccessFeature(userPlan: string, feature: string): boolean {
  const featureRequirements: Record<string, string[]> = {
    wishlist: ["premium", "pro"],
    ai_assistant: ["pro"],
    advanced_stats: ["premium", "pro"],
    custom_themes: ["premium", "pro"],
    priority_support: ["premium", "pro"],
    api_access: ["pro"],
  }

  const requiredPlans = featureRequirements[feature]
  if (!requiredPlans) return true // Feature available to all

  return requiredPlans.includes(userPlan)
}

export async function upgradePlan(userId: string, planId: string): Promise<boolean> {
  // This would integrate with payment processor
  console.log(`Upgrading user ${userId} to plan ${planId}`)
  return true
}

export async function cancelSubscription(userId: string): Promise<boolean> {
  // This would cancel the subscription at period end
  console.log(`Canceling subscription for user ${userId}`)
  return true
}
