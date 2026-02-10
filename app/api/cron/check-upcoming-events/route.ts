import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  try {
    // Allow both authorized cron requests and public polling from clients
    const authHeader = request.headers.get("authorization")
    const isCronRequest = authHeader === `Bearer ${process.env.CRON_SECRET}`
    
    console.log("[v0] Checking for upcoming events...", { isCronRequest })

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get events happening in the next 15 minutes
    const now = new Date()
    const fifteenMinutesLater = new Date(now.getTime() + 15 * 60 * 1000)
    const startISO = now.toISOString()
    const endISO = fifteenMinutesLater.toISOString()

    console.log("[v0] Checking events between:", startISO, "and", endISO)

    const { data: events, error: eventsError } = await supabase
      .from("calendar_events")
      .select("id, title, due_date, user_id, completed")
      .gte("due_date", startISO)
      .lte("due_date", endISO)
      .eq("completed", false)

    if (eventsError) {
      console.error("[v0] Error fetching events:", eventsError)
      return NextResponse.json({ error: eventsError.message }, { status: 500 })
    }

    console.log("[v0] Found", events?.length || 0, "upcoming events")

    if (!events || events.length === 0) {
      return NextResponse.json({ success: true, notifications: 0, checked: true })
    }

    // Get notifications that have already been sent (within last 30 minutes to avoid duplicates)
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000).toISOString()
    
    const { data: sentNotifications, error: sentError } = await supabase
      .from("sent_notifications")
      .select("event_id")
      .in("event_id", events.map((e) => e.id))
      .gte("sent_at", thirtyMinutesAgo)

    if (sentError) {
      console.error("[v0] Error fetching sent notifications:", sentError)
    }

    const sentEventIds = new Set(sentNotifications?.map((n) => n.event_id) || [])

    let notificationsSent = 0
    const failedNotifications = []

    // Send notifications for events that haven't been notified yet
    for (const event of events) {
      if (sentEventIds.has(event.id)) {
        console.log("[v0] Already sent notification for event:", event.id)
        continue
      }

      try {
        const minutesUntilEvent = Math.floor((new Date(event.due_date).getTime() - now.getTime()) / (1000 * 60))
        
        console.log("[v0] Sending notification for event:", event.title, "User:", event.user_id)
        
        // Send notification via the notifications API
        const notifUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        const response = await fetch(`${notifUrl}/api/notifications/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: event.user_id,
            title: "📅 Evento próximo",
            body: `${event.title} en ${minutesUntilEvent} minuto${minutesUntilEvent !== 1 ? "s" : ""}`,
            type: "reminder",
            url: "/app/calendar",
          }),
        })

        if (!response.ok) {
          const error = await response.text()
          console.error("[v0] Notification send failed:", error)
          failedNotifications.push(event.id)
        } else {
          // Mark notification as sent
          const { error: insertError } = await supabase.from("sent_notifications").insert({
            event_id: event.id,
            user_id: event.user_id,
            sent_at: new Date().toISOString(),
          })

          if (insertError) {
            console.error("[v0] Failed to mark notification as sent:", insertError)
          } else {
            notificationsSent++
            console.log("[v0] Sent notification for event:", event.title)
          }
        }
      } catch (error) {
        console.error("[v0] Failed to send notification for event:", event.id, error)
        failedNotifications.push(event.id)
      }
    }

    return NextResponse.json({
      success: true,
      notifications: notificationsSent,
      failed: failedNotifications.length,
      events: events.length,
      checked: true,
    })
  } catch (error) {
    console.error("[v0] Cron job error:", error)
    return NextResponse.json({ error: "Cron job failed", checked: false }, { status: 500 })
  }
}

// Also allow POST for client-side polling
export async function POST(request: NextRequest) {
  // Redirect to GET
  return GET(request)
}
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
