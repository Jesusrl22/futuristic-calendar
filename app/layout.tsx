import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CookieBanner } from "@/components/cookie-banner"
import Script from "next/script"
import { ANALYTICS_CONFIG } from "@/lib/analytics"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FutureTask - Organiza tu vida con IA",
  description:
    "La plataforma de productividad más avanzada del 2025. Gestiona tareas, calendario y notas con inteligencia artificial.",
  keywords: "productividad, IA, calendario, tareas, organización, inteligencia artificial",
  authors: [{ name: "FutureTask Team" }],
  creator: "FutureTask",
  publisher: "FutureTask",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://future-task.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "FutureTask - Organiza tu vida con IA",
    description:
      "La plataforma de productividad más avanzada del 2025. Gestiona tareas, calendario y notas con inteligencia artificial.",
    url: "https://future-task.com",
    siteName: "FutureTask",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FutureTask - Productividad con IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FutureTask - Organiza tu vida con IA",
    description: "La plataforma de productividad más avanzada del 2025.",
    images: ["/og-image.png"],
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
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${ANALYTICS_CONFIG.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Theme Color */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  )
}
