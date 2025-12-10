"use client"

import { useEffect, useState, useRef } from "react"
import { useMediaQuery } from "@/hooks/use-mobile"

interface AdsterraNativeBannerProps {
  containerId: string
  scriptSrc: string
  className?: string
}

export function AdsterraNativeBanner({ containerId, scriptSrc, className = "" }: AdsterraNativeBannerProps) {
  const [userTier, setUserTier] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const adContainerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    const fetchUserTier = async () => {
      try {
        const response = await fetch("/api/user/profile")
        if (response.ok) {
          const data = await response.json()
          setUserTier(data.subscription_tier || "free")
        }
      } catch (error) {
        setUserTier("free")
      } finally {
        setLoading(false)
      }
    }

    fetchUserTier()
  }, [])

  useEffect(() => {
    if (
      !loading &&
      userTier === "free" &&
      !isMobile &&
      adContainerRef.current &&
      !adContainerRef.current.querySelector("script")
    ) {
      const script = document.createElement("script")
      script.async = true
      script.setAttribute("data-cfasync", "false")
      script.src = scriptSrc
      adContainerRef.current.appendChild(script)
    }
  }, [loading, userTier, scriptSrc, isMobile])

  if (loading || userTier !== "free" || isMobile) {
    return null
  }

  return (
    <div className={`w-full flex justify-center my-4 ${className}`}>
      <div ref={adContainerRef}>
        <div id={containerId}></div>
      </div>
    </div>
  )
}
