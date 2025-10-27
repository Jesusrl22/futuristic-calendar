"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Settings, Moon, Sun, Globe, Bell, Volume2, Type, Maximize2 } from "lucide-react"
import { hybridDb } from "@/lib/hybrid-database"
import { useToast } from "@/hooks/use-toast"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  user: any
}

export function SettingsModal({ isOpen, onClose, user }: SettingsModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showMigrationWarning, setShowMigrationWarning] = useState(false)

  // Theme & Language
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [language, setLanguage] = useState<"es" | "en">("es")

  // Pomodoro Settings
  const [workDuration, setWorkDuration] = useState(25)
  const [shortBreakDuration, setShortBreakDuration] = useState(5)
  const [longBreakDuration, setLongBreakDuration] = useState(15)
  const [sessionsUntilLongBreak, setSessionsUntilLongBreak] = useState(4)

  // Notifications
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [volume, setVolume] = useState(50)

  // UI Preferences
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium")
  const [compactMode, setCompactMode] = useState(false)

  useEffect(() => {
    if (isOpen && user) {
      if (!user.id || user.id === "undefined") {
        console.error("Invalid userId in SettingsModal:", user.id)
        toast({
          title: "Error",
          description: "Invalid user session. Please log in again.",
          variant: "destructive",
        })
        onClose()
        return
      }

      loadSettings()
    }
  }, [isOpen, user])

  const loadSettings = async () => {
    if (!user?.id) return

    try {
      const userData = await hybridDb.getUser(user.id)

      if (userData) {
        setTheme((userData.theme as "light" | "dark") || "dark")
        setLanguage((userData.language as "es" | "en") || "es")

        // Handle both old and new field names
        setWorkDuration(userData.work_duration || userData.pomodoro_work_duration || 25)
        setShortBreakDuration(userData.short_break_duration || userData.pomodoro_break_duration || 5)
        setLongBreakDuration(userData.long_break_duration || userData.pomodoro_long_break_duration || 15)
        setSessionsUntilLongBreak(
          userData.sessions_until_long_break || userData.pomodoro_sessions_until_long_break || 4,
        )

        setNotificationsEnabled(userData.notifications_enabled ?? true)
        setSoundEnabled(userData.sound_enabled ?? true)
        setVolume(userData.volume ?? 50)
        setFontSize((userData.font_size as "small" | "medium" | "large") || "medium")
        setCompactMode(userData.compact_mode ?? false)
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    }
  }

  const handleSave = async () => {
    if (!user?.id || user.id === "undefined") {
      toast({
        title: "Error",
        description: "Cannot save settings: Invalid user session",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setShowMigrationWarning(false)

    try {
      const updates = {
        theme,
        language,
        work_duration: workDuration,
        short_break_duration: shortBreakDuration,
        long_break_duration: longBreakDuration,
        sessions_until_long_break: sessionsUntilLongBreak,
        notifications_enabled: notificationsEnabled,
        sound_enabled: soundEnabled,
        volume,
        font_size: fontSize,
        compact_mode: compactMode,
      }

      const result = await hybridDb.updateUser(user.id, updates)

      if (result) {
        toast({
          title: "Settings saved",
          description: "Your preferences have been updated successfully.",
        })

        // Apply theme immediately
        if (theme === "dark") {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }

        onClose()
      } else {
        setShowMigrationWarning(true)
        toast({
          title: "Partial save",
          description: "Some settings may not have been saved. Check the warning below.",
          variant: "warning" as any,
        })
      }
    } catch (error: any) {
      console.error("Error saving settings:", error)

      if (error?.message?.includes("column") && error?.message?.includes("does not exist")) {
        setShowMigrationWarning(true)
      }

      toast({
        title: "Error",
        description: "Failed to save some settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </DialogTitle>
          <DialogDescription>Customize your FutureTask experience</DialogDescription>
        </DialogHeader>

        {showMigrationWarning && (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database Migration Needed</AlertTitle>
            <AlertDescription>
              Some advanced settings columns don't exist in your database yet. To enable all settings features, run the
              SQL script:{" "}
              <code className="text-xs bg-yellow-100 dark:bg-yellow-900 px-1 py-0.5 rounded">
                scripts/add-settings-columns.sql
              </code>{" "}
              in your Supabase dashboard.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="appearance">
              <Sun className="w-4 h-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="pomodoro">
              <Settings className="w-4 h-4 mr-2" />
              Pomodoro
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="ui">
              <Type className="w-4 h-4 mr-2" />
              UI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme" className="flex items-center gap-2">
                {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                Theme
              </Label>
              <Select value={theme} onValueChange={(v) => setTheme(v as "light" | "dark")}>
                <SelectTrigger id="theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Language
              </Label>
              <Select value={language} onValueChange={(v) => setLanguage(v as "es" | "en")}>
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="pomodoro" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="work-duration">Work Duration (minutes)</Label>
              <Input
                id="work-duration"
                type="number"
                min="1"
                max="60"
                value={workDuration}
                onChange={(e) => setWorkDuration(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="short-break">Short Break (minutes)</Label>
              <Input
                id="short-break"
                type="number"
                min="1"
                max="30"
                value={shortBreakDuration}
                onChange={(e) => setShortBreakDuration(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="long-break">Long Break (minutes)</Label>
              <Input
                id="long-break"
                type="number"
                min="1"
                max="60"
                value={longBreakDuration}
                onChange={(e) => setLongBreakDuration(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessions">Sessions Until Long Break</Label>
              <Input
                id="sessions"
                type="number"
                min="1"
                max="10"
                value={sessionsUntilLongBreak}
                onChange={(e) => setSessionsUntilLongBreak(Number(e.target.value))}
              />
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Enable Notifications
              </Label>
              <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="sound" className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Enable Sound
              </Label>
              <Switch id="sound" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="volume">Volume: {volume}%</Label>
              <Input
                id="volume"
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                disabled={!soundEnabled}
              />
            </div>
          </TabsContent>

          <TabsContent value="ui" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="font-size" className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                Font Size
              </Label>
              <Select value={fontSize} onValueChange={(v) => setFontSize(v as any)}>
                <SelectTrigger id="font-size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="compact" className="flex items-center gap-2">
                <Maximize2 className="w-4 h-4" />
                Compact Mode
              </Label>
              <Switch id="compact" checked={compactMode} onCheckedChange={setCompactMode} />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
