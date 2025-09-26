"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { AchievementNotification } from "./achievement-notification"
import { useToast } from "@/hooks/use-toast"

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: "common" | "rare" | "epic" | "legendary"
  unlockedAt?: Date
}

interface NotificationContextType {
  showAchievement: (achievement: Achievement) => void
  showToast: (message: string, type?: "success" | "error" | "info") => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null)
  const { toast } = useToast()

  const showAchievement = useCallback((achievement: Achievement) => {
    setCurrentAchievement(achievement)

    // Auto-hide after 5 seconds
    setTimeout(() => {
      setCurrentAchievement(null)
    }, 5000)
  }, [])

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      toast({
        title: type === "success" ? "Success" : type === "error" ? "Error" : "Info",
        description: message,
        variant: type === "error" ? "destructive" : "default",
      })
    },
    [toast],
  )

  return (
    <NotificationContext.Provider value={{ showAchievement, showToast }}>
      {children}
      {currentAchievement && (
        <AchievementNotification achievement={currentAchievement} onClose={() => setCurrentAchievement(null)} />
      )}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

// Legacy export for backward compatibility
export const NotificationService = NotificationProvider
