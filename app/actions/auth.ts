"use server"

import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
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
      email_confirm: true, // Auto-confirm email
    })

    console.log("[v0] Auth signup response:", {
      user: authData?.user?.id,
      error: authError?.message,
    })

    if (authError) {
      console.error("[v0] Signup auth error:", authError)
      return { error: authError.message }
    }

    if (!authData.user) {
      return { error: "Failed to create user" }
    }

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
      // User was created but profile failed - they can still login
    } else {
      console.log("[v0] User profile created successfully")
    }

    return {
      success: true,
      message: "Account created successfully! Please sign in.",
    }
  } catch (err) {
    console.error("[v0] Unexpected signup error:", err)
    return { error: "An unexpected error occurred during signup" }
  }
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  console.log("[v0] Starting login for:", email)

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  console.log("[v0] Login response:", {
    session: !!data.session,
    error: error?.message,
  })

  if (error) {
    console.error("[v0] Login error:", error)
    return { error: error.message }
  }

  if (!data.session) {
    return { error: "Failed to create session" }
  }

  const cookieStore = await cookies()
  cookieStore.set("sb-access-token", data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  cookieStore.set("sb-refresh-token", data.session.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  console.log("[v0] Login successful, redirecting to app")
  redirect("/app")
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete("sb-access-token")
  cookieStore.delete("sb-refresh-token")
  redirect("/login")
}
