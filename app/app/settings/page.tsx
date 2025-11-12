"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
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
  })
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation(profile.language)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data } = await supabase.from("users").select("*").eq("id", user.id).single()

      setProfile({
        email: user.email || "",
        theme: data?.theme || "neon-tech",
        language: data?.language || "en",
        notifications: data?.notifications ?? true,
      })
    }
  }

  const handleSave = async () => {
    setLoading(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      await supabase
        .from("users")
        .update({
          theme: profile.theme,
          language: profile.language,
          notifications: profile.notifications,
        })
        .eq("id", user.id)

      alert("Settings saved successfully!")
    }
    setLoading(false)
  }

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
                      localStorage.setItem("language", value)
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
