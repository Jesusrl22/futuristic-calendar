import { createServerClient } from "@/lib/supabase/server"

export async function shouldResetMonthlyCredits(userId: string) {
  const supabase = await createServerClient()

  const { data: user, error } = await supabase
    .from("users")
    .select("last_credit_reset, ai_credits, subscription_tier")
    .eq("id", userId)
    .single()

  if (error) {
    console.error("Error fetching user for credit reset check:", error)
    return { shouldReset: false, remainingMonthlyCredits: 0, remainingPurchasedCredits: 0 }
  }

  if (!user) {
    return { shouldReset: false, remainingMonthlyCredits: 0, remainingPurchasedCredits: 0 }
  }

  const lastReset = user.last_credit_reset ? new Date(user.last_credit_reset) : new Date(0)
  const now = new Date()

  const lastResetMonth = new Date(lastReset.getFullYear(), lastReset.getMonth(), lastReset.getDate())
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

  // If current month day is smaller than last reset day, go to previous month
  if (now.getDate() < lastReset.getDate()) {
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() + 1)
  }

  const shouldReset = lastResetMonth < oneMonthAgo

  return {
    shouldReset,
    currentMonthlyCredits: user.ai_credits || 0,
    subscriptionTier: user.subscription_tier,
  }
}

export async function resetMonthlyCreditsIfNeeded(userId: string) {
  const supabase = await createServerClient()

  const { data: user, error } = await supabase
    .from("users")
    .select("last_credit_reset, subscription_tier, ai_credits_purchased")
    .eq("id", userId)
    .single()

  if (error || !user) {
    console.error("Error fetching user for reset:", error)
    return { monthlyCredits: 0, purchasedCredits: 0, resetPerformed: false }
  }

  const now = new Date()
  const lastReset = user.last_credit_reset ? new Date(user.last_credit_reset) : null

  let shouldReset = false

  // If today is day 1 of the month
  if (now.getDate() === 1) {
    // Check if we haven't reset this month yet
    if (!lastReset) {
      shouldReset = true
    } else {
      const lastResetDate = new Date(lastReset)
      // If last reset was in a different month/year, reset now
      if (lastResetDate.getMonth() !== now.getMonth() || lastResetDate.getFullYear() !== now.getFullYear()) {
        shouldReset = true
      }
    }
  }

  if (!shouldReset) {
    // No reset needed, return current credits
    const { data: currentUser } = await supabase
      .from("users")
      .select("ai_credits, ai_credits_purchased")
      .eq("id", userId)
      .single()

    return {
      monthlyCredits: currentUser?.ai_credits || 0,
      purchasedCredits: currentUser?.ai_credits_purchased || 0,
      resetPerformed: false,
    }
  }

  const tierCredits: Record<string, number> = {
    free: 0,
    premium: 100,
    pro: 500,
  }

  const monthlyCredits = tierCredits[user.subscription_tier?.toLowerCase() || "free"] || 0

  // Reset the monthly credits and update last_credit_reset
  const { error: updateError } = await supabase
    .from("users")
    .update({
      ai_credits: monthlyCredits,
      last_credit_reset: now.toISOString(),
    })
    .eq("id", userId)

  if (updateError) {
    console.error("Error resetting credits:", updateError)
    return { monthlyCredits: 0, purchasedCredits: 0, resetPerformed: false }
  }

  console.log("[v0] Credits reset for user:", userId, "New monthly credits:", monthlyCredits, "on day 1 of month")

  return {
    monthlyCredits,
    purchasedCredits: user.ai_credits_purchased || 0,
    resetPerformed: true,
  }
}
