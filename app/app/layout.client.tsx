"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { NotificationService } from "@/components/notification-service"
import { Analytics } from "@/lib/analytics"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

export function AppLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const searchParams = useSearchParams()

  return (
    <>
      <Analytics />
      <Suspense fallback={null}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <NotificationService />
        </ThemeProvider>
      </Suspense>
    </>
  )
}
