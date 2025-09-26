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
    const { orderID } = await req.json()

    console.log("🔄 Capturing PayPal order:", orderID)

    if (!orderID) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    const accessToken = await getPayPalAccessToken()
    console.log("🔑 PayPal access token obtained for capture")

    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "PayPal-Request-Id": `capture-${orderID}-${Date.now()}`,
      },
    })

    const captureData = await response.json()
    console.log("📄 PayPal capture response:", JSON.stringify(captureData, null, 2))

    if (response.ok && captureData.status === "COMPLETED") {
      // Extract payment details
      const purchaseUnit = captureData.purchase_units?.[0]
      const capture = purchaseUnit?.payments?.captures?.[0]
      const customData = purchaseUnit?.custom_id ? JSON.parse(purchaseUnit.custom_id) : null

      if (!customData || !customData.userId || !customData.credits) {
        console.error("❌ Invalid custom data in PayPal response")
        return NextResponse.json({ error: "Invalid payment data" }, { status: 400 })
      }

      console.log("💰 Payment details:", {
        userId: customData.userId,
        credits: customData.credits,
        amount: capture?.amount?.value,
        currency: capture?.amount?.currency_code,
        captureId: capture?.id,
      })

      try {
        // Add credits to user account in Supabase
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("ai_credits")
          .eq("id", customData.userId)
          .single()

        if (userError) {
          console.error("❌ Error fetching user:", userError)
          return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const currentCredits = userData.ai_credits || 0
        const newCredits = currentCredits + customData.credits

        // Update user credits
        const { error: updateError } = await supabase
          .from("users")
          .update({ ai_credits: newCredits })
          .eq("id", customData.userId)

        if (updateError) {
          console.error("❌ Error updating user credits:", updateError)
          return NextResponse.json({ error: "Failed to update credits" }, { status: 500 })
        }

        console.log("✅ Credits added successfully:", {
          userId: customData.userId,
          previousCredits: currentCredits,
          addedCredits: customData.credits,
          newTotal: newCredits,
        })

        return NextResponse.json({
          success: true,
          credits: customData.credits,
          totalCredits: newCredits,
          transactionId: capture?.id,
          amount: capture?.amount?.value,
          currency: capture?.amount?.currency_code,
        })
      } catch (dbError) {
        console.error("❌ Database error:", dbError)
        return NextResponse.json({ error: "Database error" }, { status: 500 })
      }
    } else {
      console.error("❌ PayPal capture failed:", captureData)
      return NextResponse.json(
        {
          error: captureData.message || "Payment capture failed",
          details: captureData.details || [],
          status: captureData.status,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("❌ PayPal capture error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
