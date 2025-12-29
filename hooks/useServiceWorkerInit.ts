"use client"

import { useEffect } from "react"
import { registerServiceWorker } from "@/lib/notifications"

export function useServiceWorkerInit() {
  useEffect(() => {
    // Register service worker on mount
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      registerServiceWorker().catch((error) => {
        console.error("[v0] Failed to register service worker:", error)
      })

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data.type === "NOTIFICATION_CLICK") {
          console.log("[v0] Notification clicked:", event.data)
          // Handle notification click in your app
        }
      })
    }
  }, [])
}
