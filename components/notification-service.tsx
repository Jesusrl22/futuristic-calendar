"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, X, CheckCircle, AlertCircle, Info, Clock } from "lucide-react"
import { AchievementNotification } from "@/components/achievement-notification"
import type { Achievement } from "@/lib/achievements"

interface Notification {
  id: string
  type: "success" | "error" | "info" | "warning"
  title: string
  message: string
  timestamp: Date
  read: boolean
  persistent?: boolean
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  removeNotification: (id: string) => void
  clearAll: () => void
  showAchievement: (achievement: Achievement) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationService")
  }
  return context
}

interface NotificationServiceProps {
  children: ReactNode
}

export function NotificationService({ children }: NotificationServiceProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showPanel, setShowPanel] = useState(false)
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null)

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev])

    // Auto-remove non-persistent notifications after 5 seconds
    if (!notification.persistent) {
      setTimeout(() => {
        removeNotification(newNotification.id)
      }, 5000)
    }

    // Request browser notification permission and show notification
    if ("Notification" in window && Notification.permission === "granted") {
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

  const clearAll = () => {
    setNotifications([])
  }

  const showAchievement = (achievement: Achievement) => {
    setCurrentAchievement(achievement)
  }

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

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

  const getBorderColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "border-green-500/20"
      case "error":
        return "border-red-500/20"
      case "warning":
        return "border-yellow-500/20"
      case "info":
        return "border-blue-500/20"
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        removeNotification,
        clearAll,
        showAchievement,
      }}
    >
      {children}

      {/* Notification Bell */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPanel(!showPanel)}
          className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 text-white hover:bg-slate-700"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-600 text-white text-xs min-w-[1.25rem] h-5 flex items-center justify-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Notification Panel */}
      {showPanel && (
        <div className="fixed top-16 right-4 w-80 max-h-96 z-50">
          <Card className="bg-slate-800/95 backdrop-blur-sm border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-white">Notificaciones</h3>
                <div className="flex gap-2">
                  {notifications.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAll} className="text-slate-400 text-xs">
                      Limpiar
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setShowPanel(false)} className="text-slate-400">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">No hay notificaciones</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${getBorderColor(notification.type)} ${
                        notification.read ? "bg-slate-900/50" : "bg-slate-800/50"
                      } cursor-pointer transition-colors hover:bg-slate-700/50`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        {getIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4
                              className={`text-sm font-medium ${notification.read ? "text-slate-400" : "text-white"}`}
                            >
                              {notification.title}
                            </h4>
                            {!notification.read && <div className="w-2 h-2 bg-blue-400 rounded-full"></div>}
                          </div>
                          <p className={`text-xs ${notification.read ? "text-slate-500" : "text-slate-300"} mt-1`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-1 mt-2">
                            <Clock className="h-3 w-3 text-slate-500" />
                            <span className="text-xs text-slate-500">
                              {notification.timestamp.toLocaleTimeString("es-ES", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeNotification(notification.id)
                          }}
                          className="text-slate-400 hover:text-white p-1 h-auto"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Achievement Notification */}
      {currentAchievement && (
        <AchievementNotification achievement={currentAchievement} onClose={() => setCurrentAchievement(null)} />
      )}
    </NotificationContext.Provider>
  )
}
