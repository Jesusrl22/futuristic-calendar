import { createServiceRoleClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServiceRoleClient()
    const authHeader = req.headers.get("Authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token)

    if (userError || !user) {
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
    const authHeader = req.headers.get("Authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token)

    if (userError || !user) {
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
