import { createClient } from "@/lib/supabase"

export interface CreditPackage {
  id: string
  name: string
  credits: number
  price: number
  popular?: boolean
  bestValue?: boolean
  description: string
  savings?: number
}

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "starter",
    name: "Starter",
    credits: 50,
    price: 1,
    description: "Perfecto para probar",
  },
  {
    id: "basic",
    name: "Básico",
    credits: 100,
    price: 2,
    description: "Para uso ocasional",
  },
  {
    id: "standard",
    name: "Estándar",
    credits: 150,
    price: 3,
    popular: true,
    description: "Más popular",
    savings: 0.5,
  },
  {
    id: "plus",
    name: "Plus",
    credits: 200,
    price: 4,
    description: "Uso regular",
    savings: 1,
  },
  {
    id: "premium",
    name: "Premium",
    credits: 250,
    price: 5,
    bestValue: true,
    description: "Mejor valor",
    savings: 1.5,
  },
  {
    id: "pro",
    name: "Pro",
    credits: 300,
    price: 6,
    description: "Para profesionales",
    savings: 2,
  },
  {
    id: "business",
    name: "Business",
    credits: 350,
    price: 7,
    description: "Uso intensivo",
    savings: 2.5,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    credits: 400,
    price: 8,
    description: "Máximo rendimiento",
    savings: 3,
  },
  {
    id: "ultimate",
    name: "Ultimate",
    credits: 450,
    price: 9,
    description: "Sin límites",
    savings: 3.5,
  },
  {
    id: "mega",
    name: "Mega",
    credits: 500,
    price: 10,
    description: "El más completo",
    savings: 4,
  },
]

export const QUERY_COSTS = {
  simple: 2,
  complex: 8,
  average: 5,
  image_analysis: 10,
  code_generation: 15,
}

export function formatCredits(credits: number): string {
  if (credits >= 1000000) {
    return `${(credits / 1000000).toFixed(1)}M`
  }
  if (credits >= 1000) {
    return `${(credits / 1000).toFixed(1)}k`
  }
  return credits.toString()
}

export function formatCreditsEstimate(credits: number): string {
  const simpleQueries = Math.floor(credits / QUERY_COSTS.simple)
  const averageQueries = Math.floor(credits / QUERY_COSTS.average)
  const complexQueries = Math.floor(credits / QUERY_COSTS.complex)

  if (credits < 10) {
    return `${simpleQueries} consultas simples`
  } else if (credits < 50) {
    return `${averageQueries} consultas promedio`
  } else if (credits < 100) {
    return `${averageQueries} consultas IA`
  } else {
    return `${complexQueries} consultas complejas o ${averageQueries} promedio`
  }
}

export function formatCreditBalance(credits: number): string {
  const formatted = formatCredits(credits)
  const estimate = formatCreditsEstimate(credits)
  return `${formatted} créditos (${estimate})`
}

export function getCreditStatusColor(credits: number): string {
  if (credits >= 100) return "text-green-600"
  if (credits >= 50) return "text-yellow-600"
  if (credits >= 20) return "text-orange-600"
  return "text-red-600"
}

export function getCreditStatusMessage(credits: number): string {
  if (credits >= 100) return "Excelente saldo"
  if (credits >= 50) return "Buen saldo"
  if (credits >= 20) return "Saldo bajo"
  return "Saldo muy bajo"
}

export function canAffordQuery(credits: number, queryType: keyof typeof QUERY_COSTS = "average"): boolean {
  return credits >= QUERY_COSTS[queryType]
}

export function getQueryCost(queryType: keyof typeof QUERY_COSTS = "average"): number {
  return QUERY_COSTS[queryType]
}

export async function getUserCredits(userId: string): Promise<number> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("users").select("ai_credits").eq("id", userId).single()

    if (error) {
      console.error("Error fetching user credits:", error)
      return 0
    }

    return data?.ai_credits || 0
  } catch (error) {
    console.error("Error getting user credits:", error)
    return 0
  }
}

