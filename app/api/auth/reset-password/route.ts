import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    console.log("[SERVER][v0] Password reset attempt with token")

    // Find user with this token
    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users?reset_token=eq.${token}`, {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      },
    })

    if (!userResponse.ok) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
    }

    const users = await userResponse.json()

    if (!users || users.length === 0) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
    }

    const user = users[0]

    // Check if token is expired
    if (new Date(user.reset_token_expiry) < new Date()) {
      return NextResponse.json({ error: "Reset token has expired" }, { status: 400 })
    }

    // Update password using Supabase Admin API
    const updatePasswordResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users/${user.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        },
        body: JSON.stringify({
          password: password,
        }),
      },
    )

    if (!updatePasswordResponse.ok) {
      const errorData = await updatePasswordResponse.json()
      console.error("[SERVER][v0] Failed to update password:", errorData)
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
    }

    // Clear reset token
    await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users?id=eq.${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        reset_token: null,
        reset_token_expiry: null,
      }),
    })

    console.log("[SERVER][v0] Password reset successful")

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
    })
  } catch (error: any) {
    console.error("[SERVER][v0] Reset password error:", error)
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
  }
}
