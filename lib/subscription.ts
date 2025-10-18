export type SubscriptionTier = "free" | "premium" | "pro"
export type BillingCycle = "monthly" | "yearly"

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  features: string[]
  popular?: boolean
  aiCreditsIncluded: number
  aiCreditsRenewMonthly: boolean
}

export interface CreditPack {
  id: string
  name: string
  credits: number
  price: number
  basePrice: number
  vat: number
  popular?: boolean
  description: string
}

// Export named as subscriptionPlans (lowercase)
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Gratis",
    description: "Perfecto para empezar",
    monthlyPrice: 0,
    yearlyPrice: 0,
    aiCreditsIncluded: 0,
    aiCreditsRenewMonthly: false,
    features: [
      "Calendario básico",
      "10 tareas por mes",
      "5 eventos por mes",
      "Pomodoro básico",
      "Notas limitadas",
      "Sin créditos IA incluidos",
      "Puede comprar packs de créditos IA",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    description: "Para usuarios avanzados",
    monthlyPrice: 2.49,
    yearlyPrice: 24.99,
    aiCreditsIncluded: 0,
    aiCreditsRenewMonthly: false,
    features: [
      "Tareas ilimitadas",
      "Eventos ilimitados",
      "Pomodoro avanzado",
      "Notas ilimitadas",
      "Sin créditos IA incluidos",
      "Puede comprar packs de créditos IA",
      "Estadísticas básicas",
      "Lista de deseos",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "Para profesionales",
    monthlyPrice: 4.99,
    yearlyPrice: 49.99,
    popular: true,
    aiCreditsIncluded: 500,
    aiCreditsRenewMonthly: true,
    features: [
      "Todo de Premium",
      "500 créditos IA/mes incluidos",
      "Créditos se renuevan mensualmente",
      "Puede comprar packs adicionales",
      "Asistente IA avanzado",
      "Estadísticas completas",
      "Logros y gamificación",
      "Soporte prioritario",
      "Exportar datos",
      "Integraciones premium",
    ],
  },
]

export const creditPacks: CreditPack[] = [
  {
    id: "starter",
    name: "Starter",
    credits: 100,
    price: 2.99,
    basePrice: 2.47,
    vat: 0.52,
    description: "Perfecto para probar",
  },
  {
    id: "popular",
    name: "Popular",
    credits: 500,
    price: 9.99,
    basePrice: 8.26,
    vat: 1.73,
    popular: true,
    description: "El más vendido",
  },
  {
    id: "professional",
    name: "Professional",
    credits: 1000,
    price: 17.99,
    basePrice: 14.87,
    vat: 3.12,
    description: "Para uso intensivo",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    credits: 2500,
    price: 39.99,
    basePrice: 33.05,
    vat: 6.94,
    description: "Máximo valor",
  },
]

export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return subscriptionPlans.find((plan) => plan.id === planId)
}

export function getCreditPackById(packId: string): CreditPack | undefined {
  return creditPacks.find((pack) => pack.id === packId)
}

export function getPlanPrice(planId: string, billingCycle: BillingCycle): number {
  const plan = getPlanById(planId)
  if (!plan) return 0
  return billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice
}

export function getYearlySavings(planId: string): number {
  const plan = getPlanById(planId)
  if (!plan) return 0
  const monthlyTotal = plan.monthlyPrice * 12
  return monthlyTotal - plan.yearlyPrice
}

export function calculateAnnualSavings(monthlyPrice: number, annualPrice: number): number {
  const monthlyTotal = monthlyPrice * 12
  return Math.round(monthlyTotal - annualPrice)
}

export function formatPrice(price: number, currency = "EUR"): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currency,
  }).format(price)
}

export function getAICreditsDisplayText(planId: string): string {
  const plan = getPlanById(planId)
  if (!plan) return "Sin créditos incluidos"

  if (plan.aiCreditsIncluded === 0) {
    return "Sin créditos incluidos"
  }

  if (plan.aiCreditsRenewMonthly) {
    return `${plan.aiCreditsIncluded} créditos/mes`
  }

  return `${plan.aiCreditsIncluded} créditos`
}

export function canPurchaseAICredits(planId: string): boolean {
  // Todos los planes pueden comprar packs de créditos IA
  return true
}

export function hasMonthlyAICreditsRenewal(planId: string): boolean {
  const plan = getPlanById(planId)
  return plan?.aiCreditsRenewMonthly || false
}

export function getMonthlyAICredits(planId: string): number {
  const plan = getPlanById(planId)
  return plan?.aiCreditsRenewMonthly ? plan.aiCreditsIncluded : 0
}

export function planIncludesAICredits(planId: string): boolean {
  const plan = getPlanById(planId)
  return plan ? plan.aiCreditsIncluded > 0 : false
}

export function getAICredits(planId: string): number {
  return getMonthlyAICredits(planId)
}

export function hasFeatureAccess(userPlanId: string, requiredPlanId: string): boolean {
  const tierOrder = ["free", "premium", "pro"]
  const userIndex = tierOrder.indexOf(userPlanId)
  const requiredIndex = tierOrder.indexOf(requiredPlanId)
  return userIndex >= requiredIndex
}

export function getSubscriptionPrice(planId: string, cycle: BillingCycle): number {
  return getPlanPrice(planId, cycle)
}

export function getPlanByName(name: string): SubscriptionPlan | undefined {
  return subscriptionPlans.find((plan) => plan.name.toLowerCase() === name.toLowerCase())
}

export function getPlanFeatures(planId: string): string[] {
  const plan = getPlanById(planId)
  return plan?.features || []
}

export function getAnnualSavingsPercentage(planId: string): number {
  const plan = getPlanById(planId)
  if (!plan) return 0
  const monthlyTotal = plan.monthlyPrice * 12
  const yearlyPrice = plan.yearlyPrice
  if (monthlyTotal === 0) return 0
  return Math.round(((monthlyTotal - yearlyPrice) / monthlyTotal) * 100)
}

export function getPayPalPlanId(planId: string, cycle: BillingCycle): string | undefined {
  // PayPal plan IDs would be configured here
  const paypalIds: Record<string, Record<BillingCycle, string>> = {
    premium: {
      monthly: "P-PREMIUM-MONTHLY",
      yearly: "P-PREMIUM-YEARLY",
    },
    pro: {
      monthly: "P-PRO-MONTHLY",
      yearly: "P-PRO-YEARLY",
    },
  }

  return paypalIds[planId]?.[cycle]
}

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
