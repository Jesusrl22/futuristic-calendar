// Google Analytics and tracking configuration
export const ANALYTICS_CONFIG = {
  // Your Google Analytics ID
  GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_ID || "G-L2KH22ZLXW",

  // Domain for analytics
  domain: "future-task.com",

  // Events tracking
  events: {
    // User actions
    SIGN_UP: "sign_up",
    LOGIN: "login",
    LOGOUT: "logout",

    // App usage
    CREATE_TASK: "create_task",
    COMPLETE_TASK: "complete_task",
    USE_AI_ASSISTANT: "use_ai_assistant",

    // Engagement
    VIEW_CALENDAR: "view_calendar",
    VIEW_BLOG_POST: "view_blog_post",
    SHARE_CONTENT: "share_content",

    // Conversion
    UPGRADE_PLAN: "upgrade_plan",
    PURCHASE_CREDITS: "purchase_credits",
  },
}

// Google Analytics helper functions
export const gtag = {
  // Initialize GA
  init: () => {
    if (typeof window !== "undefined" && ANALYTICS_CONFIG.GA_TRACKING_ID) {
      window.gtag("config", ANALYTICS_CONFIG.GA_TRACKING_ID, {
        page_title: document.title,
        page_location: window.location.href,
      })
    }
  },

  // Track page views
  pageview: (url: string) => {
    if (typeof window !== "undefined" && ANALYTICS_CONFIG.GA_TRACKING_ID) {
      window.gtag("config", ANALYTICS_CONFIG.GA_TRACKING_ID, {
        page_path: url,
      })
    }
  },

  // Track events
  event: (action: string, parameters?: any) => {
    if (typeof window !== "undefined" && ANALYTICS_CONFIG.GA_TRACKING_ID) {
      window.gtag("event", action, {
        event_category: "engagement",
        event_label: parameters?.label,
        value: parameters?.value,
        ...parameters,
      })
    }
  },
}

// Custom tracking hooks
export const useAnalytics = () => {
  const trackEvent = (eventName: string, parameters?: any) => {
    gtag.event(eventName, parameters)
  }

  const trackPageView = (url: string) => {
    gtag.pageview(url)
  }

  const trackUserAction = (action: string, details?: any) => {
    gtag.event(action, {
      event_category: "user_action",
      custom_parameters: details,
    })
  }

  return {
    trackEvent,
    trackPageView,
    trackUserAction,
  }
}

// Performance monitoring
export const performanceMonitoring = {
  // Track Core Web Vitals
  trackWebVitals: (metric: any) => {
    gtag.event(metric.name, {
      event_category: "Web Vitals",
      value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true,
    })
  },

  // Track loading performance
  trackLoadTime: (loadTime: number) => {
    gtag.event("page_load_time", {
      event_category: "Performance",
      value: loadTime,
      non_interaction: true,
    })
  },
}

// Analytics component for easy integration
export const Analytics = {
  init: gtag.init,
  pageview: gtag.pageview,
  event: gtag.event,
  config: ANALYTICS_CONFIG,
}

// Declare global gtag function
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void
  }
}
