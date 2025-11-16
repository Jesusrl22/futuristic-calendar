"use client"

import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from 'lucide-react'
import { useState } from "react"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile menu with Sheet */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="neon-glow-hover bg-background/95 backdrop-blur-sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px] z-50">
            <AppSidebar onNavigate={() => setMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop layout with resizable sidebar */}
      <ResizablePanelGroup direction="horizontal" className="h-screen">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="hidden md:block">
          <AppSidebar />
        </ResizablePanel>

        <ResizableHandle withHandle className="hidden md:flex" />

        <ResizablePanel defaultSize={80}>
          <main className="flex-1 h-full overflow-y-auto pt-16 md:pt-0">{children}</main>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
