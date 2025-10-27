export type SubscriptionTier = "free" | "premium" | "pro"
export type BillingPeriod = "monthly" | "yearly"

export interface SubscriptionPrice {
  monthly: {
    price: number
    currency: string
    planId: string
  }
  yearly: {
    price: number
    currency: string
    planId: string
  }
}

export interface PlanDetails {
  tier: SubscriptionTier
  name: string
  period: BillingPeriod
  price: number
  currency: string
  planId: string
  features: string[]
}

export const SUBSCRIPTION_PRICES: Record<Exclude<SubscriptionTier, "free">, SubscriptionPrice> = {
  premium: {
    monthly: {
      price: 2.49,
      currency: "EUR",
      planId: "P-PREMIUM-MONTHLY",
    },
    yearly: {
      price: 24.99,
      currency: "EUR",
      planId: "P-PREMIUM-YEARLY",
    },
  },
  pro: {
    monthly: {
      price: 4.99,
      currency: "EUR",
      planId: "P-PRO-MONTHLY",
    },
    yearly: {
      price: 49.99,
      currency: "EUR",
      planId: "P-PRO-YEARLY",
    },
  },
}

export const THEME_CONFIG: Record<SubscriptionTier, string[]> = {
  free: ["light", "dark"],
  premium: ["light", "dark", "ocean", "forest", "sunset", "lavender", "midnight", "rose-gold"],
  pro: [
    "light",
    "dark",
    "ocean",
    "forest",
    "sunset",
    "lavender",
    "midnight",
    "rose-gold",
    "royal-purple",
    "cyber-pink",
    "emerald-dream",
    "golden-hour",
    "arctic-blue",
    "crimson-night",
  ],
}

export const FEATURES_BY_TIER: Record<SubscriptionTier, string[]> = {
  free: [
    "Tareas ilimitadas",
    "Calendario básico",
    "Temporizador Pomodoro",
    "2 temas (claro y oscuro)",
    "Estadísticas básicas",
  ],
  premium: [
    "Todas las funciones gratuitas",
    "8 temas premium",
    "Notas ilimitadas",
    "Lista de deseos",
    "50 créditos IA/mes",
    "Estadísticas avanzadas",
    "Sistema de logros",
    "Sin anuncios",
  ],
  pro: [
    "Todas las funciones Premium",
    "14 temas exclusivos",
    "500 créditos IA/mes",
    "Asistente IA avanzado",
    "Análisis predictivo",
    "Exportación de datos",
    "Soporte prioritario",
    "Acceso anticipado a nuevas funciones",
  ],
}

export const AI_CREDITS_BY_TIER: Record<SubscriptionTier, number> = {
  free: 0,
  premium: 50,
  pro: 500,
}

export function canAccessTheme(tier: string | SubscriptionTier, themeName: string): boolean {
  const normalizedTier = (tier?.toLowerCase() || "free") as SubscriptionTier
  const availableThemes = THEME_CONFIG[normalizedTier] || THEME_CONFIG.free
  return availableThemes.includes(themeName)
}

export function getThemeAccess(tier: string | SubscriptionTier): string[] {
  const normalizedTier = (tier?.toLowerCase() || "free") as SubscriptionTier
  return THEME_CONFIG[normalizedTier] || THEME_CONFIG.free
}

export function getSubscriptionFeatures(tier: string | SubscriptionTier): string[] {
  const normalizedTier = (tier?.toLowerCase() || "free") as SubscriptionTier
  return FEATURES_BY_TIER[normalizedTier] || FEATURES_BY_TIER.free
}

export function hasAccess(userTier: string | SubscriptionTier, feature: string): boolean {
  const normalizedTier = (userTier?.toLowerCase() || "free") as SubscriptionTier
  const features = FEATURES_BY_TIER[normalizedTier] || FEATURES_BY_TIER.free
  return features.some((f) => f.toLowerCase().includes(feature.toLowerCase()))
}

export function canUseFeature(userTier: string | SubscriptionTier, featureName: string): boolean {
  const normalizedTier = (userTier?.toLowerCase() || "free") as SubscriptionTier

  const featureRequirements: Record<string, SubscriptionTier> = {
    notes: "premium",
    wishlist: "premium",
    "ai-assistant": "premium",
    "advanced-ai": "pro",
    "premium-themes": "premium",
    "pro-themes": "pro",
    achievements: "premium",
    "advanced-stats": "premium",
    export: "pro",
  }

  const requiredTier = featureRequirements[featureName]
  if (!requiredTier) return true

  return canAccessFeature(normalizedTier, requiredTier)
}

export function canAccessFeature(userTier: string | SubscriptionTier, requiredTier: SubscriptionTier): boolean {
  const normalizedUserTier = (userTier?.toLowerCase() || "free") as SubscriptionTier

  const tierHierarchy: Record<SubscriptionTier, number> = {
    free: 0,
    premium: 1,
    pro: 2,
  }

  return tierHierarchy[normalizedUserTier] >= tierHierarchy[requiredTier]
}

export function isPremiumOrPro(tier: string | SubscriptionTier): boolean {
  const normalizedTier = (tier?.toLowerCase() || "free") as SubscriptionTier
  return normalizedTier === "premium" || normalizedTier === "pro"
}

export function isPro(tier: string | SubscriptionTier): boolean {
  const normalizedTier = (tier?.toLowerCase() || "free") as SubscriptionTier
  return normalizedTier === "pro"
}

export function isPremium(tier: string | SubscriptionTier): boolean {
  const normalizedTier = (tier?.toLowerCase() || "free") as SubscriptionTier
  return normalizedTier === "premium"
}

export function getPayPalPlanId(tier: Exclude<SubscriptionTier, "free">, period: BillingPeriod): string {
  return SUBSCRIPTION_PRICES[tier][period].planId
}

export function getPlanById(planId: string): PlanDetails | null {
  for (const [tier, prices] of Object.entries(SUBSCRIPTION_PRICES)) {
    const typedTier = tier as Exclude<SubscriptionTier, "free">

    if (prices.monthly.planId === planId) {
      return {
        tier: typedTier,
        name: tier.charAt(0).toUpperCase() + tier.slice(1),
        period: "monthly",
        price: prices.monthly.price,
        currency: prices.monthly.currency,
        planId: prices.monthly.planId,
        features: FEATURES_BY_TIER[typedTier],
      }
    }

    if (prices.yearly.planId === planId) {
      return {
        tier: typedTier,
        name: tier.charAt(0).toUpperCase() + tier.slice(1),
        period: "yearly",
        price: prices.yearly.price,
        currency: prices.yearly.currency,
        planId: prices.yearly.planId,
        features: FEATURES_BY_TIER[typedTier],
      }
    }
  }

  return null
}

export function getAICredits(tier: string | SubscriptionTier): number {
  const normalizedTier = (tier?.toLowerCase() || "free") as SubscriptionTier
  return AI_CREDITS_BY_TIER[normalizedTier] || 0
}

export function hasUnlimitedAI(tier: string | SubscriptionTier): boolean {
  return false
}

export function getPrice(tier: Exclude<SubscriptionTier, "free">, period: BillingPeriod): number {
  return SUBSCRIPTION_PRICES[tier][period].price
}

export function getFeatures(tier: string | SubscriptionTier): string[] {
  return getSubscriptionFeatures(tier)
}
