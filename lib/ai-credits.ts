import { supabase } from "./supabase"

// Tipos de datos
export interface CreditPackage {
  id: string
  name: string
  credits: number
  price: number
  currency: string
  popular?: boolean
  description: string
  features: string[]
}

export interface UserCredits {
  userId: string
  credits: number
  totalSpent: number
  lastPurchase?: string
}

// Paquetes de créditos disponibles
export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "basic",
    name: "Básico",
    credits: 50,
    price: 2.99,
    currency: "EUR",
    description: "Perfecto para empezar",
    features: ["50 créditos IA", "Sin caducidad", "Soporte básico"],
  },
  {
    id: "popular",
    name: "Popular",
    credits: 100,
    price: 4.99,
    currency: "EUR",
    popular: true,
    description: "La opción más elegida",
    features: ["100 créditos IA", "Sin caducidad", "Soporte prioritario", "20% descuento"],
  },
  {
    id: "pro",
    name: "Pro",
    credits: 250,
    price: 9.99,
    currency: "EUR",
    description: "Para usuarios avanzados",
    features: ["250 créditos IA", "Sin caducidad", "Soporte premium", "35% descuento"],
  },
  {
    id: "premium",
    name: "Premium",
    credits: 500,
    price: 17.99,
    currency: "EUR",
    description: "Máximo valor",
    features: ["500 créditos IA", "Sin caducidad", "Soporte VIP", "40% descuento"],
  },
]

// Precios de modelos IA (tokens por crédito)
export const AI_MODEL_PRICING = {
  "gpt-4": { input: 0.03, output: 0.06 },
  "gpt-3.5-turbo": { input: 0.001, output: 0.002 },
  "claude-3": { input: 0.015, output: 0.075 },
}

// Función para calcular el costo real basado en tokens
export function calculateActualCost(tokens: number, model = "gpt-3.5-turbo"): number {
  const pricing = AI_MODEL_PRICING[model as keyof typeof AI_MODEL_PRICING] || AI_MODEL_PRICING["gpt-3.5-turbo"]
  return Math.ceil(tokens * pricing.input * 1000) // Convertir a créditos
}

// Función para añadir créditos a un usuario
export async function addCreditsToUser(userId: string, credits: number): Promise<boolean> {
  try {
    if (!supabase) {
      console.warn("Supabase not configured, using memory storage")
      return true
    }

    const { data, error } = await supabase
      .from("users")
      .update({
        ai_credits: supabase.raw(`ai_credits + ${credits}`),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()

    if (error) {
      console.error("Error adding credits:", error)
      return false
    }

    console.log(`✅ Added ${credits} credits to user ${userId}`)
    return true
  } catch (error) {
    console.error("Error in addCreditsToUser:", error)
    return false
  }
}

// Función para consumir créditos
export async function consumeAICredits(userId: string, credits: number): Promise<boolean> {
  try {
    if (!supabase) {
      console.warn("Supabase not configured, using memory storage")
      return true
    }

    // Verificar que tiene suficientes créditos
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("ai_credits")
      .eq("id", userId)
      .single()

    if (fetchError || !user || user.ai_credits < credits) {
      console.error("Insufficient credits or user not found")
      return false
    }

    // Consumir créditos
    const { error } = await supabase
      .from("users")
      .update({
        ai_credits: user.ai_credits - credits,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      console.error("Error consuming credits:", error)
      return false
    }

    console.log(`✅ Consumed ${credits} credits from user ${userId}`)
    return true
  } catch (error) {
    console.error("Error in consumeAICredits:", error)
    return false
  }
}

// Función para obtener créditos del usuario
export async function getUserAICredits(userId: string): Promise<number> {
  try {
    if (!supabase) {
      console.warn("Supabase not configured, returning default credits")
      return 10 // Créditos por defecto para demo
    }

    const { data, error } = await supabase.from("users").select("ai_credits").eq("id", userId).single()

    if (error || !data) {
      console.error("Error fetching user credits:", error)
      return 0
    }

    return data.ai_credits || 0
  } catch (error) {
    console.error("Error in getUserAICredits:", error)
    return 0
  }
}

// Función para verificar si tiene suficientes créditos
export async function hasEnoughCredits(userId: string, requiredCredits: number): Promise<boolean> {
  const currentCredits = await getUserAICredits(userId)
  return currentCredits >= requiredCredits
}

// Función para obtener un paquete por ID
export function getCreditPackage(packageId: string): CreditPackage | null {
  return CREDIT_PACKAGES.find((pkg) => pkg.id === packageId) || null
}

// Función para obtener todos los paquetes
export function getAllCreditPackages(): CreditPackage[] {
  return CREDIT_PACKAGES
}

// Función para procesar compra de créditos
export async function processCreditPurchase(userId: string, packageId: string, paymentId: string): Promise<boolean> {
  try {
    const creditPackage = getCreditPackage(packageId)
    if (!creditPackage) {
      console.error("Invalid package ID:", packageId)
      return false
    }

    // Añadir créditos al usuario
    const success = await addCreditsToUser(userId, creditPackage.credits)

    if (success && supabase) {
      // Registrar la transacción
      await supabase.from("credit_transactions").insert({
        user_id: userId,
        package_id: packageId,
        credits: creditPackage.credits,
        amount: creditPackage.price,
        currency: creditPackage.currency,
        payment_id: paymentId,
        status: "completed",
        created_at: new Date().toISOString(),
      })
    }

    return success
  } catch (error) {
    console.error("Error processing credit purchase:", error)
    return false
  }
}

// Función para validar compra
export function validateCreditPurchase(packageId: string, amount: number): boolean {
  const creditPackage = getCreditPackage(packageId)
  return creditPackage ? creditPackage.price === amount : false
}

// Funciones de utilidad
export function formatCredits(credits: number): string {
  return credits.toLocaleString("es-ES")
}

export function formatCurrency(amount: number, currency = "EUR"): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

export function calculateCreditsNeeded(text: string, model = "gpt-3.5-turbo"): number {
  const estimatedTokens = Math.ceil(text.length / 4) // Aproximación: 4 caracteres = 1 token
  return calculateActualCost(estimatedTokens, model)
}

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

// Alias para compatibilidad
export const addAICredits = addCreditsToUser
export const creditPackages = CREDIT_PACKAGES
export const pricingInfo = AI_MODEL_PRICING

// Exportación por defecto
export default {
  CREDIT_PACKAGES,
  AI_MODEL_PRICING,
  calculateActualCost,
  addCreditsToUser,
  consumeAICredits,
  getUserAICredits,
  hasEnoughCredits,
  getCreditPackage,
  getAllCreditPackages,
  processCreditPurchase,
  validateCreditPurchase,
  formatCredits,
  formatCurrency,
  calculateCreditsNeeded,
  estimateTokens,
}
