import { type NextRequest, NextResponse } from "next/server"
import { getPlanById, getPayPalPlanId } from "@/lib/subscription"

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
const PAYPAL_BASE_URL =
  process.env.NODE_ENV === "production" ? "https://api.paypal.com" : "https://api.sandbox.paypal.com"

async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64")

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
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

export async function POST(request: NextRequest) {
  try {
    const { planId, userId } = await request.json()

    if (!planId || !userId) {
      return NextResponse.json({ error: "Plan ID and User ID are required" }, { status: 400 })
    }

    const plan = getPlanById(planId)
    if (!plan) {
      return NextResponse.json({ error: "Subscription plan not found" }, { status: 404 })
    }

    const paypalPlanId = getPayPalPlanId(planId)
    if (!paypalPlanId) {
      return NextResponse.json({ error: "PayPal plan ID not configured" }, { status: 400 })
    }

    const accessToken = await getPayPalAccessToken()

    const subscriptionData = {
      plan_id: paypalPlanId,
      subscriber: {
        name: {
          given_name: "Usuario",
          surname: "FutureTask",
        },
      },
      application_context: {
        brand_name: "FutureTask",
        locale: "es-ES",
        shipping_preference: "NO_SHIPPING",
        user_action: "SUBSCRIBE_NOW",
        payment_method: {
          payer_selected: "PAYPAL",
          payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
        },
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?type=subscription&plan=${planId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
      },
    }

    const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(subscriptionData),
    })

    const subscription = await response.json()

    if (!response.ok) {
      throw new Error(`PayPal API error: ${subscription.message || "Unknown error"}`)
    }

    return NextResponse.json({
      subscriptionId: subscription.id,
      approvalUrl: subscription.links.find((link: any) => link.rel === "approve")?.href,
    })
  } catch (error) {
    console.error("PayPal Create Subscription Error:", error)
    return NextResponse.json({ error: "Failed to create PayPal subscription" }, { status: 500 })
  }
}
