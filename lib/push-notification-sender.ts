// Server-side function to send push notifications
import webpush from "web-push"

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

export interface SendNotificationParams {
  title: string
  body: string
  taskId?: string
  type: "task" | "achievement" | "event" | "reminder"
  url?: string
}

export async function sendPushNotificationToUser(
  subscriptions: Array<{ endpoint: string; p256dh: string; auth: string }>,
  payload: SendNotificationParams,
) {
  const promises = subscriptions.map((sub) => {
    const pushSubscription = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.p256dh,
        auth: sub.auth,
      },
    }

    return webpush
      .sendNotification(
        pushSubscription,
        JSON.stringify({
          title: payload.title,
          body: payload.body,
          type: payload.type,
          taskId: payload.taskId,
          url: payload.url || "/app/tasks",
        }),
      )
      .catch((error) => {
        console.error("[v0] Push notification error:", error)
      })
  })

  return Promise.allSettled(promises)
}
