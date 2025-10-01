export type SubscriptionTier = "free" | "premium" | "pro"
export type BillingCycle = "monthly" | "annual"

export interface SubscriptionPlan {
  name: string
  tier: SubscriptionTier
  price: {
    monthly: number
    annual: number
  }
  features: string[]
  aiCredits: number
  popular?: boolean
  paypalPlanId?: {
    monthly?: string
    annual?: string
  }
}

export const subscriptionPlans: Record<SubscriptionTier, SubscriptionPlan> = {
  free: {
    name: "Gratis",
    tier: "free",
    price: { monthly: 0, annual: 0 },
    features: [
      "Sin créditos IA (compra packs por separado)",
      "Calendario básico",
      "Tareas ilimitadas",
      "Temporizador Pomodoro",
      "Notas personales",
    ],
    aiCredits: 0,
  },
  premium: {
    name: "Premium",
    tier: "premium",
    price: { monthly: 9.99, annual: 99.99 },
    features: [
      "Sin créditos IA (compra packs por separado)",
      "Sincronización en la nube",
      "Análisis de productividad",
      "Temas personalizados",
      "Exportar datos",
      "Soporte prioritario",
    ],
    aiCredits: 0,
    popular: true,
    paypalPlanId: {
      monthly: "P-PREMIUM-MONTHLY",
      annual: "P-PREMIUM-ANNUAL",
    },
  },
  pro: {
    name: "Pro",
    tier: "pro",
    price: { monthly: 19.99, annual: 199.99 },
    features: [
      "500 créditos IA al mes",
      "Asistente IA avanzado",
      "IA para tareas automáticas",
      "Análisis predictivo",
      "Integraciones avanzadas",
      "Soporte VIP",
      "API access",
      "Equipos y colaboración",
    ],
    aiCredits: 500,
    paypalPlanId: {
      monthly: "P-PRO-MONTHLY",
      annual: "P-PRO-ANNUAL",
    },
  },
}

// Format price with currency
export function formatPrice(price: number, currency = "EUR"): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currency,
  }).format(price)
}

// Get annual savings percentage
export function getAnnualSavingsPercentage(tier: SubscriptionTier): number {
  const plan = subscriptionPlans[tier]
  const monthlyTotal = plan.price.monthly * 12
  const annualPrice = plan.price.annual
  if (monthlyTotal === 0) return 0
  return Math.round(((monthlyTotal - annualPrice) / monthlyTotal) * 100)
}

// Get plan features
export function getPlanFeatures(tier: SubscriptionTier): string[] {
  return subscriptionPlans[tier].features
}

// Get plan price
export function getPlanPrice(tier: SubscriptionTier, cycle: BillingCycle): number {
  return subscriptionPlans[tier].price[cycle]
}

// Calculate annual savings
export function calculateAnnualSavings(tier: SubscriptionTier): number {
  const plan = subscriptionPlans[tier]
  const monthlyTotal = plan.price.monthly * 12
  const annualPrice = plan.price.annual
  return monthlyTotal - annualPrice
}

// Check if plan includes AI credits
export function planIncludesAICredits(tier: SubscriptionTier): boolean {
  return tier === "pro"
}

// Get monthly AI credits for a plan
export function getMonthlyAICredits(tier: SubscriptionTier): number {
  return subscriptionPlans[tier].aiCredits
}

// Get plan by ID (tier)
export function getPlanById(planId: string): SubscriptionPlan | undefined {
  const tier = planId as SubscriptionTier
  return subscriptionPlans[tier]
}

// Get PayPal plan ID
export function getPayPalPlanId(tier: SubscriptionTier, cycle: BillingCycle): string | undefined {
  const plan = subscriptionPlans[tier]
  return plan.paypalPlanId?.[cycle]
}

// Get subscription price based on tier and billing cycle
export function getSubscriptionPrice(tier: SubscriptionTier, cycle: BillingCycle): number {
  const plan = subscriptionPlans[tier]
  return cycle === "monthly" ? plan.price.monthly : plan.price.annual
}

// Get plan by name
export function getPlanByName(name: string): SubscriptionPlan | undefined {
  return Object.values(subscriptionPlans).find((plan) => plan.name.toLowerCase() === name.toLowerCase())
}

// Get AI credits for a tier
export function getAICredits(tier: SubscriptionTier): number {
  return subscriptionPlans[tier].aiCredits
}

// Check if user has access to a feature
export function hasFeatureAccess(userTier: SubscriptionTier, requiredTier: SubscriptionTier): boolean {
  const tierOrder: SubscriptionTier[] = ["free", "premium", "pro"]
  const userIndex = tierOrder.indexOf(userTier)
  const requiredIndex = tierOrder.indexOf(requiredTier)
  return userIndex >= requiredIndex
}

// Calculate prorated amount for plan changes
export function calculateProratedAmount(
  currentTier: SubscriptionTier,
  newTier: SubscriptionTier,
  cycle: BillingCycle,
  daysRemaining: number,
): number {
  const currentPrice = getSubscriptionPrice(currentTier, cycle)
  const newPrice = getSubscriptionPrice(newTier, cycle)
  const totalDays = cycle === "monthly" ? 30 : 365

  const unusedAmount = (currentPrice / totalDays) * daysRemaining
  const newAmount = (newPrice / totalDays) * daysRemaining

  return Math.max(0, newAmount - unusedAmount)
}

// Get subscription status display text
export function getSubscriptionStatus(
  tier: SubscriptionTier,
  isActive: boolean,
  expiresAt?: string,
): {
  text: string
  color: string
} {
  if (!isActive) {
    return {
      text: "Inactiva",
      color: "text-gray-500",
    }
  }

  if (tier === "free") {
    return {
      text: "Plan Gratuito",
      color: "text-blue-600",
    }
  }

  if (expiresAt) {
    const daysUntilExpiry = Math.floor((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) {
      return {
        text: "Expirada",
        color: "text-red-600",
      }
    }

    if (daysUntilExpiry <= 7) {
      return {
        text: `Expira en ${daysUntilExpiry} días`,
        color: "text-orange-600",
      }
    }
  }

  return {
    text: "Activa",
    color: "text-green-600",
  }
}

// Validate subscription data
export function validateSubscriptionData(data: {
  tier: string
  cycle: string
}): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!["free", "premium", "pro"].includes(data.tier)) {
    errors.push("Plan de suscripción inválido")
  }

  if (!["monthly", "annual"].includes(data.cycle)) {
    errors.push("Ciclo de facturación inválido")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
