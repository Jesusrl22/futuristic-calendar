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
      { url: "/favicon.ico", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.jpg",
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
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3746054566396266"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeLoader />
        {children}
      </body>
    </html>
  )
}
