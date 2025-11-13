import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    const checkUserResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=id`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        },
      },
    )

    const existingUsers = await checkUserResponse.json()
    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json({ error: "User already exists. Please login instead." }, { status: 400 })
    }

    const adminSignupResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users`, {
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

    const adminSignupData = await adminSignupResponse.json()

    if (!adminSignupResponse.ok || adminSignupData.error) {
      return NextResponse.json(
        { error: adminSignupData.error?.message || adminSignupData.msg || "Signup failed" },
        { status: 400 },
      )
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
        id: adminSignupData.id,
        email: adminSignupData.email,
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
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully!",
      requiresConfirmation: false,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Signup failed" }, { status: 500 })
  }
}
