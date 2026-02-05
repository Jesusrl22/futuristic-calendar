import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import webpush from "web-push"

// Configure web-push with VAPID keys
if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.error("[v0] VAPID keys are not configured. Push notifications will not work.")
} else {
  webpush.setVapidDetails(
    "mailto:support@futuretask.app",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, body: notificationBody, taskId, type, url } = body

    console.log("[v0] Notification send request:", { userId, title, notificationBody, taskId, type, url })

    if (!userId || !title || !notificationBody) {
      console.error("[v0] Missing required fields:", { userId, title, notificationBody })
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get user session
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Handle cookie setting errors
            }
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user's push subscriptions
    console.log("[v0] Fetching subscriptions for user:", userId)
    const { data: subscriptions, error } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("user_id", userId)

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json(
        { error: "Failed to fetch subscriptions" },
        { status: 500 }
      )
    }

    console.log("[v0] Found subscriptions:", subscriptions?.length || 0)

    if (!subscriptions || subscriptions.length === 0) {
      console.warn("[v0] No active subscriptions for user:", userId)
      return NextResponse.json(
        { success: true, message: "No active subscriptions" }
      )
    }

    // Send notifications to all subscriptions
    const payload = JSON.stringify({
      title,
      body: notificationBody,
      taskId,
      type: type || "notification",
      url: url || "/app/tasks",
    })

    console.log("[v0] Sending notification payload:", payload)

    const sendPromises = subscriptions.map(async (sub) => {
      try {
        console.log("[v0] Sending to endpoint:", sub.endpoint.substring(0, 50) + "...")
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              auth: sub.auth_key,
              p256dh: sub.p256dh_key,
            },
          },
          payload
        )
        console.log("[v0] Notification sent successfully to:", sub.endpoint.substring(0, 50) + "...")
        return { success: true, endpoint: sub.endpoint }
      } catch (err) {
        console.error("[v0] Failed to send notification:", err)
        // If subscription is invalid, delete it
        if (err instanceof Error && err.message.includes("410")) {
          console.log("[v0] Deleting invalid subscription:", sub.endpoint)
          await supabase
            .from("push_subscriptions")
            .delete()
            .eq("endpoint", sub.endpoint)
        }
        return { success: false, endpoint: sub.endpoint, error: err }
      }
    })

    const results = await Promise.all(sendPromises)
    const successful = results.filter((r) => r.success).length

    console.log("[v0] Notification results:", { successful, total: subscriptions.length, results })

    return NextResponse.json({
      success: true,
      sent: successful,
      total: subscriptions.length,
    })
  } catch (error) {
    console.error("[v0] Send notifications error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
