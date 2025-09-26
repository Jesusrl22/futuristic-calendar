"use client"

// Analytics configuration
interface AnalyticsConfig {
  trackingId?: string
  debug?: boolean
}

// Event types
interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
}

// User properties
interface UserProperties {
  userId?: string
  plan?: string
  language?: string
  theme?: string
}

// Global analytics state
let analyticsConfig: AnalyticsConfig = {
  debug: process.env.NODE_ENV === "development",
}

let userProperties: UserProperties = {}

// Initialize analytics
export function initializeAnalytics(config: AnalyticsConfig = {}) {
  analyticsConfig = { ...analyticsConfig, ...config }

  // Initialize Google Analytics if tracking ID is provided
  if (analyticsConfig.trackingId && typeof window !== "undefined") {
    // Load Google Analytics script
    const script = document.createElement("script")
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.trackingId}`
    document.head.appendChild(script)

    // Initialize gtag
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      window.dataLayer.push(args)
    }
    window.gtag = gtag

    gtag("js", new Date())
    gtag("config", analyticsConfig.trackingId, {
      page_title: document.title,
      page_location: window.location.href,
    })

    if (analyticsConfig.debug) {
      console.log("Analytics initialized with tracking ID:", analyticsConfig.trackingId)
    }
  }
}

// Track page views
export function trackPageView(path: string, title?: string) {
  if (typeof window === "undefined") return

  try {
    // Google Analytics
    if (window.gtag && analyticsConfig.trackingId) {
      window.gtag("config", analyticsConfig.trackingId, {
        page_path: path,
        page_title: title || document.title,
      })
    }

    if (analyticsConfig.debug) {
      console.log("Page view tracked:", { path, title })
    }
  } catch (error) {
    console.error("Error tracking page view:", error)
  }
}

// Track custom events
export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === "undefined") return

  try {
    // Google Analytics
    if (window.gtag) {
      window.gtag("event", event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...userProperties,
      })
    }

    if (analyticsConfig.debug) {
      console.log("Event tracked:", event)
    }
  } catch (error) {
    console.error("Error tracking event:", error)
  }
}

// Set user properties
export function setUserProperties(properties: UserProperties) {
  userProperties = { ...userProperties, ...properties }

  if (typeof window === "undefined") return

  try {
    // Google Analytics
    if (window.gtag) {
      window.gtag("config", analyticsConfig.trackingId, {
        user_id: properties.userId,
        custom_map: {
          plan: properties.plan,
          language: properties.language,
          theme: properties.theme,
        },
      })
    }

    if (analyticsConfig.debug) {
      console.log("User properties set:", properties)
    }
  } catch (error) {
    console.error("Error setting user properties:", error)
  }
}

// Track user actions
export function trackUserAction(action: string, category = "user", label?: string, value?: number) {
  trackEvent({
    action,
    category,
    label,
    value,
  })
}

// Track feature usage
export function trackFeatureUsage(feature: string, action = "use", label?: string) {
  trackEvent({
    action,
    category: "feature",
    label: `${feature}${label ? `:${label}` : ""}`,
  })
}

// Track errors
export function trackError(error: string, category = "error", label?: string) {
  trackEvent({
    action: "error",
    category,
    label: `${error}${label ? `:${label}` : ""}`,
  })
}

// Track conversions
export function trackConversion(type: string, value?: number, currency = "USD") {
  trackEvent({
    action: "conversion",
    category: "ecommerce",
    label: type,
    value,
  })

  // Google Analytics Enhanced Ecommerce
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "purchase", {
      transaction_id: `conv_${Date.now()}`,
      value,
      currency,
      items: [
        {
          item_id: type,
          item_name: type,
          category: "subscription",
          quantity: 1,
          price: value,
        },
      ],
    })
  }
}

// Track subscription events
export function trackSubscription(action: string, plan: string, billing?: string) {
  trackEvent({
    action,
    category: "subscription",
    label: `${plan}${billing ? `:${billing}` : ""}`,
  })
}

// Track AI usage
export function trackAIUsage(feature: string, creditsUsed?: number) {
  trackEvent({
    action: "ai_usage",
    category: "ai",
    label: feature,
    value: creditsUsed,
  })
}

// Track task management
export function trackTaskAction(action: string, taskType?: string) {
  trackEvent({
    action,
    category: "tasks",
    label: taskType,
  })
}

// Track productivity metrics
export function trackProductivityMetric(metric: string, value: number, unit?: string) {
  trackEvent({
    action: "productivity_metric",
    category: "productivity",
    label: `${metric}${unit ? `:${unit}` : ""}`,
    value,
  })
}

// Track pomodoro sessions
export function trackPomodoroSession(action: string, duration?: number) {
  trackEvent({
    action,
    category: "pomodoro",
    label: action,
    value: duration,
  })
}

// Track note actions
export function trackNoteAction(action: string, noteType?: string) {
  trackEvent({
    action,
    category: "notes",
    label: noteType,
  })
}

// Track wishlist actions
export function trackWishlistAction(action: string, itemType?: string) {
  trackEvent({
    action,
    category: "wishlist",
    label: itemType,
  })
}

// Track achievement unlocks
export function trackAchievement(achievementType: string, points?: number) {
  trackEvent({
    action: "achievement_unlocked",
    category: "achievements",
    label: achievementType,
    value: points,
  })
}

// Track settings changes
export function trackSettingsChange(setting: string, value: string) {
  trackEvent({
    action: "settings_change",
    category: "settings",
    label: `${setting}:${value}`,
  })
}

// Track search queries
export function trackSearch(query: string, category = "search") {
  trackEvent({
    action: "search",
    category,
    label: query,
  })
}

// Track export/import actions
export function trackDataAction(action: string, dataType: string, count?: number) {
  trackEvent({
    action,
    category: "data",
    label: dataType,
    value: count,
  })
}

// Initialize analytics on module load
if (typeof window !== "undefined") {
  // Auto-initialize with environment variables
  const trackingId = process.env.NEXT_PUBLIC_GA_ID
  if (trackingId) {
    initializeAnalytics({ trackingId })
  }
}

// Export analytics instance for direct access
export const analytics = {
  initialize: initializeAnalytics,
  trackPageView,
  trackEvent,
  setUserProperties,
  trackUserAction,
  trackFeatureUsage,
  trackError,
  trackConversion,
  trackSubscription,
  trackAIUsage,
  trackTaskAction,
  trackProductivityMetric,
  trackPomodoroSession,
  trackNoteAction,
  trackWishlistAction,
  trackAchievement,
  trackSettingsChange,
  trackSearch,
  trackDataAction,
}

export default analytics

// Type declarations for global gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}
