"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { useLanguage } from "@/hooks/useLanguage"
import { Cookie, Settings } from "lucide-react"

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

export function CookieBanner() {
  const { t } = useLanguage()
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  })

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookieConsent")
    if (!cookieConsent) {
      setShowBanner(true)
    } else {
      const savedPreferences = JSON.parse(cookieConsent)
      setPreferences(savedPreferences)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    }
    setPreferences(allAccepted)
    localStorage.setItem("cookieConsent", JSON.stringify(allAccepted))
    setShowBanner(false)
  }

  const handleDeclineAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    }
    setPreferences(onlyNecessary)
    localStorage.setItem("cookieConsent", JSON.stringify(onlyNecessary))
    setShowBanner(false)
  }

  const handleSavePreferences = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(preferences))
    setShowBanner(false)
    setShowSettings(false)
  }

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  if (!showBanner) return null

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg animate-in slide-in-from-bottom duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{t("cookieTitle")}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{t("cookieDescription")}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                {t("cookieSettings")}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeclineAll}>
                {t("cookieDecline")}
              </Button>
              <Button size="sm" onClick={handleAcceptAll} className="bg-blue-600 hover:bg-blue-700">
                {t("cookieAccept")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5" />
              {t("cookieSettingsTitle")}
            </DialogTitle>
            <DialogDescription>{t("cookieSettingsDescription")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{t("cookieNecessary")}</CardTitle>
                    <CardDescription className="text-sm">{t("cookieNecessaryDesc")}</CardDescription>
                  </div>
                  <Switch checked={preferences.necessary} disabled className="opacity-50" />
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{t("cookieAnalytics")}</CardTitle>
                    <CardDescription className="text-sm">{t("cookieAnalyticsDesc")}</CardDescription>
                  </div>
                  <Switch
                    checked={preferences.analytics}
                    onCheckedChange={(checked) => updatePreference("analytics", checked)}
                  />
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{t("cookieMarketing")}</CardTitle>
                    <CardDescription className="text-sm">{t("cookieMarketingDesc")}</CardDescription>
                  </div>
                  <Switch
                    checked={preferences.marketing}
                    onCheckedChange={(checked) => updatePreference("marketing", checked)}
                  />
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{t("cookiePreferences")}</CardTitle>
                    <CardDescription className="text-sm">{t("cookiePreferencesDesc")}</CardDescription>
                  </div>
                  <Switch
                    checked={preferences.preferences}
                    onCheckedChange={(checked) => updatePreference("preferences", checked)}
                  />
                </div>
              </CardHeader>
            </Card>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSavePreferences} className="bg-blue-600 hover:bg-blue-700">
              {t("savePreferences")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
