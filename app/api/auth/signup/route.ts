import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    console.log("[v0] Starting signup for:", email, "with name:", name)

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Step 1: Check if user already exists
    const checkResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        },
      },
    )

    if (checkResponse.ok) {
      const existingUsers = await checkResponse.json()
      if (existingUsers && existingUsers.users && existingUsers.users.length > 0) {
        console.log("[v0] User already exists")
        return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
      }
    }

    // Step 2: Create user in Supabase Auth
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
        email_confirm: true,
        user_metadata: {
          name: name,
        },
      }),
    })

    const signupData = await signupResponse.json()

    if (!signupResponse.ok) {
      console.error("[v0] Signup API failed:", signupData)
      // Even if it says error, the user might have been created, so we continue
      if (!signupData.id && !signupData.user?.id) {
        const errorMsg = signupData.msg || signupData.message || signupData.error || "Failed to create account"
        return NextResponse.json({ error: errorMsg }, { status: signupResponse.status })
      }
    }

    const userId = signupData.id || signupData.user?.id
    console.log("[v0] User created in auth with ID:", userId)

    // Step 3: Create profile in users table manually
    console.log("[v0] Creating user profile...")
    const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        id: userId,
        email: email,
        name: name,
        subscription_tier: "free",
        subscription_plan: "free",
        plan: "free",
        ai_credits: 10,
        theme: "dark",
        theme_preference: "dark",
        subscription_status: "active",
        billing_cycle: "monthly",
        pomodoro_work_duration: 25,
        pomodoro_break_duration: 5,
        pomodoro_long_break_duration: 15,
        pomodoro_sessions_until_long_break: 4,
        language: "es",
        is_admin: false,
      }),
    })

    if (!profileResponse.ok) {
      const profileError = await profileResponse.json()
      console.error("[v0] Failed to create profile:", profileError)
      return NextResponse.json(
        { error: "Account created but profile setup failed. Please contact support." },
        { status: 500 },
      )
    }

    const profileData = await profileResponse.json()
    console.log("[v0] Profile created successfully:", profileData)

    // Step 4: Auto-login the user
    console.log("[v0] Attempting auto-login...")
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

        console.log("[v0] Auto-login successful, cookies set")
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
