import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    console.log("[API] Login request for:", email)

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    // Sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("[API] Login error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data.session) {
      return NextResponse.json({ error: "No session created" }, { status: 400 })
    }

    console.log("[API] Login successful, setting cookies")

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

    return NextResponse.json({ success: true, user: data.user })
  } catch (error: any) {
    console.error("[API] Login error:", error)
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 500 })
  }
}
