"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Settings,
  Palette,
  Bell,
  User,
  Crown,
  Zap,
  Lock,
  Sun,
  Moon,
  Monitor,
  Waves,
  TreePine,
  Sparkles,
  Sunset,
  Cpu,
  Gamepad2,
  Play as Galaxy,
  Rainbow,
} from "lucide-react"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  userPlan: "free" | "premium" | "pro"
  currentTheme: string
  onThemeChange: (theme: string) => void
  settings: {
    notifications: boolean
    emailNotifications: boolean
    soundEnabled: boolean
    pomodoroWorkTime: number
    pomodoroBreakTime: number
    pomodoroLongBreak: number
    autoStartBreaks: boolean
    autoStartPomodoros: boolean
  }
  onSettingsChange: (settings: any) => void
  profile: {
    name: string
    email: string
    bio: string
  }
  onProfileUpdate: (profile: any) => void
}

const themes = {
  free: [
    { id: "light", name: "Light", icon: Sun, description: "Clean and bright" },
    { id: "dark", name: "Dark", icon: Moon, description: "Easy on the eyes" },
    { id: "system", name: "System", icon: Monitor, description: "Follows your device" },
  ],
  premium: [
    { id: "ocean-blue", name: "Ocean Blue", icon: Waves, description: "Calm and professional", premium: true },
    { id: "forest-green", name: "Forest Green", icon: TreePine, description: "Natural and refreshing", premium: true },
    {
      id: "mystic-purple",
      name: "Mystic Purple",
      icon: Sparkles,
      description: "Creative and inspiring",
      premium: true,
    },
    { id: "sunset-orange", name: "Sunset Orange", icon: Sunset, description: "Warm and energetic", premium: true },
  ],
  pro: [
    { id: "neon-future", name: "Neon Future", icon: Cpu, description: "Futuristic and bold", pro: true },
    { id: "cyberpunk", name: "Cyberpunk", icon: Gamepad2, description: "High-tech aesthetic", pro: true },
    { id: "galaxy", name: "Galaxy", icon: Galaxy, description: "Cosmic and mysterious", pro: true },
    { id: "aurora", name: "Aurora", icon: Rainbow, description: "Magical and colorful", pro: true },
  ],
}

