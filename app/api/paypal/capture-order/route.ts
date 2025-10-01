import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
const PAYPAL_BASE_URL =
  process.env.NODE_ENV === "production" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"

const supabase = createClient()

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

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    console.log("🔄 Capturing PayPal order:", orderId)

    // Obtener token de acceso de PayPal
    const accessToken = await getPayPalAccessToken()

    // Capturar la orden en PayPal
    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `capture-${orderId}-${Date.now()}`,
      },
    })

    const captureData = await response.json()

    if (!response.ok) {
      console.error("❌ PayPal capture failed:", captureData)
      return NextResponse.json({ error: "Error capturing payment", details: captureData }, { status: 500 })
    }

    // Verificar que el pago fue exitoso
    if (captureData.status !== "COMPLETED") {
      console.error("❌ Payment not completed:", captureData.status)
      return NextResponse.json({ error: "Payment not completed", status: captureData.status }, { status: 400 })
    }

    console.log("✅ Payment captured successfully:", captureData.id)

    // Procesar el pago según el tipo
    const purchaseUnit = captureData.purchase_units[0]
    const customData = JSON.parse(purchaseUnit.custom_id || "{}")
    const { type, userId, packageId, planId, credits, aiCredits } = customData

    if (type === "credits" && packageId && credits) {
      // Añadir créditos IA al usuario
      const { error: updateError } = await supabase
        .from("users")
        .update({
          ai_credits: supabase.raw(`COALESCE(ai_credits, 0) + ${credits}`),
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (updateError) {
        console.error("❌ Error updating user credits:", updateError)
        return NextResponse.json({ error: "Error updating user credits" }, { status: 500 })
      }

      // Registrar la transacción
      await supabase.from("payment_transactions").insert({
        user_id: userId,
        type: "credit_purchase",
        amount: Number.parseFloat(purchaseUnit.amount.value),
        currency: purchaseUnit.amount.currency_code,
        paypal_order_id: orderId,
        paypal_capture_id: captureData.id,
        status: "completed",
        credits_added: credits,
        package_id: packageId,
        processed_at: new Date().toISOString(),
      })

      console.log(`✅ Added ${credits} credits to user ${userId}`)
    } else if (type === "subscription" && planId) {
      // Actualizar suscripción del usuario
      const { error: updateError } = await supabase
        .from("users")
        .update({
          plan: planId,
          subscription_plan: planId,
          subscription_status: "active",
          ai_credits: aiCredits || 0,
          subscription_activated_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (updateError) {
        console.error("❌ Error updating user subscription:", updateError)
        return NextResponse.json({ error: "Error updating user subscription" }, { status: 500 })
      }

      // Registrar la transacción
      await supabase.from("payment_transactions").insert({
        user_id: userId,
        type: "subscription",
        amount: Number.parseFloat(purchaseUnit.amount.value),
        currency: purchaseUnit.amount.currency_code,
        paypal_order_id: orderId,
        paypal_capture_id: captureData.id,
        status: "completed",
        plan_id: planId,
        ai_credits_added: aiCredits || 0,
        processed_at: new Date().toISOString(),
      })

      console.log(`✅ Updated user ${userId} to plan ${planId}`)
    }

    return NextResponse.json({
      success: true,
      orderId: captureData.id,
      status: captureData.status,
      amount: purchaseUnit.amount.value,
      currency: purchaseUnit.amount.currency_code,
      type,
      credits: credits || 0,
      planId: planId || null,
    })
  } catch (error) {
    console.error("❌ Error capturing PayPal order:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
