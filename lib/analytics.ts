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
  debug: false,
}

const userProperties: UserProperties = {}

declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: Record<string, any>) => void
    dataLayer?: any[]
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ""

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_TRACKING_ID) {
    console.warn("Google Analytics ID not found")
    return
  }

  // Load gtag script
  const script = document.createElement("script")
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
  document.head.appendChild(script)

  // Initialize gtag
  window.gtag =
    window.gtag ||
    ((...args: any[]) => {
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push(args)
    })

  window.gtag("js", new Date())
  window.gtag("config", GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href,
  })
}

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
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// Track page views (alias)
export function trackPageView(url: string) {
  pageview(url)
}

// Track events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Track events (alternative signature)
export const event = ({
  action,
  category,
  label,
  value,
}: { action: string; category: string; label?: string; value?: number }) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Set user properties
export const setUserProperties = (userId: string, properties: Record<string, any>) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      user_id: userId,
      ...properties,
    })
  }
}

// Track user actions
export function trackUserAction(action: string, category = "user", label?: string, value?: number) {
  trackEvent(action, category, label, value)
}

// Track feature usage
export function trackFeatureUsage(feature: string, action = "use", label?: string) {
  trackEvent(action, "feature", `${feature}${label ? `:${label}` : ""}`)
}

// Track errors
export function trackError(error: string, category = "error", label?: string) {
  trackEvent("error", category, `${error}${label ? `:${label}` : ""}`)
}

// Track conversions (purchases, sign-ups, etc.)
export const trackConversion = (eventName: string, parameters?: Record<string, any>) => {
  if (!GA_TRACKING_ID || !window.gtag) return

  window.gtag("event", eventName, {
    currency: "EUR",
    ...parameters,
  })
}

// Track subscription events
export function trackSubscription(action: string, plan: string, billing?: string) {
  trackEvent(action, "subscription", `${plan}${billing ? `:${billing}` : ""}`)
}

// Track AI usage
export const trackAIUsage = (feature: string, creditsUsed?: number) => {
  trackEvent("ai_usage", "ai", feature, creditsUsed)
}

// Track task management
export function trackTaskAction(action: string, taskType?: string) {
  trackEvent(action, "tasks", taskType)
}

// Track productivity metrics
export function trackProductivityMetric(metric: string, value: number, unit?: string) {
  trackEvent(metric, "productivity", `${metric}${unit ? `:${unit}` : ""}`, value)
}

// Track pomodoro sessions
export function trackPomodoroSession(action: string, duration?: number) {
  trackEvent(action, "pomodoro", action, duration)
}

// Track note actions
export function trackNoteAction(action: string, noteType?: string) {
  trackEvent(action, "notes", noteType)
}

// Track wishlist actions
export function trackWishlistAction(action: string, itemType?: string) {
  trackEvent(action, "wishlist", itemType)
}

// Track achievement unlocks
export function trackAchievement(achievementType: string, points?: number) {
  trackEvent("achievement_unlocked", "achievements", achievementType, points)
}

// Track settings changes
export function trackSettingsChange(setting: string, value: string) {
  trackEvent("settings_change", "settings", `${setting}:${value}`)
}

// Track search queries
export function trackSearch(query: string, category = "search") {
  trackEvent("search", category, query)
}

// Track export/import actions
export function trackDataAction(action: string, dataType: string, count?: number) {
  trackEvent(action, "data", dataType, count)
}

// Track exceptions
export const trackException = (description: string, fatal = false) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "exception", {
      description,
      fatal,
    })
  }
}

// Track button clicks
export const trackButtonClick = (buttonName: string) => {
  trackEvent("click", "button", buttonName)
}

// Track form submissions
export const trackFormSubmit = (formName: string) => {
  trackEvent("submit", "form", formName)
}

// Track sign-ups
export const trackSignup = () => {
  trackEvent("signup", "user", "new_user")
}

// Track logins
export const trackLogin = () => {
  trackEvent("login", "user", "returning_user")
}

// Track purchases
export const trackPurchase = (value: number, currency = "USD") => {
  trackEvent("purchase", "ecommerce", "subscription", value)
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
  pageview,
  trackPageView,
  event,
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
  initGA,
  trackException,
  trackButtonClick,
  trackFormSubmit,
  trackSignup,
  trackLogin,
  trackPurchase,
}

export default analytics
