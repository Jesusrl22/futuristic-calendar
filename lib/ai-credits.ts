import { hybridDb } from "./hybrid-database"

export interface AICreditPack {
  id: string
  name: string
  credits: number
  priceBase: number
  priceVAT: number
  priceFinal: number
  popular?: boolean
  description: string
  bestValue?: boolean
}

export const aiCreditPacks: AICreditPack[] = [
  {
    id: "starter",
    name: "Starter",
    credits: 100,
    priceBase: 2.47,
    priceVAT: 0.52,
    priceFinal: 2.99,
    description: "Perfecto para probar las funciones de IA",
  },
  {
    id: "popular",
    name: "Popular",
    credits: 500,
    priceBase: 8.26,
    priceVAT: 1.73,
    priceFinal: 9.99,
    popular: true,
    description: "Ideal para uso regular de IA",
  },
  {
    id: "professional",
    name: "Professional",
    credits: 1000,
    priceBase: 14.87,
    priceVAT: 3.12,
    priceFinal: 17.99,
    bestValue: true,
    description: "Para usuarios intensivos de IA",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    credits: 2500,
    priceBase: 33.05,
    priceVAT: 6.94,
    priceFinal: 39.99,
    description: "Para equipos y uso empresarial",
  },
]

// Export as CREDIT_PACKAGES for compatibility
export const CREDIT_PACKAGES = aiCreditPacks

export const AI_COSTS = {
  SIMPLE_CHAT: 1,
  COMPLEX_CHAT: 2,
  TASK_GENERATION: 2,
  SMART_SUGGESTIONS: 1,
  CONTENT_ANALYSIS: 3,
  SCHEDULE_OPTIMIZATION: 4,
  ADVANCED_PLANNING: 5,
}

export const OPENAI_COSTS = {
  GPT4_MINI_INPUT: 0.00015,
  GPT4_MINI_OUTPUT: 0.0006,
  AVERAGE_INPUT_TOKENS: 200,
  AVERAGE_OUTPUT_TOKENS: 800,
}

export const calculateRealCost = (
  inputTokens = OPENAI_COSTS.AVERAGE_INPUT_TOKENS,
  outputTokens = OPENAI_COSTS.AVERAGE_OUTPUT_TOKENS,
) => {
  const inputCost = (inputTokens / 1000) * OPENAI_COSTS.GPT4_MINI_INPUT
  const outputCost = (outputTokens / 1000) * OPENAI_COSTS.GPT4_MINI_OUTPUT
  const totalUSD = inputCost + outputCost
  const totalEUR = totalUSD * 0.92
  return {
    inputCost,
    outputCost,
    totalUSD,
    totalEUR,
  }
}

export const CREDIT_VALUE_EUR = 2 / 500

export const calculateCreditsNeeded = (message: string, responseLength?: number): number => {
  const messageLength = message.length
  const estimatedResponseLength = responseLength || messageLength * 2

  if (messageLength < 50) {
    return AI_COSTS.SIMPLE_CHAT
  }

  if (messageLength < 200) {
    return AI_COSTS.SIMPLE_CHAT
  }

  if (messageLength < 500) {
    return AI_COSTS.COMPLEX_CHAT
  }

  return AI_COSTS.COMPLEX_CHAT + 1
}

export const calculateActualCost = (inputTokens: number, outputTokens: number) => {
  const realCost = calculateRealCost(inputTokens, outputTokens)
  const creditsNeeded = Math.ceil(realCost.totalEUR / CREDIT_VALUE_EUR)

  return Math.max(1, Math.min(10, creditsNeeded))
}

