import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    console.log("[SERVER][API] Signup request for:", email)

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Sign up user normally
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

    // Create user profile using service role to bypass RLS
    const adminSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const { error: profileError } = await adminSupabase.from("users").insert({
      id: authData.user.id,
      email,
      name: name || email.split("@")[0],
      subscription_tier: "free",
      plan: "free",
      ai_credits: 10,
    })

    if (profileError) {
      console.error("[SERVER][API] Profile creation error:", profileError.message)
      // Don't fail the whole signup if profile creation fails
      // User can still login and we'll create profile on first login
    } else {
      console.log("[SERVER][API] Profile created successfully")
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully. Please check your email to confirm your account.",
    })
  } catch (error: any) {
    console.error("[SERVER][API] Signup error:", error.message)
    return NextResponse.json({ error: error.message || "Signup failed" }, { status: 500 })
  }
}
