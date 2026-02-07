import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error("[v0] Unauthorized cron request")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Checking for upcoming events...")

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get events happening in the next 30 minutes
    const now = new Date()
    const thirtyMinutesLater = new Date(now.getTime() + 30 * 60 * 1000)

    const { data: events, error: eventsError } = await supabase
      .from("calendar_events")
      .select("*, user_id")
      .gte("due_date", now.toISOString())
      .lte("due_date", thirtyMinutesLater.toISOString())
      .eq("completed", false)

    if (eventsError) {
      console.error("[v0] Error fetching events:", eventsError)
      return NextResponse.json({ error: eventsError.message }, { status: 500 })
    }

    console.log("[v0] Found", events?.length || 0, "upcoming events")

    if (!events || events.length === 0) {
      return NextResponse.json({ success: true, notifications: 0 })
    }

    // Get notifications that have already been sent
    const { data: sentNotifications, error: sentError } = await supabase
      .from("sent_notifications")
      .select("event_id")
      .in("event_id", events.map((e) => e.id))

    if (sentError) {
      console.error("[v0] Error fetching sent notifications:", sentError)
    }

    const sentEventIds = new Set(sentNotifications?.map((n) => n.event_id) || [])

    let notificationsSent = 0

    // Send notifications for events that haven't been notified yet
    for (const event of events) {
      if (sentEventIds.has(event.id)) {
        console.log("[v0] Already sent notification for event:", event.id)
        continue
      }

      try {
        const minutesUntilEvent = Math.floor((new Date(event.due_date).getTime() - now.getTime()) / (1000 * 60))
        
        // Send notification
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: event.user_id,
            title: "Evento próximo",
            body: `${event.title} en ${minutesUntilEvent} minutos`,
            type: "reminder",
            url: "/app/calendar",
          }),
        })

        // Mark notification as sent
        await supabase.from("sent_notifications").insert({
          event_id: event.id,
          user_id: event.user_id,
          sent_at: new Date().toISOString(),
        })

        notificationsSent++
        console.log("[v0] Sent notification for event:", event.title)
      } catch (error) {
        console.error("[v0] Failed to send notification for event:", event.id, error)
      }
    }

    return NextResponse.json({
      success: true,
      notifications: notificationsSent,
      events: events.length,
    })
  } catch (error) {
    console.error("[v0] Cron job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
