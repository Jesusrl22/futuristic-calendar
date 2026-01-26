"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/useTranslation"
import { useToast } from "@/hooks/use-toast"
import { getThemesByTier, canUseCustomTheme, applyTheme, type Theme } from "@/lib/themes"
import { CustomThemeManager, type CustomTheme } from "@/components/custom-theme-manager"
import { Badge } from "@/components/ui/badge"
import { AdsterraNativeBanner } from "@/components/adsterra-native-banner"
import { AdsterraMobileBanner } from "@/components/adsterra-mobile-banner"
import { useLanguage } from "@/contexts/language-context"
import { usePushNotifications } from "@/hooks/usePushNotifications"
import type { Language } from "@/lib/translations"

type ProfileType = {
  email: string
  theme: string
  customThemes: CustomTheme[]
  language: Language
  notifications: boolean
  timezone: string
  plan: string
  pomodoroWorkDuration: number
  pomodoroBreakDuration: number
  pomodoroLongBreakDuration: number
}

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { language: globalLanguage, setLanguage: setGlobalLanguage } = useLanguage()
  const {
    isSupported: notificationsSupported,
    isSubscribed,
    isLoading: notificationsLoading,
    enableNotifications,
    disableNotifications,
  } = usePushNotifications()

  const [profile, setProfile] = useState<ProfileType>({
    email: "",
    theme: "default",
    customThemes: [],
    language: globalLanguage,
    notifications: true,
    timezone: "UTC",
    plan: "free",
    pomodoroWorkDuration: 25,
    pomodoroBreakDuration: 5,
    pomodoroLongBreakDuration: 15,
  })
  const [loading, setLoading] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [availableThemes, setAvailableThemes] = useState<Theme[]>([])
  const [showCustomThemes, setShowCustomThemes] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    const themes = getThemesByTier(profile.plan)
    setAvailableThemes(themes)
    setShowCustomThemes(canUseCustomTheme(profile.plan))
  }, [profile.plan])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/settings")
      const settingsData = await response.json()

      if (settingsData?.profile) {
        const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        let plan = settingsData.profile.subscription_tier || "free"

        plan =
          typeof plan === "string"
            ? plan
                .toLowerCase()
                .trim()
                .replace(/[\s\-_]/g, "")
            : String(plan)
                .toLowerCase()
                .trim()
                .replace(/[\s\-_]/g, "")

        let customThemes: CustomTheme[] = []
        if (settingsData.profile.custom_themes) {
          try {
            customThemes =
              typeof settingsData.profile.custom_themes === "string"
                ? JSON.parse(settingsData.profile.custom_themes)
                : settingsData.profile.custom_themes
          } catch (e) {
            customThemes = []
          }
        }

        const newProfile: ProfileType = {
          email: settingsData.email || "",
          theme: settingsData.profile.theme || "default",
          customThemes: customThemes,
          language: settingsData.profile.language || localStorage.getItem("language") || globalLanguage,
          notifications: true,
          timezone: settingsData.profile.timezone || detectedTimezone,
          pomodoroWorkDuration: settingsData.profile.pomodoro_work_duration || 25,
          pomodoroBreakDuration: settingsData.profile.pomodoro_break_duration || 5,
          pomodoroLongBreakDuration: settingsData.profile.pomodoro_long_break_duration || 15,
          plan: plan,
        }

        setProfile(newProfile)
        setIsInitialLoad(false)

        // Apply the saved theme
        if (newProfile.customThemes.some((t) => t.id === newProfile.theme)) {
          const customTheme = newProfile.customThemes.find((t) => t.id === newProfile.theme)
          if (customTheme) {
            applyTheme(newProfile.theme, customTheme.primary, customTheme.secondary)
          }
        } else {
          applyTheme(newProfile.theme)
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: profile.theme,
          custom_themes: profile.customThemes,
          language: profile.language,
          timezone: detectedTimezone,
          pomodoro_work_duration: profile.pomodoroWorkDuration,
          pomodoro_break_duration: profile.pomodoroBreakDuration,
          pomodoro_long_break_duration: profile.pomodoroLongBreakDuration,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        localStorage.setItem("timezone", detectedTimezone)
        localStorage.setItem("language", profile.language)
        localStorage.setItem("theme", profile.theme)

        setGlobalLanguage(profile.language)

        // Apply the theme
        const customTheme = profile.customThemes.find((t) => t.id === profile.theme)
        if (customTheme) {
          applyTheme(profile.theme, customTheme.primary, customTheme.secondary)
        } else {
          applyTheme(profile.theme)
        }

        toast({
          title: "success",
          description: "Settings saved successfully",
        })
      } else {
        toast({
          title: "error",
          description: result.error || "Failed to save settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleThemeChange = (themeId: string) => {
    setProfile((prev) => ({ ...prev, theme: themeId }))
    localStorage.setItem("theme", themeId)

    // Apply theme immediately
    const customTheme = profile.customThemes.find((t) => t.id === themeId)
    if (customTheme) {
      applyTheme(themeId, customTheme.primary, customTheme.secondary)
    } else {
      applyTheme(themeId)
    }
  }

  const handleThemeSave = async (theme: CustomTheme) => {
    const updatedThemes = profile.customThemes.some((t) => t.id === theme.id)
      ? profile.customThemes.map((t) => (t.id === theme.id ? theme : t))
      : [...profile.customThemes, theme]

    setProfile((prev) => ({ ...prev, customThemes: updatedThemes }))

    // Save to database
    try {
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          custom_themes: updatedThemes,
        }),
      })

      if (profile.theme === theme.id) {
        applyTheme(theme.id, theme.primary, theme.secondary)
      }
    } catch (error) {
      console.error("Error saving custom theme:", error)
      throw error
    }
  }

  const handleThemeDelete = async (themeId: string) => {
    const updatedThemes = profile.customThemes.filter((t) => t.id !== themeId)
    setProfile((prev) => ({ ...prev, customThemes: updatedThemes }))

    // If deleted theme was selected, switch to default
    if (profile.theme === themeId) {
      setProfile((prev) => ({ ...prev, theme: "default" }))
      applyTheme("default")
    }

    // Save to database
    try {
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          custom_themes: updatedThemes,
          theme: profile.theme === themeId ? "default" : profile.theme,
        }),
      })
    } catch (error) {
      console.error("Error deleting custom theme:", error)
      throw error
    }
  }

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      await enableNotifications()
    } else {
      await disableNotifications()
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
    <div className="p-3 sm:p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 hidden md:block">
          <span className="text-primary neon-text">{t("settings")}</span>
        </h1>

        <Tabs defaultValue="general" className="space-y-6">
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <TabsList className="grid w-full min-w-[400px] md:min-w-0 grid-cols-3 mb-6">
              <TabsTrigger value="general" className="text-xs md:text-sm">
                {t("general_settings")}
              </TabsTrigger>
              <TabsTrigger value="theme" className="text-xs md:text-sm">
                {t("theme_settings")}
              </TabsTrigger>
              <TabsTrigger value="notifications" className="text-xs md:text-sm">
                {t("notifications_settings")}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="general">
            <Card className="glass-card p-4 sm:p-6 neon-glow">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">{t("general_settings")}</h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm">{t("email")}</Label>
                  <Input value={profile.email} disabled className="bg-secondary/50 text-sm" />
                  <p className="text-xs text-muted-foreground mt-1">{t("email_cannot_be_changed")}</p>
                </div>

                <div>
                  <Label className="text-sm">{t("language")}</Label>
                  <Select
                    value={profile.language}
                    onValueChange={(value: Language) => {
                      setProfile({ ...profile, language: value })
                      setGlobalLanguage(value)
                      localStorage.setItem("language", value)
                    }}
                  >
                    <SelectTrigger className="bg-secondary/50 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">{t("language_english")}</SelectItem>
                      <SelectItem value="es">{t("language_spanish")}</SelectItem>
                      <SelectItem value="fr">{t("language_french")}</SelectItem>
                      <SelectItem value="de">{t("language_german")}</SelectItem>
                      <SelectItem value="it">{t("language_italian")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm">{t("timezone_region")}</Label>
                  <Input value={`${profile.timezone} (Auto-detected)`} disabled className="bg-secondary/50 text-sm" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("current_time")}: {new Date().toLocaleString("en-US", { timeZone: profile.timezone })}
                  </p>
                </div>

                <div className="border-t pt-4 mt-6">
                  <h3 className="font-semibold mb-4">Pomodoro Settings</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm">Work Duration (min)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="60"
                        value={profile.pomodoroWorkDuration}
                        onChange={(e) =>
                          setProfile({ ...profile, pomodoroWorkDuration: Number(e.target.value) })
                        }
                        className="bg-secondary/50 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Break Duration (min)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="30"
                        value={profile.pomodoroBreakDuration}
                        onChange={(e) =>
                          setProfile({ ...profile, pomodoroBreakDuration: Number(e.target.value) })
                        }
                        className="bg-secondary/50 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Long Break (min)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="60"
                        value={profile.pomodoroLongBreakDuration}
                        onChange={(e) =>
                          setProfile({ ...profile, pomodoroLongBreakDuration: Number(e.target.value) })
                        }
                        className="bg-secondary/50 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end border-t pt-4 mt-4">
                  <Button variant="outline" onClick={() => router.push("/app")}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={loading} className="gap-2">
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="theme">
            <Card className="glass-card p-4 sm:p-6 neon-glow">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">{t("theme_settings")}</h2>
              <div className="space-y-6">
                <div>
                  <Label className="text-sm">{t("theme")}</Label>
                  <Select value={profile.theme} onValueChange={handleThemeChange}>
                    <SelectTrigger className="bg-secondary/50 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableThemes.map((theme) => (
                        <SelectItem key={theme.id} value={theme.id}>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="flex gap-1">
                              <div
                                className="w-3 h-3 md:w-4 md:h-4 rounded border border-white/20"
                                style={{ background: `hsl(${theme.primary})` }}
                              />
                              <div
                                className="w-3 h-3 md:w-4 md:h-4 rounded border border-white/20"
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
                      {profile.customThemes.map((theme) => (
                        <SelectItem key={theme.id} value={theme.id}>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="flex gap-1">
                              <div
                                className="w-3 h-3 md:w-4 md:h-4 rounded border border-white/20"
                                style={{ backgroundColor: theme.primary }}
                              />
                              <div
                                className="w-3 h-3 md:w-4 md:h-4 rounded border border-white/20"
                                style={{ backgroundColor: theme.secondary }}
                              />
                            </div>
                            {theme.name}
                            <Badge variant="outline" className="text-xs bg-primary/20">
                              CUSTOM
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {profile.plan === "free" && t("upgrade_for_more_themes")}
                    {profile.plan === "premium" && t("upgrade_for_custom_themes")}
                    {profile.plan === "pro" && t("all_themes_available")}
                  </p>
                </div>

                {showCustomThemes && (
                  <div className="border-t pt-6">
                    <CustomThemeManager
                      themes={profile.customThemes}
                      onThemeSave={handleThemeSave}
                      onThemeDelete={handleThemeDelete}
                      onThemeSelect={(theme) => handleThemeChange(theme.id)}
                      selectedThemeId={profile.theme}
                      maxThemes={5}
                    />
                  </div>
                )}

                <div className="flex gap-2 justify-end border-t pt-4">
                  <Button variant="outline" onClick={() => router.push("/app")}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={loading} className="gap-2">
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{t("pushNotifications")}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{t("pushNotificationsDescription")}</p>

                  {!notificationsSupported ? (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                      <p className="text-sm text-destructive">{t("notificationsNotSupported")}</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label className="text-base cursor-pointer">{t("enableNotifications")}</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {isSubscribed ? t("notificationsEnabled") : t("notificationsDisabled")}
                        </p>
                      </div>
                      <Switch
                        checked={isSubscribed}
                        onCheckedChange={handleNotificationToggle}
                        disabled={notificationsLoading}
                      />
                    </div>
                  )}
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">{t("notificationTypes")}</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>{t("taskReminders")}</Label>
                      <Switch defaultChecked disabled={!isSubscribed} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>{t("achievementNotifications")}</Label>
                      <Switch defaultChecked disabled={!isSubscribed} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>{t("eventReminders")}</Label>
                      <Switch defaultChecked disabled={!isSubscribed} />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {profile.plan === "free" && (
          <div className="mt-6">
            <AdsterraNativeBanner
              containerId="container-105a3c31d27607df87969077c87047d4"
              scriptSrc="//pl28151206.effectivegatecpm.com/105a3c31d27607df87969077c87047d4/invoke.js"
              className="hidden md:block"
            />
            <AdsterraMobileBanner
              adKey="5fedd77c571ac1a4c2ea68ca3d2bca98"
              width={320}
              height={50}
              className="block md:hidden"
            />
          </div>
        )}
      </div>
    </div>
  )
}


export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { language: globalLanguage, setLanguage: setGlobalLanguage } = useLanguage()
  const {
    isSupported: notificationsSupported,
    isSubscribed,
    isLoading: notificationsLoading,
    enableNotifications,
    disableNotifications,
  } = usePushNotifications()

  const [profile, setProfile] = useState<ProfileType>({
    email: "",
    theme: "default",
    language: globalLanguage,
    notifications: true,
    timezone: "UTC",
    plan: "free",
    customPrimary: "#7c3aed",
    customSecondary: "#ec4899",
    pomodoroWorkDuration: 25,
    pomodoroBreakDuration: 5,
    pomodoroLongBreakDuration: 15,
  })
  const [loading, setLoading] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [availableThemes, setAvailableThemes] = useState<Theme[]>([])
  const [showCustom, setShowCustom] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    const themes = getThemesByTier(profile.plan)
    setAvailableThemes(themes)
    setShowCustom(canUseCustomTheme(profile.plan))
  }, [profile.plan])

  useEffect(() => {
    if (isInitialLoad) {
      return
    }

    const timer = setTimeout(() => {
      if (profile.theme === "custom") {
        applyTheme("custom", profile.customPrimary, profile.customSecondary)
      } else {
        applyTheme(profile.theme)
      }
    }, 0)

    return () => clearTimeout(timer)
  }, [profile.theme, profile.customPrimary, profile.customSecondary, isInitialLoad])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/settings")
      const settingsData = await response.json()

      const savedTheme = localStorage.getItem("theme") || "default"

      if (settingsData?.profile) {
        const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        let plan = settingsData.profile.subscription_tier || "free"

        plan =
          typeof plan === "string"
            ? plan
                .toLowerCase()
                .trim()
                .replace(/[\s\-_]/g, "")
            : String(plan)
                .toLowerCase()
                .trim()
                .replace(/[\s\-_]/g, "")

        const newProfile: ProfileType = {
          email: settingsData.email || "",
          theme: settingsData.profile.theme || savedTheme || "default",
          customPrimary: settingsData.profile.customPrimary || localStorage.getItem("customPrimary") || "#7c3aed",
          customSecondary: settingsData.profile.customSecondary || localStorage.getItem("customSecondary") || "#ec4899",
          language: settingsData.profile.language || localStorage.getItem("language") || globalLanguage,
          notifications: true,
          timezone: settingsData.profile.timezone || detectedTimezone,
          pomodoroWorkDuration: settingsData.profile.pomodoro_work_duration || 25,
          pomodoroBreakDuration: settingsData.profile.pomodoro_break_duration || 5,
          pomodoroLongBreakDuration: settingsData.profile.pomodoro_long_break_duration || 15,
          plan: plan,
        }

        if (newProfile.customPrimary) {
          localStorage.setItem("customPrimary", newProfile.customPrimary)
        }
        if (newProfile.customSecondary) {
          localStorage.setItem("customSecondary", newProfile.customSecondary)
        }

        if (settingsData.profile.theme && settingsData.profile.theme !== savedTheme) {
          localStorage.setItem("theme", newProfile.theme)
        }

        setProfile(newProfile)
        setIsInitialLoad(false)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

      const themePreference =
        profile.theme === "custom"
          ? {
              customPrimary: profile.customPrimary || "#7c3aed",
              customSecondary: profile.customSecondary || "#ec4899",
            }
          : null

      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: profile.theme,
          theme_preference: themePreference,
          language: profile.language,
          timezone: detectedTimezone,
          pomodoro_work_duration: profile.pomodoroWorkDuration,
          pomodoro_break_duration: profile.pomodoroBreakDuration,
          pomodoro_long_break_duration: profile.pomodoroLongBreakDuration,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        localStorage.setItem("notifications", profile.notifications.toString())
        localStorage.setItem("timezone", detectedTimezone)
        localStorage.setItem("language", profile.language)
        localStorage.setItem("theme", profile.theme)

        setGlobalLanguage(profile.language)

        if (profile.theme === "custom") {
          const primaryColor = profile.customPrimary || "#7c3aed"
          const secondaryColor = profile.customSecondary || "#ec4899"
          localStorage.setItem("customPrimary", primaryColor)
          localStorage.setItem("customSecondary", secondaryColor)
          setTimeout(() => {
            applyTheme("custom", primaryColor, secondaryColor)
          }, 0)
        } else {
          applyTheme(profile.theme)
        }

        toast({
          title: "success",
          description: "Settings saved successfully",
        })
      } else {
        toast({
          title: "error",
          description: result.error || "Failed to save settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleThemeChange = (themeId: string) => {
    setProfile((prev) => ({ ...prev, theme: themeId }))

    setTimeout(() => {
      localStorage.setItem("theme", themeId)

      if (themeId === "custom" && profile.customPrimary && profile.customSecondary) {
        localStorage.setItem("customPrimary", profile.customPrimary)
        localStorage.setItem("customSecondary", profile.customSecondary)
      } else if (themeId !== "custom") {
        localStorage.removeItem("customPrimary")
        localStorage.removeItem("customSecondary")
      }
    }, 0)
  }

  const handleCustomColorChange = (type: "primary" | "secondary", value: string) => {
    const updatedProfile = {
      ...profile,
      [type === "primary" ? "customPrimary" : "customSecondary"]: value,
    }
    setProfile(updatedProfile)

    setTimeout(() => {
      const primary = type === "primary" ? value : updatedProfile.customPrimary || "#84cc16"
      const secondary = type === "secondary" ? value : updatedProfile.customSecondary || "#3b82f6"

      localStorage.setItem("customPrimary", primary)
      localStorage.setItem("customSecondary", secondary)

      if (profile.theme === "custom") {
        applyTheme("custom", primary, secondary)
      }
    }, 0)
  }

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      await enableNotifications()
    } else {
      await disableNotifications()
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
    <div className="p-3 sm:p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 hidden md:block">
          <span className="text-primary neon-text">{t("settings")}</span>
        </h1>

        <Tabs defaultValue="general" className="space-y-6">
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <TabsList className="grid w-full min-w-[400px] md:min-w-0 grid-cols-3 mb-6">
              <TabsTrigger value="general" className="text-xs md:text-sm">
                {t("general_settings")}
              </TabsTrigger>
              <TabsTrigger value="theme" className="text-xs md:text-sm">
                {t("theme_settings")}
              </TabsTrigger>
              <TabsTrigger value="notifications" className="text-xs md:text-sm">
                {t("notifications_settings")}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="general">
            <Card className="glass-card p-4 sm:p-6 neon-glow">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">{t("general_settings")}</h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm">{t("email")}</Label>
                  <Input value={profile.email} disabled className="bg-secondary/50 text-sm" />
                  <p className="text-xs text-muted-foreground mt-1">{t("email_cannot_be_changed")}</p>
                </div>

                <div>
                  <Label className="text-sm">{t("language")}</Label>
                  <Select
                    value={profile.language}
                    onValueChange={(value: Language) => {
                      setProfile({ ...profile, language: value })
                      setGlobalLanguage(value)
                      localStorage.setItem("language", value)
                    }}
                  >
                    <SelectTrigger className="bg-secondary/50 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">{t("language_english")}</SelectItem>
                      <SelectItem value="es">{t("language_spanish")}</SelectItem>
                      <SelectItem value="fr">{t("language_french")}</SelectItem>
                      <SelectItem value="de">{t("language_german")}</SelectItem>
                      <SelectItem value="it">{t("language_italian")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm">{t("timezone_region")}</Label>
                  <Input value={`${profile.timezone} (Auto-detected)`} disabled className="bg-secondary/50 text-sm" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("current_time")}: {new Date().toLocaleString("en-US", { timeZone: profile.timezone })}
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="theme">
            <Card className="glass-card p-4 sm:p-6 neon-glow">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">{t("theme_settings")}</h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm">{t("theme")}</Label>
                  <Select value={profile.theme} onValueChange={handleThemeChange}>
                    <SelectTrigger className="bg-secondary/50 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableThemes.map((theme) => (
                        <SelectItem key={theme.id} value={theme.id}>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="flex gap-1">
                              <div
                                className="w-3 h-3 md:w-4 md:h-4 rounded border border-white/20"
                                style={{ background: `hsl(${theme.primary})` }}
                              />
                              <div
                                className="w-3 h-3 md:w-4 md:h-4 rounded border border-white/20"
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
                          <div className="flex items-center gap-2 text-sm">
                            <div className="flex gap-1">
                              <div className="w-3 h-3 md:w-4 md:h-4 rounded border border-white/20 bg-gradient-to-r from-purple-500 to-pink-500" />
                            </div>
                            {t("custom_theme")}
                            <Badge variant="outline" className="text-xs bg-primary/20">
                              PRO
                            </Badge>
                          </div>
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {profile.plan === "free" && t("upgrade_for_more_themes")}
                    {profile.plan === "premium" && t("upgrade_for_custom_themes")}
                    {profile.plan === "pro" && t("all_themes_available")}
                  </p>
                </div>

                {profile.theme === "custom" && showCustom && (
                  <div className="space-y-4 mt-4 p-3 sm:p-4 border rounded-lg">
                    <p className="text-xs sm:text-sm text-muted-foreground">{t("custom_theme_description")}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customPrimary" className="text-sm">
                          {t("primary_color")}
                        </Label>
                        <Input
                          id="customPrimary"
                          type="color"
                          value={profile.customPrimary || "#84cc16"}
                          onChange={(e) => handleCustomColorChange("primary", e.target.value)}
                          className="h-10 w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customSecondary" className="text-sm">
                          {t("secondary_color")}
                        </Label>
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
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{t("pushNotifications")}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{t("pushNotificationsDescription")}</p>

                  {!notificationsSupported ? (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                      <p className="text-sm text-destructive">{t("notificationsNotSupported")}</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label className="text-base cursor-pointer">{t("enableNotifications")}</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {isSubscribed ? t("notificationsEnabled") : t("notificationsDisabled")}
                        </p>
                      </div>
                      <Switch
                        checked={isSubscribed}
                        onCheckedChange={handleNotificationToggle}
                        disabled={notificationsLoading}
                      />
                    </div>
                  )}
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">{t("notificationTypes")}</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>{t("taskReminders")}</Label>
                      <Switch defaultChecked disabled={!isSubscribed} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>{t("achievementNotifications")}</Label>
                      <Switch defaultChecked disabled={!isSubscribed} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>{t("eventReminders")}</Label>
                      <Switch defaultChecked disabled={!isSubscribed} />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {profile.plan === "free" && (
          <div className="mt-6">
            {/* Desktop native banner - only shows on desktop */}
            <AdsterraNativeBanner
              containerId="container-105a3c31d27607df87969077c87047d4"
              scriptSrc="//pl28151206.effectivegatecpm.com/105a3c31d27607df87969077c87047d4/invoke.js"
              className="hidden md:block"
            />
            {/* Mobile banner - only shows on mobile */}
            <AdsterraMobileBanner
              adKey="5fedd77c571ac1a4c2ea68ca3d2bca98"
              width={320}
              height={50}
              className="block md:hidden"
            />
          </div>
        )}
      </div>
    </div>
  )
}
