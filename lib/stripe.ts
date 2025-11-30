import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
})

// Credit pack configurations with prices including VAT (21%)
export const CREDIT_PACKS = [
  {
    id: "pack_50",
    credits: 50,
    price: 4.99, // €4.99 with VAT
    priceBeforeVAT: 4.12,
    name: "50 AI Credits",
    description: "Perfect for occasional use",
    popular: false,
  },
  {
    id: "pack_100",
    credits: 100,
    price: 8.99, // €8.99 with VAT (10% discount)
    priceBeforeVAT: 7.43,
    name: "100 AI Credits",
    description: "Best value for regular users",
    popular: true,
  },
  {
    id: "pack_250",
    credits: 250,
    price: 19.99, // €19.99 with VAT (20% discount)
    priceBeforeVAT: 16.52,
    name: "250 AI Credits",
    description: "For power users",
    popular: false,
  },
  {
    id: "pack_500",
    credits: 500,
    price: 34.99, // €34.99 with VAT (30% discount)
    priceBeforeVAT: 28.92,
    name: "500 AI Credits",
    description: "Maximum savings",
    popular: false,
  },
] as const

export type CreditPackId = (typeof CREDIT_PACKS)[number]["id"]
