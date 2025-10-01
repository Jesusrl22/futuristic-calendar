import { type NextRequest, NextResponse } from "next/server"
import { getPackById } from "@/lib/ai-credits"

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
    const { packId, userId } = await request.json()

    if (!packId || !userId) {
      return NextResponse.json({ error: "Pack ID and User ID are required" }, { status: 400 })
    }

    const creditPack = getPackById(packId)
    if (!creditPack) {
      return NextResponse.json({ error: "Credit pack not found" }, { status: 404 })
    }

    const accessToken = await getPayPalAccessToken()

    const orderData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: `credits_${packId}_${userId}`,
          amount: {
            currency_code: "EUR",
            value: creditPack.priceFinal.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "EUR",
                value: creditPack.priceBase.toFixed(2),
              },
              tax_total: {
                currency_code: "EUR",
                value: (creditPack.priceFinal - creditPack.priceBase).toFixed(2),
              },
            },
          },
          items: [
            {
              name: `${creditPack.name} - ${creditPack.credits} Créditos IA`,
              description: creditPack.description,
              unit_amount: {
                currency_code: "EUR",
                value: creditPack.priceBase.toFixed(2),
              },
              tax: {
                currency_code: "EUR",
                value: (creditPack.priceFinal - creditPack.priceBase).toFixed(2),
              },
              quantity: "1",
              category: "DIGITAL_GOODS",
            },
          ],
        },
      ],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?type=credits&pack=${packId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
        brand_name: "FutureTask",
        locale: "es-ES",
        landing_page: "BILLING",
        user_action: "PAY_NOW",
      },
    }

    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })

    const order = await response.json()

    if (!response.ok) {
      throw new Error(`PayPal API error: ${order.message || "Unknown error"}`)
    }

    return NextResponse.json({
      orderId: order.id,
      approvalUrl: order.links.find((link: any) => link.rel === "approve")?.href,
    })
  } catch (error) {
    console.error("PayPal Create Order Error:", error)
    return NextResponse.json({ error: "Failed to create PayPal order" }, { status: 500 })
  }
}
