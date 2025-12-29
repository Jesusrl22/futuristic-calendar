import { sendPushNotificationToUser } from "@/lib/push-notification-sender"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { title, body, type = "reminder" } = await request.json()

    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    })

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: subscriptions, error } = await supabase
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth")
      .eq("user_id", user.id)

    if (error || !subscriptions || subscriptions.length === 0) {
      return Response.json(
        {
          error: "No push subscriptions found",
          message: "User has not enabled push notifications",
        },
        { status: 404 },
      )
    }

    await sendPushNotificationToUser(subscriptions, {
      title,
      body,
      type,
      url: "/app/calendar",
    })

    return Response.json({
      success: true,
      message: "Push notification sent successfully",
    })
  } catch (error) {
    console.error("[v0] Error sending push notification:", error)
    return Response.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
