export const SUBSCRIPTION_PLANS = {
  free: {
    id: "free",
    name: "Free",
    paypalPlanId: "", // No PayPal plan for free
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: {
      tasks: "unlimited",
      pomodoro: "basic",
      achievements: "some",
      aiCredits: 0,
      themes: false,
      analytics: false,
      prioritySupport: false,
      betaFeatures: false,
    },
    limits: {
      aiCredits: 0,
      tasks: -1,
      notes: -1,
      wishlist: -1,
    },
    featureList: [
      "Tareas ilimitadas",
      "Temporizador Pomodoro básico",
      "Algunos logros",
      "2 temas (claro y oscuro)",
      "Sin créditos de IA",
    ],
  },
  premium: {
    id: "premium",
    name: "Premium",
    paypalPlanId: process.env.PAYPAL_PREMIUM_PLAN_ID || "P-PREMIUM",
    price: {
      monthly: 2.49,
      yearly: 24.99,
    },
    features: {
      tasks: "unlimited",
      pomodoro: "advanced",
      achievements: "all",
      aiCredits: 0,
      themes: true,
      analytics: true,
      prioritySupport: false,
      betaFeatures: false,
    },
    limits: {
      aiCredits: 0,
      tasks: -1,
      notes: -1,
      wishlist: -1,
    },
    featureList: [
      "Todo lo de Free",
      "Temporizador Pomodoro avanzado",
      "Todos los logros",
      "6 temas premium",
      "Estadísticas avanzadas",
      "Sincronización en la nube",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    paypalPlanId: process.env.PAYPAL_PRO_PLAN_ID || "P-PRO",
    price: {
      monthly: 4.99,
      yearly: 49.99,
    },
    features: {
      tasks: "unlimited",
      pomodoro: "advanced",
      achievements: "all",
      aiCredits: 500,
      themes: true,
      analytics: true,
      prioritySupport: true,
      betaFeatures: true,
    },
    limits: {
      aiCredits: 500,
      tasks: -1,
      notes: -1,
      wishlist: -1,
    },
    featureList: [
      "Todo lo de Premium",
      "500 créditos de IA/mes",
      "14 temas profesionales",
      "Análisis predictivo",
      "API access",
      "Soporte prioritario 24/7",
      "Acceso a funciones beta",
    ],
  },
}

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS
export type BillingCycle = "monthly" | "yearly"

export function getPlanFeatures(plan: SubscriptionPlan) {
  return SUBSCRIPTION_PLANS[plan].features
}

export function getPlanPrice(plan: SubscriptionPlan, cycle: BillingCycle) {
  return SUBSCRIPTION_PLANS[plan].price[cycle]
}

export function getPlanLimits(plan: SubscriptionPlan) {
  return SUBSCRIPTION_PLANS[plan].limits
}

export function getPlanById(planId: string): (typeof SUBSCRIPTION_PLANS)[SubscriptionPlan] | null {
  const plan = Object.values(SUBSCRIPTION_PLANS).find((p) => p.id === planId)
  return plan || null
}

export function getPayPalPlanId(plan: SubscriptionPlan, cycle: BillingCycle): string {
  const planData = SUBSCRIPTION_PLANS[plan]
  if (!planData.paypalPlanId) {
    return ""
  }
  // Append cycle suffix for PayPal plan IDs
  return cycle === "monthly" ? `${planData.paypalPlanId}-MONTHLY` : `${planData.paypalPlanId}-YEARLY`
}

export function canAccessFeature(
  userPlan: SubscriptionPlan,
  feature: keyof (typeof SUBSCRIPTION_PLANS)["free"]["features"],
) {
  return SUBSCRIPTION_PLANS[userPlan].features[feature]
}

export function getAnnualSavings(plan: SubscriptionPlan) {
  const monthly = SUBSCRIPTION_PLANS[plan].price.monthly * 12
  const yearly = SUBSCRIPTION_PLANS[plan].price.yearly
  return monthly - yearly
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(amount)
}

export function getPlanFeatureList(plan: SubscriptionPlan): string[] {
  return SUBSCRIPTION_PLANS[plan].featureList
}

export function comparePlans(plan1: SubscriptionPlan, plan2: SubscriptionPlan): number {
  const order = { free: 0, premium: 1, pro: 2 }
  return order[plan1] - order[plan2]
}

export function isUpgrade(currentPlan: SubscriptionPlan, targetPlan: SubscriptionPlan): boolean {
  return comparePlans(targetPlan, currentPlan) > 0
}

export function isDowngrade(currentPlan: SubscriptionPlan, targetPlan: SubscriptionPlan): boolean {
  return comparePlans(targetPlan, currentPlan) < 0
}
