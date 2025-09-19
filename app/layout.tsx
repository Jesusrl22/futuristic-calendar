import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { NotificationService } from "@/components/notification-service"
import { CookieBanner } from "@/components/cookie-banner"
import { LanguageProvider } from "@/hooks/useLanguage"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FutureTask - AI-Powered Productivity Calendar",
  description:
    "Transform your productivity with our AI-powered calendar and task management system. Smart scheduling, intelligent insights, and seamless organization.",
  keywords: "productivity, calendar, AI, task management, scheduling, organization, future task",
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
    title: "FutureTask - AI-Powered Productivity Calendar",
    description: "Transform your productivity with our AI-powered calendar and task management system.",
    url: "https://future-task.com",
    siteName: "FutureTask",
    images: [
      {
        url: "/futuristic-dashboard.png",
        width: 1200,
        height: 630,
        alt: "FutureTask Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FutureTask - AI-Powered Productivity Calendar",
    description: "Transform your productivity with our AI-powered calendar and task management system.",
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
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=G-L2KH22ZLXW`} strategy="afterInteractive" />
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

        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FutureTask" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <div className="min-h-screen bg-background">
              {children}
              <NotificationService />
              <CookieBanner />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
