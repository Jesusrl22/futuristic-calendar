import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"
import { ThemeLoader } from "@/components/theme-loader"

export const metadata: Metadata = {
  title: "Future Task - Smart Task Management",
  description: "Organize your tasks, notes, and projects with AI-powered assistance",
  generator: "v0.app",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-16x16.jpg", sizes: "16x16", type: "image/jpeg" },
      { url: "/favicon-32x32.jpg", sizes: "32x32", type: "image/jpeg" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.jpg", sizes: "180x180", type: "image/jpeg" }],
    shortcut: [{ url: "/favicon.ico" }],
  },
  verification: {
    other: {
      "google-adsense-account": ["ca-pub-3746054566396266"],
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-3746054566396266" />
      </head>
      <body className="font-sans antialiased">
        <ThemeLoader />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3746054566396266"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  )
}
