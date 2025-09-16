"use client"

import { useEffect } from "react"

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

export function NotificationService() {
  useEffect(() => {
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }

    // Create global notification API
    window.FutureTaskNotifications = {
      showSuccess: (title: string, message: string) => {
        showNotification(title, message, "✅", "#10b981")
      },

      showError: (title: string, message: string) => {
        showNotification(title, message, "❌", "#ef4444")
      },

      showTaskReminder: (taskTitle: string, time: string) => {
        showNotification("📋 Task Reminder", `${taskTitle} is scheduled for ${time}`, "⏰", "#3b82f6", true)
      },

      showPomodoroNotification: (type: "work" | "break" | "longBreak", duration: number) => {
        const messages = {
          work: `🍅 Work session complete! Time for a ${duration} minute break.`,
          break: `☕ Break over! Ready for another work session?`,
          longBreak: `🎉 Long break time! You've earned a ${duration} minute rest.`,
        }

        showNotification(
          "Pomodoro Timer",
          messages[type],
          type === "work" ? "🍅" : type === "break" ? "☕" : "🎉",
          "#f59e0b",
          true,
          true, // vibrate
        )
      },

      showAchievement: (title: string, description: string) => {
        showNotification(`🏆 Achievement Unlocked!`, `${title}: ${description}`, "🏆", "#8b5cf6", false, true)
      },

      showSubscriptionNotification: (type: "expiring" | "expired" | "renewed", daysLeft?: number) => {
        const messages = {
          expiring: `⚠️ Your subscription expires in ${daysLeft} days`,
          expired: `❌ Your subscription has expired`,
          renewed: `✅ Subscription renewed successfully!`,
        }

        const colors = {
          expiring: "#f59e0b",
          expired: "#ef4444",
          renewed: "#10b981",
        }

        showNotification(
          "Subscription Update",
          messages[type],
          type === "expiring" ? "⚠️" : type === "expired" ? "❌" : "✅",
          colors[type],
          true,
        )
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
  }, [])

  const showNotification = (
    title: string,
    message: string,
    icon: string,
    color: string,
    persistent = false,
    vibrate = false,
  ) => {
    // Check if notifications are supported and permitted
    if ("Notification" in window && Notification.permission === "granted") {
      const notification = new Notification(title, {
        body: message,
        icon: "/favicon-32x32.png",
        badge: "/favicon-16x16.png",
        tag: `future-task-${Date.now()}`,
        requireInteraction: persistent,
        silent: false,
      })

      // Vibrate if supported and requested
      if (vibrate && "vibrate" in navigator) {
        navigator.vibrate([200, 100, 200])
      }

      // Auto-close non-persistent notifications
      if (!persistent) {
        setTimeout(() => {
          notification.close()
        }, 5000)
      }

      // Handle notification click
      notification.onclick = () => {
        window.focus()
        notification.close()
      }
    }

    // Fallback: Show browser console message
    console.log(`🔔 ${title}: ${message}`)
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

  return null // This component doesn't render anything
}
