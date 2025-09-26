import { db } from "./hybrid-database"

// Types
export interface AICreditsInfo {
  balance: number
  used: number
  total: number
  lastUsed?: string
  monthlyUsage: number
  estimatedDaysLeft: number
  canUseAI: boolean
  remaining: number
}

export interface CreditPackage {
  id: string
  name: string
  credits: number
  price: number
  priceFormatted: string
  popular?: boolean
  bonus?: number
  description: string
  savings?: string
}

export interface CreditTransaction {
  id: string
  userId: string
  type: "purchase" | "usage" | "bonus" | "refund"
  amount: number
  description: string
  timestamp: Date
  packageId?: string
}

export interface UserCredits {
  userId: string
  credits: number
  totalPurchased: number
  totalUsed: number
  lastUpdated: Date
}

// Constants
export const MIN_CUSTOM_AMOUNT = 1.0
export const MAX_CUSTOM_AMOUNT = 500.0

// Credit packages with real pricing
export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "credits_100",
    name: "Paquete Básico",
    credits: 100,
    price: 2.99,
    priceFormatted: "€2.99",
    description: "Perfecto para uso ocasional",
    popular: false,
  },
  {
    id: "credits_500",
    name: "Paquete Popular",
    credits: 500,
    price: 9.99,
    priceFormatted: "€9.99",
    description: "Ideal para usuarios regulares",
    popular: true,
    savings: "33% de ahorro",
  },
  {
    id: "credits_1000",
    name: "Paquete Pro",
    credits: 1000,
    price: 15.99,
    priceFormatted: "€15.99",
    description: "Máximo valor para power users",
    popular: false,
    savings: "47% de ahorro",
  },
]

// AI Model pricing (based on OpenAI pricing)
export const AI_MODEL_PRICING = {
  "gpt-4o": {
    input: 0.0025, // per 1K tokens
    output: 0.01, // per 1K tokens
    name: "GPT-4o",
  },
  "gpt-4o-mini": {
    input: 0.00015, // per 1K tokens
    output: 0.0006, // per 1K tokens
    name: "GPT-4o Mini",
  },
  "gpt-4-turbo": {
    input: 0.01, // per 1K tokens
    output: 0.03, // per 1K tokens
    name: "GPT-4 Turbo",
  },
  "gpt-3.5-turbo": {
    input: 0.0005, // per 1K tokens
    output: 0.0015, // per 1K tokens
    name: "GPT-3.5 Turbo",
  },
}

// Token estimation functions
export function estimateTokens(text: string): number {
  // Rough approximation: 1 token ≈ 4 characters for English
  // For Spanish and other languages, it might be different
  return Math.ceil(text.length / 3.5)
}

export function estimateInputTokens(prompt: string, context?: string): number {
  const promptTokens = estimateTokens(prompt)
  const contextTokens = context ? estimateTokens(context) : 0
  return promptTokens + contextTokens
}

export function estimateOutputTokens(expectedLength: "short" | "medium" | "long" = "medium"): number {
  switch (expectedLength) {
    case "short":
      return 150 // ~1-2 sentences
    case "medium":
      return 500 // ~1-2 paragraphs
    case "long":
      return 1500 // ~multiple paragraphs
    default:
      return 500
  }
}

// Cost calculation functions
export function calculateCreditsNeeded(message: string): number {
  const messageLength = message.length
  const baseCredits = 2

  // Calculate credits based on message complexity
  if (messageLength < 50) return baseCredits
  if (messageLength < 200) return baseCredits + 1
  if (messageLength < 500) return baseCredits + 2
  return baseCredits + 3
}

export function calculateActualCost(
  inputTokens: number,
  outputTokens: number,
): {
  costUsd: number
  costEur: number
  creditsConsumed: number
} {
  const model = AI_MODEL_PRICING["gpt-4o-mini"]

  // Calculate cost in USD
  const inputCost = (inputTokens / 1000) * model.input
  const outputCost = (outputTokens / 1000) * model.output
  const costUsd = inputCost + outputCost

  // Convert to EUR (approximate)
  const costEur = costUsd * 0.92

  // Convert to credits (1 credit = €0.02)
  const creditsConsumed = Math.ceil(costEur / 0.02)

  return {
    costUsd,
    costEur,
    creditsConsumed: Math.max(1, creditsConsumed), // Minimum 1 credit
  }
}

