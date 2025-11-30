import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { CREDIT_PACKS } from "@/lib/paypal"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const eventType = body.event_type

    // Verify webhook signature (implement proper verification in production)
    const webhookId = request.headers.get("paypal-transmission-id")

    if (!webhookId) {
      return NextResponse.json({ error: "Invalid webhook" }, { status: 401 })
    }

    const supabase = await createClient()

    // Handle different event types
    switch (eventType) {
      case "PAYMENT.CAPTURE.COMPLETED": {
        // One-time payment for credit packs
        const customId = body.resource?.purchase_units?.[0]?.custom_id
        if (!customId) break

        const { userId, packId, type } = JSON.parse(customId)

        if (type === "credits") {
          const pack = CREDIT_PACKS.find((p) => p.id === packId)
          if (!pack) break

          // Update user's purchased credits
          const { data: userData } = await supabase
            .from("users")
            .select("ai_credits_purchased")
            .eq("id", userId)
            .single()

          const currentCredits = userData?.ai_credits_purchased || 0

          await supabase
            .from("users")
            .update({
              ai_credits_purchased: currentCredits + pack.credits,
            })
            .eq("id", userId)
        }
        break
      }

      case "BILLING.SUBSCRIPTION.ACTIVATED":
      case "BILLING.SUBSCRIPTION.UPDATED": {
        // Subscription activated or updated
        const customId = body.resource?.custom_id
        if (!customId) break

        const { userId, plan } = JSON.parse(customId)

        const subscriptionId = body.resource?.id
        const nextBillingTime = body.resource?.billing_info?.next_billing_time

        // Calculate subscription end date (1 month from now)
        const subscriptionEnd = new Date(nextBillingTime || Date.now())
        subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1)

        // Update user subscription
        const updates: any = {
          subscription_plan: plan,
          subscription_end: subscriptionEnd.toISOString(),
          paypal_subscription_id: subscriptionId,
        }

        // Set monthly credits based on plan
        if (plan === "premium") {
          updates.ai_credits_monthly = 100
        } else if (plan === "pro") {
          updates.ai_credits_monthly = 500
        }

        await supabase.from("users").update(updates).eq("id", userId)
        break
      }

      case "BILLING.SUBSCRIPTION.CANCELLED":
      case "BILLING.SUBSCRIPTION.EXPIRED": {
        // Subscription cancelled or expired
        const subscriptionId = body.resource?.id

        await supabase
          .from("users")
          .update({
            subscription_plan: "free",
            subscription_end: null,
            ai_credits_monthly: 0,
            paypal_subscription_id: null,
          })
          .eq("paypal_subscription_id", subscriptionId)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("PayPal webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
