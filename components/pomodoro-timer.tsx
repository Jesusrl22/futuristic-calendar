"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Play, Pause, Square, RotateCcw, Settings, Volume2, VolumeX, Coffee, Brain, Trophy, Zap } from "lucide-react"
import { toast } from "sonner"

interface PomodoroTimerProps {
  preferences: any
  onClose: () => void
  onComplete: (sessionType: "focus" | "break") => void
}

type SessionType = "focus" | "shortBreak" | "longBreak"
type TimerState = "idle" | "running" | "paused"

interface PomodoroSession {
  id: string
  type: SessionType
  duration: number
  completedAt: Date
}

export function PomodoroTimer({ preferences, onClose, onComplete }: PomodoroTimerProps) {
  const [currentSession, setCurrentSession] = useState<SessionType>("focus")
  const [timeLeft, setTimeLeft] = useState(preferences.pomodoroTime * 60)
  const [timerState, setTimerState] = useState<TimerState>("idle")
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [totalSessions, setTotalSessions] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pomodoro-sessions")
      return saved ? JSON.parse(saved).length : 0
    }
    return 0
  })
  const [sessions, setSessions] = useState<PomodoroSession[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pomodoro-sessions")
      if (saved) {
        try {
          return JSON.parse(saved).map((session: any) => ({
            ...session,
            completedAt: new Date(session.completedAt),
          }))
        } catch (error) {
          console.error("Error parsing saved sessions:", error)
        }
      }
    }
    return []
  })
  const [soundEnabled, setSoundEnabled] = useState(preferences.soundEnabled)
  const [autoStart, setAutoStart] = useState(false)
  const [customDuration, setCustomDuration] = useState(25)
  const [showSettings, setShowSettings] = useState(false)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const sessionDurations = {
    focus: preferences.pomodoroTime * 60,
    shortBreak: preferences.shortBreakTime * 60,
    longBreak: preferences.longBreakTime * 60,
  }

  const sessionLabels = {
    focus: "Enfoque",
    shortBreak: "Descanso Corto",
    longBreak: "Descanso Largo",
  }

  const sessionIcons = {
    focus: Brain,
    shortBreak: Coffee,
    longBreak: Coffee,
  }

  useEffect(() => {
    setTimeLeft(sessionDurations[currentSession])
  }, [currentSession, preferences])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pomodoro-sessions", JSON.stringify(sessions))
    }
  }, [sessions])

  useEffect(() => {
    // Initialize audio
    if (typeof window !== "undefined") {
      audioRef.current = new Audio()
      audioRef.current.preload = "auto"
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const playNotificationSound = () => {
    if (soundEnabled && audioRef.current) {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = currentSession === "focus" ? 800 : 400
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    }
  }

  const startTimer = () => {
    if (timerState === "idle") {
      setTimeLeft(sessionDurations[currentSession])
    }

    setTimerState("running")

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          completeSession()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const pauseTimer = () => {
    setTimerState("paused")
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const stopTimer = () => {
    setTimerState("idle")
    setTimeLeft(sessionDurations[currentSession])
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const resetTimer = () => {
    stopTimer()
    setSessionsCompleted(0)
  }

  const completeSession = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    const newSession: PomodoroSession = {
      id: crypto.randomUUID(),
      type: currentSession,
      duration: sessionDurations[currentSession],
      completedAt: new Date(),
    }

    setSessions((prev) => [...prev, newSession])
    setTotalSessions((prev) => prev + 1)

    playNotificationSound()
    onComplete(currentSession === "focus" ? "focus" : "break")

    if (currentSession === "focus") {
      setSessionsCompleted((prev) => prev + 1)

      // Determine next session type
      const nextSessionsCompleted = sessionsCompleted + 1
      if (nextSessionsCompleted % preferences.longBreakInterval === 0) {
        setCurrentSession("longBreak")
        toast.success("¡Sesión completada!", {
          description: "Tiempo para un descanso largo",
        })
      } else {
        setCurrentSession("shortBreak")
        toast.success("¡Sesión completada!", {
          description: "Tiempo para un descanso corto",
        })
      }
    } else {
      setCurrentSession("focus")
      toast.success("¡Descanso completado!", {
        description: "Tiempo de volver al trabajo",
      })
    }

    // Auto-start next session if enabled
    if (
      autoStart ||
      (currentSession === "focus" && preferences.autoStartBreaks) ||
      (currentSession !== "focus" && preferences.autoStartPomodoros)
    ) {
      setTimeout(() => {
        setTimerState("running")
        setTimeLeft(
          sessionDurations[
            currentSession === "focus"
              ? (sessionsCompleted + 1) % preferences.longBreakInterval === 0
                ? "longBreak"
                : "shortBreak"
              : "focus"
          ],
        )
        startTimer()
      }, 1000)
    } else {
      setTimerState("idle")
    }

    // Send browser notification if permission granted
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`FutureTask - ${sessionLabels[currentSession]} Completado`, {
        body: currentSession === "focus" ? "¡Tiempo de descanso!" : "¡Tiempo de trabajar!",
        icon: "/placeholder-logo.png",
      })
    }
  }

  const switchSession = (sessionType: SessionType) => {
    if (timerState === "running") {
      pauseTimer()
    }
    setCurrentSession(sessionType)
    setTimeLeft(sessionDurations[sessionType])
    setTimerState("idle")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getProgress = () => {
    const totalTime = sessionDurations[currentSession]
    return ((totalTime - timeLeft) / totalTime) * 100
  }

  const getCurrentIcon = () => {
    const IconComponent = sessionIcons[currentSession]
    return <IconComponent className="h-8 w-8" />
  }

  const todaySessions = sessions.filter((session) => {
    const today = new Date()
    const sessionDate = session.completedAt
    return sessionDate.toDateString() === today.toDateString()
  })

  const todayFocusTime = todaySessions
    .filter((session) => session.type === "focus")
    .reduce((total, session) => total + session.duration, 0)

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center text-white text-xl">
            {getCurrentIcon()}
            <span className="ml-2">{sessionLabels[currentSession]}</span>
            <Badge className="ml-2 bg-white/20 text-white">Sesión {sessionsCompleted + 1}</Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-white mb-4">{formatTime(timeLeft)}</div>
            <Progress value={getProgress()} className="w-full h-2 bg-white/20" />
          </div>

          {/* Session Selector */}
          <Tabs value={currentSession} onValueChange={(value) => switchSession(value as SessionType)}>
            <TabsList className="grid w-full grid-cols-3 bg-white/10">
              <TabsTrigger value="focus" className="text-white data-[state=active]:bg-white/20">
                <Brain className="h-4 w-4 mr-1" />
                Enfoque
              </TabsTrigger>
              <TabsTrigger value="shortBreak" className="text-white data-[state=active]:bg-white/20">
                <Coffee className="h-4 w-4 mr-1" />
                Corto
              </TabsTrigger>
              <TabsTrigger value="longBreak" className="text-white data-[state=active]:bg-white/20">
                <Coffee className="h-4 w-4 mr-1" />
                Largo
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Timer Controls */}
          <div className="flex justify-center space-x-4">
            {timerState === "idle" || timerState === "paused" ? (
              <Button onClick={startTimer} className="bg-green-600 hover:bg-green-700 text-white" size="lg">
                <Play className="h-5 w-5 mr-2" />
                {timerState === "paused" ? "Continuar" : "Iniciar"}
              </Button>
            ) : (
              <Button onClick={pauseTimer} className="bg-yellow-600 hover:bg-yellow-700 text-white" size="lg">
                <Pause className="h-5 w-5 mr-2" />
                Pausar
              </Button>
            )}

            <Button
              onClick={stopTimer}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              size="lg"
            >
              <Square className="h-5 w-5 mr-2" />
              Detener
            </Button>

            <Button
              onClick={resetTimer}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              size="lg"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
          </div>

          {/* Quick Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4 text-white" />
                ) : (
                  <VolumeX className="h-4 w-4 text-white/60" />
                )}
                <Label className="text-white">Sonido</Label>
              </div>
              <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-white" />
                <Label className="text-white">Auto-iniciar</Label>
              </div>
              <Switch checked={autoStart} onCheckedChange={setAutoStart} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{sessionsCompleted}</div>
              <div className="text-xs text-white/60">Sesiones Hoy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{Math.floor(todayFocusTime / 60)}</div>
              <div className="text-xs text-white/60">Minutos Enfoque</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{totalSessions}</div>
              <div className="text-xs text-white/60">Total Sesiones</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            <Button
              onClick={() => setShowSettings(!showSettings)}
              variant="outline"
              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Cerrar
            </Button>
          </div>

          {/* Advanced Settings */}
          {showSettings && (
            <div className="space-y-4 pt-4 border-t border-white/20">
              <div>
                <Label className="text-white">Duración Personalizada (minutos)</Label>
                <Select
                  value={customDuration.toString()}
                  onValueChange={(value) => {
                    setCustomDuration(Number.parseInt(value))
                    if (timerState === "idle") {
                      setTimeLeft(Number.parseInt(value) * 60)
                    }
                  }}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="20">20 minutos</SelectItem>
                    <SelectItem value="25">25 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="45">45 minutos</SelectItem>
                    <SelectItem value="60">60 minutos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-center">
                <Button
                  onClick={() => {
                    setSessions([])
                    setSessionsCompleted(0)
                    setTotalSessions(0)
                    toast.success("Estadísticas reiniciadas")
                  }}
                  variant="outline"
                  size="sm"
                  className="bg-red-600/20 border-red-500/30 text-red-400 hover:bg-red-600/30"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Reiniciar Estadísticas
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PomodoroTimer
