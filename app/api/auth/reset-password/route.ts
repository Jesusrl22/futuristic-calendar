import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Supabase uses access_token in the hash fragment, but we're using a custom token system
    // First verify the token exists and is valid
    const { data: users, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("reset_token", token)
      .single()

    if (fetchError || !users) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
    }

    // Check if token is expired
    if (users.reset_token_expiry && new Date(users.reset_token_expiry) < new Date()) {
      return NextResponse.json({ error: "Reset token has expired" }, { status: 400 })
    }

    // Update password using Supabase Admin API
    const { error: updateError } = await supabase.auth.admin.updateUserById(users.id, {
      password: password,
    })

    if (updateError) {
      console.error("[SERVER] Failed to update password:", updateError)
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
    }

    // Clear reset token
    await supabase.from("users").update({ reset_token: null, reset_token_expiry: null }).eq("id", users.id)

    console.log("[SERVER] Password reset successful")

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
    })
  } catch (error: any) {
    console.error("[SERVER] Reset password error:", error)
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
  }
}