export function calculateCreditsFromAmount(amount: number): number {
  // Base rate: €0.02 per credit (50 credits per euro)
  const baseRate = 50
  return Math.floor(amount * baseRate)
}

// Credit estimation for user queries
export function estimateCreditsForQuery(
  prompt: string,
  context?: string,
  expectedLength: "short" | "medium" | "long" = "medium",
  model: keyof typeof AI_MODEL_PRICING = "gpt-4o-mini",
): number {
  const inputTokens = estimateInputTokens(prompt, context)
  const outputTokens = estimateOutputTokens(expectedLength)
  const { creditsConsumed } = calculateActualCost(inputTokens, outputTokens)
  return creditsConsumed
}

// Format credits for display
export function formatCredits(credits: number): string {
  if (credits >= 1000000) {
    return `${(credits / 1000000).toFixed(1)}M`
  }
  if (credits >= 1000) {
    return `${(credits / 1000).toFixed(1)}K`
  }
  return credits.toString()
}

export function formatCreditsEstimate(credits: number): string {
  const tasks = Math.floor(credits / 10) // Assuming 10 credits per AI task
  return `~${tasks} tareas IA`
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(amount)
}

// User credit management
export async function getUserAICredits(userId: string): Promise<AICreditsInfo> {
  try {
    const user = await db.getUserById(userId)
    const credits = user?.ai_credits || 0
    const used = user?.ai_queries_used || 0

    return {
      balance: credits,
      used: used,
      total: credits + used,
      remaining: credits,
      canUseAI: credits > 0,
      monthlyUsage: used,
      estimatedDaysLeft: credits > 0 ? Math.floor(credits / 5) : 0, // Assuming 5 credits per day
      lastUsed: user?.last_ai_usage || undefined,
    }
  } catch (error) {
    console.error("Error getting user AI credits:", error)
    return {
      balance: 0,
      used: 0,
      total: 0,
      remaining: 0,
      canUseAI: false,
      monthlyUsage: 0,
      estimatedDaysLeft: 0,
    }
  }
}

export const addCreditsToUser = async (userId: string, credits: number): Promise<boolean> => {
  try {
    const user = await db.getUserById(userId)
    if (!user) return false

    const currentCredits = user.ai_credits || 0
    const newTotal = currentCredits + credits

    await db.updateUser(userId, {
      ai_credits: newTotal,
      credits_purchased: (user.credits_purchased || 0) + credits,
    })

    return true
  } catch (error) {
    console.error("Error adding credits to user:", error)
    return false
  }
}

export const consumeAICredits = async (
  userId: string,
  message: string,
  response: string,
  inputTokens: number,
  outputTokens: number,
  model: string,
  requestType: string,
): Promise<boolean> => {
  try {
    const user = await db.getUserById(userId)
    if (!user) return false

    const { creditsConsumed } = calculateActualCost(inputTokens, outputTokens)
    const currentCredits = user.ai_credits || 0

    if (currentCredits < creditsConsumed) return false

    const newCredits = currentCredits - creditsConsumed
    const newQueriesUsed = (user.ai_queries_used || 0) + 1

    await db.updateUser(userId, {
      ai_credits: newCredits,
      ai_queries_used: newQueriesUsed,
      last_ai_usage: new Date().toISOString(),
    })

    return true
  } catch (error) {
    console.error("Error consuming AI credits:", error)
    return false
  }
}

export async function hasEnoughCredits(userId: string, requiredCredits: number): Promise<boolean> {
  const creditsInfo = await getUserAICredits(userId)
  return creditsInfo.remaining >= requiredCredits
}

export async function hasSufficientCredits(userId: string, requiredCredits: number): Promise<boolean> {
  try {
    const creditsInfo = await getUserAICredits(userId)
    return creditsInfo.remaining >= requiredCredits
  } catch (error) {
    console.error("Error checking credits:", error)
    return false
  }
}

// Package management
export function getCreditPackage(packageId: string): CreditPackage | null {
  return CREDIT_PACKAGES.find((pkg) => pkg.id === packageId) || null
}

export function getAllCreditPackages(): CreditPackage[] {
  return CREDIT_PACKAGES
}

