"use client"

import { useEffect } from "react"

export function NotificationService() {
  useEffect(() => {
    // Request notification permission if not already granted
    if ("Notification" in window && Notification.permission === "default") {
      // We'll handle this in the main app component
    }
  }, [])

  return null
}
