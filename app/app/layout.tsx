import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ResizablePanelGroup direction="horizontal" className="h-screen">
        {/* Sidebar - Resizable */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="hidden md:block">
          <AppSidebar />
        </ResizablePanel>

        <ResizableHandle withHandle className="hidden md:flex" />

        {/* Main Content */}
        <ResizablePanel defaultSize={80}>
          <main className="flex-1 h-full overflow-y-auto">{children}</main>
        </ResizablePanel>
      </ResizablePanelGroup>
      {/* </CHANGE> */}
    </div>
  )
}
