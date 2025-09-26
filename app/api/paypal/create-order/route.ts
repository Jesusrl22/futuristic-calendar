import { type NextRequest, NextResponse } from "next/server"
import { CREDIT_PACKAGES } from "@/lib/ai-credits"

const PAYPAL_CLIENT_ID =
  process.env.PAYPAL_CLIENT_ID || "AfTXM0fv3XQWk88Wf2wa4kOesH5tUoLpJDGfBQwZC0Re5H1yUhOhamMA_Akr3keDwPkAaaEf79BXLNLl"
const PAYPAL_CLIENT_SECRET =
  process.env.PAYPAL_CLIENT_SECRET || "EM7layvX1KuwV0MFzui1w0PIm_nqLddGlS8GGIMQdaJnOXnztcfFMyaVUWc-WsCOY_sARPZ4wcxt_usq"
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

  if (!response.ok) {
    throw new Error(`PayPal auth failed: ${response.status}`)
  }

  const data = await response.json()
  return data.access_token
}

export async function POST(req: NextRequest) {
  try {
    const { packageIndex, userId } = await req.json()

    console.log("🔄 Creating PayPal order for:", { packageIndex, userId })

    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      console.error("❌ PayPal credentials missing")
      return NextResponse.json({ error: "PayPal not configured" }, { status: 500 })
    }

    const creditPackage = CREDIT_PACKAGES[packageIndex]
    if (!creditPackage) {
      console.error("❌ Invalid package index:", packageIndex)
      return NextResponse.json({ error: "Invalid package" }, { status: 400 })
    }

    console.log("📦 Credit package:", creditPackage)

    const accessToken = await getPayPalAccessToken()
    console.log("🔑 PayPal access token obtained")

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
            timestamp: Date.now(),
          }),
        },
      ],
      application_context: {
        brand_name: "FutureTask",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payment/cancel`,
      },
    }

    console.log("📋 Order data:", JSON.stringify(orderData, null, 2))

    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "PayPal-Request-Id": `${userId}-${Date.now()}`,
      },
      body: JSON.stringify(orderData),
    })

    const order = await response.json()
    console.log("📄 PayPal response:", JSON.stringify(order, null, 2))

    if (response.ok && order.id) {
      const approvalUrl = order.links?.find((link: any) => link.rel === "approve")?.href

      console.log("✅ PayPal order created successfully:", {
        orderID: order.id,
        approvalUrl,
        status: order.status,
      })

      return NextResponse.json({
        orderID: order.id,
        approvalUrl,
        status: order.status,
        credits: creditPackage.credits,
        amount: creditPackage.priceValue,
      })
    } else {
      console.error("❌ PayPal order creation failed:", order)
      return NextResponse.json(
        {
          error: order.message || "Failed to create PayPal order",
          details: order.details || [],
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("❌ PayPal API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
