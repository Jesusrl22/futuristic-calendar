"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, CheckCircle, XCircle } from "@/components/icons"
import { useTranslation } from "@/hooks/useTranslation"

export default function TeamInvitationPage() {
  const { t } = useTranslation()
  const params = useParams()
  const router = useRouter()
  const token = params.token as string
  const [loading, setLoading] = useState(true)
  const [invitation, setInvitation] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [accepting, setAccepting] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuthAndFetchInvitation()
  }, [token])

  const checkAuthAndFetchInvitation = async () => {
    try {
      // Check if user is authenticated
      const authResponse = await fetch("/api/auth/check-session")
      const authData = await authResponse.json()
      setIsAuthenticated(authData.authenticated)

      // Fetch invitation details
      const inviteResponse = await fetch(`/api/teams/invitations/${token}`)
      if (inviteResponse.ok) {
        const data = await inviteResponse.json()
        setInvitation(data.invitation)
      } else {
        const errorData = await inviteResponse.json()
        setError(errorData.error || "Invalid invitation")
      }
    } catch (err) {
      console.error("Error fetching invitation:", err)
      setError("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptInvitation = async () => {
    if (!isAuthenticated) {
      // Redirect to signup with invitation token
      router.push(`/signup?invite=${token}`)
      return
    }

    setAccepting(true)
    try {
      const response = await fetch(`/api/teams/invitations/${token}`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/app/teams/${data.teamId}`)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to accept invitation")
      }
    } catch (err) {
      console.error("Error accepting invitation:", err)
      setError("An error occurred")
    } finally {
      setAccepting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="glass-card p-8 max-w-md w-full text-center">
          <p className="text-muted-foreground">{t("loading")}</p>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="glass-card p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
          <h1 className="text-2xl font-bold mb-2">{t("invitationError")}</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => router.push("/app/teams")}>{t("backToTeams")}</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="glass-card p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-primary neon-text">{t("teamInvitation")}</span>
          </h1>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{t("teamName")}</p>
            <p className="text-lg font-semibold">{invitation?.teams?.name}</p>
          </div>

          {invitation?.teams?.description && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t("description")}</p>
              <p className="text-sm">{invitation.teams.description}</p>
            </div>
          )}

          <div>
            <p className="text-sm text-muted-foreground mb-1">{t("invitedBy")}</p>
            <p className="text-sm">{invitation?.users?.name || invitation?.users?.email}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">{t("yourRole")}</p>
            <p className="text-sm font-semibold capitalize">{t(invitation?.role || "member")}</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={handleAcceptInvitation} disabled={accepting} className="w-full">
            <CheckCircle className="w-4 h-4 mr-2" />
            {isAuthenticated ? t("acceptAndJoin") : t("signUpAndJoin")}
          </Button>

          {!isAuthenticated && (
            <Button variant="outline" onClick={() => router.push(`/login?invite=${token}`)} className="w-full">
              {t("alreadyHaveAccount")}
            </Button>
          )}
        </div>

        <p className="text-xs text-center text-muted-foreground mt-6">{t("invitationExpiresIn7Days")}</p>
      </Card>
    </div>
  )
}
