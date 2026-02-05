import { NextResponse } from "next/server"
import { cookies } from "next/headers"

function getUserIdFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
    return payload.sub || null
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("sb-access-token")?.value

    if (!accessToken) {
      console.log("[v0] Tasks GET: No access token")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getUserIdFromToken(accessToken)
    if (!userId) {
      console.log("[v0] Tasks GET: Invalid token")
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    console.log("[v0] Tasks GET: Fetching tasks for user:", userId)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/tasks?user_id=eq.${userId}&order=display_order.asc,created_at.desc`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    if (!response.ok) {
      console.log("[v0] Tasks GET: Supabase error:", response.status)
    }

    const tasks = await response.json()
    console.log("[v0] Tasks GET: Retrieved", Array.isArray(tasks) ? tasks.length : 'unknown', "tasks")
    return NextResponse.json({ tasks })
  } catch (error: any) {
    console.error("[v0] Tasks GET error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
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

    const taskData = {
      ...body,
      user_id: userId,
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${accessToken}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(taskData),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("[v0] Task creation failed:", { status: response.status, error })
      return NextResponse.json({ error: error.message || "Failed to create task" }, { status: response.status })
    }

    const task = await response.json()
    console.log("[v0] Task created successfully:", task)
    
    // Send push notification for new task
    try {
      const taskData = Array.isArray(task) ? task[0] : task
      const protocol = request.headers.get("x-forwarded-proto") || "https"
      const host = request.headers.get("host")
      
      console.log("[v0] Attempting to send notification for new task:", taskData.id)
      const notifResponse = await fetch(`${protocol}://${host}/api/notifications/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          title: "Nueva tarea creada",
          body: taskData.title || "Tienes una nueva tarea",
          taskId: taskData.id,
          type: "task",
          url: "/app/tasks",
        }),
      })
      const notifResult = await notifResponse.json()
      console.log("[v0] Push notification response:", notifResult)
    } catch (notifError) {
      console.error("[v0] Failed to send notification:", notifError)
    }
    
    return NextResponse.json(task)
  } catch (error: any) {
    console.error("[SERVER] Task API error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("sb-access-token")?.value

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, ...updates } = await request.json()

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/tasks?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${accessToken}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(updates),
    })

    const task = await response.json()
    return NextResponse.json({ task })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("sb-access-token")?.value

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, ...updates } = await request.json()

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/tasks?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${accessToken}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("[SERVER] Task update failed:", error)
      return NextResponse.json({ error: error.message || "Failed to update task" }, { status: response.status })
    }

    const task = await response.json()
    return NextResponse.json({ task })
  } catch (error: any) {
    console.error("[SERVER] Update task error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("sb-access-token")?.value

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Task ID required" }, { status: 400 })
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/tasks?id=eq.${id}`, {
      method: "DELETE",
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("[SERVER] Task deletion failed:", error)
      return NextResponse.json({ error: error.message || "Failed to delete task" }, { status: response.status })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[SERVER] Delete task error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
