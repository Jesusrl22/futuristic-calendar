import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/hooks/useLanguage"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { Toaster } from "@/components/toaster"
import { CookieBanner } from "@/components/cookie-banner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TaskFlow - Organiza tu Productividad",
  description: "La aplicación de productividad más avanzada con IA, Pomodoro y gestión de tareas",
  keywords: ["productividad", "tareas", "pomodoro", "calendario", "IA"],
  authors: [{ name: "TaskFlow Team" }],
  openGraph: {
    title: "TaskFlow - Organiza tu Productividad",
    description: "La aplicación de productividad más avanzada",
    type: "website",
  },
    generator: 'v0.app'
}

const paypalOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
  currency: "EUR",
  intent: "subscription",
  vault: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <PayPalScriptProvider options={paypalOptions}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
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
