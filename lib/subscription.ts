export type SubscriptionTier = "free" | "premium" | "pro"
export type SubscriptionPlan = SubscriptionTier

export interface SubscriptionFeatures {
  unlimitedTasks: boolean
  unlimitedEvents: boolean
  unlimitedNotes: boolean
  wishlist: boolean
  advancedPomodoro: boolean
  allAchievements: boolean
  themesCount: number
  aiCreditsPerMonth: number
  advancedAnalytics: boolean
  prioritySupport: boolean
  cloudSync: boolean
  betaFeatures: boolean
  apiAccess: boolean
  autoBackup: boolean
}

export const SUBSCRIPTION_FEATURES: Record<SubscriptionTier, SubscriptionFeatures> = {
  free: {
    unlimitedTasks: true,
    unlimitedEvents: false,
    unlimitedNotes: false,
    wishlist: false,
    advancedPomodoro: false,
    allAchievements: false,
    themesCount: 2,
    aiCreditsPerMonth: 0,
    advancedAnalytics: false,
    prioritySupport: false,
    cloudSync: false,
    betaFeatures: false,
    apiAccess: false,
    autoBackup: false,
  },
  premium: {
    unlimitedTasks: true,
    unlimitedEvents: true,
    unlimitedNotes: true,
    wishlist: true,
    advancedPomodoro: true,
    allAchievements: true,
    themesCount: 8,
    aiCreditsPerMonth: 0,
    advancedAnalytics: true,
    prioritySupport: false,
    cloudSync: true,
    betaFeatures: false,
    apiAccess: false,
    autoBackup: false,
  },
  pro: {
    unlimitedTasks: true,
    unlimitedEvents: true,
    unlimitedNotes: true,
    wishlist: true,
    advancedPomodoro: true,
    allAchievements: true,
    themesCount: 14,
    aiCreditsPerMonth: 500,
    advancedAnalytics: true,
    prioritySupport: true,
    cloudSync: true,
    betaFeatures: true,
    apiAccess: true,
    autoBackup: true,
  },
}

export function getSubscriptionFeatures(tier: SubscriptionTier): SubscriptionFeatures {
  return SUBSCRIPTION_FEATURES[tier]
}

export function canAccessFeature(userTier: SubscriptionTier, requiredTier: SubscriptionTier): boolean {
  const tierOrder: SubscriptionTier[] = ["free", "premium", "pro"]
  const userIndex = tierOrder.indexOf(userTier)
  const requiredIndex = tierOrder.indexOf(requiredTier)
  return userIndex >= requiredIndex
}

export function isPremiumOrPro(tier: SubscriptionTier | string): boolean {
  return tier === "premium" || tier === "pro"
}

export function isPro(tier: SubscriptionTier | string): boolean {
  return tier === "pro"
}

export function hasAccess(userTier: SubscriptionTier, feature: keyof SubscriptionFeatures): boolean {
  const features = getSubscriptionFeatures(userTier)
  return features[feature] as boolean
}

export function canUseFeature(userTier: SubscriptionTier | string, featureName: string): boolean {
  if (userTier === "pro") {
    return true
  }

  switch (featureName) {
    case "unlimited-tasks":
      return true
    case "unlimited-events":
      return isPremiumOrPro(userTier)
    case "unlimited-notes":
      return isPremiumOrPro(userTier)
    case "wishlist":
      return isPremiumOrPro(userTier)
    case "advanced-pomodoro":
      return isPremiumOrPro(userTier)
    case "all-achievements":
      return isPremiumOrPro(userTier)
    case "premium-themes":
      return isPremiumOrPro(userTier)
    case "pro-themes":
      return isPro(userTier)
    case "ai-credits":
      return isPro(userTier)
    case "advanced-analytics":
      return isPremiumOrPro(userTier)
    case "priority-support":
      return isPro(userTier)
    case "cloud-sync":
      return isPremiumOrPro(userTier)
    case "beta-features":
      return isPro(userTier)
    case "api-access":
      return isPro(userTier)
    case "auto-backup":
      return isPro(userTier)
    default:
      return false
  }
}

export function getThemeAccess(tier: SubscriptionTier | string): string[] {
  const freeThemes = ["light", "dark"]
  const premiumThemes = ["ocean", "forest", "sunset", "midnight"]
  const proThemes = [
    "royal-purple",
    "cyber-pink",
    "neon-green",
    "crimson",
    "golden-hour",
    "arctic-blue",
    "amoled",
    "matrix",
  ]

  if (tier === "pro") {
    return [...freeThemes, ...premiumThemes, ...proThemes]
  } else if (tier === "premium") {
    return [...freeThemes, ...premiumThemes]
  } else {
    return freeThemes
  }
}

export function canAccessTheme(tier: SubscriptionTier | string, themeName: string): boolean {
  const accessibleThemes = getThemeAccess(tier)
  return accessibleThemes.includes(themeName)
}

export const SUBSCRIPTION_PRICES = {
  premium: {
    monthly: {
      base: 2.06,
      vat: 0.43,
      total: 2.49,
    },
    yearly: {
      base: 20.65,
      vat: 4.34,
      total: 24.99,
      monthlyEquivalent: 2.08,
      savings: 4.89,
    },
  },
  pro: {
    monthly: {
      base: 4.12,
      vat: 0.87,
      total: 4.99,
    },
    yearly: {
      base: 41.31,
      vat: 8.68,
      total: 49.99,
      monthlyEquivalent: 4.17,
      savings: 9.89,
    },
  },
}
