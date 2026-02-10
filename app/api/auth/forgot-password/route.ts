import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    console.log("[v0] Forgot password request for:", email)

    // Use the anonymous client to send the reset link
    // This triggers Supabase email sending
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Use resetPasswordForEmail which Supabase will handle
    const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase(), {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`,
    })

    if (error) {
      console.error("[v0] Password reset error:", error.message)
      // Don't reveal if email exists for security
    }

    console.log("[v0] Password reset link request sent for:", email)

    // Always return success for security (don't reveal if email exists)
    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, we've sent password reset instructions.",
    })
  } catch (error: any) {
    console.error("[v0] Forgot password error:", error.message)
    // Return success anyway to not leak information
    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, we've sent password reset instructions.",
    })
  }
}
