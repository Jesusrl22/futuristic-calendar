"use client"

import {
  Home,
  Calendar,
  CheckSquare,
  FileText,
  Heart,
  Timer,
  BarChart3,
  Bot,
  Trophy,
  CreditCard,
  Settings,
  LogOut,
} from "@/components/icons"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from "@/lib/supabase/client"

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/app" },
  { icon: Calendar, label: "Calendar", href: "/app/calendar" },
  { icon: CheckSquare, label: "Tasks", href: "/app/tasks" },
  { icon: FileText, label: "Notes", href: "/app/notes" },
  { icon: Heart, label: "Wishlist", href: "/app/wishlist" },
  { icon: Timer, label: "Pomodoro", href: "/app/pomodoro" },
  { icon: BarChart3, label: "Statistics", href: "/app/stats" },
  { icon: Bot, label: "AI Assistant", href: "/app/ai" },
  { icon: Trophy, label: "Achievements", href: "/app/achievements" },
  { icon: CreditCard, label: "Subscription", href: "/app/subscription" },
  { icon: Settings, label: "Settings", href: "/app/settings" },
]

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleNavClick = () => {
    if (onNavigate) {
      onNavigate()
    }
  }

  return (
    <div className="flex flex-col h-full w-full border-r border-border/50 bg-card/50 backdrop-blur-sm">
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <Link href="/app" className="flex items-center gap-3" onClick={handleNavClick}>
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <span className="text-xl font-bold text-primary">FT</span>
          </div>
          <span className="text-xl font-bold">Future Task</span>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={handleNavClick}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    isActive ? "bg-primary/10 text-primary neon-glow-hover" : "hover:bg-secondary/50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Logout */}
      <div className="p-4 border-t border-border/50">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  )
}
