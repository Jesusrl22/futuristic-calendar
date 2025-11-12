import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    console.log("[SERVER][API] Login request for:", email)

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("[SERVER][API] Login error:", error.message)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data.session) {
      console.error("[SERVER][API] No session created")
      return NextResponse.json({ error: "No session created" }, { status: 400 })
    }

    console.log("[SERVER][API] Login successful for user:", data.user.id)

    const adminSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const { data: profile, error: profileCheckError } = await adminSupabase
      .from("users")
      .select("id")
      .eq("id", data.user.id)
      .single()

    if (profileCheckError && profileCheckError.code === "PGRST116") {
      // Profile doesn't exist, create it
      console.log("[SERVER][API] Profile not found, creating...")

      const { error: createError } = await adminSupabase.from("users").insert({
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name || data.user.email!.split("@")[0],
        subscription_tier: "free",
        plan: "free",
        ai_credits: 10,
      })

      if (createError) {
        console.error("[SERVER][API] Error creating profile:", createError.message)
      } else {
        console.log("[SERVER][API] Profile created successfully")
      }
    } else if (profile) {
      console.log("[SERVER][API] Profile exists")
    }

    // Set cookies for session persistence
    const cookieStore = await cookies()

    cookieStore.set("sb-access-token", data.session.access_token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    cookieStore.set("sb-refresh-token", data.session.refresh_token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    console.log("[SERVER][API] Cookies set successfully")

    return NextResponse.json({ success: true, user: data.user })
  } catch (error: any) {
    console.error("[SERVER][API] Login error:", error.message)
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 500 })
  }
}
