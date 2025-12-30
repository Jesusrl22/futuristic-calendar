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

    // Get all conversations for this user
    const { data: conversations, error } = await supabase
      .from("ai_conversations")
      .select("id, title, created_at, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("[AI Conversations] Error fetching conversations:", error)
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
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

    const { title, messages } = await req.json()

    // Create new conversation
    const { data: conversation, error } = await supabase
      .from("ai_conversations")
      .insert({
        user_id: user.id,
        title: title || "New Conversation",
        messages: messages || [],
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ conversation })
  } catch (error) {
    console.error("[AI Conversations] Error creating conversation:", error)
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
  }
}
