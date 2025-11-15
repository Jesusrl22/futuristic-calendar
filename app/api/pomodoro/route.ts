import { NextResponse } from "next/server"
import { cookies } from "next/headers"

function getUserIdFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.sub || null
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  try {
    console.log("[v0] Pomodoro session save started")
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("sb-access-token")?.value

    if (!accessToken) {
      console.log("[v0] No access token found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getUserIdFromToken(accessToken)
    if (!userId) {
      console.log("[v0] Invalid token")
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    console.log("[v0] Saving pomodoro session:", { userId, duration: body.duration })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const headers = {
      apikey: process.env.SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    }

    const sessionData = {
      user_id: userId,
      duration: body.duration, // already in minutes from frontend
      completed: true,
    }
    console.log("[v0] Request data:", sessionData)
    console.log("[v0] Request URL:", `${supabaseUrl}/rest/v1/pomodoro_sessions`)

    const response = await fetch(`${supabaseUrl}/rest/v1/pomodoro_sessions`, {
      method: "POST",
      headers,
      body: JSON.stringify(sessionData),
    })

    console.log("[v0] Response status:", response.status)
    
    if (!response.ok) {
      const error = await response.text()
      console.log("[v0] Failed to save pomodoro session:", error)
      return NextResponse.json({ error: "Failed to save session", details: error }, { status: response.status })
    }

    const session = await response.json()
    console.log("[v0] Pomodoro session saved successfully:", session)

    return NextResponse.json({ success: true, session })
  } catch (error) {
    console.error("[v0] Error saving pomodoro session:", error)
    return NextResponse.json({ error: "Failed to save session", details: String(error) }, { status: 500 })
  }
}
