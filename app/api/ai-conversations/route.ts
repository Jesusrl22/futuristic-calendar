import { createServiceRoleClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

function getUserIdFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
    return payload.sub || null
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServiceRoleClient()
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("sb-access-token")?.value

    if (!accessToken) {
      console.log("[v0] AI Conversations GET: No access token")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getUserIdFromToken(accessToken)
    if (!userId) {
      console.log("[v0] AI Conversations GET: Invalid token")
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(accessToken)

    if (userError || !user) {
      console.log("[v0] AI Conversations GET: User error:", userError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: conversations, error } = await supabase
      .from("ai_conversations")
      .select("id, title, created_at, updated_at, messages, mode")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(conversations || [])
  } catch (error) {
    console.error("[AI Conversations] Error fetching conversations:", error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServiceRoleClient()
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("sb-access-token")?.value

    if (!accessToken) {
      console.log("[v0] AI Conversations POST: No access token")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getUserIdFromToken(accessToken)
    if (!userId) {
      console.log("[v0] AI Conversations POST: Invalid token")
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(accessToken)

    if (userError || !user) {
      console.log("[v0] AI Conversations POST: User error:", userError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, title, messages, mode } = await req.json()

    if (!id) {
      return NextResponse.json({ error: "Conversation ID required" }, { status: 400 })
    }

    const { data: existing, error: existingError } = await supabase
      .from("ai_conversations")
      .select("id")
      .eq("id", String(id))
      .eq("user_id", user.id)
      .maybeSingle()

    if (existingError) throw existingError

    let result
    if (existing) {
      // UPDATE existing conversation
      const { data, error } = await supabase
        .from("ai_conversations")
        .update({
          title: title || "New Conversation",
          messages: messages || [],
          mode: mode || "chat",
          updated_at: new Date().toISOString(),
        })
        .eq("id", String(id))
        .eq("user_id", user.id)
        .select()
        .single()

      if (error) throw error
      result = data
    } else {
      // INSERT new conversation
      const { data, error } = await supabase
        .from("ai_conversations")
        .insert({
          id: String(id),
          user_id: user.id,
          title: title || "New Conversation",
          messages: messages || [],
          mode: mode || "chat",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      result = data
    }

    console.log("[v0] Saved conversation:", result?.id)
    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error saving conversation:", error)
    return NextResponse.json({ error: "Failed to save conversation" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createServiceRoleClient()
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("sb-access-token")?.value

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getUserIdFromToken(accessToken)
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(accessToken)

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing conversation ID" }, { status: 400 })
    }

    console.log("[v0] Deleting conversation:", id, "for user:", user.id)

    const { error } = await supabase
      .from("ai_conversations")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)

    if (error) throw error

    console.log("[v0] Conversation deleted successfully")
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Error deleting conversation:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