export const getCostBreakdown = () => {
  const realCost = calculateRealCost()
  const creditsPerMessage = calculateActualCost(OPENAI_COSTS.AVERAGE_INPUT_TOKENS, OPENAI_COSTS.AVERAGE_OUTPUT_TOKENS)
  const creditValue = CREDIT_VALUE_EUR
  const margin = creditValue * creditsPerMessage - realCost.totalEUR
  const marginPercentage = (margin / realCost.totalEUR) * 100

  return {
    realCostEUR: realCost.totalEUR,
    creditsPerMessage,
    creditValue,
    revenuePerMessage: creditValue * creditsPerMessage,
    marginPerMessage: margin,
    marginPercentage,
    messagesPerEuro: Math.floor(1 / (creditValue * creditsPerMessage)),
  }
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(price)
}

export const getPricePerCredit = (pack: AICreditPack): number => {
  return pack.priceFinal / pack.credits
}

export const getBestValuePack = (): AICreditPack => {
  return aiCreditPacks.reduce((best, current) => {
    const bestPricePerCredit = getPricePerCredit(best)
    const currentPricePerCredit = getPricePerCredit(current)
    return currentPricePerCredit < bestPricePerCredit ? current : best
  })
}

export const calculateVAT = (basePrice: number, vatRate = 0.21): number => {
  return Math.round(basePrice * vatRate * 100) / 100
}

export const calculatePriceWithVAT = (basePrice: number, vatRate = 0.21): number => {
  return Math.round(basePrice * (1 + vatRate) * 100) / 100
}

export const getPackById = (packId: string): AICreditPack | undefined => {
  return aiCreditPacks.find((pack) => pack.id === packId)
}

export const getCreditPackage = getPackById

export const estimateCreditDuration = (credits: number, messagesPerDay: number): number => {
  const averageCreditsPerMessage = 1.5
  const creditsPerDay = messagesPerDay * averageCreditsPerMessage
  return Math.floor(credits / creditsPerDay)
}

export const getRecommendedPack = (messagesPerDay: number): AICreditPack => {
  const creditsNeededPerMonth = messagesPerDay * 30 * 1.5

  if (creditsNeededPerMonth <= 100) return aiCreditPacks[0]
  if (creditsNeededPerMonth <= 500) return aiCreditPacks[1]
  if (creditsNeededPerMonth <= 1000) return aiCreditPacks[2]
  return aiCreditPacks[3]
}

export const consumeAICredits = async (userId: string, creditsToConsume: number): Promise<number> => {
  try {
    const user = await hybridDb.getCurrentUser()
    if (!user) {
      throw new Error("User not found")
    }

    const currentCredits = user.ai_credits || 0
    if (currentCredits < creditsToConsume) {
      throw new Error("Insufficient AI credits")
    }

    const newCredits = currentCredits - creditsToConsume
    await hybridDb.updateUser(userId, { ai_credits: newCredits })

    return newCredits
  } catch (error) {
    console.error("Error consuming AI credits:", error)
    throw error
  }
}

export const addCreditsToUser = async (userId: string, creditsToAdd: number): Promise<number> => {
  try {
    const user = await hybridDb.getCurrentUser()
    if (!user) {
      throw new Error("User not found")
    }

    const currentCredits = user.ai_credits || 0
    const newCredits = currentCredits + creditsToAdd
    await hybridDb.updateUser(userId, { ai_credits: newCredits })

    return newCredits
  } catch (error) {
    console.error("Error adding AI credits:", error)
    throw error
  }
}

export const processCreditPurchase = async (
  userId: string,
  packId: string,
): Promise<{ success: boolean; newCredits: number }> => {
  try {
    const pack = getPackById(packId)
    if (!pack) {
      throw new Error("Credit pack not found")
    }

    const newCredits = await addCreditsToUser(userId, pack.credits)

    return {
      success: true,
      newCredits,
    }
  } catch (error) {
    console.error("Error processing credit purchase:", error)
    return {
      success: false,
      newCredits: 0,
    }
  }
}

// Get user AI credits
export async function getUserAICredits(userId: string): Promise<number> {
  try {
    const user = await hybridDb.getUserById(userId)
    if (!user) {
      return 0
    }
    return user.ai_credits || 0
  } catch (error) {
    console.error("Error getting user AI credits:", error)
    return 0
  }
}
