import type React from "react"

import { Inter } from "next/font/google"
import { AppLayoutClient } from "./layout.client"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>{/* Analytics component will be added here */}</head>
      <body className={inter.className}>
        <AppLayoutClient>{children}</AppLayoutClient>
      </body>
    </html>
  )
}
