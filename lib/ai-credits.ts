import { supabase } from "@/lib/supabase"

export interface AICreditsInfo {
  credits: number
  used: number
  remaining: number
  resetDate: string | null
  canUseAI: boolean
  totalCostEur: number
  totalTokensUsed: number
  monthlyLimit: number
  planType: "monthly" | "yearly"
  isUnlimited: boolean
}

export interface AIUsage {
  id: string
  user_id: string
  request_text: string
  response_text?: string
  input_tokens: number
  output_tokens: number
  total_tokens: number
  credits_consumed: number
  cost_eur: number
  cost_usd: number
  model_used: string
  request_type: string
  created_at: string
}

// OpenAI GPT-4o-mini pricing (December 2024)
// Input: $0.000150 per 1K tokens
// Output: $0.000600 per 1K tokens
const OPENAI_INPUT_COST_PER_1K_TOKENS_USD = 0.00015
const OPENAI_OUTPUT_COST_PER_1K_TOKENS_USD = 0.0006
const USD_TO_EUR_RATE = 0.92 // Approximate conversion rate

// Credit system based on real OpenAI costs + margin
// 1 credit = €0.02 (2 cents) - includes OpenAI cost + profit margin
export const CREDIT_VALUE_EUR = 0.02
export const CREDIT_VALUE_USD = CREDIT_VALUE_EUR / USD_TO_EUR_RATE

// Plan pricing and credit allocation (CORRECTED BUSINESS MODEL)
export const PLAN_CREDITS = {
  // Monthly plans
  monthly: {
    premium: 0, // €1.99/month - no AI
    pro: 100, // €4.99/month - €3.00 difference = €2.00 for AI + €1.00 profit = 100 credits
  },
  // Yearly plans (with discount)
  yearly: {
    premium: 0, // €20/year - no AI
    pro: 1200, // €50/year - €30 difference = €24 for AI + €6 profit = 1,200 credits (100/month average)
  },
}

// Monthly limits for yearly plans (to prevent abuse)
export const MONTHLY_LIMITS = {
  monthly_pro: 100, // 100 credits per month (€2.00 for AI)
  yearly_pro: 100, // 1200/12 = 100 per month (same monthly value)
}

// Get user's AI credits info
export async function getUserAICredits(userId: string): Promise<AICreditsInfo> {
  try {
    if (!supabase) {
      throw new Error("Supabase not available")
    }

    const { data: user, error } = await supabase
      .from("users")
      .select(`
        ai_credits, 
        ai_credits_used, 
        ai_credits_reset_date, 
        ai_total_cost_eur, 
        ai_total_tokens_used, 
        ai_monthly_limit,
        ai_plan_type,
        is_pro,
        premium_expiry
      `)
      .eq("id", userId)
      .single()

    if (error) throw error

    const credits = user.ai_credits || 0
    const used = user.ai_credits_used || 0
    const remaining = Math.max(0, credits - used)
    const planType = user.ai_plan_type || "monthly"

    // Check if plan is still active
    const isProActive = user.is_pro && (!user.premium_expiry || new Date(user.premium_expiry) > new Date())
    const canUseAI = isProActive && remaining > 0

    // For yearly plans, check if we're within monthly limit
    const monthlyLimit = user.ai_monthly_limit || 0
    const isUnlimited = planType === "yearly" && remaining > monthlyLimit

    return {
      credits,
      used,
      remaining,
      resetDate: user.ai_credits_reset_date,
      canUseAI,
      totalCostEur: Number.parseFloat(user.ai_total_cost_eur || "0"),
      totalTokensUsed: user.ai_total_tokens_used || 0,
      monthlyLimit,
      planType,
      isUnlimited,
    }
  } catch (error) {
    console.error("Error getting AI credits:", error)
    return {
      credits: 0,
      used: 0,
      remaining: 0,
      resetDate: null,
      canUseAI: false,
      totalCostEur: 0,
      totalTokensUsed: 0,
      monthlyLimit: 0,
      planType: "monthly",
      isUnlimited: false,
    }
  }
}

