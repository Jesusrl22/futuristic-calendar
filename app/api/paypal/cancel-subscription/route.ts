import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const PAYPAL_CLIENT_ID =
  process.env.PAYPAL_CLIENT_ID || "AfTXM0fv3XQWk88Wf2wa4kOesH5tUoLpJDGfBQwZC0Re5H1yUhOhamMA_Akr3keDwPkAaaEf79BXLNLl"
const PAYPAL_CLIENT_SECRET =
  process.env.PAYPAL_CLIENT_SECRET || "EM7layvX1KuwV0MFzui1w0PIm_nqLddGlS8GGIMQdaJnOXnztcfFMyaVUWc-WsCOY_sARPZ4wcxt_usq"
const PAYPAL_BASE_URL =
  process.env.NODE_ENV === "production" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

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
    const { subscriptionId, userId, reason } = await req.json()

    console.log("🔄 Cancelling PayPal subscription:", { subscriptionId, userId, reason })

    if (!subscriptionId || !userId) {
      return NextResponse.json({ error: "Subscription ID and User ID are required" }, { status: 400 })
    }

    const accessToken = await getPayPalAccessToken()
    console.log("🔑 PayPal access token obtained for cancellation")

    // Cancel subscription in PayPal
    const cancelData = {
      reason: reason || "User requested cancellation",
    }

    const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "PayPal-Request-Id": `cancel-${subscriptionId}-${Date.now()}`,
      },
      body: JSON.stringify(cancelData),
    })

    if (response.ok || response.status === 204) {
      console.log("✅ PayPal subscription cancelled successfully")

      try {
        // Update user subscription status in database
        const { error: updateError } = await supabase
          .from("users")
          .update({
            subscription_status: "cancelled",
            subscription_cancelled_at: new Date().toISOString(),
            subscription_cancel_reason: reason || "User requested cancellation",
          })
          .eq("id", userId)

        if (updateError) {
          console.error("❌ Error updating user subscription status:", updateError)
          return NextResponse.json({ error: "Failed to update subscription status" }, { status: 500 })
        }

        // Log the cancellation
        const { error: logError } = await supabase.from("subscription_events").insert({
          user_id: userId,
          event_type: "cancelled",
          subscription_id: subscriptionId,
          reason: reason || "User requested cancellation",
          metadata: {
            cancelled_at: new Date().toISOString(),
            cancelled_via: "user_request",
          },
        })

        if (logError) {
          console.error("❌ Error logging cancellation:", logError)
          // Don't fail the request if logging fails
        }

        console.log("✅ Subscription cancelled and database updated:", {
          userId,
          subscriptionId,
          reason,
        })

        return NextResponse.json({
          success: true,
          message: "Subscription cancelled successfully",
          subscriptionId,
          cancelledAt: new Date().toISOString(),
        })
      } catch (dbError) {
        console.error("❌ Database error during cancellation:", dbError)
        return NextResponse.json({ error: "Database error" }, { status: 500 })
      }
    } else {
      const errorData = await response.json().catch(() => ({}))
      console.error("❌ PayPal cancellation failed:", errorData)

      return NextResponse.json(
        {
          error: errorData.message || "Failed to cancel subscription",
          details: errorData.details || [],
        },
        { status: response.status },
      )
    }
  } catch (error) {
    console.error("❌ Subscription cancellation error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
