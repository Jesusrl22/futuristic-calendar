import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret from Vercel (only required for automated cron jobs)
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET
    const userAgent = request.headers.get("user-agent") || ""
    
    // Check if this is a Vercel cron request (has user-agent starting with "vercel")
    const isVercelCron = userAgent.toLowerCase().includes("vercel")
    
    console.log("[v0] CRON request received")
    console.log("[v0] Is Vercel cron:", isVercelCron)
    console.log("[v0] CRON_SECRET configured:", !!cronSecret)
    console.log("[v0] Authorization header present:", !!authHeader)

    // Only require CRON_SECRET for actual Vercel cron requests
    if (isVercelCron && cronSecret) {
      if (authHeader !== `Bearer ${cronSecret}`) {
        console.error("[v0] Invalid or missing CRON_SECRET for Vercel cron")
        return NextResponse.json({ error: "Unauthorized - Invalid CRON_SECRET" }, { status: 401 })
      }
      console.log("[v0] CRON_SECRET validated successfully")
    } else if (!isVercelCron) {
      console.log("[v0] Client-side polling - no CRON_SECRET required")
    }

    console.log("[v0] Checking for upcoming events...")

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
      // Check if it's a rate limiting error
      const errorMessage = typeof eventsError === 'object' 
        ? JSON.stringify(eventsError).toLowerCase()
        : String(eventsError).toLowerCase()
      
      if (errorMessage.includes("429") || errorMessage.includes("too many")) {
        console.warn("[v0] Rate limited fetching events, returning empty list")
        return NextResponse.json({ 
          success: true, 
          notifications: 0, 
          checked: true,
          message: "Rate limited - will retry later",
          rateLimit: true
        }, { status: 429, headers: { "Retry-After": "60" } })
      }
      
      console.error("[v0] Error fetching events:", eventsError)
      return NextResponse.json({ error: String(eventsError) }, { status: 500 })
    }

    console.log("[v0] Found", events?.length || 0, "upcoming events")

    if (!events || events.length === 0) {
      return NextResponse.json({ 
        success: true, 
        notifications: 0, 
        checked: true,
        message: "No upcoming events found"
      })
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
            eventId: event.id,
            url: "/app/calendar",
          }),
        })

        if (!response.ok) {
          const error = await response.text()
          console.error("[v0] Notification send failed for event", event.id, ":", error)
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
            console.log("[v0] Successfully sent notification for event:", event.title)
          }
        }
      } catch (error) {
        console.error("[v0] Failed to send notification for event:", event.id, error)
        failedNotifications.push(event.id)
      }
    }

    const result = {
      success: true,
      notifications: notificationsSent,
      failed: failedNotifications.length,
      events: events.length,
      checked: true,
      timestamp: new Date().toISOString(),
    }

    console.log("[v0] CRON job completed:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Cron job error:", error)
    return NextResponse.json({ 
      error: "Cron job failed", 
      checked: false,
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

    console.log("[v0] Found", events?.length || 0, "upcoming events")

    if (!events || events.length === 0) {
      return NextResponse.json({ 
        success: true, 
        notifications: 0, 
        checked: true,
        message: "No upcoming events found"
      })
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
            eventId: event.id,
            url: "/app/calendar",
          }),
        })

        if (!response.ok) {
          const error = await response.text()
          console.error("[v0] Notification send failed for event", event.id, ":", error)
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
            console.log("[v0] Successfully sent notification for event:", event.title)
          }
        }
      } catch (error) {
        console.error("[v0] Failed to send notification for event:", event.id, error)
        failedNotifications.push(event.id)
      }
    }

    const result = {
      success: true,
      notifications: notificationsSent,
      failed: failedNotifications.length,
      events: events.length,
      checked: true,
      timestamp: new Date().toISOString(),
    }

    console.log("[v0] CRON job completed:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Cron job error:", error)
    return NextResponse.json({ 
      error: "Cron job failed", 
      checked: false,
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

// Also allow POST for client-side polling
export async function POST(request: NextRequest) {
  return GET(request)
}
