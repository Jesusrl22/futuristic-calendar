import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/hooks/useLanguage"
import { ThemeProvider } from "@/components/theme-provider"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { CookieBanner } from "@/components/cookie-banner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FutureTask - Organiza tu vida con IA",
  description: "La aplicación de productividad más avanzada con inteligencia artificial integrada",
  keywords: ["productividad", "IA", "tareas", "calendario", "pomodoro", "notas"],
  authors: [{ name: "FutureTask" }],
  creator: "FutureTask",
  publisher: "FutureTask",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://futuretask.app",
    siteName: "FutureTask",
    title: "FutureTask - Organiza tu vida con IA",
    description: "La aplicación de productividad más avanzada con inteligencia artificial integrada",
  },
  twitter: {
    card: "summary_large_image",
    title: "FutureTask - Organiza tu vida con IA",
    description: "La aplicación de productividad más avanzada con inteligencia artificial integrada",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <AnalyticsProvider>
              {children}
              <CookieBanner />
            </AnalyticsProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
