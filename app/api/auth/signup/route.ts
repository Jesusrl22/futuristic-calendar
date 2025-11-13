import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    console.log("[SERVER][v0] Starting signup for:", email, "with name:", name)

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Step 1: Check if user already exists in auth
    const checkResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users`, {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      },
    })

    let existingUserId: string | null = null

    if (checkResponse.ok) {
      const allUsers = await checkResponse.json()
      const existingUser = allUsers.users?.find((u: any) => u.email === email)

      if (existingUser) {
        existingUserId = existingUser.id
        console.log("[SERVER][v0] User already exists in auth with ID:", existingUserId)

        const profileCheckResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users?id=eq.${existingUserId}`,
          {
            headers: {
              apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
              Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
            },
          },
        )

        if (profileCheckResponse.ok) {
          const profiles = await profileCheckResponse.json()

          if (profiles && profiles.length > 0) {
            // Profile exists, user is fully registered
            console.log("[SERVER][v0] Profile exists, user is fully registered")
            return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
          } else {
            // Profile missing, we'll create it below
            console.log("[SERVER][v0] Profile missing, will create it")
          }
        }
      }
    }

    let userId = existingUserId

    // Step 2: Create user in auth if doesn't exist
    if (!userId) {
      console.log("[SERVER][v0] Creating new user in auth...")
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
        console.error("[SERVER][v0] Signup API failed:", signupData)
        const errorMsg = signupData.msg || signupData.message || signupData.error || "Failed to create account"
        return NextResponse.json({ error: errorMsg }, { status: signupResponse.status })
      }

      userId = signupData.id
      console.log("[SERVER][v0] User created in auth with ID:", userId)
    }

    // Step 3: Create profile in users table
    console.log("[SERVER][v0] Creating user profile for ID:", userId)
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
      console.error("[SERVER][v0] Failed to create profile:", profileError)
      return NextResponse.json({ error: "Failed to create user profile. Please try again." }, { status: 500 })
    }

    console.log("[SERVER][v0] Profile created successfully")

    // Step 4: Auto-login the user
    console.log("[SERVER][v0] Attempting auto-login...")
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

        console.log("[SERVER][v0] Auto-login successful, cookies set")
      }
    } else {
      console.error("[SERVER][v0] Auto-login failed")
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully!",
    })
  } catch (error: any) {
    console.error("[SERVER][v0] Signup error:", error)
    return NextResponse.json({ error: error.message || "Signup failed" }, { status: 500 })
  }
}
