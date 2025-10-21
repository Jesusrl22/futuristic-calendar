export const SUBSCRIPTION_PLANS = {
  free: {
    id: "free",
    name: "Free",
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
  },
  premium: {
    id: "premium",
    name: "Premium",
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
  },
  pro: {
    id: "pro",
    name: "Pro",
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
