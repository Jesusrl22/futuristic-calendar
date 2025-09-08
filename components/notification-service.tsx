"use client"

import { useEffect } from "react"

interface NotificationServiceProps {
  tasks?: any[]
  user?: any
  t?: (key: string) => string
}

export function NotificationService({ tasks = [], user, t = (key) => key }: NotificationServiceProps) {
  useEffect(() => {
    // Check for task notifications every minute
    const interval = setInterval(() => {
      if (!tasks || !user || !("Notification" in window) || Notification.permission !== "granted") {
        return
      }

      const now = new Date()
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`

      // Find tasks that should trigger notifications
      const tasksToNotify = tasks.filter(
        (task) => task.date === today && task.time === currentTime && !task.completed && task.notification_enabled,
      )

      tasksToNotify.forEach((task) => {
        try {
          new Notification(`⏰ ${t("taskReminder")}`, {
            body: task.text,
            icon: "/favicon-32x32.png",
            tag: `task-${task.id}`, // Prevent duplicate notifications
          })
        } catch (error) {
          console.error("Error showing notification:", error)
        }
      })
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [tasks, user, t])

  return null // This component doesn't render anything
}
