import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/hooks/useLanguage"
import { CookieBanner } from "@/components/cookie-banner"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FutureTask - Organiza tu vida con IA",
  description:
    "La plataforma de productividad más avanzada del 2025. Gestiona tareas, calendario y notas con inteligencia artificial.",
  keywords: "productividad, IA, tareas, calendario, notas, organización, futuro",
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
    canonical: "https://future-task.com",
  },
  openGraph: {
    title: "FutureTask - Organiza tu vida con IA",
    description:
      "La plataforma de productividad más avanzada del 2025. Gestiona tareas, calendario y notas con inteligencia artificial.",
    url: "https://future-task.com",
    siteName: "FutureTask",
    images: [
      {
        url: "https://future-task.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "FutureTask - Organiza tu vida con IA",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FutureTask - Organiza tu vida con IA",
    description:
      "La plataforma de productividad más avanzada del 2025. Gestiona tareas, calendario y notas con inteligencia artificial.",
    images: ["https://future-task.com/og-image.png"],
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
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FutureTask" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            {children}
            <CookieBanner />
          </LanguageProvider>
        </ThemeProvider>

        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-L2KH22ZLXW" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-L2KH22ZLXW', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `}
        </Script>
      </body>
    </html>
  )
}
