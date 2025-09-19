// Subscription Management System
export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  priceYearly: number
  priceFormatted: string
  priceYearlyFormatted: string
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
    priceYearly: 0,
    priceFormatted: "€0",
    priceYearlyFormatted: "€0",
    interval: "monthly",
    features: ["Tareas básicas", "Notas básicas", "Calendario básico", "Logros básicos", "Sincronización en la nube"],
  },
  {
    id: "premium_monthly",
    name: "Premium",
    price: 1.99,
    priceYearly: 20,
    priceFormatted: "€1.99/mes",
    priceYearlyFormatted: "€20/año",
    interval: "monthly",
    features: [
      "Todo lo de Free",
      "Lista de deseos",
      "Logros premium",
      "50 consultas IA/mes",
      "Estadísticas avanzadas",
      "Soporte prioritario",
    ],
    savings: "Ahorra €3.88 al año",
  },
  {
    id: "premium_yearly",
    name: "Premium Anual",
    price: 1.99,
    priceYearly: 20,
    priceFormatted: "€1.99/mes",
    priceYearlyFormatted: "€20/año",
    interval: "yearly",
    features: ["Todo lo de Premium", "2 meses gratis"],
    savings: "Ahorra €3.88",
  },
  {
    id: "pro_monthly",
    name: "Pro",
    price: 4.99,
    priceYearly: 45,
    priceFormatted: "€4.99/mes",
    priceYearlyFormatted: "€45/año",
    interval: "monthly",
    popular: true,
    features: [
      "Todo lo de Premium",
      "Asistente IA ilimitado",
      "Créditos IA incluidos",
      "Análisis inteligente",
      "Automatizaciones",
      "Colaboración en equipo",
      "API access",
    ],
    savings: "Ahorra €14.88 al año",
  },
  {
    id: "pro_yearly",
    name: "Pro Anual",
    price: 4.99,
    priceYearly: 45,
    priceFormatted: "€4.99/mes",
    priceYearlyFormatted: "€45/año",
    interval: "yearly",
    features: ["Todo lo de Pro", "2 meses gratis", "Créditos IA bonus"],
    savings: "Ahorra €14.88",
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
    team_collaboration: ["pro"],
  }

  const requiredPlans = featureRequirements[feature]
  if (!requiredPlans) return true // Feature available to all

  return requiredPlans.some((plan) => userPlan.includes(plan))
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
