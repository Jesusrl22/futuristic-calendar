import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/hooks/useLanguage"
import { ThemeInitializer } from "@/components/theme-initializer"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { Toaster } from "@/components/toaster"
import { CookieBanner } from "@/components/cookie-banner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FutureTask - AI-Powered Productivity Platform",
  description: "Transform your productivity with AI-powered task management, smart scheduling, and advanced analytics",
  keywords: [
    "productivity",
    "task management",
    "AI assistant",
    "calendar",
    "pomodoro timer",
    "time tracking",
    "project management",
  ],
  authors: [{ name: "FutureTask Team" }],
  openGraph: {
    title: "FutureTask - AI-Powered Productivity Platform",
    description: "Transform your productivity with AI-powered task management",
    type: "website",
    locale: "en_US",
    url: "https://futuretask.app",
    siteName: "FutureTask",
  },
  twitter: {
    card: "summary_large_image",
    title: "FutureTask - AI-Powered Productivity Platform",
    description: "Transform your productivity with AI-powered task management",
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
    generator: 'v0.app'
}

const paypalOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "demo",
  currency: "EUR",
  intent: "subscription",
  vault: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1e293b" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            <PayPalScriptProvider options={paypalOptions}>
              <ThemeInitializer />
              <AnalyticsProvider>
                {children}
                <Toaster />
                <CookieBanner />
              </AnalyticsProvider>
            </PayPalScriptProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
