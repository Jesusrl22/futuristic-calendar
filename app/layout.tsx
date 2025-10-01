import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/hooks/useLanguage"
import { Toaster } from "@/components/toaster"
import { CookieBanner } from "@/components/cookie-banner"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FutureTask - Calendario Inteligente con IA",
  description:
    "Organiza tu vida, potencia tu trabajo y alcanza tus objetivos con la ayuda de la inteligencia artificial más avanzada",
  keywords: ["calendario", "productividad", "IA", "inteligencia artificial", "tareas", "notas", "pomodoro"],
  authors: [{ name: "FutureTask Team" }],
  creator: "FutureTask",
  publisher: "FutureTask",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://future-task.vercel.app"),
  alternates: {
    canonical: "/",
    languages: {
      "es-ES": "/es",
      "en-US": "/en",
      "fr-FR": "/fr",
      "de-DE": "/de",
      "it-IT": "/it",
      "pt-PT": "/pt",
    },
  },
  openGraph: {
    title: "FutureTask - Calendario Inteligente con IA",
    description:
      "Organiza tu vida, potencia tu trabajo y alcanza tus objetivos con la ayuda de la inteligencia artificial más avanzada",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://future-task.vercel.app",
    siteName: "FutureTask",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FutureTask - Calendario Inteligente con IA",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FutureTask - Calendario Inteligente con IA",
    description:
      "Organiza tu vida, potencia tu trabajo y alcanza tus objetivos con la ayuda de la inteligencia artificial más avanzada",
    images: ["/og-image.png"],
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
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7c3aed" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FutureTask" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#7c3aed" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <Suspense fallback={null}>
              <AnalyticsProvider />
            </Suspense>
            {children}
            <Toaster />
            <CookieBanner />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
