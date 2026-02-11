import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    console.log("[SERVER][v0] Starting signup for:", email, "with name:", name)

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find((u) => u.email === email)

    if (existingUser) {
      // Check if profile exists
      const { data: profiles } = await supabase.from("users").select("*").eq("id", existingUser.id)

      if (profiles && profiles.length > 0) {
        console.log("[SERVER][v0] User already exists")
        return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
      }
    }

    let userId = existingUser?.id
    const language = "es" // Default language, can be passed from request if needed

    // Create user in auth if doesn't exist
    if (!userId) {
      console.log("[SERVER][v0] Creating new user in auth...")
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: false, // User must verify email
        user_metadata: {
          name: name,
          language: language,
        },
      })

      if (authError) {
        console.error("[SERVER][v0] Auth creation failed:", authError)
        return NextResponse.json({ error: authError.message }, { status: 400 })
      }

      userId = authData?.user?.id
      console.log("[SERVER][v0] User created with ID:", userId)

      // Send verification email using Supabase
      console.log("[SERVER][v0] Sending verification email to:", email)
      const { error: emailError } = await supabase.auth.admin.generateLink({
        type: "signup",
        email: email,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`,
        },
      })

      if (emailError) {
        console.error("[SERVER][v0] Verification email failed:", emailError)
        return NextResponse.json(
          { error: "User created but verification email failed. Please try 'Resend Verification Email'" },
          { status: 400 }
        )
      }

      console.log("[SERVER][v0] Verification email sent successfully")
    }

      userId = authData.user.id
      console.log("[SERVER][v0] User created in auth with ID:", userId)
    }

    // Create profile in users table
    console.log("[SERVER][v0] Creating user profile for ID:", userId)
    const { error: profileError } = await supabase.from("users").insert({
      id: userId,
      email: email,
      name: name,
      subscription_tier: "free",
      subscription_plan: "free",
      plan: "free",
      ai_credits_monthly: 0,
      ai_credits_purchased: 0,
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
    })

    if (profileError) {
      console.error("[SERVER][v0] Failed to create profile:", profileError)
      return NextResponse.json({ error: "Failed to create user profile. Please try again." }, { status: 500 })
    }

    console.log("[SERVER][v0] Profile created successfully")

    // Send verification email using Supabase
    console.log("[SERVER][v0] Sending verification email...")
    try {
      const { error: emailError } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`,
        },
      })

      if (emailError) {
        console.warn("[SERVER][v0] Failed to send verification email:", emailError.message)
      } else {
        console.log("[SERVER][v0] Verification email sent successfully")
      }
    } catch (emailError: any) {
      console.warn("[SERVER][v0] Failed to send verification email:", emailError.message)
    }

    // Try to send welcome email as well (optional)
    try {
      const { sendWelcomeEmail } = await import("@/lib/email")
      await sendWelcomeEmail(email, name)
      console.log("[SERVER][v0] Welcome email sent successfully")
    } catch (emailError: any) {
      console.warn("[SERVER][v0] Failed to send welcome email:", emailError.message)
    }

    // Do NOT auto-login - user must verify email first
    console.log("[SERVER][v0] User created, verification email sent. User must verify to login.")

    return NextResponse.json({
      success: true,
      message: "Account created! Please check your email to verify your account.",
    })
  } catch (error: any) {
    console.error("[SERVER][v0] Signup error:", error)
    return NextResponse.json({ error: error.message || "Signup failed" }, { status: 500 })
  }
}
