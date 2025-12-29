self.addEventListener("push", (event) => {
  if (!event.data) {
    console.warn("[v0] Push event received with no data")
    return
  }

  try {
    const data = event.data.json()

    const options = {
      body: data.body || "You have a new notification",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      vibrate: [200, 100, 200],
      tag: "notification-" + (data.taskId || data.type || Date.now()),
      requireInteraction: true,
      actions: [
        {
          action: "open",
          title: "Open",
        },
        {
          action: "close",
          title: "Close",
        },
      ],
      data: {
        taskId: data.taskId,
        type: data.type || "task",
        url: data.url || "/app/tasks",
        timestamp: new Date().toISOString(),
      },
    }

    event.waitUntil(
      self.registration
        .showNotification(data.title || "Future Task", options)
        .catch((error) => console.error("[v0] Error showing notification:", error)),
    )
  } catch (error) {
    console.error("[v0] Error handling push event:", error)
  }
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  const urlToOpen = event.notification.data.url || "/app/tasks"

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // Try to focus existing window
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i]
          if (client.url.includes("/app") && "focus" in client) {
            client.postMessage({
              type: "NOTIFICATION_CLICK",
              taskId: event.notification.data.taskId,
              notificationType: event.notification.data.type,
            })
            return client.focus()
          }
        }
        // Open new window if no existing window found
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
      .catch((error) => console.error("[v0] Error handling notification click:", error)),
  )
})

self.addEventListener("notificationclose", (event) => {
  console.log("[v0] Notification closed:", event.notification.data)
})

self.addEventListener("install", (event) => {
  console.log("[v0] Service Worker installed")
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  console.log("[v0] Service Worker activated")
  event.waitUntil(clients.claim())
})
