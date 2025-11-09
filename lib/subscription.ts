export type SubscriptionTier = "free" | "premium" | "pro"

export interface SubscriptionAccess {
  notes: boolean
  wishlist: boolean
  ai: boolean
  futureTasks: boolean
  admin: boolean
}

export function getSubscriptionAccess(tier: SubscriptionTier | null): SubscriptionAccess {
  const normalizedTier = tier?.toLowerCase() as SubscriptionTier

  switch (normalizedTier) {
    case "pro":
      return {
        notes: true,
        wishlist: true,
        ai: true,
        futureTasks: true,
        admin: false,
      }
    case "premium":
      return {
        notes: true,
        wishlist: true,
        ai: false,
        futureTasks: true,
        admin: false,
      }
    case "free":
    default:
      return {
        notes: false,
        wishlist: false,
        ai: false,
        futureTasks: false,
        admin: false,
      }
  }
}

export function canAccessFeature(tier: SubscriptionTier | null, feature: keyof SubscriptionAccess): boolean {
  const access = getSubscriptionAccess(tier)
  return access[feature]
}
