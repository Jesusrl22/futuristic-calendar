"use client"

import type React from "react"

import { useEffect } from "react"

// Simple notification functions
export function showSuccessNotification(title: string, message: string) {
  if (typeof window !== "undefined" && "Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: message,
        icon: "/favicon.png",
      })
    }
  }

  // Fallback to console for development
  console.log(`✅ ${title}: ${message}`)
}

export function showErrorNotification(title: string, message: string) {
  if (typeof window !== "undefined" && "Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: message,
        icon: "/favicon.png",
      })
    }
  }

  // Fallback to console for development
  console.log(`❌ ${title}: ${message}`)
}

export function requestNotificationPermission() {
  if (typeof window !== "undefined" && "Notification" in window) {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          showSuccessNotification("Notificaciones activadas", "Ahora recibirás recordatorios de tus tareas")
        }
      })
    }
  }
}

interface NotificationServiceProps {
  children: React.ReactNode
}

export function NotificationService({ children }: NotificationServiceProps) {
  useEffect(() => {
    // Request notification permission on mount
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        setTimeout(() => {
          requestNotificationPermission()
        }, 3000) // Wait 3 seconds before asking
      }
    }
  }, [])

  return <>{children}</>
}

// Add default export at the end
export default NotificationService
