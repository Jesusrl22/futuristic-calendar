"use client"

import { useEffect, useState, useCallback } from "react"
import {
  isPushNotificationSupported,
  registerServiceWorker,
  requestNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
} from "@/lib/notifications"
import { useToast } from "@/hooks/use-toast"

export function usePushNotifications() {
  const { toast } = useToast()
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Check support on mount
  useEffect(() => {
    setIsSupported(isPushNotificationSupported())
  }, [])

  // Check current subscription status
  useEffect(() => {
    if (!isSupported) return

    const checkSubscription = async () => {
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        setIsSubscribed(!!subscription)
      } catch (error) {
        console.error("[v0] Failed to check subscription:", error)
      }
    }

    checkSubscription()
  }, [isSupported])

  // Enable notifications
  const enableNotifications = useCallback(async () => {
    if (!isSupported) {
      toast({
        title: "Error",
        description: "Push notifications are not supported in your browser",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Request permission
      const permission = await requestNotificationPermission()

      if (permission !== "granted") {
        toast({
          title: "Error",
          description: "You denied notification permissions",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Register service worker
      const registration = await registerServiceWorker()
      if (!registration) throw new Error("Service Worker registration failed")

      // Subscribe to push notifications
      const subscription = await subscribeToPushNotifications(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)

      if (!subscription) throw new Error("Failed to create subscription")

      // Send subscription to server
      const response = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      })

      if (!response.ok) throw new Error("Failed to save subscription")

      setIsSubscribed(true)
      toast({
        title: "Success",
        description: "Push notifications enabled successfully",
      })
    } catch (error) {
      console.error("[v0] Enable notifications error:", error)
      toast({
        title: "Error",
        description: "Failed to enable notifications",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [isSupported, toast])

  // Disable notifications
  const disableNotifications = useCallback(async () => {
    setIsLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        // Notify server
        await fetch("/api/notifications/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        })

        // Unsubscribe locally
        await unsubscribeFromPushNotifications()
      }

      setIsSubscribed(false)
      toast({
        title: "Success",
        description: "Push notifications disabled",
      })
    } catch (error) {
      console.error("[v0] Disable notifications error:", error)
      toast({
        title: "Error",
        description: "Failed to disable notifications",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  return {
    isSupported,
    isSubscribed,
    isLoading,
    enableNotifications,
    disableNotifications,
  }
}
