"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Volume2, VolumeX, X } from "lucide-react"
import { toast } from "sonner"
import type { UserPreferences } from "@/types"

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
  const [soundEnabled, setSoundEnabled] = useState(preferences.soundEnabled)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const sessionDurations = {
    focus: preferences.pomodoroTime * 60,
    shortBreak: preferences.shortBreakTime * 60,
    longBreak: preferences.longBreakTime * 60,
  }

  const sessionLabels = {
    focus: preferences.language === "es" ? "Enfoque" : "Focus",
    shortBreak: preferences.language === "es" ? "Descanso Corto" : "Short Break",
    longBreak: preferences.language === "es" ? "Descanso Largo" : "Long Break",
  }

  useEffect(() => {
    setTimeLeft(sessionDurations[sessionType])
  }, [sessionType])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  const handleSessionComplete = () => {
    setIsRunning(false)

    if (soundEnabled) {
      playNotificationSound()
    }

    if (sessionType === "focus") {
      setSessionsCompleted((prev) => prev + 1)
      const nextSession = (sessionsCompleted + 1) % preferences.longBreakInterval === 0 ? "longBreak" : "shortBreak"

      toast.success(
        preferences.language === "es"
          ? "¡Sesión de enfoque completada! Hora del descanso."
          : "Focus session complete! Time for a break.",
      )

      if (preferences.autoStartBreaks) {
        setSessionType(nextSession)
        setIsRunning(true)
      } else {
        setSessionType(nextSession)
      }
    } else {
      toast.success(
        preferences.language === "es" ? "¡Descanso terminado! Listo para enfocar." : "Break complete! Ready to focus.",
      )

      if (preferences.autoStartPomodoros) {
        setSessionType("focus")
        setIsRunning(true)
      } else {
        setSessionType("focus")
      }
    }

    onComplete(sessionType)
  }

  const playNotificationSound = () => {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(sessionDurations[sessionType])
  }

  const switchSession = (type: SessionType) => {
    setIsRunning(false)
    setSessionType(type)
    setTimeLeft(sessionDurations[type])
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progress = ((sessionDurations[sessionType] - timeLeft) / sessionDurations[sessionType]) * 100

  return (
    <Card className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-white">
          {preferences.language === "es" ? "Temporizador Pomodoro" : "Pomodoro Timer"}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-white hover:bg-white/20"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Session Type Selector */}
        <div className="flex space-x-2">
          <Button
            variant={sessionType === "focus" ? "default" : "ghost"}
            size="sm"
            onClick={() => switchSession("focus")}
            className={`flex-1 ${
              sessionType === "focus" ? "bg-white/20 text-white" : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            {sessionLabels.focus}
          </Button>
          <Button
            variant={sessionType === "shortBreak" ? "default" : "ghost"}
            size="sm"
            onClick={() => switchSession("shortBreak")}
            className={`flex-1 ${
              sessionType === "shortBreak"
                ? "bg-white/20 text-white"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            {sessionLabels.shortBreak}
          </Button>
          <Button
            variant={sessionType === "longBreak" ? "default" : "ghost"}
            size="sm"
            onClick={() => switchSession("longBreak")}
            className={`flex-1 ${
              sessionType === "longBreak"
                ? "bg-white/20 text-white"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            {sessionLabels.longBreak}
          </Button>
        </div>

        {/* Timer Display */}
        <div className="text-center space-y-4">
          <div className="text-6xl font-bold text-white tabular-nums">{formatTime(timeLeft)}</div>
          <Progress value={progress} className="h-2 bg-white/20" />
          <Badge className="bg-white/20 text-white border-white/20">{sessionLabels[sessionType]}</Badge>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={toggleTimer}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            {isRunning ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
            {isRunning
              ? preferences.language === "es"
                ? "Pausar"
                : "Pause"
              : preferences.language === "es"
                ? "Iniciar"
                : "Start"}
          </Button>
          <Button
            onClick={resetTimer}
            variant="outline"
            size="lg"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            {preferences.language === "es" ? "Reiniciar" : "Reset"}
          </Button>
        </div>

        {/* Session Stats */}
        <div className="text-center space-y-2">
          <div className="text-white/70 text-sm">
            {preferences.language === "es" ? "Sesiones completadas:" : "Sessions completed:"}
          </div>
          <div className="text-2xl font-bold text-white">{sessionsCompleted}</div>
          <div className="text-white/60 text-xs">
            {preferences.language === "es"
              ? `Próximo descanso largo en ${preferences.longBreakInterval - (sessionsCompleted % preferences.longBreakInterval)} sesiones`
              : `Next long break in ${preferences.longBreakInterval - (sessionsCompleted % preferences.longBreakInterval)} sessions`}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
