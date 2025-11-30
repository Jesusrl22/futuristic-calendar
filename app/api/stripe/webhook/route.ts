import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@supabase/supabase-js"
import type Stripe from "stripe"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    // Check if this is a credit pack purchase
    if (session.metadata?.type === "credit_pack") {
      const userId = session.metadata.userId
      const credits = Number.parseInt(session.metadata.credits || "0")
      const packId = session.metadata.packId

      if (!userId || !credits) {
        console.error("Missing metadata in checkout session")
        return NextResponse.json({ error: "Invalid metadata" }, { status: 400 })
      }

      // Get current user credits
      const { data: user } = await supabase
        .from("users")
        .select("ai_credits_purchased, ai_credits_monthly")
        .eq("id", userId)
        .single()

      if (user) {
        const newPurchasedCredits = (user.ai_credits_purchased || 0) + credits
        const totalCredits = (user.ai_credits_monthly || 0) + newPurchasedCredits

        // Update user credits
        await supabase
          .from("users")
          .update({
            ai_credits_purchased: newPurchasedCredits,
            ai_credits: totalCredits,
          })
          .eq("id", userId)

        // Update purchase record
        await supabase
          .from("credit_purchases")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
            stripe_payment_id: session.payment_intent as string,
          })
          .eq("stripe_session_id", session.id)
      }
    }
  }

  return NextResponse.json({ received: true })
}
