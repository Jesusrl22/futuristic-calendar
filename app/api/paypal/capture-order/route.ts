import { type NextRequest, NextResponse } from "next/server"
import { addAICredits } from "@/lib/ai-credits"

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
const PAYPAL_BASE_URL =
  process.env.NODE_ENV === "production" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"

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

export async function POST(req: NextRequest) {
  try {
    const { orderID } = await req.json()

    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      return NextResponse.json({ error: "PayPal not configured" }, { status: 500 })
    }

    const accessToken = await getPayPalAccessToken()

    // Capture the payment
    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const captureData = await response.json()

    if (response.ok && captureData.status === "COMPLETED") {
      // Extract user data from the order
      const purchaseUnit = captureData.purchase_units[0]
      const customData = JSON.parse(purchaseUnit.custom_id)
      const { userId, credits } = customData

      // Add credits to user account
      const success = await addAICredits(userId, credits)

      if (success) {
        return NextResponse.json({
          success: true,
          credits,
          transactionId: captureData.id,
          amount: purchaseUnit.payments.captures[0].amount.value,
        })
      } else {
        return NextResponse.json({ error: "Failed to add credits" }, { status: 500 })
      }
    } else {
      console.error("PayPal capture error:", captureData)
      return NextResponse.json({ error: "Payment capture failed" }, { status: 400 })
    }
  } catch (error) {
    console.error("PayPal capture error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
