import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    console.log("[v0] Testing email send to:", email)

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Test 1: Try to send password reset email
    console.log("[v0] Test 1: Sending password reset email...")
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`,
    })

    if (resetError) {
      console.error("[v0] Password reset email failed:", resetError)
      return NextResponse.json(
        {
          success: false,
          error: "Password reset email failed",
          details: resetError.message,
        },
        { status: 400 }
      )
    }

    console.log("[v0] Password reset email sent successfully")

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully! Check your inbox.",
    })
  } catch (error: any) {
    console.error("[v0] Test email error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to send test email" },
      { status: 500 }
    )
  }
}
