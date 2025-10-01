import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID
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

async function verifyWebhookSignature(headers: Headers, body: string, webhookId: string): Promise<boolean> {
  try {
    const accessToken = await getPayPalAccessToken()

    const verificationData = {
      auth_algo: headers.get("paypal-auth-algo"),
      cert_id: headers.get("paypal-cert-id"),
      transmission_id: headers.get("paypal-transmission-id"),
      transmission_sig: headers.get("paypal-transmission-sig"),
      transmission_time: headers.get("paypal-transmission-time"),
      webhook_id: webhookId,
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

    const result = await response.json()
    return result.verification_status === "SUCCESS"
  } catch (error) {
    console.error("❌ Webhook verification error:", error)
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const webhookData = JSON.parse(body)

    console.log("🔔 PayPal webhook received:", {
      eventType: webhookData.event_type,
      resourceType: webhookData.resource_type,
      id: webhookData.id,
    })

    // Verificar firma del webhook si está configurado
    if (PAYPAL_WEBHOOK_ID) {
      const isValid = await verifyWebhookSignature(req.headers, body, PAYPAL_WEBHOOK_ID)
      if (!isValid) {
        console.error("❌ Invalid webhook signature")
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
      console.log("✅ Webhook signature verified")
    }

    // Procesar diferentes tipos de eventos
    switch (webhookData.event_type) {
      case "PAYMENT.CAPTURE.COMPLETED":
        await handlePaymentCaptureCompleted(webhookData)
        break

      case "PAYMENT.CAPTURE.DENIED":
        await handlePaymentCaptureDenied(webhookData)
        break

      case "BILLING.SUBSCRIPTION.ACTIVATED":
        await handleSubscriptionActivated(webhookData)
        break

      case "BILLING.SUBSCRIPTION.CANCELLED":
        await handleSubscriptionCancelled(webhookData)
        break

      case "BILLING.SUBSCRIPTION.SUSPENDED":
        await handleSubscriptionSuspended(webhookData)
        break

      case "BILLING.SUBSCRIPTION.PAYMENT.FAILED":
        await handleSubscriptionPaymentFailed(webhookData)
        break

      default:
        console.log(`ℹ️ Unhandled webhook event: ${webhookData.event_type}`)
    }

    // Registrar evento del webhook
    await supabase.from("webhook_events").insert({
      event_type: webhookData.event_type,
      resource_type: webhookData.resource_type,
      event_id: webhookData.id,
      resource_id: webhookData.resource?.id,
      processed_at: new Date().toISOString(),
      data: webhookData,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Webhook processing error:", error)
    return NextResponse.json(
      {
        error: "Webhook processing failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

async function handlePaymentCaptureCompleted(webhookData: any) {
  try {
    const capture = webhookData.resource
    const customData = capture.custom_id ? JSON.parse(capture.custom_id) : null

    console.log("💰 Payment capture completed:", {
      captureId: capture.id,
      amount: capture.amount?.value,
      currency: capture.amount?.currency_code,
      customData,
    })

    if (customData?.userId) {
      // Actualizar estado de la transacción
      await supabase
        .from("payment_transactions")
        .update({
          status: "completed",
          paypal_capture_id: capture.id,
          processed_at: new Date().toISOString(),
        })
        .eq("paypal_order_id", capture.supplementary_data?.related_ids?.order_id)
    }
  } catch (error) {
    console.error("❌ Error handling payment capture completed:", error)
  }
}

async function handlePaymentCaptureDenied(webhookData: any) {
  try {
    const capture = webhookData.resource
    console.log("❌ Payment capture denied:", {
      captureId: capture.id,
      reason: capture.status_details?.reason,
    })

    // Actualizar estado de la transacción
    await supabase
      .from("payment_transactions")
      .update({
        status: "failed",
        failure_reason: capture.status_details?.reason || "Payment denied",
        processed_at: new Date().toISOString(),
      })
      .eq("paypal_capture_id", capture.id)
  } catch (error) {
    console.error("❌ Error handling payment capture denied:", error)
  }
}

async function handleSubscriptionActivated(webhookData: any) {
  try {
    const subscription = webhookData.resource
    console.log("✅ Subscription activated:", {
      subscriptionId: subscription.id,
      planId: subscription.plan_id,
      status: subscription.status,
    })

    // Actualizar estado de suscripción del usuario
    const { error } = await supabase
      .from("users")
      .update({
        subscription_status: "active",
        paypal_subscription_id: subscription.id,
        subscription_activated_at: new Date().toISOString(),
      })
      .eq("paypal_subscription_id", subscription.id)

    if (error) {
      console.error("❌ Error updating subscription status:", error)
    }
  } catch (error) {
    console.error("❌ Error handling subscription activated:", error)
  }
}

async function handleSubscriptionCancelled(webhookData: any) {
  try {
    const subscription = webhookData.resource
    console.log("❌ Subscription cancelled:", {
      subscriptionId: subscription.id,
      reason: subscription.status_change_note,
    })

    // Actualizar estado de suscripción del usuario
    const { error } = await supabase
      .from("users")
      .update({
        subscription_status: "cancelled",
        subscription_cancelled_at: new Date().toISOString(),
        subscription_cancel_reason: subscription.status_change_note || "Cancelled via PayPal",
      })
      .eq("paypal_subscription_id", subscription.id)

    if (error) {
      console.error("❌ Error updating subscription cancellation:", error)
    }
  } catch (error) {
    console.error("❌ Error handling subscription cancelled:", error)
  }
}

async function handleSubscriptionSuspended(webhookData: any) {
  try {
    const subscription = webhookData.resource
    console.log("⏸️ Subscription suspended:", {
      subscriptionId: subscription.id,
      reason: subscription.status_change_note,
    })

    // Actualizar estado de suscripción del usuario
    const { error } = await supabase
      .from("users")
      .update({
        subscription_status: "suspended",
        subscription_suspended_at: new Date().toISOString(),
      })
      .eq("paypal_subscription_id", subscription.id)

    if (error) {
      console.error("❌ Error updating subscription suspension:", error)
    }
  } catch (error) {
    console.error("❌ Error handling subscription suspended:", error)
  }
}

async function handleSubscriptionPaymentFailed(webhookData: any) {
  try {
    const subscription = webhookData.resource
    console.log("💳 Subscription payment failed:", {
      subscriptionId: subscription.id,
      failureReason: subscription.status_change_note,
    })

    // Registrar fallo de pago
    await supabase.from("subscription_events").insert({
      subscription_id: subscription.id,
      event_type: "payment_failed",
      reason: subscription.status_change_note || "Payment failed",
      metadata: {
        failed_at: new Date().toISOString(),
        webhook_id: webhookData.id,
      },
    })
  } catch (error) {
    console.error("❌ Error handling subscription payment failed:", error)
  }
}
