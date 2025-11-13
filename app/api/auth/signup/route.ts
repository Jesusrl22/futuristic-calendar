import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    console.log("[v0] Starting signup for:", email, "with name:", name)

    // Create user in Supabase Auth with name in metadata
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
          name: name || email.split("@")[0],
        },
      }),
    })

    const signupData = await signupResponse.json()

    if (!signupResponse.ok) {
      console.error("[v0] Signup failed:", signupData)
      const errorMsg = signupData.msg || signupData.message || signupData.error || "Failed to create account"
      return NextResponse.json({ error: errorMsg }, { status: signupResponse.status })
    }

    console.log("[v0] User created successfully with ID:", signupData.id)

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
