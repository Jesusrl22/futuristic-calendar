import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./layout.client"

export const metadata: Metadata = {
  title: "FutureTask - AI-Powered Task Management",
  description: "Manage your tasks with AI assistance and advanced features",
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}
