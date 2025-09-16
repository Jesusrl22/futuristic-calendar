"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, X } from "lucide-react"
import type { Achievement } from "@/lib/achievements"

interface AchievementNotificationProps {
  achievement: Achievement
  onClose: () => void
}

export function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation
    const timer = setTimeout(() => setIsVisible(true), 100)

    // Auto close after 5 seconds
    const autoClose = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, 5000)

    return () => {
      clearTimeout(timer)
      clearTimeout(autoClose)
    }
  }, [onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "basic":
        return "from-blue-500 to-blue-600"
      case "premium":
        return "from-yellow-500 to-yellow-600"
      case "pro":
        return "from-purple-500 to-purple-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  return (
    <div
      className={`
      fixed top-4 right-4 z-50 transition-all duration-300 transform
      ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
    `}
    >
      <Card
        className={`
        w-80 bg-gradient-to-r ${getCategoryColor(achievement.category)} 
        border-0 shadow-2xl shadow-purple-500/20
      `}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl animate-bounce">🏆</div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="h-4 w-4 text-white" />
                  <span className="text-white font-bold text-sm">¡Logro Desbloqueado!</span>
                </div>
                <h3 className="text-white font-semibold">{achievement.name}</h3>
                <p className="text-white/80 text-sm">{achievement.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                    {achievement.category.toUpperCase()}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-300" />
                    <span className="text-yellow-300 text-xs">{achievement.points} pts</span>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={handleClose} className="text-white/60 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
