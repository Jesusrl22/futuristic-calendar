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
      // Si no hay usuario autenticado en servidor, es una llamada desde cliente
      // En este caso solo enviamos notificación del navegador
      return Response.json({
        success: true,
        message: "Notification will be sent from browser",
      })
    }

    // Obtener suscripciones push del usuario
    const { data: subscriptions, error } = await supabase
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth")
      .eq("user_id", user.id)

    if (error) {
      console.error("[v0] Error fetching subscriptions:", error)
    }

    // Enviar push notification si tiene suscripciones
    if (subscriptions && subscriptions.length > 0) {
      await sendPushNotificationToUser(subscriptions, {
        title,
        body,
        type,
        url: "/app/calendar",
      })
    }

    // También mostrar notificación del navegador como fallback
    if (typeof window !== "undefined" && Notification.permission === "granted") {
      new Notification(title, {
        body: body,
        icon: "/icon-192x192.png",
        tag: "task-reminder",
        requireInteraction: true,
      })
    }

    return Response.json({
      success: true,
      message: "Notification sent successfully",
    })
  } catch (error) {
    console.error("[v0] Error sending notification:", error)
    return Response.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
