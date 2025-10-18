import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { LanguageProvider } from "@/hooks/useLanguage"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { CookieBanner } from "@/components/cookie-banner"
import { Toaster } from "@/components/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FutureTask - Gestión de Tareas con IA",
  description: "Organiza tu vida con inteligencia artificial. Planifica, ejecuta y alcanza tus metas con FutureTask.",
  keywords: "productividad, tareas, gestión, IA, calendario, pomodoro",
  authors: [{ name: "FutureTask Team" }],
  creator: "FutureTask",
  publisher: "FutureTask",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://futuretask.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "FutureTask - Gestión de Tareas con IA",
    description: "Organiza tu vida con inteligencia artificial",
    url: "/",
    siteName: "FutureTask",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/futuristic-dashboard.png",
        width: 1200,
        height: 630,
        alt: "FutureTask Dashboard",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FutureTask - Gestión de Tareas con IA",
    description: "Organiza tu vida con inteligencia artificial",
    images: ["/futuristic-dashboard.png"],
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <LanguageProvider>
            <AnalyticsProvider>
              {children}
              <CookieBanner />
              <Toaster />
            </AnalyticsProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
