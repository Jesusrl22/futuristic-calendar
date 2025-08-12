"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Play, Pause, RotateCcw, Coffee, Brain, X } from "lucide-react"

interface UserPreferences {
  pomodoroTime: number
  shortBreakTime: number
  longBreakTime: number
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  longBreakInterval: number
  soundEnabled: boolean
}

interface PomodoroTimerProps {
  preferences: UserPreferences
  onClose: () => void
  onComplete: (sessionType: "focus" | "break") => void
}

type SessionType = "focus" | "shortBreak" | "longBreak"

export function PomodoroTimer({ preferences, onClose, onComplete }: PomodoroTimerProps) {
  const [sessionType, setSessionType] = useState<SessionType>("focus")
  const [timeLeft, setTimeLeft] = useState(preferences.pomodoroTime * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [totalFocusTime, setTotalFocusTime] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const getSessionDuration = (type: SessionType) => {
    switch (type) {
      case "focus":
        return preferences.pomodoroTime * 60
      case "shortBreak":
        return preferences.shortBreakTime * 60
      case "longBreak":
        return preferences.longBreakTime * 60
    }
  }

  const getSessionTitle = (type: SessionType) => {
    switch (type) {
      case "focus":
        return "Focus Time"
      case "shortBreak":
        return "Short Break"
      case "longBreak":
        return "Long Break"
    }
  }

  const getSessionIcon = (type: SessionType) => {
    switch (type) {
      case "focus":
        return <Brain className="h-5 w-5" />
      case "shortBreak":
      case "longBreak":
        return <Coffee className="h-5 w-5" />
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const startTimer = () => {
    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSessionComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const pauseTimer = () => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const resetTimer = () => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setTimeLeft(getSessionDuration(sessionType))
  }

  const handleSessionComplete = () => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    if (sessionType === "focus") {
      setSessionsCompleted((prev) => prev + 1)
      setTotalFocusTime((prev) => prev + preferences.pomodoroTime)
      onComplete("focus")

      // Determine next session type
      const nextSessionsCompleted = sessionsCompleted + 1
      const isLongBreak = nextSessionsCompleted % preferences.longBreakInterval === 0
      const nextSessionType = isLongBreak ? "longBreak" : "shortBreak"

      setSessionType(nextSessionType)
      setTimeLeft(getSessionDuration(nextSessionType))

      if (preferences.autoStartBreaks) {
        setTimeout(() => startTimer(), 1000)
      }
    } else {
      onComplete("break")
      setSessionType("focus")
      setTimeLeft(getSessionDuration("focus"))

      if (preferences.autoStartPomodoros) {
        setTimeout(() => startTimer(), 1000)
      }
    }
  }

  const switchSession = (type: SessionType) => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setSessionType(type)
    setTimeLeft(getSessionDuration(type))
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    setTimeLeft(getSessionDuration(sessionType))
  }, [sessionType, preferences])

  const progress = ((getSessionDuration(sessionType) - timeLeft) / getSessionDuration(sessionType)) * 100

  return (
    <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center space-x-2">
          {getSessionIcon(sessionType)}
          <span>{getSessionTitle(sessionType)}</span>
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Session Type Selector */}
        <div className="flex space-x-2">
          <Button
            variant={sessionType === "focus" ? "default" : "outline"}
            size="sm"
            onClick={() => switchSession("focus")}
            className={
              sessionType === "focus"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "bg-white/10 border-white/20 text-white hover:bg-white/20"
            }
          >
            <Brain className="h-4 w-4 mr-1" />
            Focus
          </Button>
          <Button
            variant={sessionType === "shortBreak" ? "default" : "outline"}
            size="sm"
            onClick={() => switchSession("shortBreak")}
            className={
              sessionType === "shortBreak"
                ? "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                : "bg-white/10 border-white/20 text-white hover:bg-white/20"
            }
          >
            <Coffee className="h-4 w-4 mr-1" />
            Short
          </Button>
          <Button
            variant={sessionType === "longBreak" ? "default" : "outline"}
            size="sm"
            onClick={() => switchSession("longBreak")}
            className={
              sessionType === "longBreak"
                ? "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                : "bg-white/10 border-white/20 text-white hover:bg-white/20"
            }
          >
            <Coffee className="h-4 w-4 mr-1" />
            Long
          </Button>
        </div>

        {/* Timer Display */}
        <div className="text-center space-y-4">
          <div className="text-6xl font-bold text-white tabular-nums">{formatTime(timeLeft)}</div>
          <Progress value={progress} className="h-2 bg-white/20" />
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={isRunning ? pauseTimer : startTimer}
            className={`${
              sessionType === "focus"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                : "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            } text-white`}
          >
            {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button
            variant="outline"
            onClick={resetTimer}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        <Separator className="bg-white/20" />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-white">{sessionsCompleted}</div>
            <div className="text-sm text-white/60">Sessions</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-white">{totalFocusTime}</div>
            <div className="text-sm text-white/60">Minutes</div>
          </div>
        </div>

        {/* Next Session Info */}
        {sessionType === "focus" && (
          <div className="text-center">
            <Badge className="bg-white/10 text-white/80">
              Next: {(sessionsCompleted + 1) % preferences.longBreakInterval === 0 ? "Long Break" : "Short Break"}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
