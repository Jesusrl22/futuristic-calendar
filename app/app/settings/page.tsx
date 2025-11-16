"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation, type Language } from "@/lib/translations"

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    email: "",
    theme: "neon-tech",
    language: "en" as Language,
    notifications: true,
    timezone: "UTC",
  })
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation(profile.language)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      console.log("[v0] Fetching profile settings...")
      const response = await fetch("/api/settings")
      const data = await response.json()
      console.log("[v0] Profile data received:", data)

      if (data.profile) {
        const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        const savedTimezone = data.profile.timezone || detectedTimezone
        
        console.log("[v0] Detected timezone:", detectedTimezone)
        console.log("[v0] Saved timezone:", savedTimezone)
        
        setProfile({
          email: data.email || "",
          theme: data.profile.theme || "neon-tech",
          language: data.profile.language || "en",
          notifications: data.profile.notifications ?? true,
          timezone: savedTimezone,
        })
        
        localStorage.setItem("timezone", savedTimezone)
      }
    } catch (error) {
      console.error("[v0] Error fetching settings:", error)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      console.log("[v0] Saving settings with timezone:", profile.timezone)
      
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: profile.theme,
          language: profile.language,
          notifications: profile.notifications,
          timezone: profile.timezone,
        }),
      })
      
      const result = await response.json()
      console.log("[v0] Save response:", result)
      
      if (response.ok) {
        localStorage.setItem("timezone", profile.timezone)
        localStorage.setItem("language", profile.language)
        alert("Settings saved successfully! The page will reload to apply changes.")
        window.location.reload()
      } else {
        console.error("[v0] Failed to save:", result)
        alert("Failed to save settings: " + (result.error || "Unknown error"))
      }
    } catch (error) {
      console.error("[v0] Error saving settings:", error)
      alert("Failed to save settings")
    }
    setLoading(false)
  }

  const timezones = [
    { value: "UTC", label: "UTC (Coordinated Universal Time)" },
    { value: "Europe/Madrid", label: "Europe/Madrid (Spain - UTC+1/+2)" },
    { value: "Europe/London", label: "Europe/London (UK - UTC+0/+1)" },
    { value: "Europe/Paris", label: "Europe/Paris (France - UTC+1/+2)" },
    { value: "Europe/Berlin", label: "Europe/Berlin (Germany - UTC+1/+2)" },
    { value: "America/New_York", label: "America/New York (EST/EDT - UTC-5/-4)" },
    { value: "America/Chicago", label: "America/Chicago (CST/CDT - UTC-6/-5)" },
    { value: "America/Denver", label: "America/Denver (MST/MDT - UTC-7/-6)" },
    { value: "America/Los_Angeles", label: "America/Los Angeles (PST/PDT - UTC-8/-7)" },
    { value: "America/Mexico_City", label: "America/Mexico City (UTC-6)" },
    { value: "America/Sao_Paulo", label: "America/São Paulo (Brazil - UTC-3)" },
    { value: "Asia/Tokyo", label: "Asia/Tokyo (Japan - UTC+9)" },
    { value: "Asia/Shanghai", label: "Asia/Shanghai (China - UTC+8)" },
    { value: "Asia/Dubai", label: "Asia/Dubai (UAE - UTC+4)" },
    { value: "Australia/Sydney", label: "Australia/Sydney (UTC+10/+11)" },
  ]

  return (
    <div className="p-8">
      <div>
        <h1 className="text-4xl font-bold mb-8">
          <span className="text-primary neon-text">{t("settings")}</span>
        </h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="glass-card p-6 neon-glow">
              <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
              <div className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input value={profile.email} disabled className="bg-secondary/50" />
                  <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <Label>{t("theme")}</Label>
                  <Select value={profile.theme} onValueChange={(value) => setProfile({ ...profile, theme: value })}>
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neon-tech">Neon Tech</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{t("language")}</Label>
                  <Select
                    value={profile.language}
                    onValueChange={(value: Language) => {
                      setProfile({ ...profile, language: value })
                    }}
                  >
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="it">Italiano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Timezone / Region</Label>
                  <Select
                    value={profile.timezone}
                    onValueChange={(value) => {
                      console.log("[v0] Timezone changed to:", value)
                      setProfile({ ...profile, timezone: value })
                    }}
                  >
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Current time: {new Date().toLocaleString("en-US", { timeZone: profile.timezone })}
                  </p>
                </div>

                <Button onClick={handleSave} disabled={loading} className="neon-glow-hover">
                  {loading ? "Saving..." : t("save")}
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card className="glass-card p-6 neon-glow">
              <h2 className="text-xl font-bold mb-6">Preferences</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Pomodoro Duration</Label>
                    <p className="text-sm text-muted-foreground">Default work session length</p>
                  </div>
                  <Select defaultValue="25">
                    <SelectTrigger className="w-32 bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 min</SelectItem>
                      <SelectItem value="25">25 min</SelectItem>
                      <SelectItem value="45">45 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-start breaks</Label>
                    <p className="text-sm text-muted-foreground">Automatically start break timer</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sound notifications</Label>
                    <p className="text-sm text-muted-foreground">Play sound when timer completes</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="glass-card p-6 neon-glow">
              <h2 className="text-xl font-bold mb-6">Notification Settings</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={profile.notifications}
                    onCheckedChange={(checked) => setProfile({ ...profile, notifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Task reminders</Label>
                    <p className="text-sm text-muted-foreground">Get reminded about upcoming tasks</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Achievement alerts</Label>
                    <p className="text-sm text-muted-foreground">Notify when you unlock achievements</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Button onClick={handleSave} disabled={loading} className="neon-glow-hover">
                  {loading ? "Saving..." : t("save")}
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
