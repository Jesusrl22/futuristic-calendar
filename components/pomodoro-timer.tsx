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
  workDuration?: number
  breakDuration?: number
  longBreakDuration?: number
  sessionsUntilLongBreak?: number
  isDemo?: boolean
}

export function PomodoroTimer({
  userId,
  workDuration = 25,
  breakDuration = 5,
  longBreakDuration = 15,
  sessionsUntilLongBreak = 4,
  isDemo = false,
}: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(workDuration * 60)
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
      workDuration,
      shortBreak: breakDuration,
      longBreak: longBreakDuration,
      longBreakInterval: sessionsUntilLongBreak,
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSessions = localStorage.getItem(`pomodoroSessions_${userId}`)
      if (savedSessions) {
        setSessions(JSON.parse(savedSessions))
      }
    }
  }, [userId])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`pomodoroSessions_${userId}`, JSON.stringify(sessions))
    }
  }, [sessions, userId])

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
    setTimeout(() => playSound(523, 0.2), 0)
    setTimeout(() => playSound(659, 0.2), 200)
    setTimeout(() => playSound(784, 0.4), 400)
  }

  const handleSessionComplete = () => {
    setIsActive(false)
    playCompletionSound()

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
        return "bg-destructive"
      case "shortBreak":
        return "bg-accent"
      case "longBreak":
        return "bg-primary"
      default:
        return "bg-destructive"
    }
  }

  const totalDuration = getDurationForSession(currentSession) * 60
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100

  const today = new Date().toDateString()
  const todaySessions = sessions.filter((session) => session.date === today)
  const todayWorkSessions = todaySessions.filter((session) => session.type === "work").length
  const todayTotalTime = todaySessions.reduce((total, session) => total + session.duration, 0)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="border-border bg-card">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getSessionColor()}`} />
            {getSessionLabel()}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sesión {completedPomodoros + 1} • {todayWorkSessions} completadas hoy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-primary mb-4">{formatTime(timeLeft)}</div>
            <Progress value={progress} className="w-full h-2" />
          </div>

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

      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <BarChart3 className="w-5 h-5" />
                Estadísticas de Hoy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                  <div className="text-2xl font-bold text-destructive">
                    {todaySessions.filter((s) => s.type === "work").length}
                  </div>
                  <div className="text-sm text-destructive">Sesiones de Trabajo</div>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <div className="text-2xl font-bold text-accent-foreground">
                    {todaySessions.filter((s) => s.type !== "work").length}
                  </div>
                  <div className="text-sm text-accent-foreground">Descansos</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Historial Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {sessions.slice(0, 10).map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-2 bg-muted rounded border border-border"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          session.type === "work"
                            ? "bg-destructive"
                            : session.type === "shortBreak"
                              ? "bg-accent"
                              : "bg-primary"
                        }`}
                      />
                      <span className="text-sm text-foreground">
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

      <Card className="border-border bg-card">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {settings.enableSounds ? (
                <Volume2 className="w-5 h-5 text-primary" />
              ) : (
                <VolumeX className="w-5 h-5 text-muted-foreground" />
              )}
              <span className="text-sm text-foreground">
                Sonidos {settings.enableSounds ? "activados" : "desactivados"}
              </span>
            </div>
            <Badge variant={settings.enableSounds ? "default" : "secondary"}>Volumen: {settings.volume}%</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
