import { type NextRequest, NextResponse } from "next/server"
import { getCreditPackage } from "@/lib/ai-credits"

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
    const { packageId, amount, currency } = await request.json()

    // Validar datos
    if (!packageId || !amount || !currency) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    // Verificar que el paquete existe y el precio coincide
    const creditPackage = getCreditPackage(packageId)
    if (!creditPackage || creditPackage.price !== amount) {
      return NextResponse.json({ error: "Paquete inválido o precio incorrecto" }, { status: 400 })
    }

    // Obtener token de acceso de PayPal
    const accessToken = await getPayPalAccessToken()

    // Crear orden en PayPal
    const orderData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: packageId,
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
          description: `${creditPackage.name} - ${creditPackage.credits} créditos IA`,
        },
      ],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
        brand_name: "FutureTask",
        locale: "es-ES",
        landing_page: "BILLING",
        shipping_preference: "NO_SHIPPING",
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
      console.error("PayPal order creation failed:", order)
      return NextResponse.json({ error: "Error al crear la orden en PayPal" }, { status: 500 })
    }

    console.log("✅ PayPal order created:", order.id)

    return NextResponse.json({
      id: order.id,
      status: order.status,
    })
  } catch (error) {
    console.error("Error creating PayPal order:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
