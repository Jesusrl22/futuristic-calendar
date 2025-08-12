"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Pause, RotateCcw, Settings, Volume2, VolumeX, Coffee, Target } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

interface PomodoroTimerProps {
  onBack: () => void
  pomodoroTime: number
  breakTime: number
  soundEnabled: boolean
}

type TimerMode = "work" | "shortBreak" | "longBreak"

export function PomodoroTimer({ onBack, pomodoroTime, breakTime, soundEnabled }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(pomodoroTime * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<TimerMode>("work")
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [totalPomodoros, setTotalPomodoros] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [localPomodoroTime, setLocalPomodoroTime] = useState(pomodoroTime)
  const [localBreakTime, setLocalBreakTime] = useState(breakTime)
  const [localSoundEnabled, setLocalSoundEnabled] = useState(soundEnabled)
  const [autoStartBreaks, setAutoStartBreaks] = useState(false)
  const [autoStartPomodoros, setAutoStartPomodoros] = useState(false)
  const [longBreakInterval, setLongBreakInterval] = useState(4)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/notification.mp3")
      audioRef.current.volume = 0.5
    }
  }, [])

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleTimerComplete()
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

  const handleTimerComplete = () => {
    setIsRunning(false)

    if (localSoundEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Fallback if audio fails
        console.log("Audio notification failed")
      })
    }

    if (mode === "work") {
      const newCompletedPomodoros = completedPomodoros + 1
      setCompletedPomodoros(newCompletedPomodoros)
      setTotalPomodoros(totalPomodoros + 1)

      // Determine next break type
      const isLongBreak = newCompletedPomodoros % longBreakInterval === 0
      const nextMode = isLongBreak ? "longBreak" : "shortBreak"
      const nextTime = isLongBreak ? localBreakTime * 3 : localBreakTime

      setMode(nextMode)
      setTimeLeft(nextTime * 60)

      if (autoStartBreaks) {
        setIsRunning(true)
      }
    } else {
      setMode("work")
      setTimeLeft(localPomodoroTime * 60)

      if (autoStartPomodoros) {
        setIsRunning(true)
      }
    }
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    const time = mode === "work" ? localPomodoroTime : mode === "longBreak" ? localBreakTime * 3 : localBreakTime
    setTimeLeft(time * 60)
  }

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false)
    setMode(newMode)
    const time = newMode === "work" ? localPomodoroTime : newMode === "longBreak" ? localBreakTime * 3 : localBreakTime
    setTimeLeft(time * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getProgress = () => {
    const totalTime =
      mode === "work" ? localPomodoroTime * 60 : mode === "longBreak" ? localBreakTime * 3 * 60 : localBreakTime * 60
    return ((totalTime - timeLeft) / totalTime) * 100
  }

  const getModeConfig = () => {
    switch (mode) {
      case "work":
        return {
          title: "Tiempo de Trabajo",
          color: "from-red-500 to-orange-500",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          icon: <Target className="w-6 h-6" />,
        }
      case "shortBreak":
        return {
          title: "Descanso Corto",
          color: "from-green-500 to-emerald-500",
          bgColor: "bg-green-50 dark:bg-green-900/20",
          icon: <Coffee className="w-6 h-6" />,
        }
      case "longBreak":
        return {
          title: "Descanso Largo",
          color: "from-blue-500 to-cyan-500",
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
          icon: <Coffee className="w-6 h-6" />,
        }
    }
  }

  const modeConfig = getModeConfig()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Timer Pomodoro</h1>
            <p className="text-gray-600 dark:text-gray-400">Mantén el foco con la técnica Pomodoro</p>
          </div>
        </div>

        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configuración
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configuración del Timer</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Tiempo de trabajo: {localPomodoroTime} min</Label>
                  <Slider
                    value={[localPomodoroTime]}
                    onValueChange={(value) => setLocalPomodoroTime(value[0])}
                    max={60}
                    min={15}
                    step={5}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Tiempo de descanso: {localBreakTime} min</Label>
                  <Slider
                    value={[localBreakTime]}
                    onValueChange={(value) => setLocalBreakTime(value[0])}
                    max={30}
                    min={5}
                    step={5}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Descanso largo cada: {longBreakInterval} pomodoros</Label>
                  <Slider
                    value={[longBreakInterval]}
                    onValueChange={(value) => setLongBreakInterval(value[0])}
                    max={8}
                    min={2}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Sonidos de notificación</Label>
                  <Switch checked={localSoundEnabled} onCheckedChange={setLocalSoundEnabled} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Auto-iniciar descansos</Label>
                  <Switch checked={autoStartBreaks} onCheckedChange={setAutoStartBreaks} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Auto-iniciar pomodoros</Label>
                  <Switch checked={autoStartPomodoros} onCheckedChange={setAutoStartPomodoros} />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timer Card */}
        <div className="lg:col-span-2">
          <Card className={`${modeConfig.bgColor} border-0 shadow-lg`}>
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                {modeConfig.icon}
                <CardTitle className="text-2xl">{modeConfig.title}</CardTitle>
              </div>
              <div className="flex justify-center space-x-2">
                <Button
                  variant={mode === "work" ? "default" : "outline"}
                  size="sm"
                  onClick={() => switchMode("work")}
                  disabled={isRunning}
                >
                  Trabajo
                </Button>
                <Button
                  variant={mode === "shortBreak" ? "default" : "outline"}
                  size="sm"
                  onClick={() => switchMode("shortBreak")}
                  disabled={isRunning}
                >
                  Descanso
                </Button>
                <Button
                  variant={mode === "longBreak" ? "default" : "outline"}
                  size="sm"
                  onClick={() => switchMode("longBreak")}
                  disabled={isRunning}
                >
                  Descanso Largo
                </Button>
              </div>
            </CardHeader>

            <CardContent className="text-center space-y-6">
              {/* Timer Display */}
              <div className="relative">
                <div className="text-8xl md:text-9xl font-mono font-bold text-gray-900 dark:text-gray-100">
                  {formatTime(timeLeft)}
                </div>
                <Progress value={getProgress()} className="mt-4 h-3" />
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={toggleTimer}
                  size="lg"
                  className={`bg-gradient-to-r ${modeConfig.color} hover:opacity-90 text-white px-8`}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Iniciar
                    </>
                  )}
                </Button>

                <Button onClick={resetTimer} variant="outline" size="lg" disabled={isRunning}>
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reiniciar
                </Button>

                <Button onClick={() => setLocalSoundEnabled(!localSoundEnabled)} variant="outline" size="lg">
                  {localSoundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Session Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estadísticas de Hoy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Pomodoros completados</span>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {completedPomodoros}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total de sesiones</span>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {totalPomodoros}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tiempo enfocado</span>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {Math.floor((completedPomodoros * localPomodoroTime) / 60)}h{" "}
                  {(completedPomodoros * localPomodoroTime) % 60}m
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Progress to Long Break */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progreso al Descanso Largo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Progreso</span>
                  <span>
                    {completedPomodoros % longBreakInterval}/{longBreakInterval}
                  </span>
                </div>
                <Progress
                  value={((completedPomodoros % longBreakInterval) / longBreakInterval) * 100}
                  className="h-2"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {longBreakInterval - (completedPomodoros % longBreakInterval)} pomodoros restantes
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💡 Consejos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <p>• Elimina todas las distracciones antes de empezar</p>
                <p>• Durante los descansos, levántate y muévete</p>
                <p>• Mantén una botella de agua cerca</p>
                <p>• Usa los descansos largos para relajarte completamente</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
