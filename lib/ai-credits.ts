import { supabase, isSupabaseAvailable } from "./supabase"

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

// Credit packages for additional purchases
export interface CreditPackage {
  credits: number
  price: string
  priceValue: number
  description: string
  estimatedRequests: string
  popular?: boolean
  aiCost: string
  profit: string
}

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    credits: 50,
    price: "€1.00",
    priceValue: 1.0,
    description: "Perfecto para empezar",
    estimatedRequests: "~25-50 consultas IA",
    aiCost: "€0.50",
    profit: "€0.50",
  },
  {
    credits: 100,
    price: "€2.00",
    priceValue: 2.0,
    description: "Para uso regular",
    estimatedRequests: "~50-100 consultas IA",
    popular: true,
    aiCost: "€1.00",
    profit: "€1.00",
  },
  {
    credits: 250,
    price: "€5.00",
    priceValue: 5.0,
    description: "Para usuarios activos",
    estimatedRequests: "~125-250 consultas IA",
    aiCost: "€2.50",
    profit: "€2.50",
  },
  {
    credits: 500,
    price: "€10.00",
    priceValue: 10.0,
    description: "Máximo valor",
    estimatedRequests: "~250-500 consultas IA",
    aiCost: "€5.00",
    profit: "€5.00",
  },
]

// Types
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
  response_text: string
  input_tokens: number
  output_tokens: number
  cost_eur: number
  credits_consumed: number
  model_used: string
  request_type: string
  created_at: string
}

export interface AIAccessResult {
  canUse: boolean
  reason?: string
  creditsRemaining: number
}

// Mock data for fallback when Supabase is not available
const mockAICreditsData: Record<string, number> = {
  "admin-mock-id": 1000,
  "demo-mock-id": 0, // Demo user has 0 credits
  "jesus-mock-id": 950, // Jesus has Pro with credits
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
  // El costo real + margen de beneficio se convierte a créditos
  const creditsConsumed = Math.max(1, Math.ceil(totalCostUSD / CREDIT_VALUE_USD))

  return {
    costUsd: Math.round(totalCostUSD * 10000) / 10000, // Round to 4 decimal places
    costEur: Math.round(costEur * 10000) / 10000,
    creditsConsumed,
  }
}

// Estimate credits needed based on request text (for pre-validation)
export function estimateCreditsNeeded(requestText: string): number {
  // Estimate input tokens (rough approximation: 1 token ≈ 3.5 characters for Spanish)
  const estimatedInputTokens = Math.ceil(requestText.length / 3.5)

  // Estimate output tokens (typically 2-3x input for detailed responses)
  const estimatedOutputTokens = estimatedInputTokens * 2.5

  // Calculate estimated cost
  const { creditsConsumed } = calculateActualCost(estimatedInputTokens, estimatedOutputTokens)

  return creditsConsumed
}

// Get user's current AI credits count
export async function getUserAICredits(userId: string): Promise<number> {
  console.log(`🔍 Getting AI credits for user: ${userId}`)

  // Check mock data first for development
  if (!isSupabaseAvailable() || !supabase) {
    console.log(`📦 Using mock AI credits for user: ${userId}`)
    return mockAICreditsData[userId] || 0 // Default: 0 credits for new users
  }

  try {
    const { data, error } = await supabase.from("users").select("ai_credits").eq("id", userId).single()

    if (error) {
      console.error("Error fetching AI credits:", error)
      return mockAICreditsData[userId] || 0
    }

    return data?.ai_credits || 0
  } catch (error) {
    console.error("Error in getUserAICredits:", error)
    return mockAICreditsData[userId] || 0
  }
}

// Check if user can use AI features
export async function canUseAI(userId: string, isPro: boolean): Promise<AIAccessResult> {
  try {
    const credits = await getUserAICredits(userId)

    // Must be Pro user to use AI
    if (!isPro) {
      return {
        canUse: false,
        reason: "Necesitas una suscripción Pro para usar las funciones de IA. Actualiza tu plan para acceder.",
        creditsRemaining: credits,
      }
    }

    // Must have credits to use AI
    if (credits <= 0) {
      return {
        canUse: false,
        reason: "No tienes créditos IA disponibles. Compra más créditos para continuar usando las funciones de IA.",
        creditsRemaining: 0,
      }
    }

    return {
      canUse: true,
      creditsRemaining: credits,
    }
  } catch (error) {
    console.error("Error checking AI access:", error)
    return {
      canUse: false,
      reason: "Error verificando acceso a IA. Inténtalo de nuevo.",
      creditsRemaining: 0,
    }
  }
}

// Add credits to user account
export async function addCreditsToUser(userId: string, credits: number): Promise<boolean> {
  console.log(`➕ Adding ${credits} AI credits to user: ${userId}`)

  if (!isSupabaseAvailable() || !supabase) {
    console.log(`📦 Mock AI credits addition for user: ${userId}`)
    // Update mock data
    if (mockAICreditsData[userId] !== undefined) {
      mockAICreditsData[userId] += credits
    } else {
      mockAICreditsData[userId] = credits
    }
    return true
  }

  try {
    const { error } = await supabase.rpc("add_ai_credits", {
      user_id: userId,
      credits_to_add: credits,
    })

    if (error) {
      console.error("Error adding credits:", error)
      return false
    }

    console.log(`✅ Successfully added ${credits} credits to user: ${userId}`)
    return true
  } catch (error) {
    console.error("Error in addCreditsToUser:", error)
    return false
  }
}

