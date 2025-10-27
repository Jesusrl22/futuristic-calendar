import type React from "react"
import ClientWrapper from "./client-wrapper"
import { ThemeInitializer } from "@/components/theme-initializer"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeInitializer />
      <ClientWrapper>{children}</ClientWrapper>
    </>
  )
}
