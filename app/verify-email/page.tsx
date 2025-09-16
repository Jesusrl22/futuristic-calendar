"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Mail, Loader2 } from "lucide-react"

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [resendLoading, setResendLoading] = useState(false)
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    } else {
      setStatus("error")
      setMessage("No verification token provided")
    }
  }, [token])

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(data.message)
      } else {
        setStatus("error")
        setMessage(data.error || "Verification failed")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Network error occurred")
    }
  }

  const resendVerification = async () => {
    setResendLoading(true)
    try {
      // This would need the user's email - in a real app, you'd handle this differently
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: "user@example.com" }), // This should come from user input
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Verification email sent! Please check your inbox.")
      } else {
        setMessage(data.error || "Failed to resend verification email")
      }
    } catch (error) {
      setMessage("Network error occurred")
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === "loading" && (
            <>
              <Loader2 className="w-16 h-16 mx-auto animate-spin text-blue-500" />
              <p className="text-gray-600">Verifying your email...</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
              <h3 className="text-xl font-semibold text-green-700">Email Verified!</h3>
              <p className="text-gray-600">{message}</p>
              <Button onClick={() => (window.location.href = "/")} className="w-full">
                Go to Dashboard
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="w-16 h-16 mx-auto text-red-500" />
              <h3 className="text-xl font-semibold text-red-700">Verification Failed</h3>
              <p className="text-gray-600">{message}</p>
              <div className="space-y-2">
                <Button
                  onClick={resendVerification}
                  disabled={resendLoading}
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  {resendLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
                <Button onClick={() => (window.location.href = "/")} variant="ghost" className="w-full">
                  Back to Home
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
