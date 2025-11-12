import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    console.log("[SERVER][API] Signup request for:", email)

    const signupResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      },
      body: JSON.stringify({
        email,
        password,
        data: {
          name: name || email.split("@")[0],
        },
      }),
    })

    const signupData = await signupResponse.json()

    if (!signupResponse.ok || signupData.error) {
      console.error("[SERVER][API] Signup error:", signupData.error?.message || signupData.msg)
      return NextResponse.json(
        { error: signupData.error?.message || signupData.msg || "Signup failed" },
        { status: 400 },
      )
    }

    console.log("[SERVER][API] User created:", signupData.id)
    console.log("[SERVER][API] Session:", signupData.access_token ? "Created" : "Not created")

    if (signupData.access_token && signupData.refresh_token) {
      const cookieStore = await cookies()

      cookieStore.set("sb-access-token", signupData.access_token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      })

      cookieStore.set("sb-refresh-token", signupData.refresh_token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      })

      const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          id: signupData.user.id,
          email: signupData.user.email,
          name: name || email.split("@")[0],
          subscription_tier: "free",
          plan: "free",
          ai_credits: 10,
        }),
      })

      if (!profileResponse.ok) {
        console.error("[SERVER][API] Profile creation failed, but user created")
      } else {
        console.log("[SERVER][API] Profile created successfully")
      }

      console.log("[SERVER][API] Cookies set, redirecting to app")
      return NextResponse.json({
        success: true,
        message: "Account created successfully!",
        requiresConfirmation: false,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Account created! Please check your email to confirm your account.",
      requiresConfirmation: true,
    })
  } catch (error: any) {
    console.error("[SERVER][API] Signup error:", error.message)
    return NextResponse.json({ error: error.message || "Signup failed" }, { status: 500 })
  }
}
