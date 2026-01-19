import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { rateLimit } from "@/lib/redis"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const identifier = email || request.headers.get("x-forwarded-for") || "anonymous"
    const rateLimitResult = await rateLimit(identifier, "auth")

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Too many login attempts",
          message: "Please try again later",
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
        },
        { status: 429 },
      )
    }

    console.log("[SERVER][API] Login request for:", email)

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

    const loginData = await loginResponse.json()

    if (!loginResponse.ok || loginData.error) {
      console.error("[SERVER][API] Login error:", loginData.error?.message || loginData.error_description)
      return NextResponse.json(
        { error: loginData.error_description || loginData.error?.message || "Invalid credentials" },
        { status: 400 },
      )
    }

    console.log("[SERVER][API] Login successful for user:", loginData.user.id)

    // Check if email is confirmed
    if (!loginData.user.email_confirmed_at) {
      console.log("[SERVER][API] Email not confirmed for user:", loginData.user.email)
      return NextResponse.json(
        { 
          error: "Email not verified", 
          message: "Please confirm your email address before logging in. Check your inbox for the confirmation link." 
        },
        { status: 403 },
      )
    }

    const profileCheckResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users?id=eq.${loginData.user.id}&select=id`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        },
      },
    )

    const profiles = await profileCheckResponse.json()

    if (!profiles || profiles.length === 0) {
      console.log("[SERVER][API] Profile not found, creating...")

      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          id: loginData.user.id,
          email: loginData.user.email,
          name: loginData.user.user_metadata?.name || loginData.user.email.split("@")[0],
          subscription_tier: "free",
          subscription_plan: "free",
          plan: "free",
          ai_credits_monthly: 0,
          ai_credits_purchased: 0,
        }),
      })

      console.log("[SERVER][API] Profile created")
    }

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

    console.log("[SERVER][API] Cookies set successfully")

    return NextResponse.json({ success: true, user: loginData.user })
  } catch (error: any) {
    console.error("[SERVER][API] Login exception:", error.message)
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 500 })
  }
}
