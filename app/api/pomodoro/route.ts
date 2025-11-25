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
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("sb-access-token")?.value

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getUserIdFromToken(accessToken)
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const headers = {
      apikey: process.env.SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    }

    const sessionData = {
      user_id: userId,
      duration: body.duration,
      completed: true,
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/pomodoro_sessions`, {
      method: "POST",
      headers,
      body: JSON.stringify(sessionData),
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json({ error: "Failed to save session", details: error }, { status: response.status })
    }

    const session = await response.json()

    return NextResponse.json({ success: true, session })
  } catch (error) {
    console.error("Error saving pomodoro session:", error)
    return NextResponse.json({ error: "Failed to save session", details: String(error) }, { status: 500 })
  }
}
