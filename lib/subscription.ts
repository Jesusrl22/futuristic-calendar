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
    name: "Gratuito",
    price: 0,
    priceYearly: 0,
    priceFormatted: "€0",
    priceYearlyFormatted: "€0",
    interval: "monthly",
    features: [
      "Tareas básicas ilimitadas",
      "Calendario básico",
      "Pomodoro básico (25/5/15 min)",
      "Temas básicos (claro/oscuro)",
      "Logros e insignias básicas",
      "Sincronización en la nube",
      "Soporte por email",
    ],
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
      "Todo lo del plan Gratuito",
      "Ajustes avanzados de Pomodoro",
      "Temas premium y personalización",
      "Lista de deseos completa",
      "Notas avanzadas con etiquetas",
      "Logros e insignias premium",
      "Gráficas de rendimiento avanzadas",
      "Estadísticas detalladas",
      "Soporte prioritario",
    ],
    savings: "Ahorra €3.88 al año",
  },
  {
    id: "premium_yearly",
    name: "Premium Anual",
    price: 1.99,
    priceYearly: 20,
    priceFormatted: "€1.67/mes",
    priceYearlyFormatted: "€20/año",
    interval: "yearly",
    features: ["Todo lo del plan Premium", "2 meses gratis", "Descuento del 17%"],
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
      "Todo lo del plan Premium",
      "Asistente IA completo",
      "500 créditos IA mensuales",
      "Análisis inteligente de productividad",
      "Sugerencias personalizadas por IA",
      "Automatizaciones inteligentes",
      "Predicciones de rendimiento",
      "Integración con APIs externas",
      "Soporte premium 24/7",
    ],
    savings: "Ahorra €14.88 al año",
  },
  {
    id: "pro_yearly",
    name: "Pro Anual",
    price: 4.99,
    priceYearly: 45,
    priceFormatted: "€3.75/mes",
    priceYearlyFormatted: "€45/año",
    interval: "yearly",
    features: ["Todo lo del plan Pro", "3 meses gratis", "1000 créditos IA bonus", "Descuento del 25%"],
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
    // Free features (available to all)
    basic_tasks: ["free", "premium", "pro"],
    basic_calendar: ["free", "premium", "pro"],
    basic_pomodoro: ["free", "premium", "pro"],
    basic_themes: ["free", "premium", "pro"],
    basic_achievements: ["free", "premium", "pro"],
    cloud_sync: ["free", "premium", "pro"],

    // Premium features
    advanced_pomodoro: ["premium", "pro"],
    premium_themes: ["premium", "pro"],
    wishlist: ["premium", "pro"],
    advanced_notes: ["premium", "pro"],
    premium_achievements: ["premium", "pro"],
    advanced_stats: ["premium", "pro"],
    performance_charts: ["premium", "pro"],
    priority_support: ["premium", "pro"],

    // Pro features
    ai_assistant: ["pro"],
    ai_credits: ["pro"],
    ai_analysis: ["pro"],
    ai_suggestions: ["pro"],
    ai_automations: ["pro"],
    performance_predictions: ["pro"],
    api_integrations: ["pro"],
    premium_support: ["pro"],
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
