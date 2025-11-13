import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    console.log("[v0] Starting signup for:", email)

    // Check if user already exists in users table
    const existingUserCheck = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users?email=eq.${email}&select=id`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        },
      },
    )

    const existingUsers = await existingUserCheck.json()
    if (existingUsers && existingUsers.length > 0) {
      console.log("[v0] User already exists in users table")
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    const signupResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          name: name || email.split("@")[0],
        },
      }),
    })

    const signupData = await signupResponse.json()
    console.log("[v0] Signup response status:", signupResponse.status)

    if (!signupResponse.ok) {
      console.error("[v0] Signup failed:", signupData)
      return NextResponse.json(
        { error: signupData.msg || signupData.error || "Failed to create account" },
        { status: signupResponse.status },
      )
    }

    const userId = signupData.id

    if (!userId) {
      console.error("[v0] No user ID in response")
      return NextResponse.json({ error: "User ID not found" }, { status: 400 })
    }

    console.log("[v0] User created with ID:", userId)

    const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        id: userId,
        email,
        name: name || email.split("@")[0],
        subscription_tier: "free",
        plan: "free",
        subscription_plan: "free",
        ai_credits: 10,
        theme: "system",
        language: "en",
      }),
    })

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text()
      console.error("[v0] Profile creation failed:", errorText)
      // Continue anyway - user is created in auth
    } else {
      console.log("[v0] Profile created successfully")
    }

    const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    if (loginResponse.ok) {
      const loginData = await loginResponse.json()

      if (loginData.access_token && loginData.refresh_token) {
        const cookieStore = await cookies()

        cookieStore.set("sb-access-token", loginData.access_token, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
        })

        cookieStore.set("sb-refresh-token", loginData.refresh_token, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30,
        })

        console.log("[v0] Auto-login successful")
      }
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully!",
    })
  } catch (error: any) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: error.message || "Signup failed" }, { status: 500 })
  }
}
