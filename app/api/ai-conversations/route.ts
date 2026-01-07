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
      .select("id, title, created_at, updated_at, messages")
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

    const { id, title, messages } = await req.json()

    if (!id) {
      return NextResponse.json({ error: "Conversation ID required" }, { status: 400 })
    }

    const { data: conversation, error } = await supabase
      .from("ai_conversations")
      .upsert(
        {
          id: String(id), // Ensure ID is string
          user_id: user.id,
          title: title || "New Conversation",
          messages: messages || [],
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id,user_id" }, // Check both columns to avoid conflicts
      )
      .select()
      .single()

    if (error) {
      console.error("[AI Conversations] Upsert error:", error)
      throw error
    }

    console.log("[AI Conversations] Saved conversation:", conversation?.id)
    return NextResponse.json(conversation)
  } catch (error) {
    console.error("[AI Conversations] Error saving conversation:", error)
    return NextResponse.json({ error: "Failed to save conversation" }, { status: 500 })
  }
}
