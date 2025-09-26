import type React from "react"
import ClientWrapper from "./client-wrapper"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <ClientWrapper>{children}</ClientWrapper>
}
