import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { UserProvider } from "@/hooks/useUser"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/toaster"
import { CookieBanner } from "@/components/cookie-banner"
import { AnalyticsProvider } from "@/components/analytics-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FutureTask - AI-Powered Task Management",
  description: "Organize your life with AI-powered task management, calendar, and productivity tools",
  keywords: "task management, calendar, productivity, AI, pomodoro, notes",
  authors: [{ name: "FutureTask" }],
  openGraph: {
    title: "FutureTask - AI-Powered Task Management",
    description: "Organize your life with AI-powered task management",
    type: "website",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <UserProvider>
            <AnalyticsProvider>
              {children}
              <CookieBanner />
              <Toaster />
            </AnalyticsProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
