import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { UserProvider } from "@/hooks/useUser"
import { Toaster } from "@/components/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { CookieBanner } from "@/components/cookie-banner"
import { AnalyticsProvider } from "@/components/analytics-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FutureTask - AI-Powered Task Management",
  description: "Transform your productivity with intelligent task management and AI-powered insights",
  keywords: "task management, productivity, AI, calendar, pomodoro, organization",
  authors: [{ name: "FutureTask Team" }],
  creator: "FutureTask",
  publisher: "FutureTask",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://futuretask.app",
    title: "FutureTask - AI-Powered Task Management",
    description: "Transform your productivity with intelligent task management and AI-powered insights",
    siteName: "FutureTask",
  },
  twitter: {
    card: "summary_large_image",
    title: "FutureTask - AI-Powered Task Management",
    description: "Transform your productivity with intelligent task management and AI-powered insights",
    creator: "@futuretask",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AnalyticsProvider>
            <UserProvider>
              {children}
              <Toaster />
              <CookieBanner />
            </UserProvider>
          </AnalyticsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
