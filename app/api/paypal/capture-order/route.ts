import { type NextRequest, NextResponse } from "next/server"
import { processCreditPurchase, getCreditPackage } from "@/lib/ai-credits"

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

export async function POST(request: NextRequest) {
  try {
    const { orderId, packageId } = await request.json()

    if (!orderId || !packageId) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    // Obtener token de acceso de PayPal
    const accessToken = await getPayPalAccessToken()

    // Capturar la orden en PayPal
    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

    const captureData = await response.json()

    if (!response.ok) {
      console.error("PayPal capture failed:", captureData)
      return NextResponse.json({ error: "Error al procesar el pago" }, { status: 500 })
    }

    // Verificar que el pago fue exitoso
    if (captureData.status !== "COMPLETED") {
      return NextResponse.json({ error: "El pago no se completó correctamente" }, { status: 400 })
    }

    // Obtener información del paquete
    const creditPackage = getCreditPackage(packageId)
    if (!creditPackage) {
      return NextResponse.json({ error: "Paquete de créditos no encontrado" }, { status: 400 })
    }

    // Obtener ID del usuario (en una implementación real, esto vendría del token de autenticación)
    const userId = "demo-user" // Temporal para demo

    // Procesar la compra de créditos
    const success = await processCreditPurchase(userId, packageId, captureData.id)

    if (!success) {
      console.error("Failed to process credit purchase")
      return NextResponse.json({ error: "Error al procesar los créditos" }, { status: 500 })
    }

    console.log(`✅ Payment captured and credits added: ${creditPackage.credits} credits for user ${userId}`)

    return NextResponse.json({
      success: true,
      orderId: captureData.id,
      credits: creditPackage.credits,
      amount: creditPackage.price,
      currency: creditPackage.currency,
      status: captureData.status,
    })
  } catch (error) {
    console.error("Error capturing PayPal order:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
