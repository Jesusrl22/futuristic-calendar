"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, RotateCcw, Volume2, VolumeX, BarChart3 } from "lucide-react"

interface PomodoroSettings {
  workDuration: number
  shortBreak: number
  longBreak: number
  longBreakInterval: number
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  enableSounds: boolean
  enableTickingSound: boolean
  volume: number
}

interface PomodoroSession {
  id: string
  type: "work" | "shortBreak" | "longBreak"
  duration: number
  completedAt: string
  date: string
}

interface PomodoroTimerProps {
  userId: string
}

export function PomodoroTimer({ userId }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false)
  const [currentSession, setCurrentSession] = useState<"work" | "shortBreak" | "longBreak">("work")
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [sessions, setSessions] = useState<PomodoroSession[]>([])
  const [settings, setSettings] = useState<PomodoroSettings>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pomodoroSettings")
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return {
      workDuration: 25,
      shortBreak: 5,
      longBreak: 15,
      longBreakInterval: 4,
      autoStartBreaks: false,
      autoStartPomodoros: false,
      enableSounds: true,
      enableTickingSound: false,
      volume: 50,
    }
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const tickingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load sessions from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSessions = localStorage.getItem(`pomodoroSessions_${userId}`)
      if (savedSessions) {
        setSessions(JSON.parse(savedSessions))
      }
    }
  }, [userId])

  // Save sessions to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`pomodoroSessions_${userId}`, JSON.stringify(sessions))
    }
  }, [sessions, userId])

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleSessionComplete()
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
  }, [isActive, timeLeft])

  // Ticking sound
  useEffect(() => {
    if (isActive && settings.enableTickingSound && settings.enableSounds) {
      tickingIntervalRef.current = setInterval(() => {
        playTickSound()
      }, 1000)
    } else {
      if (tickingIntervalRef.current) {
        clearInterval(tickingIntervalRef.current)
      }
    }

    return () => {
      if (tickingIntervalRef.current) {
        clearInterval(tickingIntervalRef.current)
      }
    }
  }, [isActive, settings.enableTickingSound, settings.enableSounds])

  const playSound = (frequency: number, duration: number) => {
    if (!audioContextRef.current || !settings.enableSounds) return

    const oscillator = audioContextRef.current.createOscillator()
    const gainNode = audioContextRef.current.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContextRef.current.destination)

    oscillator.frequency.value = frequency
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime)
    gainNode.gain.linearRampToValueAtTime((settings.volume / 100) * 0.1, audioContextRef.current.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration)

    oscillator.start(audioContextRef.current.currentTime)
    oscillator.stop(audioContextRef.current.currentTime + duration)
  }

  const playTickSound = () => {
    playSound(800, 0.1)
  }

  const playCompletionSound = () => {
    // Play a pleasant completion sound
    setTimeout(() => playSound(523, 0.2), 0) // C5
    setTimeout(() => playSound(659, 0.2), 200) // E5
    setTimeout(() => playSound(784, 0.4), 400) // G5
  }

  const handleSessionComplete = () => {
    setIsActive(false)
    playCompletionSound()

    // Save completed session
    const newSession: PomodoroSession = {
      id: Date.now().toString(),
      type: currentSession,
      duration: getDurationForSession(currentSession),
      completedAt: new Date().toISOString(),
      date: new Date().toDateString(),
    }
    setSessions((prev) => [newSession, ...prev])

    if (currentSession === "work") {
      setCompletedPomodoros((prev) => prev + 1)
      // Determine next session
      const nextPomodoroCount = completedPomodoros + 1
      if (nextPomodoroCount % settings.longBreakInterval === 0) {
        setCurrentSession("longBreak")
        setTimeLeft(settings.longBreak * 60)
      } else {
        setCurrentSession("shortBreak")
        setTimeLeft(settings.shortBreak * 60)
      }

      if (settings.autoStartBreaks) {
        setTimeout(() => setIsActive(true), 1000)
      }
    } else {
      // Break completed, start work session
      setCurrentSession("work")
      setTimeLeft(settings.workDuration * 60)

      if (settings.autoStartPomodoros) {
        setTimeout(() => setIsActive(true), 1000)
      }
    }
  }

  const getDurationForSession = (session: "work" | "shortBreak" | "longBreak") => {
    switch (session) {
      case "work":
        return settings.workDuration
      case "shortBreak":
        return settings.shortBreak
      case "longBreak":
        return settings.longBreak
      default:
        return settings.workDuration
    }
  }

  const handleStart = () => {
    setIsActive(true)
  }

  const handlePause = () => {
    setIsActive(false)
  }

  const handleReset = () => {
    setIsActive(false)
    setTimeLeft(getDurationForSession(currentSession) * 60)
  }

  const handleSkipSession = () => {
    setTimeLeft(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getSessionLabel = () => {
    switch (currentSession) {
      case "work":
        return "Trabajo"
      case "shortBreak":
        return "Descanso Corto"
      case "longBreak":
        return "Descanso Largo"
      default:
        return "Trabajo"
    }
  }

  const getSessionColor = () => {
    switch (currentSession) {
      case "work":
        return "bg-red-500"
      case "shortBreak":
        return "bg-green-500"
      case "longBreak":
        return "bg-blue-500"
      default:
        return "bg-red-500"
    }
  }

  const totalDuration = getDurationForSession(currentSession) * 60
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100

  // Get today's sessions
  const today = new Date().toDateString()
  const todaySessions = sessions.filter((session) => session.date === today)
  const todayWorkSessions = todaySessions.filter((session) => session.type === "work").length
  const todayTotalTime = todaySessions.reduce((total, session) => total + session.duration, 0)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getSessionColor()}`} />
            {getSessionLabel()}
          </CardTitle>
          <CardDescription>
            Sesión {completedPomodoros + 1} • {todayWorkSessions} completadas hoy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-primary mb-4">{formatTime(timeLeft)}</div>
            <Progress value={progress} className="w-full h-2" />
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            {!isActive ? (
              <Button onClick={handleStart} size="lg" className="px-8">
                <Play className="w-5 h-5 mr-2" />
                Iniciar
              </Button>
            ) : (
              <Button onClick={handlePause} size="lg" variant="secondary" className="px-8">
                <Pause className="w-5 h-5 mr-2" />
                Pausar
              </Button>
            )}
            <Button onClick={handleReset} size="lg" variant="outline">
              <RotateCcw className="w-5 h-5 mr-2" />
              Reiniciar
            </Button>
            <Button onClick={handleSkipSession} size="lg" variant="outline">
              Saltar
            </Button>
          </div>

          {/* Session Info */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{completedPomodoros}</div>
              <div className="text-sm text-muted-foreground">Pomodoros</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{todayWorkSessions}</div>
              <div className="text-sm text-muted-foreground">Hoy</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{Math.round(todayTotalTime / 60)}m</div>
              <div className="text-sm text-muted-foreground">Tiempo Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats and History */}
      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Estadísticas de Hoy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {todaySessions.filter((s) => s.type === "work").length}
                  </div>
                  <div className="text-sm text-red-600">Sesiones de Trabajo</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {todaySessions.filter((s) => s.type !== "work").length}
                  </div>
                  <div className="text-sm text-green-600">Descansos</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {sessions.slice(0, 10).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          session.type === "work"
                            ? "bg-red-500"
                            : session.type === "shortBreak"
                              ? "bg-green-500"
                              : "bg-blue-500"
                        }`}
                      />
                      <span className="text-sm">
                        {session.type === "work"
                          ? "Trabajo"
                          : session.type === "shortBreak"
                            ? "Descanso Corto"
                            : "Descanso Largo"}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(session.completedAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                {sessions.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">No hay sesiones completadas aún</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sound Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {settings.enableSounds ? (
                <Volume2 className="w-5 h-5 text-primary" />
              ) : (
                <VolumeX className="w-5 h-5 text-muted-foreground" />
              )}
              <span className="text-sm">Sonidos {settings.enableSounds ? "activados" : "desactivados"}</span>
            </div>
            <Badge variant={settings.enableSounds ? "default" : "secondary"}>Volumen: {settings.volume}%</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
