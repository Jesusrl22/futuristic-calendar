"use client"

import React, { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { NotificationService } from "@/components/notification-service"

function AnalyticsWrapper() {
  const searchParams = useSearchParams()

  React.useEffect(() => {
    // Google Analytics tracking
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", process.env.NEXT_PUBLIC_GA_ID || "", {
        page_title: document.title,
        page_location: window.location.href,
      })
    }
  }, [searchParams])

  return null
}

export function AppLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsWrapper />
      </Suspense>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
        <NotificationService />
      </ThemeProvider>
    </>
  )
}
