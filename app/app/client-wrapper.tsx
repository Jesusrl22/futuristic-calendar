"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Script from "next/script"
import { NotificationProvider } from "@/components/notification-service"

interface User {
  id: string
  name: string
  email: string
  plan: string
}

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    // Get current user from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  return (
    <NotificationProvider>
      {children}

      {/* Google Analytics */}
      {process.env.NEXT_PUBLIC_GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}
          </Script>
        </>
      )}
    </NotificationProvider>
  )
}
