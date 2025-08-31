"use client"

import { useEffect } from "react"

interface NotificationServiceProps {
  tasks: Array<{
    id: string
    text: string
    time?: string
    date: string
    completed: boolean
    notificationEnabled?: boolean
  }>
  user: any
  t: (key: string) => string
}

export function NotificationService({ tasks, user, t }: NotificationServiceProps) {
  useEffect(() => {
    // Request notification permission on mount
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    const checkNotifications = () => {
      if (!user || Notification.permission !== "granted") return

      const now = new Date()
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`

      tasks.forEach((task) => {
        if (!task.completed && task.date === today && task.time === currentTime && task.notificationEnabled) {
          new Notification(t("taskReminder"), {
            body: task.text,
            icon: "/favicon-32x32.png",
            tag: task.id,
            requireInteraction: true,
          })
        }
      })
    }

    const interval = setInterval(checkNotifications, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [tasks, user, t])

  return null // This component doesn't render anything
}
