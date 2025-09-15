import { type NextRequest, NextResponse } from "next/server"
import { addAICredits } from "@/lib/ai-credits"

const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID
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

async function verifyPayPalWebhook(headers: any, body: string) {
  if (!PAYPAL_WEBHOOK_ID) return false

  const accessToken = await getPayPalAccessToken()

  const verificationData = {
    auth_algo: headers["paypal-auth-algo"],
    cert_id: headers["paypal-cert-id"],
    transmission_id: headers["paypal-transmission-id"],
    transmission_sig: headers["paypal-transmission-sig"],
    transmission_time: headers["paypal-transmission-time"],
    webhook_id: PAYPAL_WEBHOOK_ID,
    webhook_event: JSON.parse(body),
  }

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(verificationData),
  })

  const verification = await response.json()
  return verification.verification_status === "SUCCESS"
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headers = Object.fromEntries(req.headers.entries())

    // Verify webhook signature (recommended for production)
    if (process.env.NODE_ENV === "production") {
      const isValid = await verifyPayPalWebhook(headers, body)
      if (!isValid) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 })
      }
    }

    const event = JSON.parse(body)

    // Handle successful payment
    if (event.event_type === "CHECKOUT.ORDER.APPROVED" || event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const resource = event.resource
      const customData = JSON.parse(resource.custom_id || "{}")

      if (customData.userId && customData.credits) {
        const success = await addAICredits(customData.userId, customData.credits)

        if (success) {
          console.log(`✅ Added ${customData.credits} credits to user ${customData.userId}`)
        } else {
          console.error(`❌ Failed to add credits to user ${customData.userId}`)
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("PayPal webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