// Calculate credits needed based on estimated tokens
export function calculateCreditsNeeded(requestText: string): number {
  // Estimate input tokens (rough approximation: 1 token ≈ 3.5 characters for Spanish)
  const estimatedInputTokens = Math.ceil(requestText.length / 3.5)

  // Estimate output tokens (typically 2-3x input for detailed responses)
  const estimatedOutputTokens = estimatedInputTokens * 2.5

  const totalEstimatedTokens = estimatedInputTokens + estimatedOutputTokens

  // Calculate estimated cost in USD
  const estimatedCostUSD =
    (estimatedInputTokens / 1000) * OPENAI_INPUT_COST_PER_1K_TOKENS_USD +
    (estimatedOutputTokens / 1000) * OPENAI_OUTPUT_COST_PER_1K_TOKENS_USD

  // Convert to credits (round up) - includes profit margin
  const creditsNeeded = Math.ceil(estimatedCostUSD / CREDIT_VALUE_USD)

  // Minimum 1 credit, maximum 20 credits per request
  return Math.max(1, Math.min(20, creditsNeeded))
}

// Calculate actual cost and credits from real token usage
export function calculateActualCost(
  inputTokens: number,
  outputTokens: number,
): {
  costUsd: number
  costEur: number
  creditsConsumed: number
} {
  // Calculate actual OpenAI cost
  const inputCostUSD = (inputTokens / 1000) * OPENAI_INPUT_COST_PER_1K_TOKENS_USD
  const outputCostUSD = (outputTokens / 1000) * OPENAI_OUTPUT_COST_PER_1K_TOKENS_USD
  const totalCostUSD = inputCostUSD + outputCostUSD
  const costEur = totalCostUSD * USD_TO_EUR_RATE

  // Convert to credits (round up, minimum 1) - includes profit margin
  const creditsConsumed = Math.max(1, Math.ceil(totalCostUSD / CREDIT_VALUE_USD))

  return {
    costUsd: Math.round(totalCostUSD * 10000) / 10000, // Round to 4 decimal places
    costEur: Math.round(costEur * 10000) / 10000,
    creditsConsumed,
  }
}

// Consume AI credits with real cost tracking
export async function consumeAICredits(
  userId: string,
  requestText: string,
  responseText: string,
  inputTokens: number,
  outputTokens: number,
  modelUsed = "gpt-4o-mini",
  requestType = "general",
): Promise<boolean> {
  try {
    if (!supabase) {
      throw new Error("Supabase not available")
    }

    // Calculate actual cost and credits
    const { costUsd, costEur, creditsConsumed } = calculateActualCost(inputTokens, outputTokens)
    const totalTokens = inputTokens + outputTokens

    // Check if user has enough credits
    const creditsInfo = await getUserAICredits(userId)
    if (!creditsInfo.canUseAI || creditsInfo.remaining < creditsConsumed) {
      return false
    }

    // Record usage with detailed cost data
    const { error: usageError } = await supabase.from("ai_usage").insert({
      user_id: userId,
      request_text: requestText.substring(0, 1000), // Limit length for storage
      response_text: responseText.substring(0, 2000), // Limit length for storage
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      total_tokens: totalTokens,
      credits_consumed: creditsConsumed,
      cost_eur: costEur,
      cost_usd: costUsd,
      model_used: modelUsed,
      request_type: requestType,
    })

    if (usageError) throw usageError

    // Update user's usage and cost tracking
    const { error: updateError } = await supabase
      .from("users")
      .update({
        ai_credits_used: creditsInfo.used + creditsConsumed,
        ai_total_tokens_used: creditsInfo.totalTokensUsed + totalTokens,
        ai_total_cost_eur: creditsInfo.totalCostEur + costEur,
      })
      .eq("id", userId)

    if (updateError) throw updateError

    return true
  } catch (error) {
    console.error("Error consuming AI credits:", error)
    return false
  }
}

