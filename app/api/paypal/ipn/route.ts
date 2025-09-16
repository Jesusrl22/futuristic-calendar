import { type NextRequest, NextResponse } from "next/server"
import { addCreditsToUser } from "@/lib/ai-credits"

export async function POST(request: NextRequest) {
  try {
    console.log("🔔 PayPal IPN received")

    // Get the raw body
    const body = await request.text()
    const params = new URLSearchParams(body)

    // Log the IPN data for debugging
    console.log("📋 IPN Data:", Object.fromEntries(params.entries()))

    // Verify the IPN with PayPal
    const verificationBody = `cmd=_notify-validate&${body}`

    const verificationResponse = await fetch("https://ipnpb.paypal.com/cgi-bin/webscr", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: verificationBody,
    })

    const verificationResult = await verificationResponse.text()
    console.log("🔍 PayPal verification result:", verificationResult)

    if (verificationResult !== "VERIFIED") {
      console.error("❌ PayPal IPN verification failed")
      return NextResponse.json({ error: "IPN verification failed" }, { status: 400 })
    }

    // Extract payment information
    const paymentStatus = params.get("payment_status")
    const txnId = params.get("txn_id")
    const receiverEmail = params.get("receiver_email")
    const mcGross = params.get("mc_gross")
    const mcCurrency = params.get("mc_currency")
    const itemNumber = params.get("item_number")
    const custom = params.get("custom")

    console.log("💳 Payment details:", {
      paymentStatus,
      txnId,
      receiverEmail,
      mcGross,
      mcCurrency,
      itemNumber,
      custom,
    })

    // Only process completed payments
    if (paymentStatus !== "Completed") {
      console.log("⏳ Payment not completed, status:", paymentStatus)
      return NextResponse.json({ message: "Payment not completed" })
    }

    // Validate currency
    if (mcCurrency !== "EUR") {
      console.error("❌ Invalid currency:", mcCurrency)
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 })
    }

    // Parse custom data to get user ID and credits
    let userId: string
    let expectedCredits: number

    try {
      const customData = JSON.parse(custom || "{}")
      userId = customData.userId
      expectedCredits = customData.credits
    } catch (error) {
      console.error("❌ Error parsing custom data:", error)
      return NextResponse.json({ error: "Invalid custom data" }, { status: 400 })
    }

    if (!userId || !expectedCredits) {
      console.error("❌ Missing user ID or credits in custom data")
      return NextResponse.json({ error: "Missing user ID or credits" }, { status: 400 })
    }

    // Validate item number and amount
    const creditPackages = [
      { itemNumber: "credits_50", credits: 50, price: "1.00" },
      { itemNumber: "credits_100", credits: 100, price: "2.00" },
      { itemNumber: "credits_250", credits: 250, price: "5.00" },
      { itemNumber: "credits_500", credits: 500, price: "10.00" },
    ]

    const packageInfo = creditPackages.find((pkg) => pkg.itemNumber === itemNumber)

    if (!packageInfo) {
      console.error("❌ Invalid item number:", itemNumber)
      return NextResponse.json({ error: "Invalid item number" }, { status: 400 })
    }

    if (mcGross !== packageInfo.price) {
      console.error("❌ Amount mismatch:", mcGross, "expected:", packageInfo.price)
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 })
    }

    if (expectedCredits !== packageInfo.credits) {
      console.error("❌ Credits mismatch:", expectedCredits, "expected:", packageInfo.credits)
      return NextResponse.json({ error: "Credits mismatch" }, { status: 400 })
    }

    // Add credits to user account
    console.log(`➕ Adding ${packageInfo.credits} credits to user ${userId}`)

    const success = await addCreditsToUser(userId, packageInfo.credits)

    if (success) {
      console.log(`✅ Successfully added ${packageInfo.credits} credits to user ${userId}`)

      // Log the successful transaction
      console.log("📊 Transaction completed:", {
        userId,
        credits: packageInfo.credits,
        amount: mcGross,
        currency: mcCurrency,
        txnId,
        timestamp: new Date().toISOString(),
      })

      return NextResponse.json({
        message: "Credits added successfully",
        credits: packageInfo.credits,
        userId,
        txnId,
      })
    } else {
      console.error(`❌ Failed to add credits to user ${userId}`)
      return NextResponse.json({ error: "Failed to add credits" }, { status: 500 })
    }
  } catch (error) {
    console.error("❌ Error processing PayPal IPN:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Handle GET requests (PayPal sometimes sends verification requests)
export async function GET() {
  return NextResponse.json({ message: "PayPal IPN endpoint is active" })
}
