import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

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
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Use regular signup
    const signupResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/signup`, {
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

    const signupData = await signupResponse.json()

    if (!signupResponse.ok || signupData.error) {
      return NextResponse.json(
        { error: signupData.error?.message || signupData.msg || "Signup failed" },
        { status: 400 },
      )
    }

    const userId = signupData.user?.id

    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 400 })
    }

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
      console.error("Profile creation failed:", errorText)
      // Continue anyway - user is created in auth
    }

    // Set session cookies if access token exists
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
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully!",
      requiresConfirmation: signupData.user?.email_confirmed === false,
    })
  } catch (error: any) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: error.message || "Signup failed" }, { status: 500 })
  }
}
