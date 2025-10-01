"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { trackPageView, trackEvent } from "@/lib/analytics"

export function AnalyticsProvider() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track page view on mount and route changes
    if (pathname) {
      trackPageView(pathname)
    }
  }, [pathname, searchParams])

  useEffect(() => {
    // Track user engagement
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        trackEvent("user_engagement", "page_visible", pathname || "")
      } else {
        trackEvent("user_engagement", "page_hidden", pathname || "")
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [pathname])

  return null
}
