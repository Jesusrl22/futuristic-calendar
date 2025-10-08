export type SubscriptionTier = "free" | "premium" | "pro"
export type BillingCycle = "monthly" | "yearly"

export interface SubscriptionPlan {
  id: string
  name: string
  price: {
    monthly: number
    yearly: number
  }
  features: string[]
  aiCredits: string
  popular?: boolean
  paypalPlanId?: {
    monthly?: string
    yearly?: string
  }
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Gratis",
    price: { monthly: 0, yearly: 0 },
    features: [
      "Sin créditos IA (compra packs por separado)",
      "Calendario básico",
      "Tareas ilimitadas",
      "Temporizador Pomodoro",
      "Notas personales",
    ],
    aiCredits: "0",
  },
  {
    id: "premium",
    name: "Premium",
    price: { monthly: 9.99, yearly: 99.99 },
    features: [
      "Sin créditos IA (compra packs por separado)",
      "Sincronización en la nube",
      "Análisis de productividad",
      "Temas personalizados",
      "Exportar datos",
      "Soporte prioritario",
    ],
    aiCredits: "0",
    popular: true,
    paypalPlanId: {
      monthly: "P-PREMIUM-MONTHLY",
      yearly: "P-PREMIUM-YEARLY",
    },
  },
  {
    id: "pro",
    name: "Pro",
    price: { monthly: 19.99, yearly: 199.99 },
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
    aiCredits: "500/mes",
    paypalPlanId: {
      monthly: "P-PRO-MONTHLY",
      yearly: "P-PRO-YEARLY",
    },
  },
]

// Format price with currency
export function formatPrice(price: number, currency = "EUR"): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currency,
  }).format(price)
}

// Get yearly savings for a plan
export function getYearlySavings(plan: SubscriptionPlan): number {
  const monthlyTotal = plan.price.monthly * 12
  const yearlyPrice = plan.price.yearly
  return monthlyTotal - yearlyPrice
}

// Get plan by ID
export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return subscriptionPlans.find((plan) => plan.id === planId)
}

// Get annual savings percentage
export function getAnnualSavingsPercentage(planId: string): number {
  const plan = getPlanById(planId)
  if (!plan) return 0
  const monthlyTotal = plan.price.monthly * 12
  const yearlyPrice = plan.price.yearly
  if (monthlyTotal === 0) return 0
  return Math.round(((monthlyTotal - yearlyPrice) / monthlyTotal) * 100)
}

// Get plan features
export function getPlanFeatures(planId: string): string[] {
  const plan = getPlanById(planId)
  return plan?.features || []
}

// Get plan price
export function getPlanPrice(planId: string, cycle: BillingCycle): number {
  const plan = getPlanById(planId)
  if (!plan) return 0
  return cycle === "monthly" ? plan.price.monthly : plan.price.yearly
}

// Calculate annual savings
export function calculateAnnualSavings(planId: string): number {
  const plan = getPlanById(planId)
  if (!plan) return 0
  return getYearlySavings(plan)
}

// Check if plan includes AI credits
export function planIncludesAICredits(planId: string): boolean {
  return planId === "pro"
}

// Get monthly AI credits for a plan
export function getMonthlyAICredits(planId: string): number {
  const plan = getPlanById(planId)
  if (!plan || plan.id !== "pro") return 0
  return 500
}

// Get PayPal plan ID
export function getPayPalPlanId(planId: string, cycle: BillingCycle): string | undefined {
  const plan = getPlanById(planId)
  return plan?.paypalPlanId?.[cycle]
}

// Get subscription price based on tier and billing cycle
export function getSubscriptionPrice(planId: string, cycle: BillingCycle): number {
  return getPlanPrice(planId, cycle)
}

// Get plan by name
export function getPlanByName(name: string): SubscriptionPlan | undefined {
  return subscriptionPlans.find((plan) => plan.name.toLowerCase() === name.toLowerCase())
}

// Get AI credits for a tier
export function getAICredits(planId: string): number {
  return getMonthlyAICredits(planId)
}

// Check if user has access to a feature
export function hasFeatureAccess(userPlanId: string, requiredPlanId: string): boolean {
  const tierOrder = ["free", "premium", "pro"]
  const userIndex = tierOrder.indexOf(userPlanId)
  const requiredIndex = tierOrder.indexOf(requiredPlanId)
  return userIndex >= requiredIndex
}

// Calculate prorated amount for plan changes
export function calculateProratedAmount(
  currentPlanId: string,
  newPlanId: string,
  cycle: BillingCycle,
  daysRemaining: number,
): number {
  const currentPrice = getSubscriptionPrice(currentPlanId, cycle)
  const newPrice = getSubscriptionPrice(newPlanId, cycle)
  const totalDays = cycle === "monthly" ? 30 : 365

  const unusedAmount = (currentPrice / totalDays) * daysRemaining
  const newAmount = (newPrice / totalDays) * daysRemaining

  return Math.max(0, newAmount - unusedAmount)
}

// Get subscription status display text
export function getSubscriptionStatus(
  planId: string,
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

  if (planId === "free") {
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

  if (!["monthly", "yearly"].includes(data.cycle)) {
    errors.push("Ciclo de facturación inválido")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Check if user can purchase AI credits
export function canPurchaseAICredits(planId: string): boolean {
  return true // All plans can purchase credits
}
