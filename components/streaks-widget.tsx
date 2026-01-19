"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, Trophy, Target, Clock } from "lucide-react"

interface StreaksData {
  currentStreak: number
  longestStreak: number
  totalTasksCompleted: number
  totalStudyHours: number
  todayTasks: number
  weekTasks: number
}

export function StreaksWidget() {
  const [streaks, setStreaks] = useState<StreaksData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStreaks()
  }, [])

  const fetchStreaks = async () => {
    try {
      const response = await fetch("/api/streaks")
      if (response.ok) {
        const data = await response.json()
        setStreaks(data)
      }
    } catch (error) {
      console.error("[v0] Error fetching streaks:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-16 bg-muted rounded" />
            <div className="h-16 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!streaks) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Streak Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg border">
            <Flame className="h-8 w-8 text-orange-500 mb-2" />
            <div className="text-3xl font-bold">{streaks.currentStreak}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg border">
            <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
            <div className="text-3xl font-bold">{streaks.longestStreak}</div>
            <div className="text-xs text-muted-foreground">Best Streak</div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Tasks Completed</span>
            </div>
            <Badge variant="secondary">{streaks.totalTasksCompleted}</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <span className="text-sm">Study Hours</span>
            </div>
            <Badge variant="secondary">{streaks.totalStudyHours.toFixed(1)}h</Badge>
          </div>
        </div>

        {/* Today/Week Progress */}
        <div className="pt-3 border-t space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Today</span>
            <span className="font-medium">{streaks.todayTasks} tasks</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">This Week</span>
            <span className="font-medium">{streaks.weekTasks} tasks</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
