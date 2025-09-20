import type React from "react"
import { AppLayoutClient } from "./layout.client"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppLayoutClient>{children}</AppLayoutClient>
      </body>
    </html>
  )
}
