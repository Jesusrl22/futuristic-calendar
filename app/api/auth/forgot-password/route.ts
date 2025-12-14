import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const redirectUrl =
      process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "https://future-task.com"

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${redirectUrl}/reset-password`,
    })

    if (error) {
      console.error("[SERVER] Password reset error:", error)
    }

    // Always return success for security (don't reveal if email exists)
    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, we've sent password reset instructions.",
    })
  } catch (error: any) {
    console.error("[SERVER] Forgot password error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
