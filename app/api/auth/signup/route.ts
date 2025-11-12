import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    console.log("[SERVER][API] Signup request for:", email)

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split("@")[0],
        },
      },
    })

    if (authError) {
      console.error("[SERVER][API] Auth error:", authError.message)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      console.error("[SERVER][API] No user data returned")
      return NextResponse.json({ error: "Failed to create user" }, { status: 400 })
    }

    console.log("[SERVER][API] User created:", authData.user.id)
    console.log("[SERVER][API] Session:", authData.session ? "Created" : "Not created (email confirmation required)")

    // If email confirmation is disabled, we'll have a session
    if (authData.session) {
      // Set cookies for immediate login
      const cookieStore = await cookies()
      cookieStore.set("sb-access-token", authData.session.access_token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
      cookieStore.set("sb-refresh-token", authData.session.refresh_token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })

      console.log("[SERVER][API] Cookies set, user can login immediately")
    }

    return NextResponse.json({
      success: true,
      message: authData.session
        ? "Account created successfully! Redirecting..."
        : "Account created! Please check your email to confirm your account.",
      requiresConfirmation: !authData.session,
    })
  } catch (error: any) {
    console.error("[SERVER][API] Signup error:", error)
    return NextResponse.json({ error: error.message || "Signup failed" }, { status: 500 })
  }
}
