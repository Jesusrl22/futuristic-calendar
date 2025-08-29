import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FutureTask - Tu calendario inteligente del futuro",
  description:
    "Organiza tus tareas, desbloquea logros y mantén rachas con FutureTask, tu calendario inteligente del futuro.",
  keywords: ["calendario", "tareas", "productividad", "pomodoro", "logros", "organizacion"],
  authors: [{ name: "FutureTask Team" }],
  creator: "FutureTask",
  publisher: "FutureTask",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/logo.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "FutureTask - Tu calendario inteligente del futuro",
    description: "Organiza tus tareas, desbloquea logros y mantén rachas con FutureTask.",
    url: "https://futuretask.app",
    siteName: "FutureTask",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "FutureTask Logo",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FutureTask - Tu calendario inteligente del futuro",
    description: "Organiza tus tareas, desbloquea logros y mantén rachas con FutureTask.",
    images: ["/logo.png"],
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
    google: "google-site-verification-code",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" sizes="180x180" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
