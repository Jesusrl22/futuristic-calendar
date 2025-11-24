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
    console.log("[v0] Settings - Current plan state:", profile.plan)
    console.log("[v0] Settings - Plan type:", typeof profile.plan)
    console.log("[v0] Settings - Plan trimmed:", profile.plan.trim())

    const themes = getThemesByTier(profile.plan)
    console.log("[v0] Settings - Available themes count:", themes.length)
    console.log(
      "[v0] Settings - Theme IDs:",
      themes.map((t) => t.id),
    )
    console.log(
      "[v0] Settings - Theme tiers:",
      themes.map((t) => t.tier),
    )

    setAvailableThemes(themes)
    setShowCustom(canUseCustomTheme(profile.plan))
  }, [profile.plan])

  useEffect(() => {
    // Don't apply theme during initial load - let ThemeLoader handle it from localStorage
    if (isInitialLoad) {
      return
    }

    const timer = setTimeout(() => {
      console.log("[v0] Applying theme from settings:", profile.theme)

      if (profile.theme === "custom") {
        applyTheme("custom", profile.customPrimary, profile.customSecondary)
      } else {
        applyTheme(profile.theme)
      }
    }, 0)

    return () => clearTimeout(timer)
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

      console.log("[v0] ===== PLAN DETECTION DEBUG =====")
      console.log("[v0] Profile data:", profileData)
      console.log("[v0] Profile subscription_plan field:", profileData.subscription_plan)
      console.log("[v0] Profile subscription_plan type:", typeof profileData.subscription_plan)
      console.log("[v0] Settings data:", settingsData)
      console.log("[v0] ===================================")

      const userPlan = (profileData.subscription_plan || "free").toLowerCase().trim()
      console.log("[v0] Detected user plan (final):", userPlan)
      console.log("[v0] User plan type:", typeof userPlan)
      console.log("[v0] User plan length:", userPlan.length)
      console.log("[v0] User plan === 'pro':", userPlan === "pro")
      console.log("[v0] User plan === 'premium':", userPlan === "premium")
      console.log("[v0] User plan === 'free':", userPlan === "free")

      const existingTheme = localStorage.getItem("theme")
      let savedTheme = existingTheme || "default"
      let themePreference: any = null

      if (settingsData?.profile?.theme) {
        savedTheme = settingsData.profile.theme
        themePreference = settingsData.profile.theme_preference

        if (typeof themePreference === "string") {
          try {
            themePreference = JSON.parse(themePreference)
          } catch {
            themePreference = null
          }
        }

        if (savedTheme !== existingTheme) {
          localStorage.setItem("theme", savedTheme)
          console.log("[v0] Updated localStorage with theme from database:", savedTheme)
        }
      } else {
        console.log("[v0] No theme in database, keeping localStorage value:", existingTheme)
      }

      const customPrimary = themePreference?.customPrimary || localStorage.getItem("customPrimary") || ""
      const customSecondary = themePreference?.customSecondary || localStorage.getItem("customSecondary") || ""

      const newProfile = {
        email: profileData.email || "",
        theme: savedTheme,
        language: (settingsData?.profile?.language || localStorage.getItem("language") || "en") as Language,
        notifications: settingsData?.profile?.notifications ?? true,
        timezone: detectedTimezone,
        plan: userPlan,
        customPrimary,
        customSecondary,
      }

      console.log("[v0] Setting profile state with plan:", newProfile.plan)
      console.log("[v0] New profile object:", newProfile)

      setProfile(newProfile)
      setIsInitialLoad(false)

      localStorage.setItem("notifications", profile.notifications.toString())
      localStorage.setItem("timezone", detectedTimezone)
      localStorage.setItem("language", profile.language)
      localStorage.setItem("theme", profile.theme)

      if (profile.theme === "custom") {
        localStorage.setItem("customPrimary", profile.customPrimary)
        localStorage.setItem("customSecondary", profile.customSecondary)
      } else {
        localStorage.removeItem("customPrimary")
        localStorage.removeItem("customSecondary")
      }

      console.log("[v0] Profile loaded successfully with theme:", savedTheme)
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

      console.log("[v0] Saving theme to database:", profile.theme)
      console.log("[v0] Theme preference:", themePreference)

      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: profile.theme,
          theme_preference: themePreference,
          language: profile.language,
          timezone: detectedTimezone,
        }),
      })

      const result = await response.json()
      console.log("[v0] Save response:", result)

      if (response.ok && result.success) {
        localStorage.setItem("notifications", profile.notifications.toString())
        localStorage.setItem("timezone", detectedTimezone)
        localStorage.setItem("language", profile.language)
        localStorage.setItem("theme", profile.theme)

        if (profile.theme === "custom") {
          localStorage.setItem("customPrimary", profile.customPrimary)
          localStorage.setItem("customSecondary", profile.customSecondary)
        } else {
          localStorage.removeItem("customPrimary")
          localStorage.removeItem("customSecondary")
        }

        console.log("[v0] Theme saved successfully to database and localStorage:", profile.theme)

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
      console.error("[v0] Error saving settings:", error)
      toast({
        title: "Error",
        description: `Failed to save settings: ${error.message || "Network error"}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleThemeChange = (themeId: string) => {
    console.log("[v0] Theme changed to:", themeId)

    setProfile((prev) => ({ ...prev, theme: themeId }))

    setTimeout(() => {
      localStorage.setItem("theme", themeId)

      if (themeId === "custom" && profile.customPrimary && profile.customSecondary) {
        console.log("[v0] Saving custom colors:", profile.customPrimary, profile.customSecondary)
        localStorage.setItem("customPrimary", profile.customPrimary)
        localStorage.setItem("customSecondary", profile.customSecondary)
      } else if (themeId !== "custom") {
        localStorage.removeItem("customPrimary")
        localStorage.removeItem("customSecondary")
      }

      console.log("[v0] Theme immediately saved to localStorage:", themeId)
    }, 0)
  }

  const handleCustomColorChange = (type: "primary" | "secondary", value: string) => {
    const updatedProfile = {
      ...profile,
      [type === "primary" ? "customPrimary" : "customSecondary"]: value,
    }
    setProfile(updatedProfile)

    if (profile.theme === "custom") {
      setTimeout(() => {
        localStorage.setItem(type === "primary" ? "customPrimary" : "customSecondary", value)
        console.log(`[v0] Updated custom ${type} color in localStorage:`, value)

        if (type === "primary" && updatedProfile.customSecondary) {
          applyTheme("custom", value, updatedProfile.customSecondary)
        } else if (type === "secondary" && updatedProfile.customPrimary) {
          applyTheme("custom", updatedProfile.customPrimary, value)
        }
      }, 0)
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
                  <Select value={profile.theme} onValueChange={handleThemeChange}>
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
                  <div className="space-y-4 mt-4 p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {t.settings.customThemeDescription || "Create your own theme by selecting two colors"}
                    </p>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customPrimary">{t.settings.primaryColor || "Primary Color"}</Label>
                        <Input
                          id="customPrimary"
                          type="color"
                          value={profile.customPrimary || "#84cc16"}
                          onChange={(e) => handleCustomColorChange("primary", e.target.value)}
                          className="h-10 w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customSecondary">{t.settings.secondaryColor || "Secondary Color"}</Label>
                        <Input
                          id="customSecondary"
                          type="color"
                          value={profile.customSecondary || "#3b82f6"}
                          onChange={(e) => handleCustomColorChange("secondary", e.target.value)}
                          className="h-10 w-full"
                        />
                      </div>
                    </div>
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