export function validateCreditPurchase(packageId: string, amount: number): boolean {
  const package_ = getCreditPackage(packageId)
  return package_ !== null && package_.price === amount
}

export function getRecommendedPackage(monthlyQueries: number): CreditPackage {
  const estimatedCreditsNeeded = monthlyQueries * 50 // Rough estimation

  for (const pkg of CREDIT_PACKAGES) {
    const totalCredits = pkg.credits + (pkg.bonus || 0)
    if (totalCredits >= estimatedCreditsNeeded) {
      return pkg
    }
  }

  return CREDIT_PACKAGES[CREDIT_PACKAGES.length - 1] // Return largest package
}

export function getRecommendedModel(taskComplexity: "simple" | "medium" | "complex"): keyof typeof AI_MODEL_PRICING {
  switch (taskComplexity) {
    case "simple":
      return "gpt-4o-mini"
    case "medium":
      return "gpt-4o"
    case "complex":
      return "gpt-4-turbo"
    default:
      return "gpt-4o-mini"
  }
}

// Validation functions
export function validateCreditAmount(credits: number): boolean {
  return credits > 0 && credits <= 1000000 && Number.isInteger(credits)
}

export function validatePackageId(packageId: string): boolean {
  return CREDIT_PACKAGES.some((pkg) => pkg.id === packageId)
}

export function validateCustomAmount(amount: number): { valid: boolean; error?: string } {
  if (amount < 1) {
    return { valid: false, error: "El monto mínimo es €1" }
  }
  if (amount > 500) {
    return { valid: false, error: "El monto máximo es €500" }
  }
  return { valid: true }
}

// Credit conversion utilities
export function creditsToUSD(credits: number): number {
  return (credits * 0.02) / 0.92 // Convert EUR to USD
}

export function usdToCredits(usd: number): number {
  return Math.ceil((usd * 0.92) / 0.02)
}

export function creditsToEUR(credits: number): number {
  return credits * 0.02
}

export function eurToCredits(eur: number): number {
  return Math.floor(eur / 0.02)
}

// Get credit usage history
export async function getCreditHistory(userId: string, limit = 50): Promise<CreditTransaction[]> {
  try {
    // This would typically fetch from database
    // For now, return empty array
    return []
  } catch (error) {
    console.error("Error getting credit history:", error)
    return []
  }
}

export async function getCreditUsageHistory(userId: string, limit = 10) {
  // In a real implementation, this would fetch from a usage log table
  return []
}

// Process credit purchase
export async function processCreditPurchase(
  userId: string,
  packageId: string,
  paymentId: string,
): Promise<{ success: boolean; credits?: number; error?: string }> {
  try {
    const package_ = getCreditPackage(packageId)

    if (!package_) {
      return { success: false, error: "Invalid package" }
    }

    // Add credits to user account
    const success = await addCreditsToUser(userId, package_.credits + (package_.bonus || 0))

    if (success) {
      return { success: true, credits: package_.credits + (package_.bonus || 0) }
    } else {
      return { success: false, error: "Failed to add credits" }
    }
  } catch (error) {
    console.error("Error processing credit purchase:", error)
    return { success: false, error: "Processing error" }
  }
}

// Calculate credits for chat completion
export function calculateChatCredits(
  model: string,
  messages: Array<{ role: string; content: string }>,
  maxTokens = 1000,
): number {
  const inputText = messages.map((m) => m.content).join(" ")
  const inputTokens = estimateTokens(inputText)
  const outputTokens = maxTokens

  const { creditsConsumed } = calculateActualCost(inputTokens, outputTokens)
  return creditsConsumed
}

// Get credit balance status
export function getCreditBalanceStatus(credits: number): "low" | "medium" | "high" {
  if (credits < 100) return "low"
  if (credits < 500) return "medium"
  return "high"
}

// Estimate credits for different AI tasks
export const AI_TASK_ESTIMATES = {
  "task-suggestion": { min: 5, max: 15, description: "Sugerencia de tarea" },
  "task-optimization": { min: 10, max: 25, description: "Optimización de tarea" },
  "note-summary": { min: 8, max: 20, description: "Resumen de nota" },
  "note-expansion": { min: 15, max: 35, description: "Expansión de nota" },
  "wishlist-analysis": { min: 12, max: 30, description: "Análisis de wishlist" },
  "productivity-tips": { min: 20, max: 50, description: "Consejos de productividad" },
  "general-chat": { min: 5, max: 40, description: "Chat general" },
}