// Add credits to user (for purchases)
export async function addAICredits(userId: string, creditsToAdd: number): Promise<boolean> {
  try {
    if (!supabase) {
      throw new Error("Supabase not available")
    }

    const creditsInfo = await getUserAICredits(userId)

    const { error } = await supabase
      .from("users")
      .update({
        ai_credits: creditsInfo.credits + creditsToAdd,
      })
      .eq("id", userId)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error adding AI credits:", error)
    return false
  }
}

// Initialize credits for new Pro user
export async function initializeProCredits(
  userId: string,
  planType: "monthly" | "yearly" = "monthly",
): Promise<boolean> {
  try {
    if (!supabase) {
      throw new Error("Supabase not available")
    }

    const credits = PLAN_CREDITS[planType].pro
    const monthlyLimit = MONTHLY_LIMITS[planType === "yearly" ? "yearly_pro" : "monthly_pro"]

    const resetDate = new Date()
    if (planType === "yearly") {
      resetDate.setFullYear(resetDate.getFullYear() + 1)
    } else {
      resetDate.setMonth(resetDate.getMonth() + 1)
    }

    const { error } = await supabase
      .from("users")
      .update({
        ai_credits: credits,
        ai_credits_used: 0,
        ai_monthly_limit: monthlyLimit,
        ai_plan_type: planType,
        ai_credits_reset_date: resetDate.toISOString(),
      })
      .eq("id", userId)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error initializing Pro credits:", error)
    return false
  }
}

// Reset credits based on plan type
export async function resetUserCredits(userId: string): Promise<boolean> {
  try {
    if (!supabase) {
      throw new Error("Supabase not available")
    }

    const { data, error } = await supabase.rpc("reset_user_ai_credits", { user_uuid: userId })

    if (error) throw error
    return data || false
  } catch (error) {
    console.error("Error resetting user credits:", error)
    return false
  }
}

// Get user's AI usage history
export async function getUserAIUsage(userId: string, limit = 10): Promise<AIUsage[]> {
  try {
    if (!supabase) {
      throw new Error("Supabase not available")
    }

    const { data, error } = await supabase
      .from("ai_usage")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error getting AI usage:", error)
    return []
  }
}

// Get cost statistics for admin
export async function getAICostStats(): Promise<{
  totalUsers: number
  totalCostEur: number
  totalCostUsd: number
  totalTokens: number
  totalRequests: number
  avgCostPerUser: number
  avgCostPerRequest: number
  monthlyProjectedCost: number
}> {
  try {
    if (!supabase) {
      throw new Error("Supabase not available")
    }

    const { data, error } = await supabase.rpc("get_ai_cost_stats")

    if (error) throw error

    const stats = data[0] || {}
    return {
      totalUsers: stats.total_users || 0,
      totalCostEur: Number.parseFloat(stats.total_cost_eur || "0"),
      totalCostUsd: Number.parseFloat(stats.total_cost_usd || "0"),
      totalTokens: stats.total_tokens || 0,
      totalRequests: stats.total_requests || 0,
      avgCostPerUser: Number.parseFloat(stats.avg_cost_per_user || "0"),
      avgCostPerRequest: Number.parseFloat(stats.avg_cost_per_request || "0"),
      monthlyProjectedCost: Number.parseFloat(stats.monthly_projected_cost || "0"),
    }
  } catch (error) {
    console.error("Error getting AI cost stats:", error)
    return {
      totalUsers: 0,
      totalCostEur: 0,
      totalCostUsd: 0,
      totalTokens: 0,
      totalRequests: 0,
      avgCostPerUser: 0,
      avgCostPerRequest: 0,
      monthlyProjectedCost: 0,
    }
  }
}

