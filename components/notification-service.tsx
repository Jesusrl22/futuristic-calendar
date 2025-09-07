"use client"

import { useEffect } from "react"

interface Task {
  id: string
  text: string
  time?: string | null
  date: string
  completed: boolean
  notification_enabled?: boolean
}

interface User {
  id: string
  name: string
}

interface NotificationServiceProps {
  tasks: Task[]
  user: User | null
  t: (key: string) => string
}

export function NotificationService({ tasks, user, t }: NotificationServiceProps) {
  useEffect(() => {
    if (!user || !("Notification" in window)) return

    const checkNotifications = () => {
      if (Notification.permission !== "granted") return

      const now = new Date()
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`

      tasks.forEach((task) => {
        if (!task.completed && task.date === today && task.time === currentTime && task.notification_enabled) {
          try {
            const notification = new Notification(`⏰ ${t("taskReminder")}`, {
              body: task.text,
              icon: "/favicon-32x32.png",
              tag: task.id,
              requireInteraction: true,
              silent: false,
            })

            notification.onclick = () => {
              window.focus()
              notification.close()
            }

            setTimeout(() => {
              notification.close()
            }, 10000)
          } catch (error) {
            console.error("Error showing task notification:", error)
          }
        }
      })
    }

    checkNotifications()
    const interval = setInterval(checkNotifications, 60000)
    return () => clearInterval(interval)
  }, [tasks, user, t])

  return null // This component doesn't render anything
}
