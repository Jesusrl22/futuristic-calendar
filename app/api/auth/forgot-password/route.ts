import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // First, check if user exists
    const { data: users } = await supabase.from("users").select("id, name").eq("email", email.toLowerCase()).single()

    if (!users) {
      // Don't reveal if email exists (security best practice)
      return NextResponse.json({
        success: true,
        message: "If an account with that email exists, we've sent password reset instructions.",
      })
    }

    // Generate reset token
    const resetToken = crypto.randomUUID()
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Store reset token in a temporary table or auth metadata
    const { error: tokenError } = await supabase
      .from("password_reset_tokens")
      .insert({
        email: email.toLowerCase(),
        token: resetToken,
        expires_at: tokenExpiry.toISOString(),
      })
      .select()

    if (tokenError) {
      console.error("[SERVER] Error storing reset token:", tokenError)
      return NextResponse.json({
        success: true,
        message: "If an account with that email exists, we've sent password reset instructions.",
      })
    }

    // Create reset link
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "https://future-task.com"}/reset-password?token=${resetToken}`

    // Send email using SMTP
    const { sendPasswordResetEmail } = await import("@/lib/email")
    await sendPasswordResetEmail(email, resetLink, users.name)

    console.log("[SERVER] Password reset email sent successfully")

    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, we've sent password reset instructions.",
    })
  } catch (error: any) {
    console.error("[SERVER] Forgot password error:", error)
    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, we've sent password reset instructions.",
    })
  }
}