export function getTaskEstimate(taskType: keyof typeof AI_TASK_ESTIMATES) {
  return AI_TASK_ESTIMATES[taskType] || AI_TASK_ESTIMATES["general-chat"]
}

// Refund credits
export async function refundCredits(userId: string, credits: number, reason = "Refund"): Promise<boolean> {
  try {
    return await addCreditsToUser(userId, credits)
  } catch (error) {
    console.error("Error refunding credits:", error)
    return false
  }
}

// Get model efficiency (credits per quality)
export function getModelEfficiency(): Array<{
  model: string
  efficiency: number
  description: string
}> {
  return [
    {
      model: "gpt-4o-mini",
      efficiency: 10,
      description: "Most cost-effective for simple tasks",
    },
    {
      model: "gpt-4o",
      efficiency: 7,
      description: "Balanced performance and cost",
    },
    {
      model: "gpt-3.5-turbo",
      efficiency: 6,
      description: "Good for basic conversations",
    },
    {
      model: "gpt-4-turbo",
      efficiency: 4,
      description: "Highest quality but most expensive",
    },
  ]
}

// Get credit status color based on balance
export function getCreditStatusColor(credits: number): string {
  if (credits >= 100) return "text-green-600"
  if (credits >= 50) return "text-yellow-600"
  if (credits >= 20) return "text-orange-600"
  return "text-red-600"
}

// Get credit status message
export function getCreditStatusMessage(credits: number): string {
  if (credits >= 100) return "Excelente balance"
  if (credits >= 50) return "Buen balance"
  if (credits >= 20) return "Balance bajo"
  if (credits >= 10) return "Balance muy bajo"
  return "Sin créditos"
}

// Check if user can afford a query
export function canAffordQuery(balance: number, estimatedCost = 5): boolean {
  return balance >= estimatedCost
}

// Get query cost by type
export function getQueryCost(queryType: "simple" | "complex" | "analysis" = "simple"): number {
  const costs = {
    simple: 3,
    complex: 8,
    analysis: 15,
  }
  return costs[queryType]
}

// Purchase credits function
export async function purchaseCredits(userId: string, packageId: string): Promise<boolean> {
  try {
    const package_ = CREDIT_PACKAGES.find((p) => p.id === packageId)
    if (!package_) {
      throw new Error("Package not found")
    }

    // This would integrate with payment processor
    console.log(`Purchasing ${package_.credits} credits for user ${userId}`)

    // Add credits to user account
    await addCreditsToUser(userId, package_.credits + (package_.bonus || 0))

    return true
  } catch (error) {
    console.error("Error purchasing credits:", error)
    return false
  }
}

// Credit usage analytics
export async function getCreditUsageStats(userId: string): Promise<{
  totalCreditsUsed: number
  totalQueriesUsed: number
  averageCreditsPerQuery: number
  totalSpent: number
}> {
  const user = await db.getUserById(userId)
  if (!user) {
    return {
      totalCreditsUsed: 0,
      totalQueriesUsed: 0,
      averageCreditsPerQuery: 0,
      totalSpent: 0,
    }
  }

  const totalQueriesUsed = user.ai_queries_used || 0
  const totalCreditsUsed = (user.credits_purchased || 0) - (user.ai_credits || 0)
  const averageCreditsPerQuery = totalQueriesUsed > 0 ? totalCreditsUsed / totalQueriesUsed : 0
  const totalSpent = (user.credits_purchased || 0) * 0.02 // €0.02 per credit

  return {
    totalCreditsUsed,
    totalQueriesUsed,
    averageCreditsPerQuery,
    totalSpent,
  }
}

// Export all functions and types
export type { CreditPackage, CreditTransaction, UserCredits }
export { CREDIT_PACKAGES as creditPackages, AI_MODEL_PRICING as pricingInfo }

// Helper functions
function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export async function updateUserCredits(userId: string, newAmount: number): Promise<void> {
  await db.updateUser(userId, { ai_credits: newAmount })
}

export async function logCreditTransaction(transaction: CreditTransaction): Promise<void> {
  // This would log to database
  console.log("Logging transaction:", transaction)
}

export const addAICredits = addCreditsToUser
