import { NextResponse } from "next/server"
import { sendPasswordResetEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    console.log("[SERVER][v0] Password reset requested for:", email)

    // Check if user exists
    const checkResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users?email=eq.${email}`, {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      },
    })

    if (!checkResponse.ok) {
      // Don't reveal if email exists for security
      return NextResponse.json({
        success: true,
        message: "If an account with that email exists, we've sent password reset instructions.",
      })
    }

    const users = await checkResponse.json()

    if (!users || users.length === 0) {
      // Don't reveal if email exists for security
      return NextResponse.json({
        success: true,
        message: "If an account with that email exists, we've sent password reset instructions.",
      })
    }

    const user = users[0]

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000).toISOString() // 1 hour

    // Save reset token to database
    const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users?id=eq.${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry,
      }),
    })

    if (!updateResponse.ok) {
      console.error("[SERVER][v0] Failed to save reset token")
      return NextResponse.json({ error: "Failed to process reset request" }, { status: 500 })
    }

    // Send reset email
    await sendPasswordResetEmail(email, resetToken)

    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, we've sent password reset instructions.",
    })
  } catch (error: any) {
    console.error("[SERVER][v0] Forgot password error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
