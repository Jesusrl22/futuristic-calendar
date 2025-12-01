"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

interface PayPalSubscriptionButtonProps {
  planId: string
  planName: string
  onSuccess?: (subscriptionId: string) => void
}

declare global {
  interface Window {
    paypal: any
  }
}

export function PayPalSubscriptionButton({ planId, planName, onSuccess }: PayPalSubscriptionButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Load PayPal SDK script
    const script = document.createElement("script")
    script.src = `https://www.paypal.com/sdk/js?client-id=AR4AW_SOK6UqtOenw2nW_cQs5gvC-_kGRKjKI9JWYUt5ybyt-K367rZ9lUeFPbtegsncbg4LZLR-pOmw&vault=true&intent=subscription`
    script.setAttribute("data-sdk-integration-source", "button-factory")
    script.async = true

    script.onload = () => {
      if (window.paypal && containerRef.current) {
        window.paypal
          .Buttons({
            style: {
              shape: "rect",
              color: "gold",
              layout: "vertical",
              label: "paypal",
            },
            createSubscription: (data: any, actions: any) =>
              actions.subscription.create({
                plan_id: planId,
              }),
            onApprove: async (data: any, actions: any) => {
              const subscriptionId = data.subscriptionID

              // Update user subscription in database
              try {
                const response = await fetch("/api/paypal/subscription-success", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    subscriptionId,
                    planName: planName.toLowerCase(),
                  }),
                })

                if (response.ok) {
                  if (onSuccess) {
                    onSuccess(subscriptionId)
                  }
                  // Refresh the page to show updated subscription
                  router.refresh()
                }
              } catch (error) {
                console.error("Error updating subscription:", error)
              }
            },
          })
          .render(containerRef.current)
      }
    }

    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [planId, planName, onSuccess, router])

  return <div ref={containerRef} className="mt-4"></div>
}
