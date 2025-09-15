import { type NextRequest, NextResponse } from "next/server"
import { CREDIT_PACKAGES } from "@/lib/ai-credits"

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
    const { packageIndex, userId } = await req.json()

    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      return NextResponse.json({ error: "PayPal not configured" }, { status: 500 })
    }

    const creditPackage = CREDIT_PACKAGES[packageIndex]
    if (!creditPackage) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 })
    }

    const accessToken = await getPayPalAccessToken()

    const orderData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: `credits_${userId}_${Date.now()}`,
          amount: {
            currency_code: "EUR",
            value: creditPackage.priceValue.toFixed(2),
          },
          description: `${creditPackage.credits} créditos IA - FutureTask`,
          custom_id: JSON.stringify({
            userId,
            credits: creditPackage.credits,
            packageIndex,
          }),
        },
      ],
      application_context: {
        brand_name: "FutureTask",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
      },
    }

    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderData),
    })

    const order = await response.json()

    if (response.ok) {
      return NextResponse.json({
        orderID: order.id,
        approvalUrl: order.links.find((link: any) => link.rel === "approve")?.href,
      })
    } else {
      console.error("PayPal order creation error:", order)
      return NextResponse.json({ error: "Failed to create PayPal order" }, { status: 500 })
    }
  } catch (error) {
    console.error("PayPal API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
