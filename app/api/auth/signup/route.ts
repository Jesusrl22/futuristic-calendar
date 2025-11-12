import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    console.log("[API] Signup request for:", email)

    // Create Supabase client with service role key to bypass email confirmation
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Create user with email confirmed
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for development
    })

    if (authError) {
      console.error("[API] Auth error:", authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    console.log("[API] User created in auth:", authData.user?.id)

    // Create user profile in users table
    const { error: profileError } = await supabase.from("users").insert({
      id: authData.user!.id,
      email,
      name: name || email.split("@")[0],
      subscription_tier: "free",
      ai_credits: 10,
    })

    if (profileError) {
      console.error("[API] Profile error:", profileError)
      // User exists in auth but not in users table - not critical
    }

    console.log("[API] Signup successful!")

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[API] Signup error:", error)
    return NextResponse.json({ error: error.message || "Signup failed" }, { status: 500 })
  }
}
