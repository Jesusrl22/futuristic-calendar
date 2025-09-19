// Domain configuration for future-task.com
export const DOMAIN_CONFIG = {
  // Production domain
  domain: "future-task.com",
  url: "https://future-task.com",

  // Get full URL for any path
  getFullUrl: (path = "") => {
    return `https://future-task.com${path}`
  },

  // API endpoints
  api: {
    base: "https://future-task.com/api",
    health: "https://future-task.com/api/health",
    sitemap: "https://future-task.com/sitemap.xml",
    robots: "https://future-task.com/robots.txt",
  },
}

// SEO Configuration
export const SEO_CONFIG = {
  title: "FutureTask - AI-Powered Productivity Calendar",
  description:
    "Transform your productivity with our AI-powered calendar and task management system. Smart scheduling, intelligent insights, and seamless organization.",
  keywords: "productivity, calendar, AI, task management, scheduling, organization, future task",
  author: "FutureTask Team",

  // Open Graph
  openGraph: {
    title: "FutureTask - AI-Powered Productivity Calendar",
    description: "Transform your productivity with our AI-powered calendar and task management system.",
    siteName: "FutureTask",
    locale: "en_US",
    type: "website" as const,
  },

  // Twitter
  twitter: {
    card: "summary_large_image" as const,
    title: "FutureTask - AI-Powered Productivity Calendar",
    description: "Transform your productivity with our AI-powered calendar and task management system.",
    creator: "@futuretask",
  },
}

// Social media links
export const SOCIAL_LINKS = {
  twitter: "https://twitter.com/futuretask",
  linkedin: "https://linkedin.com/company/futuretask",
  github: "https://github.com/futuretask",
  email: "hello@future-task.com",
}
