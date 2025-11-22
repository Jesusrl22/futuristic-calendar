"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation, type Language } from "@/lib/translations"
import { useToast } from "@/hooks/use-toast"
import { getThemesByTier, canUseCustomTheme, applyTheme, type Theme } from "@/lib/themes"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [profile, setProfile] = useState({
    email: "",
    theme: "default",
    language: "en" as Language,
    notifications: true,
    timezone: "UTC",
    plan: "free",
    customPrimary: "",
    customSecondary: "",
  })
  const [loading, setLoading] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [availableThemes, setAvailableThemes] = useState<Theme[]>([])
  const [showCustom, setShowCustom] = useState(false)
  const { t } = useTranslation(profile.language)

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    console.log("[v0] Current plan state:", profile.plan)
    const themes = getThemesByTier(profile.plan)
    console.log(
      "[v0] Available themes count:",
      themes.length,
      themes.map((t) => t.id),
    )
    setAvailableThemes(themes)
    setShowCustom(canUseCustomTheme(profile.plan))
  }, [profile.plan])

  useEffect(() => {
    if (!isInitialLoad) {
      if (profile.theme === "custom") {
        applyTheme("custom", profile.customPrimary, profile.customSecondary)
      } else {
        applyTheme(profile.theme)
      }
    }
  }, [profile.theme, profile.customPrimary, profile.customSecondary, isInitialLoad])

  const fetchProfile = async () => {
    try {
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

      const profileResponse = await fetch("/api/user/profile")
      const settingsResponse = await fetch("/api/settings")

      if (!profileResponse.ok) {
        console.error("[v0] Failed to fetch profile")
        setIsInitialLoad(false)
        return
      }

      const profileData = await profileResponse.json()
      const settingsData = settingsResponse.ok ? await settingsResponse.json() : null

      console.log("[v0] Profile data:", profileData)
      console.log("[v0] Settings data:", settingsData)

      const userPlan = (profileData.subscription_plan || "free").toLowerCase().trim()
      console.log("[v0] Detected user plan:", userPlan)

      let savedTheme = localStorage.getItem("theme") || "default"
      let themePreference: any = null

      if (settingsData?.profile) {
        const dbTheme = settingsData.profile.theme || "default"
        if (dbTheme !== savedTheme) {
          savedTheme = dbTheme
        }

        themePreference = settingsData.profile.theme_preference

        if (typeof themePreference === "string") {
          try {
            themePreference = JSON.parse(themePreference)
          } catch {
            themePreference = null
          }
        }
      }

      const customPrimary = themePreference?.customPrimary || localStorage.getItem("customPrimary") || ""
      const customSecondary = themePreference?.customSecondary || localStorage.getItem("customSecondary") || ""

      const newProfile = {
        email: profileData.email || "",
        theme: savedTheme,
        language: (settingsData?.profile?.language || "en") as Language,
        notifications: settingsData?.profile?.notifications ?? true,
        timezone: detectedTimezone,
        plan: userPlan,
        customPrimary,
        customSecondary,
      }

      console.log("[v0] Setting profile state:", newProfile)
      setProfile(newProfile)
      setIsInitialLoad(false)

      localStorage.setItem("timezone", detectedTimezone)
      localStorage.setItem("language", newProfile.language)
      localStorage.setItem("theme", newProfile.theme)
      localStorage.setItem("userPlan", userPlan)

      if (customPrimary) {
        localStorage.setItem("customPrimary", customPrimary)
      }
      if (customSecondary) {
        localStorage.setItem("customSecondary", customSecondary)
      }
    } catch (error) {
      console.error("[v0] Error fetching settings:", error)
      setIsInitialLoad(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

      const themePreference =
        profile.theme === "custom"
          ? {
              customPrimary: profile.customPrimary,
              customSecondary: profile.customSecondary,
            }
          : null

      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: profile.theme,
          theme_preference: themePreference ? JSON.stringify(themePreference) : null,
          language: profile.language,
          timezone: detectedTimezone,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        localStorage.setItem("notifications", profile.notifications.toString())
        localStorage.setItem("timezone", detectedTimezone)
        localStorage.setItem("language", profile.language)
        localStorage.setItem("theme", profile.theme)

        if (profile.theme === "custom") {
          localStorage.setItem("customPrimary", profile.customPrimary)
          localStorage.setItem("customSecondary", profile.customSecondary)
        }

        if (profile.theme === "custom") {
          applyTheme("custom", profile.customPrimary, profile.customSecondary)
        } else {
          applyTheme(profile.theme)
        }

        toast({
          title: "Settings saved",
          description: "Your settings have been updated successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: `Failed to save settings: ${result.error || "Unknown error"}`,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to save settings: ${error.message || "Network error"}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
        <h1 className="text-4xl font-bold mb-8 hidden md:block">
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
                      {availableThemes.map((theme) => (
                        <SelectItem key={theme.id} value={theme.id}>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <div
                                className="w-4 h-4 rounded border border-white/20"
                                style={{ background: `hsl(${theme.primary})` }}
                              />
                              <div
                                className="w-4 h-4 rounded border border-white/20"
                                style={{ background: `hsl(${theme.secondary})` }}
                              />
                            </div>
                            {theme.name}
                            <Badge variant="outline" className="text-xs">
                              {theme.tier}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                      {showCustom && (
                        <SelectItem value="custom">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <div className="w-4 h-4 rounded border border-white/20 bg-gradient-to-r from-purple-500 to-pink-500" />
                            </div>
                            Custom Theme
                            <Badge variant="outline" className="text-xs bg-primary/20">
                              PRO
                            </Badge>
                          </div>
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {profile.plan === "free" && "Upgrade to Premium or Pro for more themes"}
                    {profile.plan === "premium" && "Upgrade to Pro for custom themes"}
                    {profile.plan === "pro" && "You have access to all themes + custom"}
                  </p>
                </div>

                {profile.theme === "custom" && showCustom && (
                  <div className="space-y-4 p-4 border border-primary/20 rounded-lg bg-primary/5">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      Custom Theme Colors
                      <Badge variant="outline" className="text-xs">
                        PRO
                      </Badge>
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Primary Color (HSL)</Label>
                        <Input
                          placeholder="e.g., 280 70% 60%"
                          value={profile.customPrimary}
                          onChange={(e) => setProfile({ ...profile, customPrimary: e.target.value })}
                          className="bg-secondary/50"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Main accent color</p>
                      </div>
                      <div>
                        <Label>Secondary Color (HSL)</Label>
                        <Input
                          placeholder="e.g., 0 0% 15%"
                          value={profile.customSecondary}
                          onChange={(e) => setProfile({ ...profile, customSecondary: e.target.value })}
                          className="bg-secondary/50"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Background/muted color</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Use HSL format: Hue (0-360) Saturation (0-100%) Lightness (0-100%)
                    </p>
                  </div>
                )}

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
                  <Input value={`${profile.timezone} (Auto-detected)`} disabled className="bg-secondary/50" />
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
