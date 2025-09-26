"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: "common" | "rare" | "epic" | "legendary"
  unlockedAt?: Date
}

interface AchievementNotificationProps {
  achievement: Achievement
  onClose: () => void
}

const rarityColors = {
  common: "bg-gray-100 border-gray-300 text-gray-800",
  rare: "bg-blue-100 border-blue-300 text-blue-800",
  epic: "bg-purple-100 border-purple-300 text-purple-800",
  legendary: "bg-yellow-100 border-yellow-300 text-yellow-800",
}

const rarityGlow = {
  common: "shadow-gray-200",
  rare: "shadow-blue-200",
  epic: "shadow-purple-200",
  legendary: "shadow-yellow-200",
}

export function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    // Animate in
    setIsVisible(true)

    // Create particles effect
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }))
    setParticles(newParticles)

    // Auto-close after 4 seconds
    const timer = setTimeout(() => {
      handleClose()
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for animation to complete
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="relative">
        {/* Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.id * 0.1}s`,
              animationDuration: "2s",
            }}
          />
        ))}

        {/* Main notification */}
        <Card
          className={`
            pointer-events-auto relative overflow-hidden transition-all duration-300 transform
            ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}
            ${rarityColors[achievement.rarity]}
            ${rarityGlow[achievement.rarity]}
            shadow-2xl border-2 max-w-sm mx-4
          `}
        >
          <CardContent className="p-6 text-center relative">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Achievement content */}
            <div className="space-y-3">
              <div className="text-4xl mb-2">{achievement.icon}</div>

              <div>
                <h3 className="font-bold text-lg mb-1">Achievement Unlocked!</h3>
                <h4 className="font-semibold text-base">{achievement.name}</h4>
                <p className="text-sm opacity-80 mt-1">{achievement.description}</p>
              </div>

              <Badge variant="secondary" className={`${rarityColors[achievement.rarity]} capitalize font-medium`}>
                {achievement.rarity}
              </Badge>
            </div>

            {/* Animated border */}
            <div className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
