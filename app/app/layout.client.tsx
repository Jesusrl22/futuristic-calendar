"use client"

import React, { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { NotificationService } from "@/components/notification-service"
import Script from "next/script"

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

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsWrapper />
      </Suspense>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <div className="min-h-screen bg-background">
          {children}
          <NotificationService userId="current-user" />
        </div>
      </ThemeProvider>

      {/* Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
        `}
      </Script>
    </>
  )
}