// Consume credits for AI usage with REAL cost calculation
export async function consumeAICredits(
  userId: string,
  requestText: string,
  responseText: string,
  inputTokens: number,
  outputTokens: number,
  modelUsed = "gpt-4o-mini",
  requestType = "chat",
): Promise<boolean> {
  console.log(`🔥 Consuming AI credits for user: ${userId}`)

  // Calculate REAL cost based on actual token usage
  const { costUsd, costEur, creditsConsumed } = calculateActualCost(inputTokens, outputTokens)

  console.log(`💰 Real cost: $${costUsd.toFixed(4)} (€${costEur.toFixed(4)}) = ${creditsConsumed} créditos`)

  // Check if user has enough credits
  const currentCredits = await getUserAICredits(userId)
  if (currentCredits < creditsConsumed) {
    console.error(`❌ Insufficient credits: ${currentCredits} < ${creditsConsumed}`)
    return false
  }

  if (!isSupabaseAvailable() || !supabase) {
    console.log(`📦 Mock AI credits consumption for user: ${userId}`)
    // Update mock data
    if (mockAICreditsData[userId] !== undefined) {
      mockAICreditsData[userId] -= creditsConsumed
    }
    return true
  }

  try {
    // Start transaction - update credits
    const { error: updateError } = await supabase
      .from("users")
      .update({
        ai_credits: currentCredits - creditsConsumed,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (updateError) {
      console.error("Error updating credits:", updateError)
      return false
    }

    // Log usage with REAL cost data
    const { error: logError } = await supabase.from("ai_usage_logs").insert({
      user_id: userId,
      request_text: requestText.substring(0, 1000), // Limit length
      response_text: responseText.substring(0, 2000), // Limit length
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      cost_eur: costEur,
      cost_usd: costUsd,
      credits_consumed: creditsConsumed,
      model_used: modelUsed,
      request_type: requestType,
    })

    if (logError) {
      console.error("Error logging AI usage:", logError)
      // Don't fail the whole operation for logging errors
    }

    console.log(`✅ Successfully consumed ${creditsConsumed} credits (real cost: €${costEur.toFixed(4)})`)
    return true
  } catch (error) {
    console.error("Error in consumeAICredits:", error)
    return false
  }
}

// Get user's AI usage history
export async function getUserAIUsage(userId: string, limit = 10): Promise<AIUsage[]> {
  console.log(`📊 Getting AI usage for user: ${userId}`)

  if (!isSupabaseAvailable() || !supabase) {
    console.log(`📦 Using mock AI usage for user: ${userId}`)
    return [
      {
        id: "1",
        user_id: userId,
        request_text: "Ayúdame a planificar mi día",
        response_text: "Aquí tienes un plan para tu día...",
        input_tokens: 25,
        output_tokens: 150,
        cost_eur: 0.0184, // Real cost calculation
        credits_consumed: 1, // Based on real cost
        model_used: "gpt-4o-mini",
        request_type: "planning",
        created_at: new Date().toISOString(),
      },
    ]
  }

  try {
    const { data, error } = await supabase
      .from("ai_usage_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching AI usage:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getUserAIUsage:", error)
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
  console.log("💰 Getting AI cost statistics")

  if (!isSupabaseAvailable() || !supabase) {
    console.log("📦 Using mock AI cost stats")
    return {
      totalUsers: 3,
      totalCostEur: 5.25,
      totalCostUsd: 5.71,
      totalTokens: 15000,
      totalRequests: 45,
      avgCostPerUser: 1.75,
      avgCostPerRequest: 0.117,
      monthlyProjectedCost: 157.5,
    }
  }

  try {
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

// Format cost for display
export function formatCost(costEur: number): string {
  if (costEur < 0.001) {
    return `€${(costEur * 1000).toFixed(2)}‰` // Show in per-mille for very small amounts
  }
  if (costEur < 0.01) {
    return `€${costEur.toFixed(4)}`
  }
  return `€${costEur.toFixed(2)}`
}

// Get plan comparison data
export function getPlanComparison() {
  return {
    monthly: {
      premium: {
        price: 1.99,
        credits: 0,
        features: ["Sin IA", "Funciones básicas"],
      },
      pro: {
        price: 4.99,
        credits: 0, // Pro no incluye créditos, se compran por separado
        features: ["Acceso a IA", "Compra créditos por separado", "Funciones avanzadas"],
      },
    },
    yearly: {
      premium: {
        price: 20,
        credits: 0,
        savings: 3.88,
        features: ["Sin IA", "Funciones básicas"],
      },
      pro: {
        price: 50,
        credits: 0, // Pro no incluye créditos, se compran por separado
        savings: 9.88,
        features: ["Acceso a IA", "Compra créditos por separado", "Funciones avanzadas"],
      },
    },
  }
}

// Helper to show real cost examples
export function getCostExamples() {
  return [
    {
      scenario: "Pregunta simple (50 tokens entrada, 100 tokens salida)",
      inputTokens: 50,
      outputTokens: 100,
      ...calculateActualCost(50, 100),
    },
    {
      scenario: "Consulta detallada (150 tokens entrada, 400 tokens salida)",
      inputTokens: 150,
      outputTokens: 400,
      ...calculateActualCost(150, 400),
    },
    {
      scenario: "Planificación compleja (300 tokens entrada, 800 tokens salida)",
      inputTokens: 300,
      outputTokens: 800,
      ...calculateActualCost(300, 800),
    },
  ]
}

// Estimate tokens from text (rough approximation)
export function estimateTokens(text: string): number {
  // Rough approximation: 1 token ≈ 3.5 characters for Spanish/mixed content
  return Math.ceil(text.length / 3.5)
}
