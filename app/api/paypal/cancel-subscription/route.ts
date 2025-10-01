import { type NextRequest, NextResponse } from "next/server"

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
    const { subscriptionId, reason } = await request.json()

    if (!subscriptionId) {
      return NextResponse.json({ error: "Subscription ID is required" }, { status: 400 })
    }

    const accessToken = await getPayPalAccessToken()

    const cancelData = {
      reason: reason || "User requested cancellation",
    }

    const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(cancelData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`PayPal API error: ${error.message || "Unknown error"}`)
    }

    return NextResponse.json({
      success: true,
      message: "Subscription cancelled successfully",
    })
  } catch (error) {
    console.error("PayPal Cancel Subscription Error:", error)
    return NextResponse.json({ error: "Failed to cancel PayPal subscription" }, { status: 500 })
  }
}
