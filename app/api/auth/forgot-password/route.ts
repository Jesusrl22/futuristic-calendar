import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendPasswordResetEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    console.log("[SERVER][v0] Forgot password request for:", email)

    // Create Supabase client with admin privileges to generate token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Try to find user with this email
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers()
    
    const user = userData?.users.find(u => u.email?.toLowerCase() === email.toLowerCase())

    if (!user) {
      console.log("[SERVER][v0] User not found for email:", email)
      // Don't reveal if email exists for security - return success anyway
      return NextResponse.json({
        success: true,
        message: "If an account with that email exists, we've sent password reset instructions.",
      })
    }

    console.log("[SERVER][v0] Found user for password reset:", user.id)

    // Generate password reset link using Supabase
    const { data: resetData, error: resetError } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email: email.toLowerCase(),
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`,
      },
    })

    if (resetError) {
      console.error("[SERVER][v0] Error generating reset link:", resetError)
      return NextResponse.json({
        success: true,
        message: "If an account with that email exists, we've sent password reset instructions.",
      })
    }

    const resetLink = resetData?.properties?.action_link

    if (!resetLink) {
      console.error("[SERVER][v0] No reset link generated")
      return NextResponse.json({
        success: true,
        message: "If an account with that email exists, we've sent password reset instructions.",
      })
    }

    // Send password reset email using our custom email function
    console.log("[SERVER][v0] Sending password reset email to:", email)
    try {
      await sendPasswordResetEmail(
        email,
        resetLink,
        user.user_metadata?.name || email.split("@")[0]
      )
      console.log("[SERVER][v0] Password reset email sent successfully")
    } catch (emailError: any) {
      console.error("[SERVER][v0] Failed to send password reset email:", emailError.message)
      // Still return success to not reveal if email exists
    }

    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, we've sent password reset instructions.",
    })
  } catch (error: any) {
    console.error("[SERVER][v0] Forgot password error:", error.message)
    // Always return success for security
    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, we've sent password reset instructions.",
    })
  }
}
