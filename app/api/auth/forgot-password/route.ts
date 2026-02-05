import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Check if email service is configured
    const smtpConfigured = process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASSWORD
    
    if (!smtpConfigured) {
      console.error("[v0] SMTP not configured - Password reset emails will not be sent")
      return NextResponse.json({
        success: false,
        error: "Email service is not configured. Please contact the administrator.",
      }, { status: 503 })
    }

    // Use Supabase native password reset flow
    const { error } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email: email.toLowerCase(),
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/reset`,
      },
    })

    if (error) {
      console.error("[v0] Password reset error:", error)
      // Don't reveal if email doesn't exist for security
    }

    console.log("[v0] Password reset link generated for:", email)

    // Always return success for security (don't reveal if email exists)
    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, we've sent password reset instructions.",
    })
  } catch (error: any) {
    console.error("[v0] Forgot password error:", error)
    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, we've sent password reset instructions.",
    })
  }
}
