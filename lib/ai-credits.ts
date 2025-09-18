"use client"

import { db } from "./hybrid-database"

// Types
export interface AICreditsInfo {
  balance: number
  used: number
  total: number
  lastUsed?: string
  monthlyUsage: number
  estimatedDaysLeft: number
}

export interface CreditPackage {
  id: string
  name: string
  credits: number
  price: number
  currency: string
  description: string
  popular?: boolean
  bestValue?: boolean
  savings?: number
}

// Constants
export const MIN_CUSTOM_AMOUNT = 1.0
export const MAX_CUSTOM_AMOUNT = 999.99
export const CREDITS_PER_EURO = 50

// OpenAI Pricing (per 1M tokens)
export const OPENAI_PRICING = {
  "gpt-4o-mini": {
    input: 0.15,
    output: 0.6,
  },
  "gpt-4o": {
    input: 5.0,
    output: 15.0,
  },
  "gpt-4": {
    input: 30.0,
    output: 60.0,
  },
}

// Credit packages
export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "starter",
    name: "Starter",
    credits: 50,
    price: 1.0,
    currency: "EUR",
    description: "Perfecto para probar el asistente IA",
  },
  {
    id: "basic",
    name: "Básico",
    credits: 150,
    price: 2.5,
    currency: "EUR",
    description: "Para uso ocasional del asistente",
    savings: 0.5,
  },
  {
    id: "standard",
    name: "Estándar",
    credits: 300,
    price: 4.5,
    currency: "EUR",
    description: "Uso regular del asistente IA",
    popular: true,
    savings: 1.5,
  },
  {
    id: "premium",
    name: "Premium",
    credits: 500,
    price: 6.5,
    currency: "EUR",
    description: "Para usuarios frecuentes",
    savings: 3.5,
  },
  {
    id: "pro",
    name: "Profesional",
    credits: 750,
    price: 8.5,
    currency: "EUR",
    description: "Uso intensivo del asistente",
    bestValue: true,
    savings: 6.5,
  },
  {
    id: "enterprise",
    name: "Empresarial",
    credits: 1000,
    price: 10.0,
    currency: "EUR",
    description: "Para equipos y empresas",
    savings: 10.0,
  },
]

// Get user's current AI credits
export async function getUserCredits(userId: string): Promise<number> {
  try {
    const user = await db.getUserById(userId)
    return user?.aiCredits || 0
  } catch (error) {
    console.error("Error getting user credits:", error)
    return 0
  }
}

// Get detailed AI credits information
export async function getUserAICredits(userId: string): Promise<AICreditsInfo> {
  try {
    const user = await db.getUserById(userId)
    if (!user) {
      return {
        balance: 0,
        used: 0,
        total: 0,
        monthlyUsage: 0,
        estimatedDaysLeft: 0,
      }
    }

    const balance = user.aiCredits || 0
    const used = 0 // This would come from usage tracking
    const total = balance + used
    const monthlyUsage = Math.floor(used / 30) // Rough estimate
    const estimatedDaysLeft = monthlyUsage > 0 ? Math.floor(balance / (monthlyUsage / 30)) : 999

    return {
      balance,
      used,
      total,
      monthlyUsage,
      estimatedDaysLeft,
    }
  } catch (error) {
    console.error("Error getting user AI credits:", error)
    return {
      balance: 0,
      used: 0,
      total: 0,
      monthlyUsage: 0,
      estimatedDaysLeft: 0,
    }
  }
}

// Add credits to user account
export async function addCredits(userId: string, amount: number): Promise<boolean> {
  try {
    const user = await db.getUserById(userId)
    if (!user) return false

    const newBalance = (user.aiCredits || 0) + amount
    const updatedUser = await db.updateUser(userId, { aiCredits: newBalance })
    return !!updatedUser
  } catch (error) {
    console.error("Error adding credits:", error)
    return false
  }
}

// Add AI credits (alias for compatibility)
export async function addAICredits(userId: string, amount: number): Promise<boolean> {
  return await addCredits(userId, amount)
}

// Alias for compatibility
export const addCreditsToUser = addCredits

// Deduct credits from user account
export async function deductCredits(userId: string, amount: number): Promise<boolean> {
  try {
    const user = await db.getUserById(userId)
    if (!user) return false

    const currentBalance = user.aiCredits || 0
    if (currentBalance < amount) return false

    const newBalance = currentBalance - amount
    const updatedUser = await db.updateUser(userId, { aiCredits: newBalance })
    return !!updatedUser
  } catch (error) {
    console.error("Error deducting credits:", error)
    return false
  }
}

