"use client"

import { useCallback } from "react"

// Types for analytics events
export interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
  custom_parameters?: Record<string, any>
}

export interface PageViewEvent {
  page_title: string
  page_location: string
  page_path: string
  custom_parameters?: Record<string, any>
}

export interface ConversionEvent {
  currency?: string
  value?: number
  transaction_id?: string
  items?: Array<{
    item_id: string
    item_name: string
    category: string
    quantity: number
    price: number
  }>
}

// Analytics class for managing all analytics operations
export class Analytics {
  private isInitialized = false
  private debugMode = false

  constructor(debugMode = false) {
    this.debugMode = debugMode
    this.initialize()
  }

  private initialize() {
    if (typeof window === "undefined") return

    // Check if gtag is available
    if (window.gtag) {
      this.isInitialized = true
      if (this.debugMode) {
        console.log("Analytics initialized")
      }
    }
  }

  // Track page views
  trackPageView(event: PageViewEvent) {
    if (!this.isInitialized || typeof window === "undefined") return

    try {
      window.gtag("config", process.env.NEXT_PUBLIC_GA_ID || "", {
        page_title: event.page_title,
        page_location: event.page_location,
        page_path: event.page_path,
        ...event.custom_parameters,
      })

      if (this.debugMode) {
        console.log("Page view tracked:", event)
      }
    } catch (error) {
      console.error("Error tracking page view:", error)
    }
  }

  // Track custom events
  trackEvent(event: AnalyticsEvent) {
    if (!this.isInitialized || typeof window === "undefined") return

    try {
      window.gtag("event", event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters,
      })

      if (this.debugMode) {
        console.log("Event tracked:", event)
      }
    } catch (error) {
      console.error("Error tracking event:", error)
    }
  }

  // Track conversions
  trackConversion(eventName: string, event: ConversionEvent) {
    if (!this.isInitialized || typeof window === "undefined") return

    try {
      window.gtag("event", eventName, {
        currency: event.currency || "EUR",
        value: event.value,
        transaction_id: event.transaction_id,
        items: event.items,
      })

      if (this.debugMode) {
        console.log("Conversion tracked:", eventName, event)
      }
    } catch (error) {
      console.error("Error tracking conversion:", error)
    }
  }

  // Track user engagement
  trackEngagement(action: string, details?: Record<string, any>) {
    this.trackEvent({
      action,
      category: "engagement",
      custom_parameters: details,
    })
  }

  // Track feature usage
  trackFeatureUsage(feature: string, action: string, details?: Record<string, any>) {
    this.trackEvent({
      action,
      category: "feature_usage",
      label: feature,
      custom_parameters: details,
    })
  }

  // Track errors
  trackError(error: string, details?: Record<string, any>) {
    this.trackEvent({
      action: "error",
      category: "javascript_error",
      label: error,
      custom_parameters: details,
    })
  }

  // Track timing events
  trackTiming(category: string, variable: string, value: number, label?: string) {
    if (!this.isInitialized || typeof window === "undefined") return

    try {
      window.gtag("event", "timing_complete", {
        name: variable,
        value: value,
        event_category: category,
        event_label: label,
      })

      if (this.debugMode) {
        console.log("Timing tracked:", { category, variable, value, label })
      }
    } catch (error) {
      console.error("Error tracking timing:", error)
    }
  }

  // Track user properties
  setUserProperties(properties: Record<string, any>) {
    if (!this.isInitialized || typeof window === "undefined") return

    try {
      window.gtag("config", process.env.NEXT_PUBLIC_GA_ID || "", {
        custom_map: properties,
      })

      if (this.debugMode) {
        console.log("User properties set:", properties)
      }
    } catch (error) {
      console.error("Error setting user properties:", error)
    }
  }

  // Track search events
  trackSearch(searchTerm: string, results?: number) {
    this.trackEvent({
      action: "search",
      category: "site_search",
      label: searchTerm,
      value: results,
    })
  }

  // Track social interactions
  trackSocialInteraction(network: string, action: string, target?: string) {
    this.trackEvent({
      action: "social_interaction",
      category: "social",
      label: `${network}_${action}`,
      custom_parameters: {
        social_network: network,
        social_action: action,
        social_target: target,
      },
    })
  }

  // Track file downloads
  trackDownload(fileName: string, fileType?: string) {
    this.trackEvent({
      action: "download",
      category: "file_download",
      label: fileName,
      custom_parameters: {
        file_type: fileType,
      },
    })
  }

  // Track outbound links
  trackOutboundLink(url: string, linkText?: string) {
    this.trackEvent({
      action: "click",
      category: "outbound_link",
      label: url,
      custom_parameters: {
        link_text: linkText,
      },
    })
  }

  // Track form submissions
  trackFormSubmission(formName: string, success: boolean, details?: Record<string, any>) {
    this.trackEvent({
      action: success ? "submit_success" : "submit_error",
      category: "form_interaction",
      label: formName,
      custom_parameters: details,
    })
  }

  // Track video interactions
  trackVideoInteraction(action: string, videoTitle: string, progress?: number) {
    this.trackEvent({
      action: `video_${action}`,
      category: "video_interaction",
      label: videoTitle,
      value: progress,
    })
  }

  // Track scroll depth
  trackScrollDepth(percentage: number, page: string) {
    this.trackEvent({
      action: "scroll",
      category: "scroll_depth",
      label: page,
      value: percentage,
    })
  }
}

