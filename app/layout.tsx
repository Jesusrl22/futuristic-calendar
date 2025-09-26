import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/hooks/useLanguage"
import { CookieBanner } from "@/components/cookie-banner"
import { NotificationProvider } from "@/components/notification-service"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FutureTask - Calendario Inteligente con IA",
  description:
    "Organiza tu vida con nuestro calendario futurista potenciado por inteligencia artificial. Gestiona tareas, notas y objetivos de manera eficiente.",
  keywords: "calendario, productividad, IA, tareas, organización, planificación",
  authors: [{ name: "FutureTask Team" }],
  creator: "FutureTask",
  publisher: "FutureTask",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://futuretask.vercel.app"),
  alternates: {
    canonical: "/",
    languages: {
      "es-ES": "/es",
      "en-US": "/en",
    },
  },
  openGraph: {
    title: "FutureTask - Calendario Inteligente con IA",
    description: "Organiza tu vida con nuestro calendario futurista potenciado por inteligencia artificial.",
    url: "https://futuretask.vercel.app",
    siteName: "FutureTask",
    images: [
      {
        url: "/futuristic-dashboard.png",
        width: 1200,
        height: 630,
        alt: "FutureTask Dashboard",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FutureTask - Calendario Inteligente con IA",
    description: "Organiza tu vida con nuestro calendario futurista potenciado por inteligencia artificial.",
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
  verification: {
    google: "your-google-verification-code",
  },
  category: "productivity",
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
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <NotificationProvider>
              {children}
              <CookieBanner />
            </NotificationProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
