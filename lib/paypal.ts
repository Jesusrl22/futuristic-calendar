export const CREDIT_PACKS = [
  {
    id: "pack_50",
    credits: 50,
    price: 4.99,
    priceWithVAT: 6.04,
    discount: 0,
    popular: false,
  },
  {
    id: "pack_100",
    credits: 100,
    price: 8.99,
    priceWithVAT: 10.88,
    discount: 10,
    popular: true,
  },
  {
    id: "pack_250",
    credits: 250,
    price: 19.99,
    priceWithVAT: 24.19,
    discount: 20,
    popular: false,
  },
  {
    id: "pack_500",
    credits: 500,
    price: 34.99,
    priceWithVAT: 42.34,
    discount: 30,
    popular: false,
  },
]

export const SUBSCRIPTION_PLANS = {
  premium: {
    price: 4.99,
    priceWithVAT: 6.04,
    planId: process.env.PAYPAL_PREMIUM_PLAN_ID || "",
  },
  pro: {
    price: 9.99,
    priceWithVAT: 12.09,
    planId: process.env.PAYPAL_PRO_PLAN_ID || "",
  },
}

// PayPal API configuration
const PAYPAL_API_BASE =
  process.env.PAYPAL_ENVIRONMENT === "production" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET

// Get PayPal access token
export async function getPayPalAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal credentials are not configured")
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64")

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  const data = await response.json()
  return data.access_token
}

// Create PayPal order for credit packs
export async function createPayPalOrder(packId: string, userId: string) {
  const pack = CREDIT_PACKS.find((p) => p.id === packId)
  if (!pack) throw new Error("Invalid pack")

  const accessToken = await getPayPalAccessToken()

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "EUR",
            value: pack.priceWithVAT.toFixed(2),
          },
          description: `${pack.credits} AI Credits`,
          custom_id: JSON.stringify({ userId, packId, type: "credits" }),
        },
      ],
      application_context: {
        brand_name: "Future Task",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/subscription?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/subscription?canceled=true`,
      },
    }),
  })

  const data = await response.json()
  return data
}

// Create PayPal subscription
export async function createPayPalSubscription(plan: "premium" | "pro", userId: string) {
  const planConfig = SUBSCRIPTION_PLANS[plan]
  if (!planConfig.planId) throw new Error("PayPal plan not configured")

  const accessToken = await getPayPalAccessToken()

  const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      plan_id: planConfig.planId,
      subscriber: {
        name: {
          given_name: "User",
        },
      },
      application_context: {
        brand_name: "Future Task",
        user_action: "SUBSCRIBE_NOW",
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/subscription?success=true&plan=${plan}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/subscription?canceled=true`,
      },
      custom_id: JSON.stringify({ userId, type: "subscription", plan }),
    }),
  })

  const data = await response.json()
  return data
}

// Capture PayPal order
export async function capturePayPalOrder(orderId: string) {
  const accessToken = await getPayPalAccessToken()

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data = await response.json()
  return data
}
