"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell, X, CheckCircle, AlertCircle, Info } from "lucide-react"

declare global {
  interface Window {
    FutureTaskNotifications: {
      showSuccess: (title: string, message: string) => void
      showError: (title: string, message: string) => void
      showTaskReminder: (taskTitle: string, time: string) => void
      showPomodoroNotification: (type: "work" | "break" | "longBreak", duration: number) => void
      showAchievement: (title: string, description: string) => void
      showSubscriptionNotification: (type: "expiring" | "expired" | "renewed", daysLeft?: number) => void
    }
  }
}

interface Notification {
  id: string
  type: "success" | "error" | "info" | "warning"
  title: string
  message: string
  timestamp: Date
  read: boolean
}

interface NotificationServiceProps {
  children: React.ReactNode
}

export function NotificationService({ children }: NotificationServiceProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>("default")

  useEffect(() => {
    // Request notification permission
    if ("Notification" in window) {
      setPermission(Notification.permission)

      if (Notification.permission === "default") {
        Notification.requestPermission().then((result) => {
          setPermission(result)
        })
      }
    }

    // Add some demo notifications
    const demoNotifications: Notification[] = [
      {
        id: "1",
        type: "success",
        title: "¡Bienvenido!",
        message: "Tu cuenta ha sido configurada correctamente",
        timestamp: new Date(),
        read: false,
      },
      {
        id: "2",
        type: "info",
        title: "Recordatorio",
        message: "Tienes 3 tareas pendientes para hoy",
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        read: false,
      },
    ]

    setNotifications(demoNotifications)

    // Show browser notification for demo
    if (permission === "granted") {
      setTimeout(() => {
        new Notification("FutureTask", {
          body: "¡Bienvenido a tu calendario inteligente!",
          icon: "/favicon.png",
        })
      }, 2000)
    }

    // Create global notification API
    window.FutureTaskNotifications = {
      showSuccess: (title: string, message: string) => {
        addNotification({ type: "success", title, message })
      },

      showError: (title: string, message: string) => {
        addNotification({ type: "error", title, message })
      },

      showTaskReminder: (taskTitle: string, time: string) => {
        addNotification({ type: "info", title: "📋 Task Reminder", message: `${taskTitle} is scheduled for ${time}` })
      },

      showPomodoroNotification: (type: "work" | "break" | "longBreak", duration: number) => {
        const messages = {
          work: `🍅 Work session complete! Time for a ${duration} minute break.`,
          break: `☕ Break over! Ready for another work session?`,
          longBreak: `🎉 Long break time! You've earned a ${duration} minute rest.`,
        }

        addNotification({
          type: type === "work" ? "success" : type === "break" ? "info" : "warning",
          title: "Pomodoro Timer",
          message: messages[type],
        })
      },

      showAchievement: (title: string, description: string) => {
        addNotification({ type: "success", title: `🏆 Achievement Unlocked!`, message: `${title}: ${description}` })
      },

      showSubscriptionNotification: (type: "expiring" | "expired" | "renewed", daysLeft?: number) => {
        const messages = {
          expiring: `⚠️ Your subscription expires in ${daysLeft} days`,
          expired: `❌ Your subscription has expired`,
          renewed: `✅ Subscription renewed successfully!`,
        }

        const notificationType: Notification["type"] =
          type === "expiring" ? "warning" : type === "expired" ? "error" : "success"

        addNotification({ type: notificationType, title: "Subscription Update", message: messages[type] })
      },
    }

    // Set up automatic task reminders (every 30 minutes during work hours)
    const reminderInterval = setInterval(
      () => {
        const now = new Date()
        const hour = now.getHours()

        // Only show reminders during work hours (9 AM - 6 PM)
        if (hour >= 9 && hour <= 18) {
          checkForTaskReminders()
        }
      },
      30 * 60 * 1000,
    ) // 30 minutes

    return () => {
      clearInterval(reminderInterval)
    }
  }, [permission])

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev])

    // Show browser notification
    if (permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/favicon.png",
      })
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-400" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-400" />
      case "info":
        return <Info className="h-4 w-4 text-blue-400" />
    }
  }

  const getColorClass = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "border-green-500/20 bg-green-500/10"
      case "error":
        return "border-red-500/20 bg-red-500/10"
      case "warning":
        return "border-yellow-500/20 bg-yellow-500/10"
      case "info":
        return "border-blue-500/20 bg-blue-500/10"
    }
  }

  const checkForTaskReminders = async () => {
    try {
      // This would typically fetch from your API
      // For now, we'll simulate checking for upcoming tasks
      const now = new Date()
      const in30Minutes = new Date(now.getTime() + 30 * 60 * 1000)

      // In a real app, you'd fetch tasks from your database
      // and check if any are due within the next 30 minutes

      console.log("Checking for task reminders...")
    } catch (error) {
      console.error("Failed to check task reminders:", error)
    }
  }

  return (
    <>
      {children}

      {/* Notification Bell */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative bg-slate-800/90 border-slate-600 text-white hover:bg-slate-700"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed top-16 right-4 w-80 max-h-96 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">Notificaciones</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-slate-400">No hay notificaciones</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-slate-700 last:border-b-0 ${getColorClass(notification.type)} ${
                    !notification.read ? "bg-opacity-20" : "bg-opacity-5"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium text-sm ${!notification.read ? "text-white" : "text-slate-300"}`}>
                        {notification.title}
                      </h4>
                      <p className="text-sm text-slate-400 mt-1">{notification.message}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        {notification.timestamp.toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="text-slate-400 hover:text-white p-1 h-auto"
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNotification(notification.id)}
                        className="text-slate-400 hover:text-red-400 p-1 h-auto"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-slate-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNotifications([])}
                className="w-full text-slate-400 hover:text-white"
              >
                Limpiar todas
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
