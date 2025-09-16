import { NextResponse } from "next/server"
import { processExpiredSubscriptions, sendExpirationWarnings } from "@/lib/database"

export async function GET() {
  try {
    console.log("🔄 Processing expired subscriptions via cron job")

    // Process expired subscriptions
    await processExpiredSubscriptions()

    // Send expiration warnings (3 days and 1 day before expiry)
    await sendExpirationWarnings()

    return NextResponse.json({
      success: true,
      message: "Expired subscriptions processed and warnings sent successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Error processing expired subscriptions:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process expired subscriptions",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

// Verify cron secret to prevent unauthorized access
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get("secret")

    // Check if the secret matches (you should set this in your environment variables)
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("🔄 Processing expired subscriptions via authenticated cron job")

    // Process expired subscriptions
    await processExpiredSubscriptions()

    // Send expiration warnings (3 days and 1 day before expiry)
    await sendExpirationWarnings()

    return NextResponse.json({
      success: true,
      message: "Expired subscriptions processed and warnings sent successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Error processing expired subscriptions:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process expired subscriptions",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
