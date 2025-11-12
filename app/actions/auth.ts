"use server"

import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" }
  }

  console.log("[v0] Starting signup for:", email)

  const supabase = createAdminClient()

  try {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    console.log("[v0] Auth signup response:", { userId: authData?.user?.id, error: authError?.message })

    if (authError) throw authError
    if (!authData.user) throw new Error("Failed to create user")

    const { error: profileError } = await supabase.from("users").insert({
      id: authData.user.id,
      email: authData.user.email,
      subscription_tier: "free",
      ai_credits: 10,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (profileError) {
      console.error("[v0] Profile creation error:", profileError)
      throw new Error(`Database error creating user profile: ${profileError.message}`)
    }

    console.log("[v0] User created successfully")
    return { success: true, message: "Account created successfully! Please sign in." }
  } catch (err: any) {
    console.error("[v0] Signup error:", err)
    return { error: err.message || "Database error creating new user" }
  }
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  console.log("[v0] Attempting login for:", email)

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    if (!data.session) throw new Error("Failed to create session")

    console.log("[v0] Login successful, setting cookies")

    const cookieStore = await cookies()

    cookieStore.set("sb-access-token", data.session.access_token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    cookieStore.set("sb-refresh-token", data.session.refresh_token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    console.log("[v0] Cookies set successfully")
    return { success: true }
  } catch (err: any) {
    console.error("[v0] Login error:", err)
    return { error: err.message || "Invalid credentials" }
  }
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete("sb-access-token")
  cookieStore.delete("sb-refresh-token")
  return { success: true }
}
