"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ExternalLink, Star, Zap, Crown } from "lucide-react"
import { getThemeById } from "@/constants/themes"

interface AdBannerProps {
  currentTheme?: string
  onUpgrade?: () => void
}

interface Ad {
  id: string
  title: string
  description: string
  cta: string
  icon: React.ReactNode
  color: string
  gradient: string
}

const ADS: Ad[] = [
  {
    id: "premium-upgrade",
    title: "Upgrade to Premium",
    description: "Unlock unlimited tasks, custom themes, and advanced features",
    cta: "Upgrade Now",
    icon: <Crown className="h-5 w-5" />,
    color: "text-yellow-600",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    id: "productivity-boost",
    title: "Boost Your Productivity",
    description: "Get 50% more done with our premium Pomodoro features",
    cta: "Learn More",
    icon: <Zap className="h-5 w-5" />,
    color: "text-blue-600",
    gradient: "from-blue-400 to-purple-500",
  },
  {
    id: "premium-themes",
    title: "Beautiful Premium Themes",
    description: "Access 9 stunning themes to personalize your workspace",
    cta: "See Themes",
    icon: <Star className="h-5 w-5" />,
    color: "text-purple-600",
    gradient: "from-purple-400 to-pink-500",
  },
]

export default function AdBanner({ currentTheme = "slate-gray", onUpgrade }: AdBannerProps) {
  const [currentAd, setCurrentAd] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  const theme = getThemeById(currentTheme)

  // Rotate ads every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentAd((prev) => (prev + 1) % ADS.length)
        setIsAnimating(false)
      }, 300)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  const ad = ADS[currentAd]

  const handleAdClick = () => {
    if (onUpgrade) {
      onUpgrade()
    }
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 ${
        isAnimating ? "opacity-50 scale-95" : "opacity-100 scale-100"
      }`}
      style={{ borderColor: theme?.colors.border }}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${ad.gradient} opacity-10`} />

      <CardContent className="relative p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div
              className={`p-2 rounded-lg ${ad.color} bg-white/80`}
              style={{ backgroundColor: theme?.colors.surface + "80" }}
            >
              {ad.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-sm" style={{ color: theme?.colors.text }}>
                  {ad.title}
                </h4>
                <Badge
                  variant="secondary"
                  className="text-xs px-2 py-0.5"
                  style={{
                    backgroundColor: theme?.colors.primary + "20",
                    color: theme?.colors.primary,
                  }}
                >
                  Ad
                </Badge>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: theme?.colors.textSecondary }}>
                {ad.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-3">
            <Button
              size="sm"
              onClick={handleAdClick}
              className="text-xs px-3 py-1.5 h-auto"
              style={{
                backgroundColor: theme?.colors.primary,
                borderColor: theme?.colors.primary,
              }}
            >
              {ad.cta}
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>

            <Button size="sm" variant="ghost" onClick={handleClose} className="h-6 w-6 p-0 hover:bg-gray-100">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex gap-1 mt-3 justify-center">
          {ADS.map((_, index) => (
            <div
              key={index}
              className={`h-1 w-6 rounded-full transition-all duration-300 ${
                index === currentAd ? "opacity-100" : "opacity-30"
              }`}
              style={{
                backgroundColor: index === currentAd ? theme?.colors.primary : theme?.colors.border,
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