// Consume AI credits with logging
export async function consumeAICredits(
  userId: string,
  amount: number,
  operation: string,
  details?: any,
): Promise<boolean> {
  try {
    const success = await deductCredits(userId, amount)
    if (success) {
      // Log the usage (in a real app, you'd save this to a usage table)
      console.log(`AI Credits consumed: ${amount} for ${operation}`, details)
    }
    return success
  } catch (error) {
    console.error("Error consuming AI credits:", error)
    return false
  }
}

// Purchase credits
export async function purchaseCredits(userId: string, packageId: string): Promise<boolean> {
  try {
    const creditPackage = CREDIT_PACKAGES.find((pkg) => pkg.id === packageId)
    if (!creditPackage) return false

    // In a real app, you'd process payment here
    // For demo purposes, we'll just add the credits
    return await addCredits(userId, creditPackage.credits)
  } catch (error) {
    console.error("Error purchasing credits:", error)
    return false
  }
}

// Calculate credits needed for a query
export function calculateCreditsNeeded(
  inputTokens: number,
  outputTokens: number,
  model: keyof typeof OPENAI_PRICING = "gpt-4o-mini",
): number {
  const pricing = OPENAI_PRICING[model]
  const inputCost = (inputTokens / 1000000) * pricing.input
  const outputCost = (outputTokens / 1000000) * pricing.output
  const totalCost = inputCost + outputCost

  // Convert USD to credits (assuming 1 credit = $0.01)
  return Math.ceil(totalCost * 100)
}

// Calculate actual cost in USD
export function calculateActualCost(
  inputTokens: number,
  outputTokens: number,
  model: keyof typeof OPENAI_PRICING = "gpt-4o-mini",
): number {
  const pricing = OPENAI_PRICING[model]
  const inputCost = (inputTokens / 1000000) * pricing.input
  const outputCost = (outputTokens / 1000000) * pricing.output
  return inputCost + outputCost
}

// Calculate credits from euro amount
export function calculateCreditsFromAmount(amount: number): number {
  return Math.floor(amount * CREDITS_PER_EURO)
}

// Calculate savings for a package
export function calculateSavings(packageData: CreditPackage): number {
  const standardRate = packageData.credits / CREDITS_PER_EURO
  return Math.max(0, standardRate - packageData.price)
}

// Validate custom amount
export function validateCustomAmount(amount: number): { valid: boolean; error?: string } {
  if (amount < MIN_CUSTOM_AMOUNT) {
    return { valid: false, error: `El mínimo es €${MIN_CUSTOM_AMOUNT}` }
  }
  if (amount > MAX_CUSTOM_AMOUNT) {
    return { valid: false, error: `El máximo es €${MAX_CUSTOM_AMOUNT}` }
  }
  return { valid: true }
}

// Format credits for display
export function formatCredits(credits: number): string {
  if (credits >= 1000000) {
    return `${(credits / 1000000).toFixed(1)}M`
  }
  if (credits >= 1000) {
    return `${(credits / 1000).toFixed(1)}k`
  }
  return credits.toString()
}

// Format credits estimate
export function formatCreditsEstimate(credits: number): string {
  const queries = Math.floor(credits / 5) // Assuming 5 credits per query
  return `~${queries} consultas`
}

// Format credit balance with usage estimate
export function formatCreditBalance(balance: number): string {
  const formatted = formatCredits(balance)
  const estimate = formatCreditsEstimate(balance)
  return `${formatted} créditos (${estimate})`
}

// Format currency
export function formatCurrency(amount: number, currency = "EUR"): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
  }).format(amount)
}

// Format savings
export function formatSavings(savings: number): string {
  return `Ahorra ${formatCurrency(savings)}`
}

// Get credit status color
export function getCreditStatusColor(balance: number): string {
  if (balance >= 100) return "text-green-600"
  if (balance >= 50) return "text-yellow-600"
  if (balance >= 20) return "text-orange-600"
  return "text-red-600"
}

// Get credit status message
export function getCreditStatusMessage(balance: number): string {
  if (balance >= 100) return "Excelente balance"
  if (balance >= 50) return "Buen balance"
  if (balance >= 20) return "Balance bajo"
  if (balance >= 10) return "Balance muy bajo"
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

// Get credit packages
export function getCreditPackages(): CreditPackage[] {
  return CREDIT_PACKAGES
}

// Get pricing info
export function getPricingInfo() {
  return OPENAI_PRICING
}

// Export all functions and constants
export { CREDIT_PACKAGES as creditPackages, OPENAI_PRICING as pricingInfo }