// Create a singleton instance
export const analytics = new Analytics(process.env.NODE_ENV === "development")

// React hook for analytics
export function useAnalytics() {
  const trackPageView = useCallback((event: PageViewEvent) => {
    analytics.trackPageView(event)
  }, [])

  const trackEvent = useCallback((event: AnalyticsEvent) => {
    analytics.trackEvent(event)
  }, [])

  const trackConversion = useCallback((eventName: string, event: ConversionEvent) => {
    analytics.trackConversion(eventName, event)
  }, [])

  const trackEngagement = useCallback((action: string, details?: Record<string, any>) => {
    analytics.trackEngagement(action, details)
  }, [])

  const trackFeatureUsage = useCallback((feature: string, action: string, details?: Record<string, any>) => {
    analytics.trackFeatureUsage(feature, action, details)
  }, [])

  const trackError = useCallback((error: string, details?: Record<string, any>) => {
    analytics.trackError(error, details)
  }, [])

  const trackSearch = useCallback((searchTerm: string, results?: number) => {
    analytics.trackSearch(searchTerm, results)
  }, [])

  const trackFormSubmission = useCallback((formName: string, success: boolean, details?: Record<string, any>) => {
    analytics.trackFormSubmission(formName, success, details)
  }, [])

  return {
    trackPageView,
    trackEvent,
    trackConversion,
    trackEngagement,
    trackFeatureUsage,
    trackError,
    trackSearch,
    trackFormSubmission,
  }
}

// Helper functions for common tracking scenarios
export const trackButtonClick = (buttonName: string, location?: string) => {
  analytics.trackEvent({
    action: "click",
    category: "button",
    label: buttonName,
    custom_parameters: { location },
  })
}

export const trackLinkClick = (linkText: string, destination: string, location?: string) => {
  analytics.trackEvent({
    action: "click",
    category: "link",
    label: linkText,
    custom_parameters: { destination, location },
  })
}

export const trackModalOpen = (modalName: string, trigger?: string) => {
  analytics.trackEvent({
    action: "open",
    category: "modal",
    label: modalName,
    custom_parameters: { trigger },
  })
}

export const trackModalClose = (modalName: string, method?: string) => {
  analytics.trackEvent({
    action: "close",
    category: "modal",
    label: modalName,
    custom_parameters: { method },
  })
}

export const trackTabChange = (tabName: string, section?: string) => {
  analytics.trackEvent({
    action: "change",
    category: "tab",
    label: tabName,
    custom_parameters: { section },
  })
}

export const trackFilterUsage = (filterType: string, filterValue: string, resultsCount?: number) => {
  analytics.trackEvent({
    action: "filter",
    category: "search_filter",
    label: `${filterType}:${filterValue}`,
    value: resultsCount,
  })
}

export const trackSignup = (method: string, success: boolean) => {
  analytics.trackConversion("sign_up", {
    value: success ? 1 : 0,
    custom_parameters: { method, success },
  })
}

export const trackLogin = (method: string, success: boolean) => {
  analytics.trackEvent({
    action: success ? "login_success" : "login_failure",
    category: "authentication",
    label: method,
  })
}

// Performance tracking
export const trackPerformance = (metric: string, value: number, page?: string) => {
  analytics.trackTiming("performance", metric, value, page)
}

// Error boundary integration
export const trackErrorBoundary = (error: Error, errorInfo: any) => {
  analytics.trackError(error.message, {
    stack: error.stack,
    componentStack: errorInfo.componentStack,
  })
}

// Declare global gtag function for TypeScript
declare global {
  interface Window {
    gtag: (command: "config" | "event" | "consent", targetId: string, config?: Record<string, any>) => void
  }
}

export default analytics