export async function deductCredits(userId: string, amount: number): Promise<boolean> {
  try {
    const supabase = createClient()
    const currentCredits = await getUserCredits(userId)

    if (currentCredits < amount) {
      return false
    }

    const { error } = await supabase
      .from("users")
      .update({ ai_credits: currentCredits - amount })
      .eq("id", userId)

    if (error) {
      console.error("Error deducting credits:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error deducting credits:", error)
    return false
  }
}

export async function addCredits(userId: string, amount: number): Promise<boolean> {
  try {
    const supabase = createClient()
    const currentCredits = await getUserCredits(userId)

    const { error } = await supabase
      .from("users")
      .update({ ai_credits: currentCredits + amount })
      .eq("id", userId)

    if (error) {
      console.error("Error adding credits:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error adding credits:", error)
    return false
  }
}

export async function addCreditsToUser(userId: string, amount: number): Promise<boolean> {
  return await addCredits(userId, amount)
}

export function calculateSavings(packageId: string): number {
  const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId)
  if (!pkg) return 0

  const baseRate = 0.02 // €0.02 per credit
  const standardCost = pkg.credits * baseRate
  const actualCost = pkg.price
  const savings = standardCost - actualCost

  return Math.max(0, savings)
}

export function calculateCreditsFromAmount(amount: number): number {
  // Base rate: 50 credits per euro
  return Math.floor(amount * 50)
}

export function validateCustomAmount(amount: number): { valid: boolean; message?: string } {
  if (amount < 10) {
    return { valid: false, message: "El mínimo es €10" }
  }
  if (amount > 999.99) {
    return { valid: false, message: "El máximo es €999.99" }
  }
  return { valid: true }
}

export async function purchaseCredits(
  userId: string,
  packageId: string,
  customAmount?: number,
): Promise<{ success: boolean; message: string; credits?: number }> {
  try {
    let credits: number
    let amount: number

    if (customAmount) {
      const validation = validateCustomAmount(customAmount)
      if (!validation.valid) {
        return { success: false, message: validation.message || "Cantidad inválida" }
      }
      credits = calculateCreditsFromAmount(customAmount)
      amount = customAmount
    } else {
      const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId)
      if (!pkg) {
        return { success: false, message: "Paquete no encontrado" }
      }
      credits = pkg.credits
      amount = pkg.price
    }

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Add credits to user account
    const success = await addCredits(userId, credits)

    if (success) {
      return {
        success: true,
        message: `¡Compra exitosa! Se han añadido ${credits} créditos a tu cuenta.`,
        credits,
      }
    }

    return { success: false, message: "Error procesando la compra. Inténtalo de nuevo." }
  } catch (error) {
    console.error("Error purchasing credits:", error)
    return { success: false, message: "Error procesando la compra. Inténtalo de nuevo." }
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount)
}

export function getPackageById(id: string): CreditPackage | undefined {
  return CREDIT_PACKAGES.find((pkg) => pkg.id === id)
}

export function getPopularPackage(): CreditPackage | undefined {
  return CREDIT_PACKAGES.find((pkg) => pkg.popular)
}

export function getBestValuePackage(): CreditPackage | undefined {
  return CREDIT_PACKAGES.find((pkg) => pkg.bestValue)
}

export function getPopularPackages(): CreditPackage[] {
  return CREDIT_PACKAGES.filter((pkg) => pkg.popular || pkg.bestValue)
}

export function formatSavings(savings: number): string {
  if (savings <= 0) return ""
  return `Ahorras €${savings.toFixed(2)}`
}

export function getCreditUsageEstimate(credits: number): string {
  const estimates = [
    `Consultas simples: ~${Math.floor(credits / QUERY_COSTS.simple)}`,
    `Consultas complejas: ~${Math.floor(credits / QUERY_COSTS.complex)}`,
    `Análisis: ~${Math.floor(credits / QUERY_COSTS.image_analysis)}`,
    `Generación: ~${Math.floor(credits / QUERY_COSTS.code_generation)}`,
  ]

  return estimates.join(" • ")
}

export const MIN_CUSTOM_AMOUNT = 10.0
export const MAX_CUSTOM_AMOUNT = 999.99
export const CREDITS_PER_EURO = 50
