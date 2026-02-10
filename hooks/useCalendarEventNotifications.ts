'use client'

import { useEffect, useRef } from 'react'

/**
 * Hook that polls for upcoming calendar events and sends notifications
 * Runs in the background while the app is open
 */
export function useCalendarEventNotifications() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Start polling for upcoming events every 30 seconds
    intervalRef.current = setInterval(async () => {
      try {
        console.log('[v0] Checking for upcoming calendar events...')
        const response = await fetch('/api/cron/check-upcoming-events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })

        if (response.ok) {
          const data = await response.json()
          console.log('[v0] Event check completed:', data)
        } else {
          console.warn('[v0] Event check failed:', response.status)
        }
      } catch (error) {
        console.error('[v0] Error checking calendar events:', error)
      }
    }, 30 * 1000) // Check every 30 seconds

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])
}