// Credit packages for additional purchases (UPDATED BUSINESS MODEL)
export const CREDIT_PACKAGES = [
  {
    credits: 50,
    price: "€1.00",
    priceValue: 1.0,
    popular: false,
    description: "~2,900 tokens • Consultas básicas",
    estimatedRequests: "10-15 consultas simples",
    aiCost: "€0.80", // 80% for AI
    profit: "€0.20", // 20% profit
  },
  {
    credits: 100,
    price: "€2.00",
    priceValue: 2.0,
    popular: true,
    description: "~5,800 tokens • Consultas detalladas",
    estimatedRequests: "20-30 consultas típicas",
    aiCost: "€1.60", // 80% for AI
    profit: "€0.40", // 20% profit
  },
  {
    credits: 250,
    price: "€5.00",
    priceValue: 5.0,
    popular: false,
    description: "~14,500 tokens • Planificación completa",
    estimatedRequests: "50-75 consultas complejas",
    aiCost: "€4.00", // 80% for AI
    profit: "€1.00", // 20% profit
  },
  {
    credits: 500,
    price: "€10.00",
    priceValue: 10.0,
    popular: false,
    description: "~29,000 tokens • Uso intensivo",
    estimatedRequests: "100-150 consultas variadas",
    aiCost: "€8.00", // 80% for AI
    profit: "€2.00", // 20% profit
  },
]

// Helper functions
export function formatCost(costEur: number): string {
  if (costEur < 0.001) {
    return `€${(costEur * 1000).toFixed(2)}‰` // Show in per-mille for very small amounts
  }
  if (costEur < 0.01) {
    return `€${costEur.toFixed(4)}`
  }
  return `€${costEur.toFixed(2)}`
}

export function estimateTokens(text: string): number {
  // Rough approximation: 1 token ≈ 3.5 characters for Spanish/mixed content
  return Math.ceil(text.length / 3.5)
}

export function getEfficiencyRating(avgCostPerCredit: number): {
  rating: "excellent" | "good" | "average" | "poor"
  color: string
  description: string
} {
  if (avgCostPerCredit <= 0.015) {
    return {
      rating: "excellent",
      color: "text-green-400",
      description: "Uso muy eficiente",
    }
  }
  if (avgCostPerCredit <= 0.02) {
    return {
      rating: "good",
      color: "text-blue-400",
      description: "Uso eficiente",
    }
  }
  if (avgCostPerCredit <= 0.025) {
    return {
      rating: "average",
      color: "text-yellow-400",
      description: "Uso promedio",
    }
  }
  return {
    rating: "poor",
    color: "text-red-400",
    description: "Consultas muy complejas",
  }
}

// Plan comparison helper (UPDATED BUSINESS MODEL)
export function getPlanComparison() {
  return {
    monthly: {
      premium: {
        price: "€1.99",
        priceValue: 1.99,
        credits: 0,
        aiAccess: false,
      },
      pro: {
        price: "€4.99",
        priceValue: 4.99,
        credits: 100,
        aiAccess: true,
        creditValue: "€2.00", // €2.00 for AI credits
        profitMargin: "€1.00", // €1.00 profit
        resetPeriod: "mensual",
      },
    },
    yearly: {
      premium: {
        price: "€20",
        priceValue: 20,
        credits: 0,
        aiAccess: false,
        monthlyEquivalent: "€1.67",
        savings: "€3.88",
      },
      pro: {
        price: "€50",
        priceValue: 50,
        credits: 1200, // €24 for AI credits + €6 profit
        aiAccess: true,
        creditValue: "€24.00", // €24 for AI credits
        profitMargin: "€6.00", // €6 profit
        resetPeriod: "anual",
        monthlyEquivalent: "€4.17", // €50/12 = €4.17
        savings: "€9.88", // (€4.99×12) - €50 = €9.88
        monthlyCredits: "100", // 1200/12 = 100
      },
    },
  }
}
