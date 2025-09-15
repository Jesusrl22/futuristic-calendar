import { type NextRequest, NextResponse } from "next/server"
import { addAICredits } from "@/lib/ai-credits"

// PayPal IPN (Instant Payment Notification) handler
export async function POST(request: NextRequest) {
  console.log("🔔 PayPal IPN received")

  try {
    const body = await request.text()
    const params = new URLSearchParams(body)

    // Log the IPN data for debugging
    console.log("📦 IPN Data:", Object.fromEntries(params))

    // Verify the IPN with PayPal
    const verifyParams = new URLSearchParams(body)
    verifyParams.append("cmd", "_notify-validate")

    const verifyResponse = await fetch("https://ipnpb.paypal.com/cgi-bin/webscr", {
      method: "POST",
      body: verifyParams.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })

    const verifyResult = await verifyResponse.text()
    console.log("✅ PayPal verification result:", verifyResult)

    if (verifyResult !== "VERIFIED") {
      console.error("❌ PayPal IPN verification failed")
      return NextResponse.json({ error: "IPN verification failed" }, { status: 400 })
    }

    // Extract payment data
    const paymentStatus = params.get("payment_status")
    const itemNumber = params.get("item_number")
    const custom = params.get("custom") // This contains the user ID
    const txnId = params.get("txn_id")
    const payerEmail = params.get("payer_email")
    const mcGross = params.get("mc_gross")

    console.log("💰 Payment details:", {
      paymentStatus,
      itemNumber,
      custom,
      txnId,
      payerEmail,
      mcGross,
    })

    // Only process completed payments
    if (paymentStatus !== "Completed") {
      console.log("⏳ Payment not completed, status:", paymentStatus)
      return NextResponse.json({ message: "Payment not completed" })
    }

    // Determine credits based on item number
    let creditsToAdd = 0
    switch (itemNumber) {
      case "credits_50":
        creditsToAdd = 50
        break
      case "credits_100":
        creditsToAdd = 100
        break
      case "credits_250":
        creditsToAdd = 250
        break
      case "credits_500":
        creditsToAdd = 500
        break
      default:
        console.error("❌ Unknown item number:", itemNumber)
        return NextResponse.json({ error: "Unknown item" }, { status: 400 })
    }

    if (!custom) {
      console.error("❌ No user ID provided in custom field")
      return NextResponse.json({ error: "No user ID" }, { status: 400 })
    }

    // Add credits to user account
    const success = await addAICredits(custom, creditsToAdd)

    if (success) {
      console.log(`✅ Successfully added ${creditsToAdd} credits to user ${custom}`)

      // TODO: Send confirmation email to user
      // TODO: Log transaction in database

      return NextResponse.json({
        message: "Credits added successfully",
        credits: creditsToAdd,
        userId: custom,
        txnId,
      })
    } else {
      console.error("❌ Failed to add credits to user")
      return NextResponse.json({ error: "Failed to add credits" }, { status: 500 })
    }
  } catch (error) {
    console.error("❌ Error processing PayPal IPN:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Handle GET requests (PayPal sometimes sends test IPNs via GET)
export async function GET(request: NextRequest) {
  console.log("📨 PayPal IPN GET request received")
  return NextResponse.json({ message: "PayPal IPN endpoint active" })
}