export function SettingsModal({
  isOpen,
  onClose,
  userPlan,
  currentTheme,
  onThemeChange,
  settings,
  onSettingsChange,
  profile,
  onProfileUpdate,
}: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState(settings)
  const [localProfile, setLocalProfile] = useState(profile)

  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  useEffect(() => {
    setLocalProfile(profile)
  }, [profile])

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...localSettings, [key]: value }
    setLocalSettings(newSettings)
    onSettingsChange(newSettings)
  }

  const handleProfileChange = (key: string, value: string) => {
    const newProfile = { ...localProfile, [key]: value }
    setLocalProfile(newProfile)
  }

  const handleProfileSave = () => {
    onProfileUpdate(localProfile)
  }

  const canUseTheme = (theme: any) => {
    if (theme.pro && userPlan !== "pro") return false
    if (theme.premium && userPlan === "free") return false
    return true
  }

  const getAllThemes = () => {
    return [...themes.free, ...themes.premium, ...themes.pro]
  }

  const getPlanBadge = (plan: "free" | "premium" | "pro") => {
    const badges = {
      free: { label: "Free", icon: null, color: "bg-gray-500" },
      premium: { label: "Premium", icon: Crown, color: "bg-blue-500" },
      pro: { label: "Pro", icon: Zap, color: "bg-purple-500" },
    }

    const badge = badges[plan]
    const Icon = badge.icon

    return (
      <Badge className={`${badge.color} text-white`}>
        {Icon && <Icon className="h-3 w-3 mr-1" />}
        {badge.label}
      </Badge>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-6 w-6" />
            <span>Settings</span>
            {getPlanBadge(userPlan)}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="appearance">
              <Palette className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="productivity">
              <Settings className="h-4 w-4 mr-2" />
              Productivity
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Theme Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Free Themes */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center space-x-2">
                      <span>Free Themes</span>
                      <Badge variant="secondary">Included</Badge>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {themes.free.map((theme) => {
                        const Icon = theme.icon
                        const isSelected = currentTheme === theme.id

                        return (
                          <Card
                            key={theme.id}
                            className={`cursor-pointer transition-all ${
                              isSelected ? "ring-2 ring-primary" : "hover:shadow-md"
                            }`}
                            onClick={() => onThemeChange(theme.id)}
                          >
                            <CardContent className="p-4 text-center">
                              <Icon className="h-8 w-8 mx-auto mb-2" />
                              <h5 className="font-medium">{theme.name}</h5>
                              <p className="text-xs text-muted-foreground">{theme.description}</p>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>

                  {/* Premium Themes */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center space-x-2">
                      <span>Premium Themes</span>
                      <Badge className="bg-blue-500 text-white">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {themes.premium.map((theme) => {
                        const Icon = theme.icon
                        const isSelected = currentTheme === theme.id
                        const canUse = canUseTheme(theme)

                        return (
                          <Card
                            key={theme.id}
                            className={`relative transition-all ${
                              isSelected
                                ? "ring-2 ring-primary"
                                : canUse
                                  ? "hover:shadow-md cursor-pointer"
                                  : "opacity-60"
                            }`}
                            onClick={() => canUse && onThemeChange(theme.id)}
                          >
                            {!canUse && (
                              <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center z-10">
                                <Lock className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                            <CardContent className="p-4 text-center">
                              <Icon className="h-8 w-8 mx-auto mb-2" />
                              <h5 className="font-medium">{theme.name}</h5>
                              <p className="text-xs text-muted-foreground">{theme.description}</p>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                    {userPlan === "free" && (
                      <p className="text-sm text-muted-foreground mt-2">Upgrade to Premium to unlock these themes</p>
                    )}
                  </div>

                  {/* Pro Themes */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center space-x-2">
                      <span>Pro Themes</span>
                      <Badge className="bg-purple-500 text-white">
                        <Zap className="h-3 w-3 mr-1" />
                        Pro
                      </Badge>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {themes.pro.map((theme) => {
                        const Icon = theme.icon
                        const isSelected = currentTheme === theme.id
                        const canUse = canUseTheme(theme)

                        return (
                          <Card
                            key={theme.id}
                            className={`relative transition-all ${
                              isSelected
                                ? "ring-2 ring-primary"
                                : canUse
                                  ? "hover:shadow-md cursor-pointer"
                                  : "opacity-60"
                            }`}
                            onClick={() => canUse && onThemeChange(theme.id)}
                          >
                            {!canUse && (
                              <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center z-10">
                                <Lock className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                            <CardContent className="p-4 text-center">
                              <Icon className="h-8 w-8 mx-auto mb-2" />
                              <h5 className="font-medium">{theme.name}</h5>
                              <p className="text-xs text-muted-foreground">{theme.description}</p>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                    {userPlan !== "pro" && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Upgrade to Pro to unlock these exclusive themes
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications for tasks and reminders</p>
                  </div>
                  <Switch
                    checked={localSettings.notifications}
                    onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email updates and reminders</p>
                  </div>
                  <Switch
                    checked={localSettings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sound Effects</Label>
                    <p className="text-sm text-muted-foreground">Play sounds for notifications and actions</p>
                  </div>
                  <Switch
                    checked={localSettings.soundEnabled}
                    onCheckedChange={(checked) => handleSettingChange("soundEnabled", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="productivity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pomodoro Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="workTime">Work Time (minutes)</Label>
                    <Input
                      id="workTime"
                      type="number"
                      min="1"
                      max="60"
                      value={localSettings.pomodoroWorkTime}
                      onChange={(e) => handleSettingChange("pomodoroWorkTime", Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="breakTime">Short Break (minutes)</Label>
                    <Input
                      id="breakTime"
                      type="number"
                      min="1"
                      max="30"
                      value={localSettings.pomodoroBreakTime}
                      onChange={(e) => handleSettingChange("pomodoroBreakTime", Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="longBreak">Long Break (minutes)</Label>
                    <Input
                      id="longBreak"
                      type="number"
                      min="1"
                      max="60"
                      value={localSettings.pomodoroLongBreak}
                      onChange={(e) => handleSettingChange("pomodoroLongBreak", Number.parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-start Breaks</Label>
                    <p className="text-sm text-muted-foreground">Automatically start break timers</p>
                  </div>
                  <Switch
                    checked={localSettings.autoStartBreaks}
                    onCheckedChange={(checked) => handleSettingChange("autoStartBreaks", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-start Pomodoros</Label>
                    <p className="text-sm text-muted-foreground">Automatically start work timers after breaks</p>
                  </div>
                  <Switch
                    checked={localSettings.autoStartPomodoros}
                    onCheckedChange={(checked) => handleSettingChange("autoStartPomodoros", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={localProfile.name}
                    onChange={(e) => handleProfileChange("name", e.target.value)}
                    placeholder="Your display name"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={localProfile.email}
                    onChange={(e) => handleProfileChange("email", e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={localProfile.bio}
                    onChange={(e) => handleProfileChange("bio", e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>

                <Button onClick={handleProfileSave} className="w-full">
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
