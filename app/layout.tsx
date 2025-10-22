import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/hooks/useLanguage"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { Toaster } from "@/components/toaster"
import { CookieBanner } from "@/components/cookie-banner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Futuristic Calendar - Gestión de Tareas y Productividad",
  description: "Gestiona tus tareas, optimiza tu tiempo con Pomodoro, y alcanza tus metas con IA",
  keywords: "calendario, tareas, productividad, pomodoro, gestión del tiempo, organización",
  authors: [{ name: "Futuristic Calendar Team" }],
  openGraph: {
    title: "Futuristic Calendar - Gestión de Tareas y Productividad",
    description: "La mejor app para organizar tu vida y aumentar tu productividad",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Futuristic Calendar",
    description: "Gestiona tus tareas y optimiza tu tiempo",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
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
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <PayPalScriptProvider options={paypalOptions}>
          <ThemeProvider>
            <LanguageProvider>
              <AnalyticsProvider>
                {children}
                <Toaster />
                <CookieBanner />
              </AnalyticsProvider>
            </LanguageProvider>
          </ThemeProvider>
        </PayPalScriptProvider>
      </body>
    </html>
  )
}
